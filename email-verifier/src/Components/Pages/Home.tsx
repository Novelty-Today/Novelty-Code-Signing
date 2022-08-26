import { Fragment, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { addPublicAddress } from "../../API/addPublicAddress";
import GoogleAuth from "../UI/GoogleAuth";

export const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [googleJwtToken, setGoogleJwtToken] = useState("");

  const setGoogleJwtTokenHandler = (response: string) => {
    setGoogleJwtToken(response);
  };

  useEffect(() => {
    try {
      if (googleJwtToken) {
        const requestBody = {
          signature: searchParams.get("signature") || "",
          proof: searchParams.get("proof") || "",
          publicAddress: searchParams.get("publicAddress") || "",
          jwtToken: googleJwtToken,
        };

        (async () => {
          const serverResponse = await addPublicAddress(requestBody);
          console.log(serverResponse);
        })();
      }
    } catch (Err) {}
  }, [googleJwtToken]);

  return (
    <Fragment>
      <div className="flex flex-col items-center gap-y-4 mt-4">
        <h1 className="text-4xl font-bold text-[#3d61ff]">
          Sign In With Google
        </h1>
        <GoogleAuth setGoogleJwtTokenHandler={setGoogleJwtTokenHandler} />
      </div>
    </Fragment>
  );
};
