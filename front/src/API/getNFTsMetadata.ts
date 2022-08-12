import axios from "axios";

export const getNFTsMetadata = async (URL: string) => {
  const CID = URL.split("//");
  return (await axios.get(`https://novelty.mypinata.cloud/ipfs/${CID[1]}`))
    .data;
};
