import { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getNFTsMetadata } from "../../API/getNFTsMetadata";
import { getNFTsURI } from "../../API/getNFTsURI";
import { Spinner } from "../UI/Spinner";
// import { fetchNFTsURI } from "../../functions/fetchNFTsUri";

export const UserFiles = () => {
  const { userWalletAddress } = useParams();

  const [nftUri, setNftUri] = useState<Array<Object>>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchNFTsURI = async () => {
      setIsLoading(true);
      // fetchNFTsURI(userWalletAddress || "");
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
    fetchNFTsURI();
  }, []);

  return (
    <Fragment>
      <h1 className="text-[32px] font-bold text-center">Signed files</h1>
      <div className="min-w-[300px] w-[80%] mx-auto p-4 border-[1px] border-[#6d6d6d3b] rounded-[6px] shadow-[2px_2px_10px_0px_rgba(0,0,0,0.1)] min-h-[240px]">
        {isLoading && (
          <div className="flex justify-center items-center">
            <Spinner styleSize="mt-[2.5%] w-[40px] h-[40px]" />
          </div>
        )}
        {nftUri &&
          !isLoading &&
          nftUri.map((element: any, index: any) => {
            return (
              <div key={index}>
                {index + 1}) Name: {element?.filename},{" "}
                <span className="ml-[5px]">
                  Timepstamp:{"      \t\t"}
                  {element?.timestamp}
                </span>{" "}
                <p className="break-words">Signature: {element?.signature}</p>
                <br />
                <br />
              </div>
            );
          })}
        {nftUri?.length === 0 && !isLoading ? (
          <div className="text-center text-[25px] mt-[2%]">
            You have not signed anything yet
          </div>
        ) : (
          <></>
        )}
      </div>
    </Fragment>
  );
};
