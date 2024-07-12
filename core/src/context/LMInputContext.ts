import React from "react";
import { UseInputReturns } from "../hooks/useInput";

interface InputContextInterface extends UseInputReturns {}

export default React.createContext<InputContextInterface>(
  {} as InputContextInterface,
);
