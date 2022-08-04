import { FormEvent, SetStateAction, useRef, useState, RefObject } from "react";
import { Buffer } from "buffer";
import detectEthereumProvider from "@metamask/detect-provider";

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
  const address = await checkWebProviderAndConnect();
  const dataArray = await fileToSignRef.current!.files[0].arrayBuffer();
  const buffer = Buffer.from(dataArray);
  const msg = `0x${buffer.toString("hex")}`;
  const sign = await window.ethereum.request({
    method: "personal_sign",
    params: [msg, address, ""],
  });
  setVerificationKey(sign);
};

const OnSubmitVerify = async (
  fileToVerifyRef: RefObject<HTMLInputElement>,
  verificationKey: string,
  e: FormEvent
) => {
  e.preventDefault();
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
  const dataArray = await fileToVerifyRef.current!.files[0].arrayBuffer();
  const buffer = Buffer.from(dataArray);
  const msg = `0x${buffer.toString("hex")}`;
  try {
    const signedAddress = await window.ethereum.request({
      method: "personal_ecRecover",
      params: [msg, verificationKey],
    });
    alert(`file signed by ${signedAddress}`);
  } catch (e) {
    alert("verification failed");
  }
};

export const Form = () => {
  const fileToSignRef = useRef<HTMLInputElement>(null);
  const fileToVerifyRef = useRef<HTMLInputElement>(null);
  const verificationKeyRef = useRef<HTMLInputElement>(null);
  // first form output
  const [verificationKey, setVerificationKey] = useState("");
  return (
    <div className="w-2/6 mx-auto flex flex-col gap-5">
      <div className="flex flex-col gap-5 p-5 border-solid border-black border-2">
        <h1 className="text-xl">Sign a File</h1>
        <form
          action="#"
          onSubmit={(e) => OnSubmitSign(fileToSignRef, setVerificationKey, e)}
          className="flex flex-col w-full gap-1"
        >
          <input
            type="file"
            ref={fileToSignRef}
            className="border-solid border-black border-2 text-center"
          />
          <input
            type="submit"
            value="Submit"
            className="border-solid border-black border-2 text-center"
          />
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
          onSubmit={(e) =>
            OnSubmitVerify(
              fileToVerifyRef,
              verificationKeyRef.current!.value,
              e
            )
          }
          className="flex flex-col w-full gap-2"
        >
          <input
            type="file"
            ref={fileToVerifyRef}
            className="border-solid border-black border-2 text-center"
          />
          <input
            type="text"
            ref={verificationKeyRef}
            placeholder="Verification Key"
            className="border-solid border-black border-2 text-center"
          />
          <input
            type="submit"
            value="Submit"
            className="border-solid border-black border-2 text-center"
          />
        </form>
      </div>
    </div>
  );
};
