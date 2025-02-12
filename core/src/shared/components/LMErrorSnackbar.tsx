import React from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

interface ErrorSnackbarProps {
  open: boolean;
  message: string;
  onClose: () => void;
}

const Alert = (props: AlertProps) => {
  return (
    <MuiAlert
      elevation={6}
      variant="filled"
      {...props}
      className="lm-chat-alert"
    />
  );
};

const ErrorSnackbar: React.FC<ErrorSnackbarProps> = ({
  open,
  message,
  onClose,
}) => {
  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={onClose}>
      <Alert onClose={onClose} severity="error">
        {message}
      </Alert>
    </Snackbar>
  );
};

export default ErrorSnackbar;
