import { FormEvent, SetStateAction, RefObject } from "react";
import { Buffer } from "buffer";
import detectEthereumProvider from "@metamask/detect-provider";
import axios from "axios";
import { addSignature } from "../API/addSignature";
import { getTokenURI } from "../API/getTokenURI";

export const onSubmitSign = async (
  fileName: string,
  fileToSignRef: RefObject<HTMLInputElement>,
  setVerificationKey: (arg: SetStateAction<string>) => void,
  e: FormEvent,
  setTransactionState: (arg: SetStateAction<string>) => void,
  setJsonFileData: (arg: SetStateAction<{}>) => void
) => {
  try {
    e.preventDefault();
    fileWarning(fileToSignRef);

    const address: string = await checkWebProviderAndConnect();
    if (!address) return;

    const buffer = await makeBufferFromFile(
      fileToSignRef.current?.files?.[0] as Blob
    );

    const msg = `0x${buffer.toString("hex")}`; // making our file content hexidecimal

    const signature: string = await window.ethereum.request({
      method: "personal_sign",
      params: [msg, address, ""],
    });
    if (signature) {
      setTransactionState("Transaction is being approved");
      const requestBody = {
        filename:
          fileName || (fileToSignRef.current!.files?.[0].name as string),
        signature,
        timestamp: new Date().toUTCString(),
        userAddress: address,
      };
      setJsonFileData(requestBody);
      const response = await addSignature({
        ...requestBody,
      });
      setVerificationKey(response.tokenId);
    } else {
      throw Error("The data was not signed");
    }
  } catch (error: any) {
    alert(error?.message);
  }
};

export const checkWebProviderAndConnect = async () => {
  const provider = await detectEthereumProvider(); // just gives true/false, no UI involved

  if (!provider) {
    throw Error("Wallet not found. Please install MetaMask.");
  } else {
    await window?.ethereum?.enable(); // connect action is done here
    const tempAddress = await getWalletAddress();
    return tempAddress;
  }
};

const getWalletAddress = async () => {
  const accounts = await window?.ethereum?.request({
    method: "eth_requestAccounts",
  }); // gets all account
  return accounts[0];
};

export const onSubmitVerify = async (
  fileToVerifyRef: RefObject<HTMLInputElement>,
  verificationKey: string,
  e: FormEvent
) => {
  try {
    e.preventDefault();
    if (!/^[0-9]+$/.test(verificationKey)) {
      throw Error("Invalid verification key");
    }
    fileWarning(fileToVerifyRef);

    const response = await getTokenURI(parseInt(verificationKey));

    if (response.status === "error") throw Error("Invalid verification key");

    const ipfsHash = getHashFromURI(response.URI);
    const ipfsResponse = (
      await axios.get(`https://novelty.mypinata.cloud/ipfs/${ipfsHash}`)
    ).data;

    const buffer = await makeBufferFromFile(
      fileToVerifyRef.current?.files?.[0] as File
    );
    const msg = `0x${buffer.toString("hex")}`;
    await window?.ethereum?.enable();
    const signedAddress = await window.ethereum.request({
      method: "personal_ecRecover",
      params: [msg, ipfsResponse.signature],
    });
    if (signedAddress === ipfsResponse.userAddress)
      alert(
        `Verification succeeded!\n${signedAddress} has signed this file.\n`
      );
    else throw Error("Verification failed");
  } catch (error: any) {
    alert(error?.message);
  }
};

const makeBufferFromFile = async (file: Blob) => {
  const dataArray = await file.arrayBuffer();
  return Buffer.from(dataArray);
};

const getHashFromURI = (URI: string) => {
  const lastIndex = URI.lastIndexOf("/");
  return URI.slice(lastIndex + 1);
};

const fileWarning = (fileToVerifyRef: RefObject<HTMLInputElement>) => {
  if (
    !fileToVerifyRef.current!.files ||
    fileToVerifyRef.current!.files.length === 0
  ) {
    throw Error("No file selected, please select a file to sign");
  }
  if (
    fileToVerifyRef.current!.files &&
    fileToVerifyRef.current!.files.length > 1
  ) {
    throw Error("Too many files selected, please select only a single file");
  }
};
