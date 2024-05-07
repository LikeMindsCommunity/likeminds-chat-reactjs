/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
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
  targetElement: HTMLDivElement | null
): boolean {
  if (!targetElement) {
    return false;
  }
  const { scrollTop, clientHeight, scrollHeight } = targetElement;
  const scrollableLimit =
    ((Math.abs(scrollHeight) - Math.floor(clientHeight)) * scrollThreshold) /
    100;
  if (scrollDirection) {
    return scrollTop >= Math.abs(scrollHeight) - Math.abs(scrollableLimit)
      ? true
      : false;
  } else {
    return scrollTop <= Math.abs(scrollableLimit) ? true : false;
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
  } = props;
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const scrollTarget = useRef<HTMLDivElement | null>(null);
  const hasAlreadyCalled = useRef<boolean>(false);
  const previousScrollPosition = useRef<number>(Number.POSITIVE_INFINITY);
  const prevDataLength = useRef<number>(0);
  //   Original function for handling scroll event
  const handleScroll = useCallback(() => {
    console.log(
      callNextOnBottom,
      callNextOnTop,
      nextOnScrollBottom,
      nextOnScrollTop
    );
    if (hasAlreadyCalled.current) {
      // TODO remove the below log
      console.log("The function has already been called before");
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
      scrollTarget.current || null
    );
    if (scrollDirection && isInScrollableLimits) {
      if (callNextOnBottom) {
        hasAlreadyCalled.current = true;
        nextOnScrollBottom();
      }
    } else {
      if (callNextOnTop && isInScrollableLimits) {
        console.log("calling from top scroller");
        hasAlreadyCalled.current = true;
        nextOnScrollTop();
      }
    }
    previousScrollPosition.current = currentScrollTop;
  }, [callNextOnBottom, callNextOnTop, nextOnScrollBottom, nextOnScrollTop]);

  useEffect(() => {
    //   The debounced function which will handle the scoll event
    const debouncedScroll = createDebouncedFunction(handleScroll);
    console.log("handle scroll changed");
    console.log(debouncedScroll);
    scrollTarget.current = scrollContainerRef.current;
    if (scrollTarget.current) {
      // console.log("inside decounce ");
      console.log(debouncedScroll);
      scrollTarget.current.scrollTo(0, scrollTarget.current.scrollHeight);
      scrollTarget.current.addEventListener("scroll", debouncedScroll);
    }
  }, [handleScroll]);
  useEffect(() => {
    // console.log("entering inside data length useEffect");
    if (dataLength !== prevDataLength.current) {
      // console.log(`prevDataLength is : ${prevDataLength.current}`);
      // console.log(`newDataLength is : ${dataLength}`);
      // console.log("setting the hasAlreadyCalled to false");
      hasAlreadyCalled.current = false;
    }
  }, [dataLength]);
  return (
    <div ref={scrollContainerRef} className="lm-dual-scroll-container">
      {children}
    </div>
  );
};
interface ScrollContainerProps {
  nextOnScrollTop: VoidFn;
  nextOnScrollBottom: VoidFn;
  callNextOnTop: boolean;
  callNextOnBottom: boolean;
  dataLength: number;
}

export type VoidFn = () => void;

export default ScrollContainer;
