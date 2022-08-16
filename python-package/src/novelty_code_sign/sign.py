from eth_account.messages import encode_defunct
import requests
from web3.auto import w3;
from . import common;
from . import constants;

# API function, calls /addSignature
def add_signature(filename: str, signature: str, user_address: str, ipfs_uri) -> dict:
    post_data = {'filename': filename, 'signature': signature, 'userAddress': user_address, 'IpfsURI': ipfs_uri } # this is a python dictionary https://www.w3schools.com/python/python_dictionaries.asp
    req = requests.post('{}/addSignature'.format(constants.api_url), json=post_data); # we need to use json= if we don't requests will fail passing the data
    return req.json(); # https://requests.readthedocs.io/en/latest/user/quickstart/#json-response-content

# simply sign the message without connecting to any server
def advanced_sign(ipfs_uri, private_key: str) -> str:
    # convert private key from 0x... format to bytes format needed by web3.py
    # typing error here is a false positive
    decoded_private_key = w3.toBytes(hexstr=private_key); # type: ignore
    # encode to make it compatible to metamask's personal_sign
    message = encode_defunct(text=ipfs_uri);
    return w3.toHex(w3.eth.account.sign_message(message, private_key=decoded_private_key).signature);

# sign the message, sent it to server and get api response
def easy_sign(file_path: str, filename: str, private_key: str, pinata_jwt: str):
    ipfs_uri = common.upload_file_to_pinata(filename=filename, file_path=file_path, pinata_jwt=pinata_jwt);
    user_address = common.get_address_from_private_key(private_key)
    signature = advanced_sign(ipfs_uri, private_key)
    return [ipfs_uri, add_signature(filename, signature, user_address, ipfs_uri)["tokenId"]];

