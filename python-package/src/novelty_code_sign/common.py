# convert file into bytes
from eth_account import account
import requests

def file_to_bytes(file_path: str) -> bytes:
    file_reader = open(file_path, "rb") # open file in [r]eading and [b]inary mode
    data = file_reader.read();
    file_reader.close();
    return data;

def get_address_from_private_key(private_key: str) -> str:
    return (account.Account.from_key(private_key)).address;

def upload_file_to_pinata(file_path: str, filename: str, pinata_jwt: str):
    url = "https://api.pinata.cloud/pinning/pinFileToIPFS";
    payload={'pinataOptions': '{"cidVersion": 1}', 'pinataMetadata': '{{"name": "{}"}}'.format(filename)};
    files=[
        ('file',("file", open(file_path,'rb'), 'application/octet-stream'))
    ];
    headers = {
      'Authorization': 'Bearer {}'.format(pinata_jwt)
    };
    response = requests.request("POST", url, headers=headers, data=payload, files=files)
    return "ipfs://{}".format(response.json()["IpfsHash"]);
