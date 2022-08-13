import { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchNFTsURI } from "../../functions/fetchNFTsURI";
import { Spinner } from "../UI/Spinner";

export const UserFiles = () => {
  const { userWalletAddress } = useParams();

  const [nftUri, setNftUri] = useState<Array<Object>>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchNFTsURI(userWalletAddress || "", setIsLoading, setNftUri);
  }, []);

  return (
    <Fragment>
      <h1 className="text-[32px] font-bold text-center">Signed files</h1>
      <div className="min-w-[300px] w-[80%] mx-auto p-4 border-[1px] border-[#6d6d6d3b] rounded-[6px] shadow-[2px_2px_10px_0px_rgba(0,0,0,0.1)] min-h-[240px]">
        {isLoading && (
          <div className="flex justify-center items-center">
            <Spinner styleSize="mt-[2.5%] w-[45px] h-[45px]" />
          </div>
        )}
        {nftUri &&
          !isLoading &&
          nftUri.map((element: any, index: any) => {
            return (
              <div
                key={index}
                className="shadow-[2px_2px_10px_0px_rgba(0,0,0,0.1)] h-[150px] rounded-[12px] bg-[#b8b8b80e] mb-4 p-3"
              >
                Name: {element?.filename}
                <br />
                Timestamp:{"      \t\t"}
                {element?.timestamp}
                <p className="break-words">Signature: {element?.signature}</p>
                <br />
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
