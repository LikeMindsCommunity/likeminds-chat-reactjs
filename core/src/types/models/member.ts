import {
  Member as DLMember,
  MemberRight as DLMemberRight,
  SDKClientInfo as DLSdkClientInfo,
} from "@likeminds.community/chat-js";
export default interface Member extends DLMember {
  memberRights?: MemberRight[];
}

export interface MemberRight extends DLMemberRight {}

export interface SdkClientInfo extends DLSdkClientInfo {}
