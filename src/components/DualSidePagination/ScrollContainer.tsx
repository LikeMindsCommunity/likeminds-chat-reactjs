/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { PropsWithChildren, useEffect, useRef } from "react";

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
  const hasAlreadyCalled = useRef<boolean>(false);
  const previousScrollPosition = useRef<number>(Number.POSITIVE_INFINITY);

  useEffect(() => {
    hasAlreadyCalled.current = false;
  }, [dataLength]);

  //   Original function for handling scroll event
  function handleScroll() {
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
    if (scrollDirection) {
      if (callNextOnBottom) {
        hasAlreadyCalled.current = true;
        nextOnScrollBottom();
      }
    } else {
      if (callNextOnTop) {
        hasAlreadyCalled.current = true;
        nextOnScrollTop();
      }
    }
    previousScrollPosition.current = currentScrollTop;
  }
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
        }, 400);
        originalFunction();
      }
    };
  }
  //   The debounced function which will handle the scoll event
  const debouncedScroll = createDebouncedFunction(handleScroll);
  return (
    <div
      ref={scrollContainerRef}
      onScroll={debouncedScroll}
      className="lm-dual-scroll-container"
    >
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
