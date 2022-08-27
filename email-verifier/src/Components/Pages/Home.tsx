import { Fragment, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { addPublicAddress } from "../../API/addPublicAddress";
import { useNavigate } from "react-router-dom";
import GoogleAuth from "../UI/GoogleAuth";

export const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [googleJwtToken, setGoogleJwtToken] = useState("");
  const [errored, setErrored] = useState(false);

  const setGoogleJwtTokenHandler = (response: string) => {
    setGoogleJwtToken(response);
  };
  useEffect(() => {
    if (
      !searchParams.get("signature_v") ||
      !searchParams.get("signature_r") ||
      !searchParams.get("signature_s") ||
      !searchParams.get("proof") ||
      !searchParams.get("publicAddress")
    ) {
      setErrored(true);
    }
  }, []);

  const navigate = useNavigate();

  useEffect(() => {
    try {
      if (googleJwtToken) {
        const requestBody = {
          signature_v: searchParams.get("signature_v") || "",
          signature_r: searchParams.get("signature_r") || "",
          signature_s: searchParams.get("signature_s") || "",
          proof: searchParams.get("proof") || "",
          publicAddress: searchParams.get("publicAddress") || "",
          jwtToken: googleJwtToken,
        };

        (async () => {
          const serverResponse = await addPublicAddress(requestBody);
          if (serverResponse.status === "success") {
            navigate("/success");
          }
        })();
      }
    } catch (Err) {}
  }, [googleJwtToken]);

  return (
    <Fragment>
      {!errored ? (
        <div className="flex flex-col items-center gap-y-4 mt-4">
          <h1 className="text-4xl font-bold text-[#3d61ff]">
            Sign In With Google
          </h1>
          <GoogleAuth setGoogleJwtTokenHandler={setGoogleJwtTokenHandler} />
        </div>
      ) : (
        <div className="flex flex-col items-center mt-4 text-4xl font-bold text-red-500">
          Error: Missing data in query string
        </div>
      )}
    </Fragment>
  );
};
