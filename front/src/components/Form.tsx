import { FormEvent, SetStateAction, useRef, useState, RefObject } from "react";
import { Buffer } from "buffer";
import detectEthereumProvider from "@metamask/detect-provider";
import axios from "axios";
import { addSignature } from "../API/addSignature";
import { getTokenURI } from "../API/getTokenURI";
import { Spinner } from "./Spinner";
import { FileSelector } from "./FileSelector";

const checkWebProviderAndConnect = async () => {
  try {
    const provider = await detectEthereumProvider();

    if (!provider) {
      alert("Wallet not found. Please install MetaMask.");
    } else {
      const tempAddress = await metamaskConnect();
      return tempAddress;
    }
  } catch (error: any) {
    alert(error?.message || "Something went wrong while connecting to wallet.");
  }
};

const metamaskConnect = async () => {
  try {
    await window?.ethereum?.enable();
    const accounts = await window?.ethereum?.request({
      method: "eth_requestAccounts",
    });

    return accounts[0];
  } catch (error: any) {
    if (error?.code === 4001) {
      // If this happens, the user rejected the connection request.
      alert("Rejected Request, Please connect to MetaMask.");
    } else if (error?.code === -32002) {
      alert("User Request Pending, Please unlock MetaMask and try agin.");
    } else {
      console.log(error);
    }
    return null;
  }
};

const getHashFromURI = (URI: string) => {
  const lastIndex = URI.lastIndexOf("/");
  return URI.slice(lastIndex + 1);
};

const OnSubmitSign = async (
  fileToSignRef: RefObject<HTMLInputElement>,
  setVerificationKey: (arg: SetStateAction<string>) => void,
  e: FormEvent
) => {
  e.preventDefault();
  if (
    !fileToSignRef.current!.files ||
    fileToSignRef.current!.files.length === 0
  ) {
    alert("No file selected, please select a file to sign");
    return;
  }
  if (fileToSignRef.current!.files && fileToSignRef.current!.files.length > 1) {
    alert("Too many files selected, please select only a single file");
    return;
  }
  const address: string = await checkWebProviderAndConnect();
  const dataArray = await fileToSignRef.current!.files[0].arrayBuffer();
  const buffer = Buffer.from(dataArray);
  const msg = `0x${buffer.toString("hex")}`;
  try {
    const signature: string = await window.ethereum.request({
      method: "personal_sign",
      params: [msg, address, ""],
    });
    if (signature) {
      const response = await addSignature({
        filename: fileToSignRef.current!.files[0].name,
        signature,
        timestamp: new Date().toUTCString(),
        userAddress: address,
      });
      setVerificationKey(response.tokenId);
    } else {
      alert("The data was not signed");
    }
  } catch (err: any) {
    console.log(err.message);
    alert("Something went wrong while signing file content");
  }
};

const OnSubmitVerify = async (
  fileToVerifyRef: RefObject<HTMLInputElement>,
  verificationKey: string,
  e: FormEvent
) => {
  e.preventDefault();
  if (!/^[0-9]+$/.test(verificationKey)) {
    alert("Invalid verification key");
    return;
  }
  if (
    !fileToVerifyRef.current!.files ||
    fileToVerifyRef.current!.files.length === 0
  ) {
    alert("No file selected, please select a file to sign");
    return;
  }
  if (
    fileToVerifyRef.current!.files &&
    fileToVerifyRef.current!.files.length > 1
  ) {
    alert("Too many files selected, please select only a single file");
  }
  const response = await getTokenURI(parseInt(verificationKey));
  if (response.status === "error") {
    alert("Invalid verification key");
    return;
  }
  const ipfsHash = getHashFromURI(response.URI);
  const ipfsResponse = (await axios.get(`https://dweb.link/ipfs/${ipfsHash}`))
    .data;
  console.log(ipfsResponse);
  const dataArray = await fileToVerifyRef.current!.files[0].arrayBuffer();
  const buffer = Buffer.from(dataArray);
  const msg = `0x${buffer.toString("hex")}`;
  try {
    const signedAddress = await window.ethereum.request({
      method: "personal_ecRecover",
      params: [msg, ipfsResponse.signature],
    });
    if (signedAddress === ipfsResponse.userAddress)
      alert(
        `Verification succeeded!\n${signedAddress} has signed this file.\n`
      );
    else alert("Verification failed");
  } catch (e) {
    alert("Verification failed");
  }
};

export const Form = () => {
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
              await OnSubmitSign(fileToSignRef, setVerificationKey, e);
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
        <h1 className="text-xl text-center">Verify Signiture</h1>
        <form
          action="#"
          onSubmit={async (e) => {
            if (!isVerifierLoading) {
              setIsVerifierLoading(true);
              await OnSubmitVerify(
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
