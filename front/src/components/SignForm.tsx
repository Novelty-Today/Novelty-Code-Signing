import { useRef, useState } from "react";
import { Spinner } from "./Spinner";
import { FileSelector } from "./FileSelector";
import { onSubmitVerify, onSubmitSign } from "../functions/signAndVerify";

export const SignForm = () => {
  const fileToSignRef = useRef<HTMLInputElement>(null);
  const fileToVerifyRef = useRef<HTMLInputElement>(null);
  const verificationKeyRef = useRef<HTMLInputElement>(null);

  const [isSignerLoading, setIsSignerLoading] = useState(false);
  const [isVerifierLoading, setIsVerifierLoading] = useState(false);
  // first form output
  const [verificationKey, setVerificationKey] = useState("");
  return (
    <div className="w-2/6 mx-auto flex flex-col gap-5 text-center">
      <div className="flex flex-col gap-5 p-5 border-solid border-black border-2 rounded-xl">
        <h1 className="text-xl text-center">Sign a File</h1>
        <form
          action="#"
          onSubmit={async (e) => {
            if (!isSignerLoading) {
              setIsSignerLoading(true);
              await onSubmitSign(fileToSignRef, setVerificationKey, e);
              setIsSignerLoading(false);
            }
          }}
          className="flex flex-col w-full gap-1"
        >
          <FileSelector ref={fileToSignRef} id="fileToSignId" />
          {!isSignerLoading ? (
            <div className="flex items-center justify-center">
              <input
                type="submit"
                value="Submit"
                className="bg-[#ff1818] rounded-[12px] py-2.5 px-5 hover:bg-[#1f1c1c] hover:shadow-lg my-2 font-bold text-white cursor-pointer duration-500 text-center max-w-min"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center my-2">
              <Spinner />
            </div>
          )}
        </form>
        {verificationKey && (
          <span>
            Verification key:
            <p className="break-words">{verificationKey}</p>
          </span>
        )}
      </div>
      <div className="flex flex-col gap-5 p-5 border-solid border-black border-2 rounded-xl">
        <h1 className="text-xl text-center">Verify Signature</h1>
        <form
          action="#"
          onSubmit={async (e) => {
            if (!isVerifierLoading) {
              setIsVerifierLoading(true);
              await onSubmitVerify(
                fileToVerifyRef,
                verificationKeyRef.current!.value,
                e
              );
              setIsVerifierLoading(false);
            }
          }}
          className="flex flex-col w-full gap-1"
        >
          <FileSelector ref={fileToVerifyRef} id="fileToVerifyId" />
          <input
            type="text"
            ref={verificationKeyRef}
            placeholder="Verification Key"
            className="border-solid border-black border-2 text-center placeholder-gray-700"
          />
          {!isVerifierLoading ? (
            <div className="flex items-center justify-center my-2">
              <input
                type="submit"
                value="Submit"
                className="bg-[#ff1818] rounded-[12px] py-2.5 px-5 hover:bg-[#1f1c1c] hover:shadow-lg p-1 font-bold text-white cursor-pointer duration-500 text-center max-w-min"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center my-2">
              <Spinner />
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
