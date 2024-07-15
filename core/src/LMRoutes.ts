export class LMRoutes {
  private ROOT_PATH = "/";
  private ID_PATH = ":id";
  private MODE = ":mode";
  private CHANNEL_PATH = "channel";
  private DM_CHANNEL_PATH = "dm";
  private PARTICIPANTS_PATH = "participants";
  private PAGE_NOT_FOUND_PATH = "404";

  public setRootPath(path: string) {
    this.ROOT_PATH = path;
  }

  public getRootPath(): string {
    return this.ROOT_PATH;
  }

  public setIdPath(path: string) {
    this.ID_PATH = path;
  }

  public getIdPath(): string {
    return this.ID_PATH;
  }

  public setMode(path: string) {
    this.MODE = path;
  }

  public getMode(): string {
    return this.MODE;
  }

  public setChannelPath(path: string) {
    this.CHANNEL_PATH = path;
  }

  public getChannelPath(): string {
    return this.CHANNEL_PATH;
  }

  public setDmChannelPath(path: string) {
    this.DM_CHANNEL_PATH = path;
  }

  public getDmChannelPath(): string {
    return this.DM_CHANNEL_PATH;
  }

  public setParticipantsPath(path: string) {
    this.PARTICIPANTS_PATH = path;
  }

  public getParticipantsPath(): string {
    return this.PARTICIPANTS_PATH;
  }

  public setPageNotFoundPath(path: string) {
    this.PAGE_NOT_FOUND_PATH = path;
  }

  public getPageNotFoundPath(): string {
    return this.PAGE_NOT_FOUND_PATH;
  }
}
