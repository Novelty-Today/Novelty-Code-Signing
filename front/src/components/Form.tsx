import { FormEvent, SetStateAction, useRef, useState } from "react";
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
  data: string,
  setVerificationKey: (arg: SetStateAction<string>) => void,
  e: FormEvent
) => {
  e.preventDefault();
  const address = await checkWebProviderAndConnect();
  console.log("address", address);
  const msg = `0x${Buffer.from(data, "utf8").toString("hex")}`;
  const sign = await window.ethereum.request({
    method: "personal_sign",
    params: [msg, address, ""],
  });
  setVerificationKey(sign);
};

const OnSubmitVerify = async (
  data: string,
  verificationKey: string,
  e: FormEvent
) => {
  e.preventDefault();
  const msg = `0x${Buffer.from(data, "utf8").toString("hex")}`;
  try {
    const signedAddress = await window.ethereum.request({
      method: "personal_ecRecover",
      params: [msg, verificationKey],
    });
    alert(`message signed by ${signedAddress}`);
  } catch (e) {
    alert("verification failed");
  }
};

export const Form = () => {
  const dataToSignRef = useRef<HTMLInputElement>(null);
  const dataToVerifyRef = useRef<HTMLInputElement>(null);
  const verificationKeyRef = useRef<HTMLInputElement>(null);
  // first form output
  const [verificationKey, setVerificationKey] = useState("");
  return (
    <div className="w-2/6 mx-auto flex flex-col gap-5">
      <div className="flex flex-col gap-5 p-5 border-solid border-black border-2">
        <h1 className="text-xl">Sign Data</h1>
        <form
          action="#"
          onSubmit={(e) =>
            OnSubmitSign(dataToSignRef.current!.value, setVerificationKey, e)
          }
          className="flex flex-col w-full gap-1"
        >
          <input
            type="text"
            ref={dataToSignRef}
            placeholder="Data to Sign"
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
              dataToVerifyRef.current!.value,
              verificationKeyRef.current!.value,
              e
            )
          }
          className="flex flex-col w-full gap-2"
        >
          <input
            type="text"
            ref={dataToVerifyRef}
            placeholder="Data to Verify"
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
