import axios from "axios";

export const getNFTsURI = async (userWalletAddress: string) => {
  return (
    await axios.get(
      `http://localhost:8080/userSignedFiles/${userWalletAddress}`
    )
  ).data;
};
