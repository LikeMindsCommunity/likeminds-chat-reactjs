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
import { LMChatroomContext } from "../context/LMChatChatroomContext";
import { PostConversationResponse } from "../types/api-responses/postConversationResponse";
import { FileType } from "../types/enums/Filetype";
import { CustomActions } from "../customActions";

import { DecodeURLResponse } from "../types/api-responses/getOgTagResponse";
import { Gif } from "../types/models/GifObject";
import { ChatroomDetails } from "../types/api-responses/getChatroomResponse";
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
import { Conversation } from "../types/models/conversations";
import ConversationStates from "../enums/lm-conversation-states";
import { ConstantStrings } from "../enums/lm-common-strings";
import { CustomisationContextProvider } from "../context/LMChatCustomisationContext";
import { MemberRightsState } from "../enums/lm-member-rights-states";
export function useInput(): UseInputReturns {
  //contexts
  const { inputCustomActions = {} } = useContext(CustomisationContextProvider);
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
    onShouldShowInputBox,
  } = inputCustomActions;
  const { lmChatClient } = useContext(GlobalClientProviderContext);
  const { currentUser, memberState, currentCommunity, logoutUser } =
    useContext(UserProviderContext);
  const {
    chatroomDetails,
    conversationToedit,
    setConversationToEdit,
    conversationToReply,
    setConversationToReply,
    setNewChatroom,
  } = useContext(LMChatroomContext);
  const {
    chatroomDetails: {
      chatroom: { id: chatroomId },
    },
  } = useContext(LMChatroomContext);
  // state
  const [inputText, setInputText] = useState<string>("");
  const [tagSearchKey, setTagSearchKey] = useState<string | null>(null);
  const [matchedTagMembersList, setMatchedTagMembersList] = useState<Member[]>(
    [],
  );
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
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

  function formatEpochToTime(epoch: string) {
    const date = new Date(parseInt(epoch));
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  const shouldShowInputBox = useCallback(() => {
    const canRespondInChatroom = currentUser!.memberRights!.find(
      (right) => right.state === MemberRightsState.RespondInChatRooms,
    )?.isSelected
      ? true
      : false;
    if (!canRespondInChatroom) {
      setAlertMessage(ConstantStrings.USER_MESSAGES_RESTRICTED_BY_CM);
      return false;
    } else {
      setAlertMessage(null);
    }
    const memberCanMessage =
      chatroomDetails!.chatroom.memberCanMessage || false;

    switch (memberCanMessage) {
      case true:
        setAlertMessage(null);
        return true;
      case false: {
        if (currentUser?.state === MemberType.COMMUNITY_MANAGER) {
          setAlertMessage(null);
          return true;
        } else {
          setAlertMessage(ConstantStrings.ONLY_CM_MESSAGES_ALLOWED);
          return false;
        }
      }
    }
  }, [chatroomDetails, currentUser]);

  const createLocalConversation = useCallback(
    (
      temporaryId: string,
      answerText: string,
      conversationToEdit: Conversation | null,
      conversationToReply: Conversation | null,
      attachments: File[],
      ogTags: OgTag | undefined,
    ) => {
      const localConversation: Conversation = {
        id: 0,
        communityId: currentCommunity.id,
        member: currentUser,
        answer: answerText,
        state: ConversationStates.LOCAL_CONVERSATION_STATE,
        lastSeen: true,
        isEdited: conversationToEdit ? true : false,
        lastUpdatedAt: parseInt(temporaryId),
        deletedBy: "",
        date: Utils.formatEpochToDateWithMonthName(temporaryId),
        createdEpoch: parseInt(temporaryId),
        createdAt: formatEpochToTime(temporaryId),
        attachmentUploaded: false,
        isAnonymous: false,
        hasFiles: false,
        hasReactions: false,
        attachments: attachments as Attachment[],
        replyConversationObject: conversationToReply || undefined,
        ogTags: ogTags,
        temporaryId: temporaryId.toString(),
        userId: currentUser.id.toString(),
      };
      return localConversation;
    },
    [currentCommunity.id, currentUser],
  );

  // This function builds a new GIF attachment
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

  // This funciton will build MediaAttachments
  const buildMediaAttachments = useCallback(
    async (mediaList: File[]) => {
      mediaList = [...mediaList];

      const attachments: Attachment[] = [];
      for (let index = 0; index < mediaList.length; index++) {
        const currentAttachment = mediaList[index];
        const { name, size, type } = currentAttachment;

        if (type.includes(FileType.video)) {
          const { thumbnailUrl, fileUrl, height, width } =
            await Utils.uploadVideoFile(
              currentAttachment,
              chatroomId.toString() || "",
              currentUser!.sdkClientInfo!.uuid,
            );
          if (thumbnailUrl && fileUrl) {
            const attachment: Attachment = {
              url: fileUrl,
              type: FileType.video,
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
            chatroomId.toString() || "",
            currentUser.sdkClientInfo!.uuid,
          );
          if (fileUrl) {
            const attachment: Attachment = {
              url: fileUrl,
              type: FileType.image,
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
            chatroomId.toString() || "",
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
        const sendDmRequestCall = await lmChatClient.sendDMRequest({
          chatRequestState: 0,
          chatroomId: parseInt(chatroomId!.toString()),
          text: textMessage,
        });

        document.dispatchEvent(
          new CustomEvent(CustomActions.DM_CHAT_REQUEST_STATUS_CHANGED, {
            detail: sendDmRequestCall?.data.conversation,
          }),
        );

        const newChatroom = { ...chatroomDetails };
        if (newChatroom.chatroom && newChatroom.chatroom) {
          newChatroom.chatroom.chatRequestState = 0;
          newChatroom.chatroom.chatRequestedBy = currentUser;
        }
        setNewChatroom(newChatroom as ChatroomDetails);
      } catch (error) {
        console.log(error);
      }
    },
    [chatroomId, lmChatClient, chatroomDetails, currentUser, setNewChatroom],
  );
  const aprooveDMRequest = useCallback(async () => {
    try {
      const aprooveDmRequestCall = await lmChatClient.sendDMRequest({
        chatRequestState: 1,
        chatroomId: parseInt(chatroomId!.toString()),
      });
      document.dispatchEvent(
        new CustomEvent(CustomActions.DM_CHAT_REQUEST_STATUS_CHANGED, {
          detail: aprooveDmRequestCall?.data.conversation,
        }),
      );
      const newChatroom = { ...chatroomDetails };
      if (newChatroom.chatroom && newChatroom.chatroom) {
        newChatroom.chatroom.chatRequestState = 1;
      }
      setNewChatroom(newChatroom as ChatroomDetails);
    } catch (error) {
      console.log(error);
    }
  }, [chatroomId, lmChatClient, chatroomDetails, setNewChatroom]);
  const rejectDMRequest = useCallback(async () => {
    try {
      const rejectDmRequestCall = await lmChatClient.sendDMRequest({
        chatRequestState: 2,
        chatroomId: parseInt(chatroomId!.toString()),
      });
      document.dispatchEvent(
        new CustomEvent(CustomActions.DM_CHAT_REQUEST_STATUS_CHANGED, {
          detail: rejectDmRequestCall?.data.conversation,
        }),
      );
      const newChatroom = { ...chatroomDetails };
      if (newChatroom.chatroom && newChatroom.chatroom) {
        newChatroom.chatroom.chatRequestState = 2;
      }
      setNewChatroom(newChatroom as ChatroomDetails);
    } catch (error) {
      console.log(error);
    }
  }, [chatroomId, lmChatClient, chatroomDetails, setNewChatroom]);
  const fetchGifs = useCallback(async (url: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(url);
      const result = await response.json();
      setGifs(result?.data);
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
        const call: GetTaggingListResponse = await lmChatClient.getTaggingList({
          chatroomId: chatroomDetails?.chatroom.id,
          page: pg ? pg : taggingListPageCount.current,
          pageSize: 10,
          searchName: tagSearchKey || "",
        });
        if (call.success) {
          setMatchedTagMembersList((previousState) => {
            return [...previousState, ...(call?.data.communityMembers || [])];
          });
          incrementPageNo();
        }
        if (call?.data.communityMembers?.length) {
          setFetchMoreTags(false);
        }
      } catch (error) {
        console.log(error);
      }
    },
    [chatroomDetails?.chatroom.id, lmChatClient, tagSearchKey],
  );
  const postMessage = useCallback(
    async (customWidgetData?: Record<string, any>) => {
      try {
        if (!chatroomDetails) {
          return;
        }
        const messageText = Utils.extractTextFromNode(
          inputBoxRef.current!,
        ).trim();
        if (
          chatroomDetails.chatroom.type ===
            ChatroomTypes.DIRECT_MESSAGE_CHATROOM &&
          chatroomDetails.chatroom.chatRequestState === null &&
          chatroomDetails.chatroom.member.state !==
            MemberType.COMMUNITY_MANAGER &&
          chatroomDetails.chatroom.chatroomWithUser?.state !==
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
        if (messageText.length)
          if (conversationToedit) {
            // Handling the editing of the conversation
            const call: any = await lmChatClient.editConversation({
              conversationId: conversationToedit.id,
              text: messageText,
            });
            setConversationToEdit(null);
            document.dispatchEvent(
              new CustomEvent(CustomActions.EDIT_ACTION_COMPLETED, {
                detail: call?.data.conversation,
              }),
            );
            setFocusOnInputField();
            return;
          }

        const attachmentsList = imagesAndVideosMediaList
          ? [...imagesAndVideosMediaList]
          : [...(documentsMediaList || [])];
        setImagesAndVideosMediaList([]);
        setDocumentMediaList([]);
        const temporaryId = Date.now().toString();
        const SHOW_SKELETON_CUSTOM_EVENT = new CustomEvent(
          CustomActions.CONVERSATION_POSTED_ON_AI_CHATBOT,
        );
        const localConversation = createLocalConversation(
          temporaryId,
          messageText,
          conversationToedit,
          conversationToReply,
          attachmentsList,
          ogTags || undefined,
        );
        const NEW_CONVERSATION_POSTED = new CustomEvent(
          CustomActions.NEW_CONVERSATION_POSTED,
          {
            detail: {
              conversation: localConversation,
            },
          },
        );
        document.dispatchEvent(NEW_CONVERSATION_POSTED);
        document.dispatchEvent(SHOW_SKELETON_CUSTOM_EVENT);
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
        const chatroomData = chatroomDetails.chatroom;
        const postConversationCallConfig: PostConversationRequest = {
          text: messageText,
          chatroomId: parseInt(chatroomData.id.toString()),
          hasFiles: false,
          ogTags: ogTags || undefined,
          triggerBot: Utils.isOtherUserAIChatbot(
            chatroomData as any as Chatroom,
            currentUser,
          ),
          temporaryId: temporaryId,
          attachments: attachmentsList,
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
          await lmChatClient.postConversation(postConversationCallConfig);

        setFocusOnInputField();
        removeOgTag();
      } catch (error) {
        console.log(error);
      }
    },
    [
      buildMediaAttachments,
      chatroomDetails,
      conversationToReply,
      conversationToedit,
      createLocalConversation,
      currentUser,
      documentsMediaList,
      gifMedia,
      imagesAndVideosMediaList,
      lmChatClient,
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
      if (
        chatroomDetails?.chatroom.type === ChatroomTypes.DIRECT_MESSAGE_CHATROOM
      ) {
        return;
      }
      const tagOp = Utils.findTag(textContentFocusNode!);

      if (tagOp?.tagString !== null && tagOp?.tagString !== undefined) {
        setTagSearchKey(tagOp?.tagString);
      } else {
        setTagSearchKey(null);
      }
    },
    [chatroomDetails?.chatroom.type],
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
      storeInputOnChatroomLeave(chatroomId.toString() || "");
    };
  }, [chatroomId, manageInputOnChatroomChange, storeInputOnChatroomLeave]);
  useEffect(() => {
    const checkForLinksTimeout = setTimeout(async () => {
      try {
        const linksDetected = Utils.detectLinks(inputText || "");
        if (linksDetected.length) {
          const firstLinkDetected = linksDetected[0];
          if (firstLinkDetected.toString() !== ogTags?.url.toString()) {
            const getOgTagData: DecodeURLResponse =
              await lmChatClient.decodeUrl({ url: firstLinkDetected });
            if (getOgTagData?.success) {
              setOgTags(getOgTagData?.data.ogTags);
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
  }, [lmChatClient, inputText]);
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
      shouldShowInputBox,
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
    shouldShowInputBox,
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
      alertMessage,
    };
  }, [
    alertMessage,
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
    alertMessage,
    // Functions
    updateInputText: onUpdateInputText
      ? onUpdateInputText.bind(
          null,
          inputDefaultActions,
          applicationGeneralDataContext,
          inputDataStore,
        )
      : updateInputText,
    onTextInputKeydownHandler: onOnTextInputKeydownHandler
      ? onOnTextInputKeydownHandler.bind(
          null,
          inputDefaultActions,
          applicationGeneralDataContext,
          inputDataStore,
        )
      : onTextInputKeydownHandler,
    onTextInputKeyUpHandler: onOnTextInputKeyUpHandler
      ? onOnTextInputKeyUpHandler.bind(
          null,
          inputDefaultActions,
          applicationGeneralDataContext,
          inputDataStore,
        )
      : onTextInputKeyUpHandler,
    clearTaggingList: onClearTaggingList
      ? onClearTaggingList.bind(
          null,
          inputDefaultActions,
          applicationGeneralDataContext,
          inputDataStore,
        )
      : clearTaggingList,
    addEmojiToText: onAddEmojiToText
      ? onAddEmojiToText.bind(
          null,
          inputDefaultActions,
          applicationGeneralDataContext,
          inputDataStore,
        )
      : addEmojiToText,
    addDocumentsMedia: onAddDocumentsMedia
      ? onAddDocumentsMedia.bind(
          null,
          inputDefaultActions,
          applicationGeneralDataContext,
          inputDataStore,
        )
      : addDocumentsMedia,
    addImagesAndVideosMedia: onAddImagesAndVideosMedia
      ? onAddImagesAndVideosMedia.bind(
          null,
          inputDefaultActions,
          applicationGeneralDataContext,
          inputDataStore,
        )
      : addImagesAndVideosMedia,
    postMessage: onPostMessage
      ? onPostMessage.bind(
          null,
          inputDefaultActions,
          applicationGeneralDataContext,
          inputDataStore,
        )
      : postMessage,
    getTaggingMembers: onGetTaggingMembers
      ? onGetTaggingMembers.bind(
          null,
          inputDefaultActions,
          applicationGeneralDataContext,
          inputDataStore,
        )
      : fetchTaggingList,
    removeOgTag: onRemoveOgTag
      ? onRemoveOgTag.bind(
          null,
          inputDefaultActions,
          applicationGeneralDataContext,
          inputDataStore,
        )
      : removeOgTag,
    setOpenGifCollapse: onSetOpenGifCollapse
      ? onSetOpenGifCollapse.bind(
          null,
          inputDefaultActions,
          applicationGeneralDataContext,
          inputDataStore,
        )
      : setOpenGifCollapse,
    fetchGifs: onFetchGifs
      ? onFetchGifs.bind(
          null,
          inputDefaultActions,
          applicationGeneralDataContext,
          inputDataStore,
        )
      : fetchGifs,
    handleGifSearch: onHandleGifSearch
      ? onHandleGifSearch.bind(
          null,
          inputDefaultActions,
          applicationGeneralDataContext,
          inputDataStore,
        )
      : handleSearch,
    setGifMedia: onSetGifMedia
      ? onSetGifMedia.bind(
          null,
          inputDefaultActions,
          applicationGeneralDataContext,
          inputDataStore,
        )
      : setGifMedia,
    removeMediaFromImageList: onRemoveMediaFromImageList
      ? onRemoveMediaFromImageList.bind(
          null,
          inputDefaultActions,
          applicationGeneralDataContext,
          inputDataStore,
        )
      : removeMediaFromImageList,
    removeMediaFromDocumentList: onRemoveMediaFromDocumentList
      ? onRemoveMediaFromDocumentList.bind(
          null,
          inputDefaultActions,
          applicationGeneralDataContext,
          inputDataStore,
        )
      : removeMediaFromDocumentList,
    sendDMRequest: onSendDMRequest
      ? onSendDMRequest.bind(
          null,
          inputDefaultActions,
          applicationGeneralDataContext,
          inputDataStore,
        )
      : sendDMRequest,
    rejectDMRequest: onRejectDMRequest
      ? onRejectDMRequest.bind(
          null,
          inputDefaultActions,
          applicationGeneralDataContext,
          inputDataStore,
        )
      : rejectDMRequest,
    aprooveDMRequest: onAprooveDMRequest
      ? onAprooveDMRequest.bind(
          null,
          inputDefaultActions,
          applicationGeneralDataContext,
          inputDataStore,
        )
      : aprooveDMRequest,
    shouldShowInputBox: onShouldShowInputBox
      ? onShouldShowInputBox.bind(
          null,
          inputDefaultActions,
          applicationGeneralDataContext,
          inputDataStore,
        )
      : shouldShowInputBox,
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
  alertMessage: string | null;
  shouldShowInputBox: ZeroArgBooleanReturns;
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
  shouldShowInputBox: ZeroArgBooleanReturns;
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
  alertMessage: string | null;
}
