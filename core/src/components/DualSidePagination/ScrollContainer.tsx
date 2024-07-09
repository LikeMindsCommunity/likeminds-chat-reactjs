/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {
  MutableRefObject,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useParams } from "react-router-dom";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import { IconButton } from "@mui/material";
import { LMChatChatroomContext } from "../../context/LMChatChatroomContext";
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
  const { id: chatroomId } = useParams();
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const scrollTarget = useRef<HTMLDivElement | null>(null);
  const hasAlreadyCalled = useRef<boolean>(false);
  const previousScrollPosition = useRef<number>(Number.NEGATIVE_INFINITY);
  const prevDataLength = useRef<number>(0);
  const isFirstRender = useRef<boolean>(true);

  const scrollToBottom = () => {
    if (bottomReferenceDiv && bottomReferenceDiv.current) {
      bottomReferenceDiv.current.scrollIntoView(false);
    }
  };
  const handleScroll = useCallback(async () => {
    try {
      if (hasAlreadyCalled.current) {
        // TODO remove the below log
        // console.log("The function has already been called before");
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
          console.log(callNextOnBottom);
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
  useEffect(() => {
    if (isFirstRender.current && bottomReferenceDiv.current && children) {
      setTimeout(() => {
        bottomReferenceDiv?.current?.scrollIntoView({
          behavior: "instant",
        });
      }, 500);

      isFirstRender.current = false;
    }
  }, [children, chatroomId, bottomReferenceDiv]);
  // for setting the visibility of scroll to bottom
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsScrollToBottomVisible(!entry.isIntersecting);
      },
      { root: scrollContainerRef.current, threshold: 1.0 },
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
