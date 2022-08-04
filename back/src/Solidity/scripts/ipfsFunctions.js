require("dotenv").config();
const { pinata_jwt } = process.env;
const axios = require("axios");

const uploadToIPFS = async (json = {}, name = "noName") => {
  const data = JSON.stringify({
    pinataMetadata: {
      name,
    },
    pinataContent: json,
  });

  var config = {
    method: "post",
    url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${pinata_jwt}`,
    },
    data,
  };

  try {
    const res = await axios(config);
    console.log("response pinanta", res.data);
    if (res.data.IpfsHash)
      return `ipfs://${res.data.IpfsHash}`;
  } catch (error) {
    throw Error("IPFS Upload Error");
  }
};

module.exports = { uploadToIPFS };
