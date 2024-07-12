/* eslint-disable @typescript-eslint/no-explicit-any */
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
      | (() => { accessToken: string; refreshToken: string } | null)
      | (() => Promise<{ accessToken: string; refreshToken: string } | null>),
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
      console.log("Inside login");
      const user = this.client?.getUserFromLocalStorage();
      console.log(user);
      if (!user) {
        return;
      }
      const { sdk_client_info, name, is_guest } = JSON.parse(user);
      const { uuid } = sdk_client_info;
      const initiateUserCall = await this.client?.initiateUser({
        userUniqueId: uuid,
        isGuest: is_guest,
        userName: name,
        apiKey: this.client.getApiKeyFromLocalStorage(),
      });
      if (initiateUserCall.success) {
        this.setTokensInLocalStorage(
          initiateUserCall.data?.access_token || "",
          initiateUserCall.data?.refresh_token || "",
        );

        this.client?.setUserInLocalStorage(
          JSON.stringify(initiateUserCall.data?.user),
        );
      }
      const memberStateCall = await this.client?.getMemberState();
      const userObject = {
        ...initiateUserCall.data?.user,
      };
      userObject.memberRights = memberStateCall.data?.member_rights;
      userObject.state = memberStateCall.data?.state;
      document.dispatchEvent(
        new CustomEvent(CustomActions.TRIGGER_SET_USER, {
          detail: {
            user: userObject,
            community: initiateUserCall.data?.community,
          },
        }),
      );
      console.log({
        accessToken: initiateUserCall.data?.access_token,
        refreshToken: initiateUserCall.data?.refresh_token,
      });
      return {
        accessToken: initiateUserCall.data?.access_token,
        refreshToken: initiateUserCall.data?.refresh_token,
      };
    } catch (error) {
      return {
        accessToken: "",
        refreshToken: "",
      };
    }
  }
  // loginFunction() {
  //   const user = this.client.getUserFromLocalStorage();
  //   if (!user) {
  //     return null;
  //   }
  //   const { sdk_client_info, name, is_guest } = JSON.parse(user);
  //   const { uuid } = sdk_client_info;
  //   return this.client
  //     .initiateUser({
  //       userUniqueId: uuid,
  //       isGuest: is_guest,
  //       userName: name,
  //       apiKey: this.client.getApiKeyFromLocalStorage(),
  //     })
  //     .then((initiateUserCall) => {
  //       if (initiateUserCall.success) {
  //         this.setTokensInLocalStorage(
  //           initiateUserCall.data.access_token || "",
  //           initiateUserCall.data.refresh_token || "",
  //         );

  //         this.client.setUserInLocalStorage(
  //           JSON.stringify(initiateUserCall.data.user),
  //         );
  //         return this.client
  //           .getMemberState()
  //           .then((memberStateCall) => {
  //             const userObject = {
  //               ...initiateUserCall.data.user,
  //             };
  //             userObject.memberRights = memberStateCall.data.member_rights;
  //             userObject.state = memberStateCall.data.state;
  //             document.dispatchEvent(
  //               new CustomEvent(CustomActions.TRIGGER_SET_USER, {
  //                 detail: {
  //                   user: userObject,
  //                   community: initiateUserCall.data.community,
  //                 },
  //               }),
  //             );
  //             console.log({
  //               accessToken: initiateUserCall.data.access_token,
  //               refreshToken: initiateUserCall.data.refresh_token,
  //             });
  //             return {
  //               accessToken: initiateUserCall.data.access_token,
  //               refreshToken: initiateUserCall.data.refresh_token,
  //             };
  //           })
  //           .catch(() => {
  //             return {
  //               accessToken: "",
  //               refreshToken: "",
  //             };
  //           });
  //       } else {
  //         return null;
  //       }
  //     })
  //     .catch(() => null);
  // }
  onAccessTokenExpiredAndRefreshed(
    accessToken: string,
    refreshToken: string,
  ): void {
    console.log("ye re tokens");
    console.log(accessToken);
    console.log(refreshToken);
    this.lmCoreCallbacks.onAccessTokenExpiredAndRefreshed(
      accessToken,
      refreshToken,
    );
  }
  onRefreshTokenExpired():
    | any
    | {
        accessToken: string;
        refreshToken: string;
      }
    | null
    | Promise<{
        accessToken: string;
        refreshToken: string;
      } | null> {
    console.log("calling");
    const apiKey: string | undefined = this.client.getApiKeyFromLocalStorage();
    console.log(`The apiKey is : ${apiKey}`);
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
