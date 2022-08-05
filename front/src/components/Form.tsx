import { FormEvent, SetStateAction, useRef, useState, RefObject } from "react";
import { Buffer } from "buffer";
import detectEthereumProvider from "@metamask/detect-provider";
import axios from "axios";
import { addSignature } from "../API/addSignature";
import { getTokenURI } from "../API/getTokenURI";
import { Spinner } from "./Spinner";

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
    const response = await addSignature({
      filename: fileToSignRef.current!.files[0].name,
      signature,
      timestamp: new Date().toUTCString(),
      userAddress: address,
    });
    setVerificationKey(response.tokenId);
  } catch (err: any) {
    console.log(err.message);
    alert("Something went wrong while signing file content");
  }
};

const OnSubmitVerify = async (
  fileToVerifyRef: RefObject<HTMLInputElement>,
  addressToVerify: string,
  verificationKey: string,
  e: FormEvent
) => {
  e.preventDefault();
  const trueAdress = (
    /^0x/.test(addressToVerify) ? addressToVerify : `0x${addressToVerify}`
  ).toLowerCase();
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
  }
  const ipfsHash = getHashFromURI(response.URI);
  const ipfsResponse = (
    await axios.get(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`)
  ).data;
  console.log(ipfsResponse);
  const dataArray = await fileToVerifyRef.current!.files[0].arrayBuffer();
  const buffer = Buffer.from(dataArray);
  const msg = `0x${buffer.toString("hex")}`;
  try {
    const signedAddress = await window.ethereum.request({
      method: "personal_ecRecover",
      params: [msg, ipfsResponse.signature],
    });
    if (signedAddress === trueAdress) alert("verification succeeded");
    else alert("verification failed");
  } catch (e) {
    alert("verification failed");
  }
};

export const Form = () => {
  const fileToSignRef = useRef<HTMLInputElement>(null);
  const fileToVerifyRef = useRef<HTMLInputElement>(null);
  const addressToVerifyRef = useRef<HTMLInputElement>(null);
  const verificationKeyRef = useRef<HTMLInputElement>(null);

  const [isSignerLoading, setIsSignerLoading] = useState(false);
  const [isVerifierLoading, setIsVerifierLoading] = useState(false);
  // first form output
  const [verificationKey, setVerificationKey] = useState("");
  return (
    <div className="w-2/6 mx-auto flex flex-col gap-5">
      <div className="flex flex-col gap-5 p-5 border-solid border-black border-2">
        <h1 className="text-xl">Sign a File</h1>
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
          <input
            type="file"
            ref={fileToSignRef}
            className="border-solid border-black border-2 text-center"
          />
          {!isSignerLoading ? (
            <input
              type="submit"
              value="Submit"
              className="border-solid border-black border-2 text-center"
            />
          ) : (
            <div className="flex items-center justify-center py-2">
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
      <div className="flex flex-col gap-5 p-5 border-solid border-black border-2">
        <h1 className="text-xl">Verify Signiture</h1>
        <form
          action="#"
          onSubmit={async (e) => {
            if (!isVerifierLoading) {
              setIsVerifierLoading(true);
              await OnSubmitVerify(
                fileToVerifyRef,
                addressToVerifyRef.current!.value,
                verificationKeyRef.current!.value,
                e
              );
              setIsVerifierLoading(false);
            }
          }}
          className="flex flex-col w-full gap-2"
        >
          <input
            type="file"
            ref={fileToVerifyRef}
            className="border-solid border-black border-2 text-center"
          />
          <input
            type="text"
            ref={addressToVerifyRef}
            placeholder="Address to Compare With"
            className="border-solid border-black border-2 text-center"
          />
          <input
            type="text"
            ref={verificationKeyRef}
            placeholder="Verification Key"
            className="border-solid border-black border-2 text-center"
          />
          {!isVerifierLoading ? (
            <input
              type="submit"
              value="Submit"
              className="border-solid border-black border-2 text-center"
            />
          ) : (
            <div className="flex items-center justify-center">
              <Spinner />
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
