import React from "react";

interface UserProviderContextInterface {
  currentUser: unknown;
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
