import { useRouteError } from "react-router-dom";

const Error = () => {
  const error: unknown = useRouteError();
  console.log(error);
  return (
    <div id="error-page" className="lmError">
      <div className="lmErrorBox">
        <h1>404</h1>
        <p className="lmErrorTitle">Sorry, an unexpected error has occurred.</p>
        <p className="lmErrorMsg">
          <i>
            {(error as Error)?.message ||
              (error as { statusText?: string })?.statusText}
          </i>
        </p>
      </div>
    </div>
  );
};

export default Error;
