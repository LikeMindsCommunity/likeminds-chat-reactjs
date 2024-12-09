/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {
  MutableRefObject,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import { IconButton } from "@mui/material";
import { Conversation } from "../../types/models/conversations";
import Member from "../../types/models/member";
import LMMessageListContext from "../../context/LMMessageListContext";
import LMUserProviderContext from "../../context/LMUserProviderContext";

//   Debounce creator for creating a debounced variation of the original function
function createDebouncedFunction(originalFunction: () => void) {
  let hasTheFunctionAlreadyCalled: boolean = false;
  return () => {
    if (hasTheFunctionAlreadyCalled) {
      return;
    } else {
      hasTheFunctionAlreadyCalled = true;
      setTimeout(() => {
        hasTheFunctionAlreadyCalled = false;
      }, 150);
      originalFunction();
    }
  };
}
function isScrollTopBeyondThresholdLimits(
  scrollDirection: number,
  scrollThreshold: number,
  targetElement: HTMLDivElement | null,
): boolean {
  if (!targetElement) {
    return false;
  }

  const { scrollTop, clientHeight, scrollHeight } = targetElement;

  if (scrollTop < 0.3 * scrollHeight && !scrollDirection && scrollTop !== 0) {
    return true;
  } else if (
    scrollTop > 0.7 * (scrollHeight - clientHeight) &&
    scrollDirection &&
    scrollTop !== 0
  ) {
    return true;
  } else {
    return false;
  }
}
const ScrollContainer = (props: PropsWithChildren<ScrollContainerProps>) => {
  const {
    children,
    nextOnScrollBottom,
    nextOnScrollTop,
    callNextOnBottom,
    callNextOnTop,
    dataLength,
    bottomReferenceDiv,
  } = props;

  const [isScrollToBottomVisible, setIsScrollToBottomVisible] = useState(false);
  const { conversations, shouldScrollToBottom } =
    useContext(LMMessageListContext);
  const { currentUser } = useContext(LMUserProviderContext);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const scrollTarget = useRef<HTMLDivElement | null>(null);
  const hasAlreadyCalled = useRef<boolean>(false);
  const previousScrollPosition = useRef<number>(Number.NEGATIVE_INFINITY);
  const prevDataLength = useRef<number>(0);
  const isFirstRender = useRef<boolean>(true);
  const lastScrolledValue = useRef<number>(Number.NEGATIVE_INFINITY);
  const scrollToBottom = () => {
    if (bottomReferenceDiv && bottomReferenceDiv.current) {
      bottomReferenceDiv.current.scrollIntoView(false);
    }
  };
  const scrollToTheBottom = useCallback(
    (
      conversation: Conversation,
      currentUser: Member,
      scrollContainer: HTMLDivElement,
    ) => {
      if (!shouldScrollToBottom.current) {
        shouldScrollToBottom.current = true;
        return;
      }
      const userId = conversation.userId;
      const isConversationSentByCurrentUser =
        userId?.toString() === currentUser.id.toString() ? true : false;
      if (isConversationSentByCurrentUser) {
        const scrollHeight = scrollContainer.scrollHeight;
        scrollContainer.scrollTop = scrollHeight;
      } else {
        const scrollHeight = scrollContainer.scrollHeight;
        scrollContainer.scrollTop = scrollHeight;
      }
    },
    [shouldScrollToBottom],
  );
  const handleScroll = useCallback(async () => {
    try {
      if (hasAlreadyCalled.current) {
        return;
      }
      const scrollContainer = scrollContainerRef.current;
      if (!scrollContainer) {
        throw Error("The reference to scroll container is undefined or null");
      }
      if (typeof previousScrollPosition.current === "undefined") {
        throw Error("The previos scroll position isnt set yet");
      }
      const currentScrollTop = scrollContainer.scrollTop;
      const previousScrollTop = previousScrollPosition.current;
      // Scroll direction is 1 for downwards direction and 0 for upwards position
      const scrollDirection = currentScrollTop > previousScrollTop ? 1 : 0;

      const isInScrollableLimits = isScrollTopBeyondThresholdLimits(
        scrollDirection,
        30,
        scrollTarget.current || null,
      );
      if (isInScrollableLimits) {
        if (!scrollDirection) {
          hasAlreadyCalled.current = true;
          await nextOnScrollTop();
        } else {
          if (callNextOnBottom) {
            hasAlreadyCalled.current = true;
            await nextOnScrollBottom();
          }
        }
      }
      previousScrollPosition.current = currentScrollTop;
    } catch (error) {
      console.log(error);
    }
  }, [callNextOnBottom, nextOnScrollBottom, nextOnScrollTop]);

  useEffect(() => {
    const debouncedScroll = createDebouncedFunction(handleScroll);
    scrollTarget.current = scrollContainerRef.current;
    if (scrollTarget.current) {
      scrollTarget.current.addEventListener("scroll", debouncedScroll);
      return () => {
        scrollTarget?.current?.removeEventListener("scroll", debouncedScroll);
      };
    }
  }, [handleScroll]);
  useEffect(() => {
    if (dataLength !== prevDataLength.current) {
      hasAlreadyCalled.current = false;
    }
  }, [dataLength]);

  // for setting the visibility of scroll to bottom
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setIsScrollToBottomVisible(false);
        } else {
          setIsScrollToBottomVisible(true);
        }
      },
      { root: scrollContainerRef.current, threshold: 0.01 },
    );

    const target =
      scrollContainerRef.current?.lastElementChild?.previousElementSibling;

    if (target) {
      observer.observe(target as Element);
    }

    return () => {
      if (target) {
        observer.unobserve(target as Element);
      }
    };
  }, [bottomReferenceDiv, dataLength]);

  useEffect(() => {
    if (conversations?.length && scrollContainerRef.current) {
      const conversationLength = conversations?.length || 0;
      const lastConversation = conversations[conversationLength - 1];
      const scrollPosition = scrollContainerRef.current.scrollTop;
      scrollToTheBottom(
        lastConversation,
        currentUser,
        scrollContainerRef.current,
      );
      return () => {
        lastScrolledValue.current = scrollPosition;
      };
    }
  }, [conversations, currentUser, scrollToTheBottom, shouldScrollToBottom]);

  if (!children) {
    return null;
  }
  return (
    <>
      {isScrollToBottomVisible && (
        <span className="scroll-to-bottom-shortcut">
          <IconButton onClick={scrollToBottom}>
            <KeyboardDoubleArrowDownIcon fontSize="small" />
          </IconButton>
        </span>
      )}
      <div ref={scrollContainerRef} className="lm-dual-scroll-container">
        {children}
        <div
          ref={bottomReferenceDiv}
          className="lm-dual-scroll-container-bottom-block"
        ></div>
      </div>
    </>
  );
};
interface ScrollContainerProps {
  nextOnScrollTop: VoidFn;
  nextOnScrollBottom: VoidFn;
  callNextOnTop: boolean;
  callNextOnBottom: boolean;
  dataLength: number;
  bottomReferenceDiv: MutableRefObject<HTMLDivElement | null>;
}

export type VoidFn = () => void;

export default ScrollContainer;
