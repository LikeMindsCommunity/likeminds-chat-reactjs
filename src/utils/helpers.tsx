import React from "react";

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
    console.log(user_splitted_string);
    console.log(users_matched);
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
    console.log(combinedMatchesArray);
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
}

// normal text strings: 0
// taggingStrings: 1
