import { FormEvent, SetStateAction, RefObject } from "react";
import { Buffer } from "buffer";
import detectEthereumProvider from "@metamask/detect-provider";
import axios from "axios";
import { addSignature } from "../API/addSignature";
import { getTokenURI } from "../API/getTokenURI";

export const onSubmitSign = async (
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
  if(!address) return

  const buffer = await makeBufferFromFile(fileToSignRef.current?.files?.[0] as File);

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

const checkWebProviderAndConnect = async () => {
  try {
    const provider = await detectEthereumProvider(); // just gives true/false, no UI involved

    if (!provider) {
      alert("Wallet not found. Please install MetaMask.");
    } else {
      const tempAddress = await getWalletAddress();
      return tempAddress;
    }
  } catch (error: any) {
    alert(error?.message || "Something went wrong while connecting to wallet.");
  }
};

const getWalletAddress = async () => {
  try {
    await window?.ethereum?.enable(); // connect action is done here
    const accounts = await window?.ethereum?.request({
      method: "eth_requestAccounts",
    }); // gets all account
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

const makeBufferFromFile = async (file: File) => {
  const dataArray = await file.arrayBuffer();
  return Buffer.from(dataArray);
};

export const onSubmitVerify = async (
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

  const buffer = await makeBufferFromFile(fileToVerifyRef.current?.files?.[0] as File);
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
