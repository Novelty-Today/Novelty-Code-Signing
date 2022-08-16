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
    ipfsWarning(fileToSignRef.current!.value);

    const ipfsURI = fileToSignRef.current!.value;

    const address: string = await checkWebProviderAndConnect();
    if (!address) return;

    const signature: string = await window.ethereum.request({
      method: "personal_sign",
      params: [ipfsURI, address, ""],
    });
    if (signature) {
      setTransactionState("Transaction is being approved");
      const requestBody = {
        filename: fileName || "Unknown File",
        signature,
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
      throw new Error("Invalid verification key");
    }

    ipfsWarning(fileToVerifyRef.current!.value);

    const response = await getTokenURI(parseInt(verificationKey));

    if (response.status === "error")
      throw new Error("Invalid verification key");

    const ipfsVerificationHash = getHashFromURI(response.URI);
    const ipfsVerificationResponse = (
      await axios.get(
        `https://novelty.mypinata.cloud/ipfs/${ipfsVerificationHash}`
      )
    ).data;

    await window?.ethereum?.enable();
    const signedAddress = await window.ethereum.request({
      method: "personal_ecRecover",
      params: [
        fileToVerifyRef.current!.value,
        ipfsVerificationResponse.signature,
      ],
    });
    if (
      signedAddress.toLowerCase() ===
      ipfsVerificationResponse.userAddress.toLowerCase()
    )
      alert(
        `Verification succeeded!\n${signedAddress} has signed this file.\n`
      );
    else throw new Error("Verification failed");
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

const ipfsWarning = (ipfsURI: string) => {
  if (!/^ipfs:\/\//.test(ipfsURI)) {
    throw new Error("Invalid IPFS URI provided, URI must start with ipfs://");
  }
};
