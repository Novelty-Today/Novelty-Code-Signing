import { getNFTsURI } from "../API/getNFTsURI";

export const fetchNFTsURI = async (userWalletAddress: string) => {
  const ipfsURLs = await getNFTsURI(userWalletAddress);
  console.log(ipfsURLs);
};
