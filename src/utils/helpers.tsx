import React, { MutableRefObject } from "react";

type StringTagType = {
  text: string;
  type: number;
  route?: string;
};

export class Utils {
  static REGEX_USER_SPLITTING = /<<[^<>>]*>>/g;
  static REGEX_USER_TAGGING =
    /<<(?<name>[^<>|]+)\|route:\/\/(?<route>[^<>]+(\?.+)?)>>/g;
  static parseAnser(answer: string): JSX.Element[] {
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
        console.log(match);
        const regexMatch = this.REGEX_USER_TAGGING.exec(match);
        console.log(regexMatch);
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
}
export interface TagInfo {
  tagString: string;
  limitLeft: number;
  limitRight: number;
}
// normal text strings: 0
// taggingStrings: 1
