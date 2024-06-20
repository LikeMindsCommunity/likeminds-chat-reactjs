import React from "react";
import Member from "../types/models/member";

interface UserProviderContextInterface {
  currentUser: Member | null;
  memberState: unknown;
  logoutUser: (() => void) | null;
  currentCommunity: unknown;
}
export default React.createContext<UserProviderContextInterface>({
  currentUser: null,
  memberState: null,
  logoutUser: null,
  currentCommunity: null,
});
