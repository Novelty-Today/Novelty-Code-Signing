import { getNFTsMetadata } from "../API/getNFTsMetadata";
import { getNFTsURI } from "../API/getNFTsURI";

export const fetchNFTsURI = async (
  userWalletAddress: string,
  setIsLoading: (param: boolean) => void,
  setNftUri: (param: any[]) => void
) => {
  setIsLoading(true);
  const ipfsURLs = await getNFTsURI(userWalletAddress || "");
  if (ipfsURLs) {
    let userNFTsMetadata = [];
    for (let i = 0; i < ipfsURLs.length; ++i) {
      const data = await getNFTsMetadata(ipfsURLs[i]);
      userNFTsMetadata.push(data);
    }
    setNftUri(userNFTsMetadata);
    console.log(userNFTsMetadata);
    setIsLoading(false);
  }
};
