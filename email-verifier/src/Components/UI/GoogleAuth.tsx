import { Fragment, SetStateAction, useEffect } from "react";
import { GOOGLE_AUTH_CLIENT_ID } from "../../constants";

interface GoogleAuthInteface {
  setGoogleJwtTokenHandler: (param: string) => void;
}

const GoogleAuth = ({ setGoogleJwtTokenHandler }: GoogleAuthInteface) => {
  const handleCredentialResponse = (response: any) => {
    if (response.credential) {
      setGoogleJwtTokenHandler(response.credential);
    }
  };

  useEffect(() => {
    google.accounts.id.initialize({
      client_id: GOOGLE_AUTH_CLIENT_ID,
      callback: handleCredentialResponse,
    });
    google.accounts.id.renderButton(
      document.getElementById("buttonDiv"),
      { theme: "outline", size: "large" } // customization attributes
    );
  }, []);
  return (
    <Fragment>
      <div id="buttonDiv"></div>
    </Fragment>
  );
};

export default GoogleAuth;
