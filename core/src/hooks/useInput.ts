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
  useMemo,
  useRef,
  useState,
} from "react";
import Member from "../types/models/member";
import GlobalClientProviderContext from "../context/LMGlobalClientProviderContext";
import { Utils } from "../utils/helpers";
import { GetTaggingListResponse } from "../types/api-responses/getTaggingListResponse";
import { EmojiData } from "../types/models/emojiData";
import { LMChatChatroomContext } from "../context/LMChatChatroomContext";
import { PostConversationResponse } from "../types/api-responses/postConversationResponse";
import { FileType } from "../types/enums/Filetype";
import { CustomActions } from "../customActions";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { GetOgTagResponse } from "../types/api-responses/getOgTagResponse";
import { Gif } from "../types/models/GifObject";
import { ChatroomCollabcard } from "../types/api-responses/getChatroomResponse";
import { ChatroomTypes } from "../enums/lm-chatroom-types";
import UserProviderContext from "../context/LMUserProviderContext";
import { MemberType } from "../enums/lm-member-type";
import {
  InputCustomActions,
  Router,
} from "../types/prop-types/CustomComponents";
import { GIPHY_API_KEY } from "../apiKeys";
import {
  Attachment,
  AttachmentMeta,
  Chatroom,
} from "@likeminds.community/chat-js-beta";
import { PostConversationRequest } from "@likeminds.community/chat-js-beta/dist/pages/chatroom/types";
import { LMInputAttachments } from "../enums/lm-input-attachment-options";
import { OgTag } from "../types/models/OgTag";
export function useInput(
  inputCustomActions?: InputCustomActions,
): UseInputReturns {
  const {
    onUpdateInputText,
    onOnTextInputKeydownHandler,
    onOnTextInputKeyUpHandler,
    onClearTaggingList,
    onAddEmojiToText,
    onAddImagesAndVideosMedia,
    onAddDocumentsMedia,
    onPostMessage,
    onGetTaggingMembers,
    onRemoveOgTag,
    onSetGifMedia,
    onSetOpenGifCollapse,
    onGifSearchQuery,
    onFetchGifs,
    onHandleGifSearch,
    onRemoveMediaFromImageList,
    onRemoveMediaFromDocumentList,
    onSendDMRequest,
    onRejectDMRequest,
    onAprooveDMRequest,
  } = inputCustomActions!;
  const { id: chatroomId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  //contexts
  const { lmChatclient } = useContext(GlobalClientProviderContext);
  const { currentUser, memberState, currentCommunity, logoutUser } =
    useContext(UserProviderContext);
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
  const apiKey = GIPHY_API_KEY;

  const buildGIFAttachment = (gif: Gif) => {
    const attachmentObject: Attachment = {
      url: gif.images.fixed_height.url,
      type: "gif",
      index: 0,
      width: parseInt(gif.images.fixed_height.width),
      height: parseInt(gif.images.fixed_height.height),
      thumbnailUrl: gif.images["480w_still"]?.url,
      name: gif.title,
      meta: {
        size: parseInt(gif.images.fixed_height.size),
      },
    };
    return attachmentObject;
  };
  const buildMediaAttachments = useCallback(
    async (mediaList: File[]) => {
      const attachments: Attachment[] = [];
      for (let index = 0; index < mediaList.length; index++) {
        const currentAttachment = mediaList[index];
        const { name, size, type } = currentAttachment;
        if (type.includes(FileType.video)) {
          const { thumbnailUrl, fileUrl, height, width } =
            await Utils.uploadVideoFile(
              currentAttachment,
              chatroomId || "",
              currentUser!.sdkClientInfo!.uuid,
            );
          if (thumbnailUrl && fileUrl) {
            const attachment: Attachment = {
              url: fileUrl,
              type: "video",
              index,
              width: width,
              height: height,
              thumbnailUrl: thumbnailUrl,
              name,
              meta: {
                size,
              },
            };
            attachments.push(attachment);
          }
        } else if (type.includes(FileType.image)) {
          const { fileUrl } = await Utils.uploadImageOrDocument(
            currentAttachment,
            chatroomId || "",
            currentUser.sdkClientInfo!.uuid,
          );
          if (fileUrl) {
            const attachment: Attachment = {
              url: fileUrl,
              type: "image",
              index,
              name,
              meta: {
                size,
              },
            };
            attachments.push(attachment);
          }
        } else {
          const { fileUrl } = await Utils.uploadImageOrDocument(
            currentAttachment,
            chatroomId || "",
            currentUser!.sdkClientInfo!.uuid!,
          );
          if (fileUrl) {
            const attachment: Attachment = {
              url: fileUrl,
              type: "pdf",
              index,
              name,
              meta: {
                size,
              },
            };
            attachments.push(attachment);
          }
        }
      }
      return attachments;
    },
    [chatroomId, currentUser],
  );
  //   api calls
  const sendDMRequest = useCallback(
    async (textMessage: string) => {
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
          newChatroom.chatroom.chatRequestState = 0;
          newChatroom.chatroom.chatRequestedBy = currentUser;
        }
        setNewChatroom(newChatroom as ChatroomCollabcard);
      } catch (error) {
        console.log(error);
      }
    },
    [chatroomId, lmChatclient, chatroom, currentUser, setNewChatroom],
  );
  const aprooveDMRequest = useCallback(async () => {
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
        newChatroom.chatroom.chatRequestState = 1;
      }
      setNewChatroom(newChatroom as ChatroomCollabcard);
    } catch (error) {
      console.log(error);
    }
  }, [chatroomId, lmChatclient, chatroom, setNewChatroom]);
  const rejectDMRequest = useCallback(async () => {
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
        newChatroom.chatroom.chatRequestState = 2;
      }
      setNewChatroom(newChatroom as ChatroomCollabcard);
    } catch (error) {
      console.log(error);
    }
  }, [chatroomId, lmChatclient, chatroom, setNewChatroom]);
  const fetchGifs = useCallback(async (url: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(url);
      const result = await response.json();
      setGifs(result.data);
      setQuery(() => "");
    } catch (err) {
      setError("Failed to fetch GIFs. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = useCallback(async () => {
    const url = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${query}&limit=100`;
    fetchGifs(url);
  }, [apiKey, fetchGifs, query]);

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
              ...(call.data?.members || call.data.communityMembers || []),
            ];
          });
          incrementPageNo();
        }
        if (!call.data.members?.length && call.data.communityMembers?.length) {
          setFetchMoreTags(false);
        }
      } catch (error) {
        console.log(error);
      }
    },
    [chatroom?.chatroom.id, lmChatclient, tagSearchKey],
  );
  const postMessage = useCallback(
    async (customWidgetData?: Record<string, any>) => {
      try {
        if (!chatroom) {
          return;
        }
        const messageText = Utils.extractTextFromNode(
          inputBoxRef.current!,
        ).trim();
        if (
          chatroom.chatroom.type === ChatroomTypes.DIRECT_MESSAGE_CHATROOM &&
          chatroom.chatroom.chatRequestState === null &&
          chatroom.chatroom.member.state !== MemberType.COMMUNITY_MANAGER &&
          chatroom.chatroom.chatroomWithUser?.state !==
            MemberType.COMMUNITY_MANAGER
        ) {
          await sendDMRequest(messageText);

          return;
        }

        // returns when no message text ans no media
        if (!messageText.length) {
          if (
            !imagesAndVideosMediaList?.length &&
            !documentsMediaList?.length &&
            !gifMedia
          ) {
            return;
          }
        }

        if (messageText)
          if (conversationToedit) {
            // Handling the editing of the conversation
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
            setFocusOnInputField();
            return;
          }

        const attachmentsList =
          imagesAndVideosMediaList || documentsMediaList || [];
        const attachments: Attachment[] = [];
        if (gifMedia) {
          const gifAttachment = buildGIFAttachment(gifMedia);
          attachments.push(gifAttachment);
        }
        if (attachmentsList.length) {
          const mediaAttachments = await buildMediaAttachments(attachmentsList);
          attachments.push(...mediaAttachments);
        }

        // sending the text part of the conversation
        const chatroomData = chatroom.chatroom;
        const postConversationCallConfig: PostConversationRequest = {
          text: messageText,
          chatroomId: parseInt(chatroomData.id.toString()),
          hasFiles: false,
          ogTags: ogTags || undefined,
          triggerBot: Utils.isOtherUserAIChatbot(
            chatroomData as any as Chatroom,
            currentUser,
          ),
        };
        if (customWidgetData) {
          postConversationCallConfig.metadata = customWidgetData;
        }
        if (conversationToReply) {
          postConversationCallConfig.repliedConversationId =
            conversationToReply.id;
          setConversationToReply(null);
        }
        if (attachments.length) {
          postConversationCallConfig.attachments = attachments;
        }
        // sending the conversation
        const postConversationsCall: PostConversationResponse =
          await lmChatclient?.postConversation(postConversationCallConfig);
        setFocusOnInputField();
        removeOgTag();
      } catch (error) {
        console.log(error);
      }
    },
    [
      buildMediaAttachments,
      chatroom,
      conversationToReply,
      conversationToedit,
      currentUser,
      documentsMediaList,
      gifMedia,
      imagesAndVideosMediaList,
      lmChatclient,
      ogTags,
      sendDMRequest,
      setConversationToEdit,
      setConversationToReply,
    ],
  );

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
  const clearTaggingList = useCallback(() => {
    setMatchedTagMembersList(() => []);
    setTagSearchKey(null);
    resetPageCount();
  }, []);
  const updateInputText: onChangeUpdateInputText = useCallback(
    (change) => {
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
    },
    [chatroom?.chatroom.type],
  );
  const onTextInputKeydownHandler: onKeydownEvent = useCallback(
    (change) => {
      if (change.key === "Enter") {
        if (!isShiftPressed.current) {
          change.preventDefault();
          postMessage();
        }
      }
      if (change.key === "Shift") {
        isShiftPressed.current = true;
      }
    },
    [postMessage],
  );
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
  > = useCallback(
    (changeEvent) => {
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
    },
    [imagesAndVideosMediaList],
  );
  const addDocumentsMedia: OneArgVoidReturns<ChangeEvent<HTMLInputElement>> =
    useCallback(
      (changeEvent) => {
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
      },
      [documentsMediaList],
    );
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
              setOgTags(getOgTagData.data.ogTags);
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
  const inputDefaultActions = useMemo(() => {
    return {
      updateInputText,
      onTextInputKeydownHandler,
      onTextInputKeyUpHandler,
      clearTaggingList,
      addEmojiToText,
      addDocumentsMedia,
      addImagesAndVideosMedia,
      postMessage,
      getTaggingMembers: fetchTaggingList,
      removeOgTag,
      setOpenGifCollapse: setOpenGifCollapse,
      fetchGifs: fetchGifs,
      handleGifSearch: handleSearch,
      setGifMedia,
      removeMediaFromImageList,
      removeMediaFromDocumentList,
      sendDMRequest,
      rejectDMRequest,
      aprooveDMRequest,
      gifSearchQuery: gifSearchQuery,
    };
  }, [
    addDocumentsMedia,
    addImagesAndVideosMedia,
    aprooveDMRequest,
    clearTaggingList,
    fetchGifs,
    fetchTaggingList,
    handleSearch,
    onTextInputKeydownHandler,
    postMessage,
    rejectDMRequest,
    sendDMRequest,
    updateInputText,
  ]);
  const inputDataStore = useMemo(() => {
    return {
      inputBoxRef,
      inputWrapperRef,
      inputText,
      matchedTagMembersList,
      fetchMoreTags,
      documentsMediaList,
      imagesAndVideosMediaList,
      ogTag: ogTags,
      gifMedia,
      gifs: gifs,
      loadingGifs: loading,
      errorOnGifs: error,
      openGifCollapse: openGifCollapse,
      gifQuery: query,
    };
  }, [
    documentsMediaList,
    error,
    fetchMoreTags,
    gifMedia,
    gifs,
    imagesAndVideosMediaList,
    inputText,
    loading,
    matchedTagMembersList,
    ogTags,
    openGifCollapse,
    query,
  ]);
  const applicationGeneralDataContext = useMemo(() => {
    return {
      currentUser,
      memberState,
      logoutUser,
      currentCommunity,
    };
  }, [currentCommunity, currentUser, logoutUser, memberState]);
  const router: Router = {
    location: location,
    navigate: navigate,
  };
  return {
    inputBoxRef,
    inputWrapperRef,
    inputText,
    matchedTagMembersList,
    fetchMoreTags,
    documentsMediaList,
    imagesAndVideosMediaList,
    ogTag: ogTags,
    gifMedia,
    gifs: gifs,
    loadingGifs: loading,
    errorOnGifs: error,
    gifSearchQuery: gifSearchQuery,
    openGifCollapse: openGifCollapse,
    gifQuery: query,
    // Functions
    updateInputText: onUpdateInputText
      ? onUpdateInputText.bind(
          null,
          inputDefaultActions,
          applicationGeneralDataContext,
          inputDataStore,
          router,
        )
      : updateInputText,
    onTextInputKeydownHandler: onOnTextInputKeydownHandler
      ? onOnTextInputKeydownHandler.bind(
          null,
          inputDefaultActions,
          applicationGeneralDataContext,
          inputDataStore,
          router,
        )
      : onTextInputKeydownHandler,
    onTextInputKeyUpHandler: onOnTextInputKeyUpHandler
      ? onOnTextInputKeyUpHandler.bind(
          null,
          inputDefaultActions,
          applicationGeneralDataContext,
          inputDataStore,
          router,
        )
      : onTextInputKeyUpHandler,
    clearTaggingList: onClearTaggingList
      ? onClearTaggingList.bind(
          null,
          inputDefaultActions,
          applicationGeneralDataContext,
          inputDataStore,
          router,
        )
      : clearTaggingList,
    addEmojiToText: onAddEmojiToText
      ? onAddEmojiToText.bind(
          null,
          inputDefaultActions,
          applicationGeneralDataContext,
          inputDataStore,
          router,
        )
      : addEmojiToText,
    addDocumentsMedia: onAddDocumentsMedia
      ? onAddDocumentsMedia.bind(
          null,
          inputDefaultActions,
          applicationGeneralDataContext,
          inputDataStore,
          router,
        )
      : addDocumentsMedia,
    addImagesAndVideosMedia: onAddImagesAndVideosMedia
      ? onAddImagesAndVideosMedia.bind(
          null,
          inputDefaultActions,
          applicationGeneralDataContext,
          inputDataStore,
          router,
        )
      : addImagesAndVideosMedia,
    postMessage: onPostMessage
      ? onPostMessage.bind(
          null,
          inputDefaultActions,
          applicationGeneralDataContext,
          inputDataStore,
          router,
        )
      : postMessage,
    getTaggingMembers: onGetTaggingMembers
      ? onGetTaggingMembers.bind(
          null,
          inputDefaultActions,
          applicationGeneralDataContext,
          inputDataStore,
          router,
        )
      : fetchTaggingList,
    removeOgTag: onRemoveOgTag
      ? onRemoveOgTag.bind(
          null,
          inputDefaultActions,
          applicationGeneralDataContext,
          inputDataStore,
          router,
        )
      : removeOgTag,
    setOpenGifCollapse: onSetOpenGifCollapse
      ? onSetOpenGifCollapse.bind(
          null,
          inputDefaultActions,
          applicationGeneralDataContext,
          inputDataStore,
          router,
        )
      : setOpenGifCollapse,
    fetchGifs: onFetchGifs
      ? onFetchGifs.bind(
          null,
          inputDefaultActions,
          applicationGeneralDataContext,
          inputDataStore,
          router,
        )
      : fetchGifs,
    handleGifSearch: onHandleGifSearch
      ? onHandleGifSearch.bind(
          null,
          inputDefaultActions,
          applicationGeneralDataContext,
          inputDataStore,
          router,
        )
      : handleSearch,
    setGifMedia: onSetGifMedia
      ? onSetGifMedia.bind(
          null,
          inputDefaultActions,
          applicationGeneralDataContext,
          inputDataStore,
          router,
        )
      : setGifMedia,
    removeMediaFromImageList: onRemoveMediaFromImageList
      ? onRemoveMediaFromImageList.bind(
          null,
          inputDefaultActions,
          applicationGeneralDataContext,
          inputDataStore,
          router,
        )
      : removeMediaFromImageList,
    removeMediaFromDocumentList: onRemoveMediaFromDocumentList
      ? onRemoveMediaFromDocumentList.bind(
          null,
          inputDefaultActions,
          applicationGeneralDataContext,
          inputDataStore,
          router,
        )
      : removeMediaFromDocumentList,
    sendDMRequest: onSendDMRequest
      ? onSendDMRequest.bind(
          null,
          inputDefaultActions,
          applicationGeneralDataContext,
          inputDataStore,
          router,
        )
      : sendDMRequest,
    rejectDMRequest: onRejectDMRequest
      ? onRejectDMRequest.bind(
          null,
          inputDefaultActions,
          applicationGeneralDataContext,
          inputDataStore,
          router,
        )
      : rejectDMRequest,
    aprooveDMRequest: onAprooveDMRequest
      ? onAprooveDMRequest.bind(
          null,
          inputDefaultActions,
          applicationGeneralDataContext,
          inputDataStore,
          router,
        )
      : aprooveDMRequest,
  };
}

export interface UseInputReturns {
  inputBoxRef: MutableRefObject<HTMLDivElement | null>;
  inputWrapperRef: MutableRefObject<HTMLDivElement | null>;
  inputText: string;
  matchedTagMembersList: Member[];
  fetchMoreTags: boolean;
  imagesAndVideosMediaList: File[] | null;
  documentsMediaList: File[] | null;
  ogTag: OgTag | null;
  gifMedia: Gif | null;
  gifs: Gif[];
  loadingGifs: boolean;
  errorOnGifs: string | null;
  gifQuery: string;
  openGifCollapse: boolean;
  updateInputText: onChangeUpdateInputText;
  onTextInputKeydownHandler: onKeydownEvent;
  onTextInputKeyUpHandler: onKeyUpEvent;
  clearTaggingList: ZeroArgVoidReturns;
  addEmojiToText: TwoArgVoidReturns<EmojiData, MouseEvent>;
  addImagesAndVideosMedia: OneArgVoidReturns<ChangeEvent<HTMLInputElement>>;
  addDocumentsMedia: OneArgVoidReturns<ChangeEvent<HTMLInputElement>>;
  postMessage: OneOptionalArgVoidReturns<Record<string, any>>;
  getTaggingMembers: OneOptionalArgVoidReturns<number>;
  removeOgTag: ZeroArgVoidReturns;
  setGifMedia: Dispatch<Gif | null>;
  setOpenGifCollapse: Dispatch<boolean>;
  gifSearchQuery: OneArgVoidReturns<string>;
  fetchGifs: OneArgVoidReturns<string>;
  handleGifSearch: ZeroArgVoidReturns;
  removeMediaFromImageList: OneArgVoidReturns<number>;
  removeMediaFromDocumentList: OneArgVoidReturns<number>;
  sendDMRequest: OneArgVoidReturns<string>;
  rejectDMRequest: ZeroArgVoidReturns;
  aprooveDMRequest: ZeroArgVoidReturns;
  attachmentOptions?: LMInputAttachments[];
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

export interface InputDefaultActions {
  updateInputText: onChangeUpdateInputText;
  onTextInputKeydownHandler: onKeydownEvent;
  onTextInputKeyUpHandler: onKeyUpEvent;
  clearTaggingList: ZeroArgVoidReturns;
  addEmojiToText: TwoArgVoidReturns<EmojiData, MouseEvent>;
  addImagesAndVideosMedia: OneArgVoidReturns<ChangeEvent<HTMLInputElement>>;
  addDocumentsMedia: OneArgVoidReturns<ChangeEvent<HTMLInputElement>>;
  postMessage: OneOptionalArgVoidReturns<Record<string, any>>;
  getTaggingMembers: OneOptionalArgVoidReturns<number>;
  removeOgTag: ZeroArgVoidReturns;
  setGifMedia: Dispatch<Gif | null>;
  setOpenGifCollapse: Dispatch<boolean>;
  gifSearchQuery: OneArgVoidReturns<string>;
  fetchGifs: OneArgVoidReturns<string>;
  handleGifSearch: ZeroArgVoidReturns;
  removeMediaFromImageList: OneArgVoidReturns<number>;
  removeMediaFromDocumentList: OneArgVoidReturns<number>;
  sendDMRequest: OneArgVoidReturns<string>;
  rejectDMRequest: ZeroArgVoidReturns;
  aprooveDMRequest: ZeroArgVoidReturns;
}

export interface InputDataStore {
  inputBoxRef: MutableRefObject<HTMLDivElement | null>;
  inputWrapperRef: MutableRefObject<HTMLDivElement | null>;
  inputText: string;
  matchedTagMembersList: Member[];
  fetchMoreTags: boolean;
  imagesAndVideosMediaList: File[] | null;
  documentsMediaList: File[] | null;
  ogTag: OgTag | null;
  gifMedia: Gif | null;
  gifs: Gif[];
  loadingGifs: boolean;
  errorOnGifs: string | null;
  gifQuery: string;
  openGifCollapse: boolean;
}
