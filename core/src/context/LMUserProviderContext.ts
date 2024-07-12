import React from "react";
import Member from "../types/models/member";
import { Community } from "../types/models/Community";

interface UserProviderContextInterface {
  currentUser: Member;
  memberState: unknown;
  logoutUser: (() => void) | null;
  currentCommunity: Community;
}
export default React.createContext<UserProviderContextInterface>(
  {} as UserProviderContextInterface,
);
