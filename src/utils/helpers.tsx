import React, { MutableRefObject, ReactNode } from "react";
import {
  S3Client,
  PutObjectCommand,
  // PutObjectOutput,
  PutObjectRequest,
} from "@aws-sdk/client-s3";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
// import { LMAppAwsKeys } from "./constants/lmAppAwsKeys";
import { FileType } from "../types/enums/Filetype";
import { FileTypeInitials } from "../enums/file-type-initials";
import Member from "../types/models/member";
type StringTagType = {
  text: string;
  type: number;
  route?: string;
};

export class Utils {
  private static poolId = "ap-south-1:181963ba-f2db-450b-8199-964a941b38c2";
  private static bucketName = "beta-likeminds-media";
  private static region = "ap-south-1";
  private static bucketUrl = "https://beta-likeminds-media.s3.amazonaws.com/";
  static REGEX_USER_SPLITTING = /<<[^<>>]*>>/g;
  static REGEX_USER_TAGGING =
    /<<(?<name>[^<>|]+)\|route:\/\/(?<route>[^<>]+(\?.+)?)>>/g;
  static parseAndReplaceTags = (text: string): ReactNode => {
    if (!text) {
      return null; // Return null if text is empty
    }

    const tagRegex = /<<([^|]+)\|([^>]+)>>/g;
    const lines = text.split(/\r?\n/); // Split text into lines
    const elements: ReactNode[] = [];

    lines.forEach((line, lineIndex) => {
      if (lineIndex > 0) {
        // Add line break between lines
        elements.push(<br key={`br-${lineIndex}`} />);
      }

      let lastIndex = 0;

      line.replace(tagRegex, (match, name, route, index) => {
        // Add the text before the tag
        if (index > lastIndex) {
          elements.push(line.substring(lastIndex, index));
        }

        // Add the user info tag as a clickable span
        elements.push(
          <span
            key={`${lineIndex}-${index}`}
            // onClick={() => handleRouteClick(route)}
            className="userTag"
          >
            {name}
          </span>,
        );

        // Update the lastIndex
        lastIndex = index + match.length;

        return match;
      });

      // Add the remaining text after the last tag
      if (lastIndex < line.length) {
        elements.push(line.substring(lastIndex));
      }
    });

    // Convert URLs to anchor tags
    const textWithLinks = elements.map((element, index) => {
      if (typeof element === "string") {
        // Convert string to a React fragment containing anchor tags for URLs
        return (
          <React.Fragment key={index}>
            {element.split(/\b(https?:\/\/\S+|www\.\S+)\b/g).map((part, i) => {
              if (i % 2 === 0) {
                return part; // Regular text
              } else {
                const url = part.startsWith("http") ? part : `http://${part}`;
                return (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {part}
                  </a>
                );
              }
            })}
          </React.Fragment>
        );
      }
      return element;
    });

    return textWithLinks;
  };

  static parseAnser(answer: string): JSX.Element[] {
    console.log(answer);
    const user_splitted_string = answer.split(this.REGEX_USER_SPLITTING);
    const users_matched = answer.match(this.REGEX_USER_TAGGING);
    const combinedMatchesArray: StringTagType[] = [];
    for (
      let index = 0;
      index <
      Math.max(user_splitted_string?.length, users_matched?.length || 0);
      index++
    ) {
      if (index < user_splitted_string.length) {
        const text = user_splitted_string[index];
        combinedMatchesArray.push({
          text: text,
          type: 0,
        });
      }
      if (index < (users_matched?.length || 0)) {
        const match = Array.from(users_matched || [])[index];
        // console.log(match);
        const regexMatch = this.REGEX_USER_TAGGING.exec(match);
        // console.log(regexMatch);
        const groups = regexMatch?.groups;

        combinedMatchesArray.push({
          text: groups?.name || "",
          type: 1,
          route: groups?.route || "",
        });
      }
    }
    return combinedMatchesArray.map((item: StringTagType, index: number) => {
      switch (item.type) {
        case 0: {
          return <span key={index}>{item.text.toString()}</span>;
        }
        case 1: {
          return <span key={item.route}>{item.text.toString()}</span>;
        }
        default:
          return <></>;
      }
    });
  }
  static getCharacterWidth(character: string): number {
    const font: string = "Roboto",
      fontSize: number = 16;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (context) {
      context.font = `${fontSize}px ${font}`;
      const metrics = context.measureText(character);
      return metrics.width;
    } else {
      return 0;
    }
  }
  static getCaretPosition = (): number => {
    const selection = window.getSelection();
    const editableDiv = selection?.focusNode as Node;
    let caretPos = 0;
    if (window.getSelection()) {
      if (selection?.rangeCount && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(editableDiv);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        caretPos = preCaretRange.toString().length;
      }
    }
    return caretPos;
  };
  static checkAtSymbol(str: string, index: number): number {
    if (index < 0 || index >= str.length) {
      return -1;
    }
    let pos = -1;
    for (let i = index; i >= 0; i--) {
      if (str[i] === "@") {
        pos = i;
        break;
      }
    }
    if (pos === -1) {
      return -1;
    } else if (pos === 0) {
      return 1;
    } else if (pos > 0 && /\s/.test(str[pos - 1])) {
      return pos + 1;
    } else {
      return -1;
    }
  }
  static findSpaceAfterIndex(str: string, index: number): number {
    if (index < 0 || index >= str.length) {
      throw new Error("Invalid index");
    }
    let pos = -1;
    for (let i = index + 1; i < str.length; i++) {
      if (str[i] === " ") {
        pos = i - 1;
        break;
      } else if (str[i] === "@") {
        pos = i - 1;
        break;
      }
    }
    if (pos === -1) {
      return str.length - 1;
    } else {
      return pos;
    }
  }
  static findTag(str: string): TagInfo | undefined {
    if (str.length === 0) {
      return undefined;
    }
    const cursorPosition = this.getCaretPosition();

    // // ("the cursor position is: ", cursorPosition)
    const leftLimit = this.checkAtSymbol(str, cursorPosition - 1);

    if (leftLimit === -1) {
      return undefined;
    }
    const rightLimit = this.findSpaceAfterIndex(str, cursorPosition - 1);
    // // ("the right limit is :", rightLimit)
    const substr = str.substring(leftLimit, rightLimit + 1);

    return {
      tagString: substr,
      limitLeft: leftLimit,
      limitRight: rightLimit,
    };
  }
  static setCursorToTheEnd(
    textFieldRef: MutableRefObject<HTMLDivElement | null>,
  ) {
    if (textFieldRef?.current) {
      // Setting the cursor at the end of the div
      textFieldRef.current.focus();
      const range = document.createRange();

      range.selectNodeContents(textFieldRef.current);

      range.collapse(false);

      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();

        selection.addRange(range);
      }
    }
  }
  static extractTextFromNode(node: HTMLElement): string {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent || "";
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.nodeName === "A") {
        let textContent: string = node.textContent || "";
        textContent = textContent.substring(1);
        const id = node.getAttribute("id");
        return `<<${textContent}|route://user_profile/${id}>>`;
      } else if (node.nodeName === "BR") {
        return "\n"; // Add a new line
      } else if (node.nodeName === "SPAN") {
        return "";
      } else {
        let text = "";
        const childNodes = node.childNodes;
        for (const childNode of childNodes) {
          const retText = Utils.extractTextFromNode(childNode as HTMLElement);
          text += retText;
        }
        return "\n" + text;
      }
    } else {
      return "";
    }
  }
  static insertCharAtEnd(contentEditableDiv: HTMLElement, char: string): void {
    if (typeof char !== "string") {
      throw new Error("The second argument must be a string.");
    }

    if (contentEditableDiv.isContentEditable) {
      // Append the character at the end of the last node
      const lastChild = contentEditableDiv.lastChild;

      if (lastChild) {
        // Check the type of the last node
        if (lastChild.nodeType === Node.TEXT_NODE) {
          // If it's a text node, append the character
          (lastChild as Text).textContent += char;
        } else {
          // If it's an element node, create a new text node and append it
          const textNode = document.createTextNode(char);
          contentEditableDiv.appendChild(textNode);
        }
      } else {
        // If there's no child, simply add the character
        contentEditableDiv.textContent = char;
      }

      // Move caret to the end of the contentEditableDiv
      const range = document.createRange();
      const selection = window.getSelection();

      range.selectNodeContents(contentEditableDiv);
      range.collapse(false);

      selection?.removeAllRanges();
      selection?.addRange(range);

      // Focus the contentEditableDiv
      contentEditableDiv.focus();
    } else {
      console.error("The provided element is not contenteditable.");
    }
  }
  static convertTextToHTML(text: string) {
    const regex =
      /<<.*?>>|(?:https?|ftp):\/\/[^\s/$.?#].[^\s]*|www\.[^\s/$.?#].[^\s]*/g;
    const matches = text?.match(regex) || [];
    const splits = text?.split(regex);

    const container = document.createElement("div");

    for (let i = 0; i < splits?.length; i++) {
      const splitNode = document.createTextNode(splits[i]);
      container.appendChild(splitNode);

      if (matches[i]) {
        const text = matches[i];
        const getInfoPattern = /<<([^|]+)\|([^>>]+)>>/;
        const match = text.match(getInfoPattern);
        const userObject: MatchPattern = {
          type: 1,
        };
        if (match) {
          const userName = match[1];
          const userId = match[2];
          userObject.displayName = userName;
          userObject.routeId = userId;
        } else {
          userObject.type = 2;
          userObject.link = text;
        }
        if (userObject.type === 1) {
          // const matchText = matches[i].slice(2, -2); // Remove '<<' and '>>'
          const linkNode = document.createElement("a");
          linkNode.href = "#"; // You can set the appropriate URL here
          linkNode.textContent = userObject.displayName!;
          linkNode.id = userObject.routeId!;
          container.appendChild(linkNode);
        } else {
          const linkNode = document.createElement("a");
          linkNode.href = userObject.link!; // You can set the appropriate URL here
          linkNode.textContent = userObject.link!;
          container.appendChild(linkNode);
        }
      }
    }

    return container;
  }
  static getAWS(): S3Client {
    const credentials = fromCognitoIdentityPool({
      identityPoolId: this.poolId,
      clientConfig: {
        region: this.region,
      },
    });

    const s3Client = new S3Client({ region: this.region, credentials });
    return s3Client;
  }

  static async uploadMedia(
    media: File,
    conversationId: string,
    chatroomId: string,
  ): Promise<unknown> {
    const s3Client = this.getAWS();
    const { Key, Bucket, Body, ACL, ContentType } = this.buildUploadParams(
      media,
      conversationId,
      chatroomId,
    );
    const command = new PutObjectCommand({
      Key,
      Bucket,
      Body,
      ACL,
      ContentType,
    });
    await s3Client.send(command);
    return Key || "";
  }

  private static buildUploadParams(
    media: File,
    conversationId: string,
    chatroomId: string,
  ): PutObjectRequest {
    const key = this.generateKey(chatroomId, conversationId, media);
    console.log(key);
    return {
      // Key: `files/post/${userUniqueId}/${media.name}`,
      Key: key,
      Bucket: this.bucketName,
      Body: media,
      ACL: "public-read-write",
      ContentType: media.type.includes(FileType.image)
        ? FileType.image
        : media.type.includes(FileType.video)
          ? FileType.video
          : "pdf",
    };
  }
  static generateKey(chatroomId: string, conversationId: string, media: File) {
    const conversationInitials = media.type.includes(FileType.image)
      ? FileTypeInitials.IMAGE
      : media.type.includes(FileType.video)
        ? FileTypeInitials.VIDEO
        : media.type.includes(FileType.document)
          ? FileTypeInitials.PDF
          : FileTypeInitials.OTHERS;
    return `files/collabcard/${chatroomId}/conversation/${conversationId}/${conversationInitials}${Date.now()}.${media.name.split(".").reverse()[0]}`;
  }
  static generateFileUrl(keyName: string) {
    return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${keyName}`;
  }
  static returnCSSForTagging(
    refObject: React.MutableRefObject<HTMLDivElement | null>,
  ) {
    if (!(refObject && refObject.current)) {
      return;
    }
    const selection = window.getSelection();
    if (!selection) {
      return;
    }
    const resObject: {
      left: string | number;
      position: string;
      top: string | number;
    } = {
      left: "0px",
      position: "absolute",
      top: "0px",
    };
    if (selection === null) {
      return {};
    }
    const focusNodeParentBoundings =
      selection.focusNode?.parentElement?.getBoundingClientRect();
    resObject.top = (
      focusNodeParentBoundings!.top -
      refObject.current!.getBoundingClientRect()!.top +
      30
    )
      .toString()
      .concat("px");
    const leftSubstring =
      selection.focusNode?.parentElement?.textContent?.substring(
        0,
        selection.focusOffset - 1,
      );
    const width = Utils.getCharacterWidth(leftSubstring!);
    if (width > 264) {
      resObject.left = "264px";
    } else {
      resObject.left = width;
    }
    resObject.position = "absolute";
    return resObject;
  }
  static setCursorAtEnd(
    contentEditableDiv: React.MutableRefObject<HTMLDivElement | null>,
  ): void {
    if (!contentEditableDiv.current) return;

    const range = document.createRange();
    const selection = window.getSelection();

    range.selectNodeContents(contentEditableDiv.current);
    range.collapse(false);

    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
    }

    contentEditableDiv.current.focus();
  }
  static setTagUserImage(user: Member) {
    const imageLink = user?.imageUrl || user?.image_url;
    if (imageLink !== "") {
      return (
        <img
          src={imageLink}
          alt={""}
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
          }}
        />
      );
    } else {
      return (
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f5f5f5",
            fontSize: "14px",
            fontWeight: "bold",
            color: "#333",
          }}
          className="reply-editor"
        >
          {user?.name?.split(" ").map((part: string) => {
            return part.charAt(0)?.toUpperCase();
          })}
        </div>
      );
    }
  }
  static detectLinks(text: string) {
    const regex = /\b(?:https?:\/\/)?(?:[\w.]+\.\w+)(?:(?<=\\n)|\b)/g;
    const links = text?.match(regex);
    return links ? links : [];
  }
}
export interface TagInfo {
  tagString: string;
  limitLeft: number;
  limitRight: number;
}
// normal text strings: 0
// taggingStrings: 1
interface MatchPattern {
  type: number;
  displayName?: string;
  routeId?: string;
  link?: string;
}
