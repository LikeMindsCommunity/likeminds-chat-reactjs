import { MouseEventHandler, useState } from "react";
import { ZeroArgVoidReturns } from "./useInput";

export function useMenu(): UseMenuReturns {
  const [menuAnchor, setMenuAnchor] = useState<HTMLImageElement | null>(null);
  const openMenu: MouseEventHandler = (event) => {
    setMenuAnchor(event.currentTarget as HTMLImageElement);
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
  menuAnchor: HTMLImageElement | null;
  openMenu: React.MouseEventHandler<HTMLImageElement>;
  closeMenu: ZeroArgVoidReturns;
}
