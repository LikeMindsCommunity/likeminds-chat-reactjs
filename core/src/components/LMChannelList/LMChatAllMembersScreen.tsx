import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Member from "../../types/models/member";
import GlobalClientProviderContext from "../../context/LMGlobalClientProviderContext";
import InfiniteScroll from "react-infinite-scroll-component";
import { getAvatar } from "../../shared/components/LMUserMedia";
import { CustomActions } from "../../customActions";
import { ZeroArgVoidReturns } from "../../hooks/useInput";
import LMUserProviderContext from "../../context/LMUserProviderContext";
import { MemberType } from "../../enums/lm-member-type";

interface LMChatAllMembersScreenProps {
  showList?: number;
  closeNewDMScreen: ZeroArgVoidReturns;
}

const LMChatAllMembersScreen = ({
  showList,
  closeNewDMScreen,
}: LMChatAllMembersScreenProps) => {
  const { lmChatClient } = useContext(GlobalClientProviderContext);
  const { currentUser } = useContext(LMUserProviderContext);
  const [members, setMembers] = useState<Member[]>([]);
  const [loadMoreMembers, setLoadMoreMembers] = useState<boolean>(true);
  const currentPageCount = useRef<number>(1);

  const createNewDM = useCallback(
    async (memberId: string | number) => {
      closeNewDMScreen();
      try {
        const checkDMLimitCall = await lmChatClient.checkDMLimitWithUuid({
          uuid: memberId,
        });
        if (checkDMLimitCall.success) {
          const chatroomId = checkDMLimitCall.data.chatroomId;
          if (chatroomId) {
            const NEW_CHATROOM_SELECTED = new CustomEvent(
              CustomActions.NEW_CHATROOM_SELECTED,
              {
                detail: {
                  chatroomId: chatroomId,
                },
              },
            );
            document.dispatchEvent(NEW_CHATROOM_SELECTED);
            return;
          }
          const isRequestDmLimitExceeded =
            checkDMLimitCall?.data.isRequestDmLimitExceeded;
          if (!isRequestDmLimitExceeded) {
            const createDMChatroomCall =
              await lmChatClient.createDMChatroomWithUuid({
                uuid: memberId,
              });
            if (createDMChatroomCall.success) {
              const newChatroomId = createDMChatroomCall?.data.chatroom.id;

              const NEW_CHATROOM_SELECTED = new CustomEvent(
                CustomActions.NEW_CHATROOM_SELECTED,
                {
                  detail: {
                    chatroomId: newChatroomId,
                  },
                },
              );
              document.dispatchEvent(NEW_CHATROOM_SELECTED);
              return;
            }
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    [lmChatClient],
  );

  const getMembers = useCallback(
    async (pageNumber: number) => {
      try {
        const call = await lmChatClient.getAllMembers({
          page: pageNumber,
          memberState:
            showList === 1
              ? [MemberType.COMMUNITY_MANAGER, MemberType.MEMBER]
              : [MemberType.MEMBER],
        });
        if (call.success) {
          if (call.data.members.length > 0) {
            currentPageCount.current = currentPageCount.current + 1;
          } else {
            setLoadMoreMembers(false);
          }
          setMembers((currentMembers) => {
            const newMembers = [...currentMembers, ...call.data.members];
            console.log(newMembers);
            return newMembers;
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
    [lmChatClient, showList],
  );
  useEffect(() => {
    getMembers(1);
  }, [getMembers]);

  return (
    <div>
      <InfiniteScroll
        loader={null}
        hasMore={loadMoreMembers}
        dataLength={members.length}
        next={getMembers.bind(null, currentPageCount.current + 1)}
      >
        {members.map((member) => {
          if (member.sdkClientInfo?.uuid === currentUser.sdkClientInfo?.uuid) {
            return null;
          }
          return (
            <div
              key={member.sdkClientInfo?.uuid}
              className="lm-chat-new-chat"
              onClick={() => createNewDM(member.sdkClientInfo!.uuid)}
            >
              {getAvatar({ imageUrl: member.imageUrl, name: member.name })}

              {member.name}
            </div>
          );
        })}
      </InfiniteScroll>
    </div>
  );
};

export default LMChatAllMembersScreen;
