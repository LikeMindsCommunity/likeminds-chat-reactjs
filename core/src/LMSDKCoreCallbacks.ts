/* eslint-disable @typescript-eslint/no-explicit-any */
import LMChatClient, {
  LMSDKCallbacks,
} from "@likeminds.community/chat-js-beta";
import { CustomActions } from "./customActions";
import Member from "./types/models/member";

export class LMCoreCallbacks {
  constructor(
    onAccessTokenExpiredAndRefreshed: (
      accessToken: string,
      refreshToken: string,
    ) => void,
    onRefreshTokenExpired: () => Promise<{
      accessToken: string;
      refreshToken: string;
    } | null>,
  ) {
    (this.onAccessTokenExpiredAndRefreshed = onAccessTokenExpiredAndRefreshed),
      (this.onRefreshTokenExpired = onRefreshTokenExpired);
  }
  onAccessTokenExpiredAndRefreshed: (
    accessToken: string,
    refreshToken: string,
  ) => void;
  onRefreshTokenExpired:
    | (() => { accessToken: string; refreshToken: string } | null)
    | (() => Promise<{ accessToken: string; refreshToken: string } | null>);
}

export class LMSDKCallbacksImplementations extends LMSDKCallbacks {
  lmCoreCallbacks: LMCoreCallbacks;
  client: LMChatClient;

  setTokensInLocalStorage(accessToken: string, refreshToken: string) {
    this.client?.setAccessTokenInLocalStorage(accessToken);
    this.client?.setRefreshTokenInLocalStorage(refreshToken);
  }
  async loginFunction() {
    try {
      const user = this.client.getUserFromLocalStorage();
      if (!user) {
        return null;
      }
      const { sdkClientInfo, name, isGuest } = JSON.parse(user);
      const { uuid } = sdkClientInfo;
      const initiateUserCall = await this.client.initiateUser({
        userUniqueId: uuid,
        isGuest: isGuest,
        userName: name,
        apiKey: this.client.getApiKeyFromLocalStorage(),
      });
      if (initiateUserCall.success) {
        this.setTokensInLocalStorage(
          initiateUserCall.data.accessToken,
          initiateUserCall.data.refreshToken,
        );

        this.client?.setUserInLocalStorage(
          JSON.stringify(initiateUserCall?.data?.user),
        );
      }
      const memberStateCall = await this.client?.getMemberState();
      const userObject: Member = {
        ...initiateUserCall?.data?.user,
      };
      userObject.memberRights = memberStateCall?.data?.memberRights;
      userObject.state = memberStateCall?.data?.state;
      document.dispatchEvent(
        new CustomEvent(CustomActions.TRIGGER_SET_USER, {
          detail: {
            user: userObject,
            community: initiateUserCall?.data?.community,
          },
        }),
      );

      return {
        accessToken: initiateUserCall?.data?.accessToken,
        refreshToken: initiateUserCall?.data?.refreshToken,
      };
    } catch (error) {
      return null;
    }
  }
  onAccessTokenExpiredAndRefreshed(
    accessToken: string,
    refreshToken: string,
  ): void {
    this.lmCoreCallbacks.onAccessTokenExpiredAndRefreshed(
      accessToken,
      refreshToken,
    );
  }
  async onRefreshTokenExpired() {
    const apiKey = this.client.getApiKeyFromLocalStorage();
    if (apiKey && apiKey.length) {
      return this.loginFunction();
    } else {
      return this.lmCoreCallbacks.onRefreshTokenExpired();
    }
  }
  constructor(lmCoreCallbacks: LMCoreCallbacks, client: LMChatClient) {
    super();
    this.lmCoreCallbacks = lmCoreCallbacks;
    this.client = client;
  }
}
