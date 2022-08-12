import React, { FC, ReactNode, SetStateAction, useState } from "react";

interface GeneralInformationContextInterface {
  userWalletAddress: string;
  setUserWalletAddress: (arg: SetStateAction<string>) => void;
}
const GeneralInformationContext =
  React.createContext<GeneralInformationContextInterface>({
    userWalletAddress: "",
    setUserWalletAddress: (arg: SetStateAction<string>) => {},
  });

type Props = {
  children?: ReactNode;
};

export const GeneralInformationProvider: FC<Props> = ({ children }: Props) => {
  const [userWalletAddress, setUserWalletAddress] = useState("");

  return (
    <GeneralInformationContext.Provider
      value={{
        userWalletAddress,
        setUserWalletAddress,
      }}
    >
      {children}
    </GeneralInformationContext.Provider>
  );
};

export default GeneralInformationContext;