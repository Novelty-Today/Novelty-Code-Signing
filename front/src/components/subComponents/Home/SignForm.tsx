import { useEffect, useRef, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "../../UI/Spinner";
import { FileSelector } from "./FileSelector";
import {
  onSubmitVerify,
  onSubmitSign,
  checkWebProviderAndConnect,
} from "../../../functions/signAndVerify";
import GeneralInformationContext from "../../../Store/GeneralInformationContext";

export const SignForm = () => {
  const navigate = useNavigate();
  const generalInfoCtx = useContext(GeneralInformationContext);

  const fileToSignRef = useRef<HTMLInputElement>(null);
  const fileToVerifyRef = useRef<HTMLInputElement>(null);
  const verificationKeyRef = useRef<HTMLInputElement>(null);

  const [isSignerLoading, setIsSignerLoading] = useState(false);
  const [isVerifierLoading, setIsVerifierLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [transactionState, setTransactionState] = useState("");
  const [jsonFileData, setJsonFileData] = useState({});

  // first form output
  const [verificationKey, setVerificationKey] = useState("");

  // redirect to users' signed codes
  const redirectToUserFilesHandler = async () => {
    const myAddress = await checkWebProviderAndConnect();
    if (myAddress) {
      generalInfoCtx.setUserWalletAddress(myAddress);
      navigate(`/${myAddress}/files`);
    }
  };

  useEffect(() => {
    console.log(fileName);
  }, [fileName]);
  return (
    <div className="w-2/6 mx-auto flex flex-col gap-5 text-center">
      <div className="flex flex-col gap-[4px] p-5 border-solid border-black border-2 rounded-xl">
        <h1 className="text-xl text-center mb-[16px]">Sign a File</h1>
        <form
          action="#"
          onSubmit={async (e) => {
            if (!isSignerLoading) {
              setIsSignerLoading(true);
              await onSubmitSign(
                fileName,
                fileToSignRef,
                setVerificationKey,
                e,
                setTransactionState,
                setJsonFileData
              );
              setIsSignerLoading(false);
            }
          }}
          className="flex flex-col w-full gap-1"
        >
          <input
            type="text"
            className="w-full border-[1px] border-[#b8b8b8] text-[#545c5c] placeholder:font-normal placeholder:text-[14px] font-semibold focus:outline-none  px-[15px] py-[4px] focus:border-[#0404049a]"
            placeholder="File name"
            value={fileName}
            onChange={(e) => {
              if (fileName.trim().length === 0 && fileName.length !== 0)
                setFileName("");
              else setFileName(e.target.value);
            }}
          />
          <FileSelector ref={fileToSignRef} id="fileToSignId" />
          <button
            type="button"
            onClick={redirectToUserFilesHandler}
            className="bg-[#5a5959] py-1 px-2  hover:bg-[#1f1c1c] hover:shadow-lg font-bold text-white cursor-pointer duration-500 text-center min-w-[160px] "
          >
            My files
          </button>
          {!isSignerLoading ? (
            <div className="flex flex-col items-center justify-center">
              <input
                type="submit"
                value="Submit"
                className="bg-[#ff1818] rounded-[12px] py-2.5 px-5 hover:bg-[#1f1c1c] hover:shadow-lg my-2 font-bold text-white cursor-pointer duration-500 text-center max-w-min"
              />
              {Object.entries(jsonFileData).length !== 0 && (
                <a
                  href={`data:text/plain;charset=utf-8,${JSON.stringify(
                    jsonFileData
                  )}`}
                  className="text-base text-[#56582e] underline hover:text-yellow-800 "
                  download="Document"
                >
                  Download Proof
                </a>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center my-2">
              <Spinner />
              <p>{transactionState}</p>
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
            className="border-[1px] border-[#b8b8b8] text-center placeholder-gray-700"
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
