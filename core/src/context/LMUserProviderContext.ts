import React from "react";
import Member from "../types/models/member";
import { Community } from "../types/models/Community";

export interface UserProviderContextInterface {
  currentUser: Member;
  memberState: number;
  logoutUser: (() => void) | null;
  currentCommunity: Community;
}
export default React.createContext<UserProviderContextInterface>(
  {} as UserProviderContextInterface,
);

export interface ApplicationGeneralDataContext {
  currentUser: Member;
  memberState: number;
  logoutUser: (() => void) | null;
  currentCommunity: Community;
}
