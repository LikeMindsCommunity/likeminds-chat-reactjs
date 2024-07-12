/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChangeEvent,
  Dispatch,
  KeyboardEvent,
  MutableRefObject,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Member from "../types/models/member";
import GlobalClientProviderContext from "../context/LMGlobalClientProviderContext";
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
import { Gif } from "../types/models/GifObject";
import { ChatroomCollabcard } from "../types/api-responses/getChatroomResponse";
import { ChatroomTypes } from "../enums/lm-chatroom-types";
import UserProviderContext from "../context/LMUserProviderContext";
import { MemberType } from "../enums/lm-member-type";

export function useInput(): UseInputReturns {
  const { id: chatroomId } = useParams();
  //contexts
  const { lmChatclient } = useContext(GlobalClientProviderContext);
  const { currentUser } = useContext(UserProviderContext);
  const {
    chatroom,
    conversationToedit,
    setConversationToEdit,
    conversationToReply,
    setConversationToReply,
    setNewChatroom,
  } = useContext(LMChatChatroomContext);
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
  const [gifMedia, setGifMedia] = useState<Gif | null>(null);
  // refs
  const inputBoxRef = useRef<HTMLDivElement | null>(null);
  const inputWrapperRef = useRef<HTMLDivElement | null>(null);
  const taggingListPageCount = useRef<number>(1);
  const chatroomInputTextRef = useRef<Record<string, string>>({});
  const isShiftPressed = useRef<boolean>(false);
  // Gifs
  const [query, setQuery] = useState("");
  const [gifs, setGifs] = useState<Gif[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openGifCollapse, setOpenGifCollapse] = useState<boolean>(false);
  const apiKey = "9hQZNoy1wtM2b1T4BIx8B0Cwjaje3UUR";

  //   api calls
  const sendDMRequest = async (textMessage: string) => {
    try {
      const sendDmRequestCall = await lmChatclient?.sendDMRequest({
        chatRequestState: 0,
        chatroomId: parseInt(chatroomId!.toString()),
        text: textMessage,
      });

      document.dispatchEvent(
        new CustomEvent(CustomActions.DM_CHAT_REQUEST_STATUS_CHANGED, {
          detail: sendDmRequestCall.data.conversation,
        }),
      );

      const newChatroom = { ...chatroom };
      if (newChatroom.chatroom && newChatroom.chatroom) {
        newChatroom.chatroom.chat_request_state = 0;
        newChatroom.chatroom.chat_requested_by = currentUser;
      }
      setNewChatroom(newChatroom as ChatroomCollabcard);
    } catch (error) {
      console.log(error);
    }
  };
  const aprooveDMRequest = async () => {
    try {
      const aprooveDmRequestCall = await lmChatclient?.sendDMRequest({
        chatRequestState: 1,
        chatroomId: parseInt(chatroomId!.toString()),
      });
      document.dispatchEvent(
        new CustomEvent(CustomActions.DM_CHAT_REQUEST_STATUS_CHANGED, {
          detail: aprooveDmRequestCall.data.conversation,
        }),
      );
      const newChatroom = { ...chatroom };
      if (newChatroom.chatroom && newChatroom.chatroom) {
        newChatroom.chatroom.chat_request_state = 1;
      }
      setNewChatroom(newChatroom as ChatroomCollabcard);
    } catch (error) {
      console.log(error);
    }
  };
  const rejectDMRequest = async () => {
    try {
      const rejectDmRequestCall = await lmChatclient?.sendDMRequest({
        chatRequestState: 2,
        chatroomId: parseInt(chatroomId!.toString()),
      });
      document.dispatchEvent(
        new CustomEvent(CustomActions.DM_CHAT_REQUEST_STATUS_CHANGED, {
          detail: rejectDmRequestCall.data.conversation,
        }),
      );
      const newChatroom = { ...chatroom };
      if (newChatroom.chatroom && newChatroom.chatroom) {
        newChatroom.chatroom.chat_request_state = 2;
      }
      setNewChatroom(newChatroom as ChatroomCollabcard);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchGifs = async (url: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(url);
      const result = await response.json();
      setGifs(result.data);
    } catch (err) {
      setError("Failed to fetch GIFs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    const url = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${query}&limit=100`;
    fetchGifs(url);
  };

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
        chatroom.chatroom.type === ChatroomTypes.DIRECT_MESSAGE_CHATROOM &&
        chatroom.chatroom.chat_request_state === null &&
        chatroom.chatroom.member.state !== MemberType.COMMUNITY_MANAGER &&
        chatroom.chatroom.chatroom_with_user?.state !==
          MemberType.COMMUNITY_MANAGER
      ) {
        await sendDMRequest(messageText);

        return;
      }
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
      if (conversationToReply) {
        postConversationCallConfig.repliedConversationId =
          conversationToReply.id;
        setConversationToReply(null);
      }
      const attachmentsList =
        imagesAndVideosMediaList || documentsMediaList || [];
      if (attachmentsList.length) {
        postConversationCallConfig.hasFiles = true;
        postConversationCallConfig.attachmentCount = attachmentsList.length;
      }
      if (gifMedia) {
        postConversationCallConfig.hasFiles = true;
        postConversationCallConfig.attachmentCount = 1;
      }
      const postConversationsCall: PostConversationResponse =
        await lmChatclient?.postConversation(postConversationCallConfig);
      setFocusOnInputField();
      removeOgTag();
      if (gifMedia) {
        setGifMedia(null);
        const onUploadConfig = {
          conversationId: parseInt(
            postConversationsCall.data.conversation.id.toString(),
            10,
          ),
          filesCount: 1,
          index: 0,
          meta: {
            size: parseInt(gifMedia.images.fixed_height.size.toString()),
            // size: parseInt(giphyUrl?.images?.fixed_height?.size?.toString()),
          },
          name: gifMedia?.title,
          type: gifMedia?.type,
          url: gifMedia?.images?.fixed_height?.url,
          thumbnailUrl: gifMedia?.images["480w_still"]?.url,
        };
        lmChatclient?.putMultimedia(onUploadConfig);
        setOpenGifCollapse(false);
        return;
      }
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
        setImagesAndVideosMediaList(null);
        setDocumentMediaList(null);
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
    if (chatroom?.chatroom.type === ChatroomTypes.DIRECT_MESSAGE_CHATROOM) {
      return;
    }
    const tagOp = Utils.findTag(textContentFocusNode!);

    if (tagOp?.tagString !== null && tagOp?.tagString !== undefined) {
      setTagSearchKey(tagOp?.tagString);
    } else {
      setTagSearchKey(null);
    }
  };
  const onTextInputKeydownHandler: onKeydownEvent = (change) => {
    if (change.key === "Enter") {
      if (!isShiftPressed.current) {
        change.preventDefault();
        postMessage();
      }
    }
    if (change.key === "Shift") {
      isShiftPressed.current = true;
    }
  };
  const onTextInputKeyUpHandler: onKeyUpEvent = (change) => {
    if (change.key === "Shift") {
      isShiftPressed.current = false;
    }
  };
  const addEmojiToText: TwoArgVoidReturns<EmojiData, MouseEvent> = (
    emojiData,
  ) => {
    const emoji = emojiData.native;
    setInputText((currentText) => {
      const newTextString = currentText.concat(emoji);
      Utils.insertCharAtEnd(inputBoxRef.current!, emoji.toString());
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
  const gifSearchQuery = (query: string) => {
    setQuery(query);
  };
  const removeMediaFromImageList = (index: number) => {
    setImagesAndVideosMediaList((currentList) => {
      if (!currentList) {
        return null;
      }
      return currentList?.filter((mediaFile, fileIndex) => {
        return index !== fileIndex;
      });
    });
  };
  const removeMediaFromDocumentList = (index: number) => {
    setDocumentMediaList((currentList) => {
      if (!currentList) {
        return null;
      }
      return currentList?.filter((mediaFile, fileIndex) => {
        return index !== fileIndex;
      });
    });
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
  useEffect(() => {
    return () => {
      setConversationToEdit(null);
      setConversationToReply(null);
      setDocumentMediaList(null);
      setImagesAndVideosMediaList(null);
      setGifMedia(null);
      setFetchMoreTags(true);
      setMatchedTagMembersList([]);
      setInputText("");
      setOgTags(null);
      setOpenGifCollapse(false);
    };
  }, [chatroomId, setConversationToEdit, setConversationToReply]);
  return {
    inputBoxRef,
    inputWrapperRef,
    inputText,
    matchedTagMembersList,
    updateInputText,
    onTextInputKeydownHandler,
    onTextInputKeyUpHandler,
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
    gifMedia,
    gifs: gifs,
    loadingGifs: loading,
    errorOnGifs: error,
    gifSearchQuery: gifSearchQuery,
    openGifCollapse: openGifCollapse,
    setOpenGifCollapse: setOpenGifCollapse,
    fetchGifs: fetchGifs,
    handleGifSearch: handleSearch,
    gifQuery: query,
    setGifMedia,
    removeMediaFromImageList,
    removeMediaFromDocumentList,
    sendDMRequest,
    rejectDMRequest,
    aprooveDMRequest,
  };
}

export interface UseInputReturns {
  inputBoxRef: MutableRefObject<HTMLDivElement | null>;
  inputWrapperRef: MutableRefObject<HTMLDivElement | null>;
  inputText: string;
  updateInputText: onChangeUpdateInputText;
  onTextInputKeydownHandler: onKeydownEvent;
  onTextInputKeyUpHandler: onKeyUpEvent;
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
  setGifMedia: Dispatch<Gif | null>;
  gifMedia: Gif | null;
  gifs: Gif[];
  loadingGifs: boolean;
  errorOnGifs: string | null;
  gifQuery: string;
  gifSearchQuery: OneArgVoidReturns<string>;
  openGifCollapse: boolean;
  setOpenGifCollapse: Dispatch<boolean>;
  fetchGifs: OneArgVoidReturns<string>;
  handleGifSearch: ZeroArgVoidReturns;
  removeMediaFromImageList: OneArgVoidReturns<number>;
  removeMediaFromDocumentList: OneArgVoidReturns<number>;
  sendDMRequest: OneArgVoidReturns<string>;
  rejectDMRequest: ZeroArgVoidReturns;
  aprooveDMRequest: ZeroArgVoidReturns;
}
// single compulsary argument
export type onChangeUpdateInputText = (
  change: KeyboardEvent<HTMLDivElement>,
) => void;
export type onKeydownEvent = (change: KeyboardEvent<HTMLDivElement>) => void;
export type onKeyUpEvent = (change: KeyboardEvent<HTMLDivElement>) => void;
export type ZeroArgVoidReturns = () => void;
export type OneArgVoidReturns<T> = (arg: T) => void;
export type TwoArgVoidReturns<T, S> = (argOne: T, ardTwo: S) => void;
export type OneOptionalArgVoidReturns<T> = (arg?: T) => void;
export type ZeroArgBooleanReturns = () => boolean;
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
