import { MouseEventHandler, useState } from "react";
import { ZeroArgVoidReturns } from "./useInput";

export function useMenu(): UseMenuReturns {
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const openMenu: MouseEventHandler = (event) => {
    setMenuAnchor(event.currentTarget as HTMLElement);
  };
  const closeMenu: ZeroArgVoidReturns = () => {
    setMenuAnchor(null);
  };
  return {
    menuAnchor,
    openMenu,
    closeMenu,
  };
}

export interface UseMenuReturns {
  menuAnchor: HTMLElement | null;
  openMenu: React.MouseEventHandler<HTMLElement>;
  closeMenu: ZeroArgVoidReturns;
}
