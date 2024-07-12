import LMChatClient, {
  LMSDKCallbacks,
} from "@likeminds.community/chat-js-beta";
import { CustomActions } from "./customActions";
// import { LMFeedCustomActionEvents } from "../temp";

export class LMCoreCallbacks {
  constructor(
    onAccessTokenExpiredAndRefreshed: (
      accessToken: string,
      refreshToken: string,
    ) => void,
    onRefreshTokenExpired:
      | (() => { accessToken: string; refreshToken: string })
      | (() => Promise<{ accessToken: string; refreshToken: string }>),
  ) {
    (this.onAccessTokenExpiredAndRefreshed = onAccessTokenExpiredAndRefreshed),
      (this.onRefreshTokenExpired = onRefreshTokenExpired);
  }
  onAccessTokenExpiredAndRefreshed: (
    accessToken: string,
    refreshToken: string,
  ) => void;
  onRefreshTokenExpired:
    | (() => { accessToken: string; refreshToken: string })
    | (() => Promise<{ accessToken: string; refreshToken: string }>);
}

export class LMSDKCallbacksImplementations extends LMSDKCallbacks {
  lmCoreCallbacks: LMCoreCallbacks;
  client: LMChatClient;

  setTokensInLocalStorage(accessToken: string, refreshToken: string) {
    this.client.setAccessTokenInLocalStorage(accessToken);
    this.client.setRefreshTokenInLocalStorage(refreshToken);
  }
  async loginFunction() {
    try {
      const user = this.client.getUserFromLocalStorage();
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
          initiateUserCall.data?.accessToken || "",
          initiateUserCall.data?.refreshToken || "",
        );

        this.client.setUserInLocalStorage(
          JSON.stringify(initiateUserCall.data?.user),
        );
      }
      const memberStateCall = await this.client?.getMemberState();
      const userObject = {
        ...initiateUserCall.data?.user,
        ...memberStateCall.data.member,
      };
      document.dispatchEvent(
        new CustomEvent(CustomActions.TRIGGER_SET_USER, {
          detail: {
            user: userObject,
            community: initiateUserCall.data?.community,
          },
        }),
      );
      return {
        accessToken: initiateUserCall.data?.accessToken,
        refreshToken: initiateUserCall.data?.refreshToken,
      };
    } catch (error) {
      return {
        accessToken: "",
        refreshToken: "",
      };
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
  onRefreshTokenExpired():
    | {
        accessToken: string;
        refreshToken: string;
      }
    | null
    | Promise<{
        accessToken: string;
        refreshToken: string;
      }> {
    const apiKey: string = this.client.getApiKeyFromLocalStorage();
    if (apiKey && apiKey.length) {
      return this.loginFunction()
        .then(function (res) {
          return res;
        })
        .catch(function (err) {
          return err;
        });
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
