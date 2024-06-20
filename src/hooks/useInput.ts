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
import {
  Media,
  PostConversation,
} from "@likeminds.community/chat-js-beta/dist/pages/chatroom/types";
import { LMChatChatroomContext } from "../context/LMChatChatroomContext";
import { PostConversationResponse } from "../types/api-responses/postConversationResponse";
import { FileType } from "../types/enums/Filetype";

export function useInput(): UseInputReturns {
  //contexts
  const { lmChatclient } = useContext(GlobalClientProviderContext);
  const { chatroom } = useContext(LMChatChatroomContext);
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

  // refs
  const inputBoxRef = useRef<HTMLDivElement | null>(null);
  const inputWrapperRef = useRef<HTMLDivElement | null>(null);
  const taggingListPageCount = useRef<number>(1);

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
            return [...previousState, ...call.data.members];
          });
          incrementPageNo();
        }
        if (!call.data.members.length) {
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
      // sending the text part of the conversation
      const chatroomData = chatroom.chatroom;
      const postConversationCallConfig: PostConversation = {
        text: Utils.extractTextFromNode(inputBoxRef.current!),
        chatroomId: parseInt(chatroomData.id.toString()),
        hasFiles: false,
      };
      const attachmentsList =
        imagesAndVideosMediaList || documentsMediaList || [];
      if (attachmentsList.length) {
        postConversationCallConfig.hasFiles = true;
        postConversationCallConfig.attachmentCount = attachmentsList.length;
      }

      const postConversationsCall: PostConversationResponse =
        await lmChatclient?.postConversation(postConversationCallConfig);
      console.log(postConversationsCall);
      for (let index = 0; index < attachmentsList.length; index++) {
        const conversation = postConversationsCall.data.conversation;
        console.log(conversation);
        const attachment = attachmentsList[index];
        const { name, size, type } = attachment;
        const uploadConfig: Media = {
          messageId: parseInt(conversation.id.toString(), 10),
          chatroomId: chatroomData.id,
          file: attachment,
          index: index,
        };
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
                  const thumbnailConfig = {
                    messageId: parseInt(conversation.id.toString(), 10),
                    chatroomId: chatroomData.id,
                    file: new File(
                      [blobEl!],
                      conversation.id.toString().concat("thumbnail.jpeg"),
                    ),
                  };

                  lmChatclient
                    ?.uploadMedia(thumbnailConfig)
                    .then((thumbnailResponse: any) => {
                      lmChatclient
                        ?.uploadMedia(uploadConfig)
                        .then((fileResponse: any) => {
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
                            type: type,
                            url: fileResponse.Location,
                            thumbnailUrl: thumbnailResponse.Location,
                          };

                          lmChatclient.putMultimedia(onUploadConfig);
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
          await lmChatclient
            ?.uploadMedia(uploadConfig)
            .then((fileResponse: any) => {
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
                type: type,
                url: fileResponse.Location,
                thumbnail_url: null,
              };

              lmChatclient?.putMultimedia(onUploadConfig);
            });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // normal functions
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
}
// single compulsary argument
export type onChangeUpdateInputText = (
  change: KeyboardEvent<HTMLDivElement>,
) => void;
export type onKeydownEvent = (change: KeyboardEvent<HTMLDivElement>) => void;
export type ZeroArgVoidReturns = () => void;
export type OneArgVoidReturns<T> = (arg: T) => void;
export type TwoArgVoidReturns<T, S> = (argOne: T, ardTwo: S) => void;
