/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {
  MutableRefObject,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { useParams } from "react-router-dom";
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
  // const scrollableLimit =
  //   ((Math.abs(scrollHeight) - Math.floor(clientHeight)) * scrollThreshold) /
  //   100;
  // if (scrollDirection) {
  //   return scrollTop >= Math.abs(scrollHeight) - Math.abs(scrollableLimit)
  //     ? true
  //     : false;
  // } else {
  //   return scrollTop <= Math.abs(scrollableLimit) ? true : false;
  // }
  console.log(`The scroll height is: ${scrollHeight}`);
  console.log(`The scroll top is ${scrollTop}`);
  console.log(`The scroll direction is ${scrollDirection}`);
  console.log(scrollTop < 0.3 * scrollHeight);
  if (scrollTop < 0.3 * scrollHeight && !scrollDirection) {
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
  const { id: chatroomId } = useParams();
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const scrollTarget = useRef<HTMLDivElement | null>(null);
  // const bottomReferenceDiv = useRef<HTMLDivElement | null>(null);
  const hasAlreadyCalled = useRef<boolean>(false);
  const previousScrollPosition = useRef<number>(Number.NEGATIVE_INFINITY);
  const prevDataLength = useRef<number>(0);
  const isFirstRender = useRef<boolean>(true);

  //   Original function for handling scroll event
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
        hasAlreadyCalled.current = true;
        await nextOnScrollTop();
      }
      previousScrollPosition.current = currentScrollTop;
    } catch (error) {
      console.log(error);
    }
  }, [nextOnScrollTop]);

  useEffect(() => {
    console.log("calling the effect");
    //   The debounced function which will handle the scoll event
    const debouncedScroll = createDebouncedFunction(handleScroll);
    scrollTarget.current = scrollContainerRef.current;
    if (scrollTarget.current) {
      // console.log("inside decounce ");
      scrollTarget.current.scrollTo(0, scrollTarget.current.scrollHeight);
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
    if (isFirstRender.current && children) {
      bottomReferenceDiv.current?.scrollIntoView();

      isFirstRender.current = false;
    }
  }, [children, chatroomId, bottomReferenceDiv]);
  return (
    <div ref={scrollContainerRef} className="lm-dual-scroll-container">
      {children}
      <div
        ref={bottomReferenceDiv}
        className="lm-dual-scroll-container-bottom-block"
      ></div>
    </div>
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
