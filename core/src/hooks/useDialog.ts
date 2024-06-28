import { useState } from "react";
import { ZeroArgVoidReturns } from "./useInput";

export function useDialog(): UseDialogReturns {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  function openDialog() {
    setDialogOpen(true);
  }
  function closeDialog() {
    setDialogOpen(false);
  }
  return {
    dialogOpen,
    openDialog,
    closeDialog,
  };
}
export interface UseDialogReturns {
  dialogOpen: boolean;
  openDialog: ZeroArgVoidReturns;
  closeDialog: ZeroArgVoidReturns;
}
