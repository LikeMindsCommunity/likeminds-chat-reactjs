/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChangeEvent,
  KeyboardEvent,
  MutableRefObject,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Member from "../types/models/member";
import GlobalClientProviderContext from "../context/GlobalClientProviderContext";
import { Utils } from "../utils/helpers";
import { GetTaggingListResponse } from "../types/api-responses/getTaggingListResponse";
import { EmojiData } from "../types/models/emojiData";
import { PostConversation } from "@likeminds.community/chat-js-beta/dist/pages/chatroom/types";
import { LMChatChatroomContext } from "../context/LMChatChatroomContext";
import { PostConversationResponse } from "../types/api-responses/postConversationResponse";
import { FileType } from "../types/enums/Filetype";
import { CustomActions } from "../customActions";
import { useParams } from "react-router-dom";
import {
  GetOgTagResponse,
  OgTag,
} from "../types/api-responses/getOgTagResponse";

export function useInput(): UseInputReturns {
  const { id: chatroomId } = useParams();
  //contexts
  const { lmChatclient } = useContext(GlobalClientProviderContext);
  const { chatroom, conversationToedit, setConversationToEdit } = useContext(
    LMChatChatroomContext,
  );
  // state
  const [inputText, setInputText] = useState<string>("");
  const [tagSearchKey, setTagSearchKey] = useState<string | null>(null);
  const [matchedTagMembersList, setMatchedTagMembersList] = useState<Member[]>(
    [],
  );
  const [imagesAndVideosMediaList, setImagesAndVideosMediaList] = useState<
    File[] | null
  >(null);
  const [documentsMediaList, setDocumentMediaList] = useState<File[] | null>(
    null,
  );
  const [fetchMoreTags, setFetchMoreTags] = useState<boolean>(true);
  const [ogTags, setOgTags] = useState<OgTag | null>(null);
  // refs
  const inputBoxRef = useRef<HTMLDivElement | null>(null);
  const inputWrapperRef = useRef<HTMLDivElement | null>(null);
  const taggingListPageCount = useRef<number>(1);
  const chatroomInputTextRef = useRef<Record<string, string>>({});

  //   api calls
  const fetchTaggingList = useCallback(
    async (pg?: number) => {
      try {
        const call: GetTaggingListResponse = await lmChatclient?.getTaggingList(
          {
            feedroomId: chatroom?.chatroom.id,
            page: pg ? pg : taggingListPageCount.current,
            pageSize: 10,
            searchName: tagSearchKey || "",
          },
        );
        if (call.success) {
          setMatchedTagMembersList((previousState) => {
            return [
              ...previousState,
              ...(call.data?.members || call.data.community_members || []),
            ];
          });
          incrementPageNo();
        }
        if (!call.data.members?.length && call.data.community_members?.length) {
          setFetchMoreTags(false);
        }
      } catch (error) {
        console.log(error);
      }
    },
    [chatroom?.chatroom.id, lmChatclient, tagSearchKey],
  );
  const postMessage = async () => {
    try {
      if (!chatroom) {
        return;
      }
      const messageText = Utils.extractTextFromNode(
        inputBoxRef.current!,
      ).trim();
      if (
        (!messageText || !messageText.length) &&
        !imagesAndVideosMediaList?.length &&
        imagesAndVideosMediaList?.length
      ) {
        return;
      }
      if (Utils.extractTextFromNode(inputBoxRef.current!).trim())
        if (conversationToedit) {
          const call: any = await lmChatclient?.editConversation({
            conversationId: conversationToedit.id,
            text: messageText,
          });
          setConversationToEdit(null);
          dispatchEvent(
            new CustomEvent(CustomActions.EDIT_ACTION_COMPLETED, {
              detail: call.data.conversation,
            }),
          );
          if (call.success) {
            console.log(call);
          }
          setFocusOnInputField();
          return;
        }
      // sending the text part of the conversation
      const chatroomData = chatroom.chatroom;
      const postConversationCallConfig: PostConversation = {
        text: messageText,
        chatroomId: parseInt(chatroomData.id.toString()),
        hasFiles: false,
        ogTags: ogTags || undefined,
      };
      const attachmentsList =
        imagesAndVideosMediaList || documentsMediaList || [];
      if (attachmentsList.length) {
        postConversationCallConfig.hasFiles = true;
        postConversationCallConfig.attachmentCount = attachmentsList.length;
      }
      const postConversationsCall: PostConversationResponse =
        await lmChatclient?.postConversation(postConversationCallConfig);
      setFocusOnInputField();
      removeOgTag();
      for (let index = 0; index < attachmentsList.length; index++) {
        const conversation = postConversationsCall.data.conversation;
        const attachment = attachmentsList[index];
        const { name, size, type } = attachment;
        if (type.includes(FileType.video)) {
          const video = document.createElement("video");
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          const localIndex = index;
          // Load the video
          const url = URL.createObjectURL(attachment);
          video.src = url;
          let blobEl = null;
          video.addEventListener("loadedmetadata", async () => {
            // Set canvas dimensions to match video dimensions

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            video.currentTime = 1;
            video.addEventListener("seeked", async () => {
              ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

              // Convert canvas content to blob
              canvas.toBlob(
                (blob) => {
                  blobEl = blob;
                  const thumbnailFile = new File(
                    [blobEl!],
                    conversation.id.toString().concat("thumbnail.jpeg"),
                  );

                  Utils.uploadMedia(
                    attachment,
                    conversation.id.toString(),
                    chatroom.chatroom.id.toString(),
                  ).then((response: any) => {
                    const thumbnailUrl = Utils.generateFileUrl(response);
                    // const thumbnailUrl = response;
                    Utils.uploadMedia(
                      attachment,
                      conversation.id.toString(),
                      chatroom.chatroom.id.toString(),
                    ).then((response) => {
                      // const fileUrl = response;
                      const fileUrl = Utils.generateFileUrl(
                        response as unknown as string,
                      );
                      const onUploadConfig: {
                        conversationId: number;
                        filesCount: number;
                        index: number;
                        meta: { size: number };
                        name: string;
                        type: string;
                        url: string;
                        thumbnailUrl: undefined | string;
                      } = {
                        conversationId: parseInt(
                          conversation.id.toString(),
                          10,
                        ),
                        filesCount: 1,
                        index: localIndex,
                        meta: { size: size },
                        name: name,
                        type: "video",
                        url: (fileUrl as string) || "",
                        thumbnailUrl: thumbnailUrl,
                      };

                      lmChatclient?.putMultimedia(onUploadConfig);
                    });
                  });
                },
                "image/jpeg",
                0.8,
              );
            });
          });

          video.load();
        } else {
          await Utils.uploadMedia(
            attachment,
            conversation.id.toString(),
            chatroom.chatroom.id.toString(),
          ).then((response: any) => {
            console.log(response);
            // const fileUrl = response;
            const fileUrl = Utils.generateFileUrl(response);
            const onUploadConfig: {
              conversationId: number;
              filesCount: number;
              index: number;
              meta: { size: number };
              name: string;
              type: string;
              url: string;
              thumbnail_url: null | string;
            } = {
              conversationId: parseInt(
                postConversationsCall.data.id.toString(),
                10,
              ),
              filesCount: 1,
              index,
              meta: { size: size },
              name: name,
              // type: type,
              type: type.includes(FileType.image) ? FileType.image : "pdf",
              url: fileUrl || "",
              thumbnail_url: null,
            };

            lmChatclient?.putMultimedia(onUploadConfig);
          });
        }
        setImagesAndVideosMediaList([]);
        setDocumentMediaList([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // normal functions
  const removeOgTag = () => {
    setOgTags(null);
  };
  const emptyInputField = () => {
    while (inputBoxRef.current?.firstChild) {
      inputBoxRef.current.removeChild(inputBoxRef.current?.firstChild);
    }
  };
  const manageInputOnChatroomChange = useCallback(() => {
    const text = chatroomInputTextRef.current[chatroomId || ""];
    if (text && inputBoxRef && inputBoxRef.current) {
      inputBoxRef.current.innerHTML = Utils.convertTextToHTML(text).innerHTML;
      setInputText(() => text);
    }
  }, [chatroomId]);
  const storeInputOnChatroomLeave = useCallback((chatroomId: string) => {
    if (inputBoxRef && inputBoxRef.current) {
      chatroomInputTextRef.current[chatroomId] = Utils.extractTextFromNode(
        inputBoxRef.current,
      );
      emptyInputField();
      setInputText(() => "");
    }
  }, []);
  const setFocusOnInputField = () => {
    while (inputBoxRef.current?.firstChild) {
      inputBoxRef.current.removeChild(inputBoxRef.current?.firstChild);
    }
    inputBoxRef.current?.focus();
  };
  const incrementPageNo = () => {
    taggingListPageCount.current = taggingListPageCount.current + 1;
  };
  const resetPageCount = () => {
    taggingListPageCount.current = 1;
  };
  const clearTaggingList = () => {
    setMatchedTagMembersList(() => []);
    setTagSearchKey(null);
    resetPageCount();
  };
  const updateInputText: onChangeUpdateInputText = (change) => {
    const selection = window.getSelection();
    setInputText(change.currentTarget.textContent!);
    if (selection === null) return;
    const focusNode = selection.focusNode;
    if (focusNode === null) {
      return;
    }
    const div = focusNode.parentElement;
    if (div === null) {
      return;
    }
    const postText = div.childNodes;
    if (focusNode === null || postText.length === 0) {
      return;
    }
    const textContentFocusNode = focusNode.textContent;

    const tagOp = Utils.findTag(textContentFocusNode!);

    if (tagOp?.tagString !== null && tagOp?.tagString !== undefined) {
      setTagSearchKey(tagOp?.tagString);
    } else {
      setTagSearchKey(null);
    }
  };
  const onTextInputKeydownHandler: onKeydownEvent = (change) => {
    if (change.key === "Enter") {
      change.preventDefault();
      const selection = window.getSelection()!;
      const range = selection.getRangeAt(0).cloneRange();
      const p = document.createElement("p");
      const br = document.createElement("br");
      p.appendChild(br);
      inputBoxRef?.current?.appendChild(p);
      range.setStart(p, 0);
      range.setEnd(p, 0);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };
  const addEmojiToText: TwoArgVoidReturns<EmojiData, MouseEvent> = (
    emojiData,
  ) => {
    const emoji = emojiData.native;
    setInputText((currentText) => {
      const newTextString = currentText.concat(emoji);
      console.log(emoji);
      Utils.insertCharAtEnd(inputBoxRef.current!, emoji.toString());
      // console.log(newTextString);
      return newTextString;
    });
  };
  const addImagesAndVideosMedia: OneArgVoidReturns<
    ChangeEvent<HTMLInputElement>
  > = (changeEvent) => {
    const currentMediaFileNames = Array.from(
      imagesAndVideosMediaList || [],
    ).map((file) => {
      return file.name;
    });
    const filesArray = Array.from(changeEvent.target.files || []);
    const mediaListCopy = [...(imagesAndVideosMediaList || [])];
    filesArray.forEach((file) => {
      if (!currentMediaFileNames.includes(file.name)) {
        mediaListCopy.push(file);
      }
    });
    setImagesAndVideosMediaList(mediaListCopy);
  };
  const addDocumentsMedia: OneArgVoidReturns<ChangeEvent<HTMLInputElement>> = (
    changeEvent,
  ) => {
    const currentMediaFileNames = Array.from(documentsMediaList || []).map(
      (file) => {
        return file.name;
      },
    );
    const filesArray = Array.from(changeEvent.target.files || []);
    const mediaListCopy = [...(documentsMediaList || [])];
    filesArray.forEach((file) => {
      if (!currentMediaFileNames.includes(file.name)) {
        mediaListCopy.push(file);
      }
    });
    setDocumentMediaList(mediaListCopy);
  };
  // effects
  useEffect(() => {
    if (tagSearchKey !== null) {
      setFetchMoreTags(true);
      setMatchedTagMembersList(() => []);
      resetPageCount();
      fetchTaggingList(1);
    } else {
      setMatchedTagMembersList(() => []);
      resetPageCount();
    }
  }, [fetchTaggingList, tagSearchKey]);
  useEffect(() => {
    if (conversationToedit && inputBoxRef.current) {
      inputBoxRef.current.innerHTML = Utils.convertTextToHTML(
        conversationToedit.answer,
      ).innerHTML;
    }
  }, [conversationToedit]);
  useEffect(() => {
    manageInputOnChatroomChange();
    return () => {
      storeInputOnChatroomLeave(chatroomId || "");
    };
  }, [chatroomId, manageInputOnChatroomChange, storeInputOnChatroomLeave]);
  useEffect(() => {
    const checkForLinksTimeout = setTimeout(async () => {
      try {
        const linksDetected = Utils.detectLinks(inputText || "");
        if (linksDetected.length) {
          const firstLinkDetected = linksDetected[0];
          if (firstLinkDetected.toString() !== ogTags?.url.toString()) {
            const getOgTagData: GetOgTagResponse =
              await lmChatclient?.decodeUrl({ url: firstLinkDetected });
            if (getOgTagData?.success) {
              setOgTags(getOgTagData.data.og_tags);
            }
          }
        } else {
          if (ogTags !== null) {
            setOgTags(null);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }, 500);

    return () => clearTimeout(checkForLinksTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lmChatclient, inputText]);
  return {
    inputBoxRef,
    inputWrapperRef,
    inputText,
    matchedTagMembersList,
    updateInputText,
    onTextInputKeydownHandler,
    fetchMoreTags,
    clearTaggingList,
    addEmojiToText,
    addDocumentsMedia,
    addImagesAndVideosMedia,
    documentsMediaList,
    imagesAndVideosMediaList,
    postMessage,
    getTaggingMembers: fetchTaggingList,
    removeOgTag,
    ogTag: ogTags,
  };
}

export interface UseInputReturns {
  inputBoxRef: MutableRefObject<HTMLDivElement | null>;
  inputWrapperRef: MutableRefObject<HTMLDivElement | null>;
  inputText: string;
  updateInputText: onChangeUpdateInputText;
  onTextInputKeydownHandler: onKeydownEvent;
  matchedTagMembersList: Member[];
  fetchMoreTags: boolean;
  clearTaggingList: ZeroArgVoidReturns;
  addEmojiToText: TwoArgVoidReturns<EmojiData, MouseEvent>;
  addImagesAndVideosMedia: OneArgVoidReturns<ChangeEvent<HTMLInputElement>>;
  addDocumentsMedia: OneArgVoidReturns<ChangeEvent<HTMLInputElement>>;
  imagesAndVideosMediaList: File[] | null;
  documentsMediaList: File[] | null;
  postMessage: ZeroArgVoidReturns;
  getTaggingMembers: OneOptionalArgVoidReturns<number>;
  removeOgTag: ZeroArgVoidReturns;
  ogTag: OgTag | null;
}
// single compulsary argument
export type onChangeUpdateInputText = (
  change: KeyboardEvent<HTMLDivElement>,
) => void;
export type onKeydownEvent = (change: KeyboardEvent<HTMLDivElement>) => void;
export type ZeroArgVoidReturns = () => void;
export type OneArgVoidReturns<T> = (arg: T) => void;
export type TwoArgVoidReturns<T, S> = (argOne: T, ardTwo: S) => void;
export type OneOptionalArgVoidReturns<T> = (arg?: T) => void;

// "files/collabcard/$chatroom_id/conversation/$conversation_id/initials of media/current time in milliseconds.fileextension"
// var initial = when (mediaType) {
//                 IMAGE -> "IMG_"
//                 GIF -> "GIF_"
//                 VIDEO -> "VID_"
//                 PDF -> "DOC_"
//                 AUDIO -> "AUD_"
//                 VOICE_NOTE -> "VOC_"
//                 else -> "MEDIA_"
//             }
//             if (isThumbnail) {
//                 initial += "THUMB_"
//             }
