from eth_account.messages import encode_defunct
import requests
from web3.auto import w3;
# Signing
# API function, calls /addSignature
def add_signature(filename: str, signature: str, timestamp: str, user_address: str) -> dict:
    post_data = {'filename': filename, 'signature': signature, 'timestamp': timestamp, 'userAddress': user_address} # this is a python dictionary https://www.w3schools.com/python/python_dictionaries.asp
    req = requests.post('http://localhost:8080/addSignature', json=post_data); # we need to use json= if we don't requests will fail passing the data
    return req.json(); # https://requests.readthedocs.io/en/latest/user/quickstart/#json-response-content

# simply sign the message without connecting to any server
def advanced_sign(file_data_in_bytes: bytes, private_key: str) -> str:
    # convert private key from 0x... format to bytes format needed by web3.py
    # typing error here is a false positive
    decoded_private_key = w3.toBytes(hexstr=private_key); # type: ignore
    # encode to make it compatible to metamask's personal_sign
    message = encode_defunct(file_data_in_bytes);
    return w3.toHex(w3.eth.account.sign_message(message, private_key=decoded_private_key).signature);

# sign the message, sent it to server and get api response
def easy_sign(file_path: str, filename: str, timestamp: str, user_address: str, private_key: str) -> dict:
    file_data_in_bytes = file_to_bytes(file_path);
    signature = advanced_sign(file_data_in_bytes, private_key)
    return add_signature(filename, signature, timestamp, user_address);

# verification
# api function, calls /getTokenURI
def get_token_uri(token_id: int) -> dict:
    # we use format because python doesn't have template strings
    # https://www.geeksforgeeks.org/python-string-format-method/
    req = requests.get('http://localhost:8080/getTokenURI/{}'.format(token_id));
    return req.json();

# retreive needed data from ipfs
# token uri should be obtained from get_token_uri
def get_data_from_token_uri(token_uri: str, gateway="https://novelty.mypinata.cloud") -> dict:
    ipfs_hash = token_uri.replace("ipfs://", ""); # get hash from uri
    req = requests.get("{}/ipfs/{}".format(gateway, ipfs_hash));
    return req.json(); # https://requests.readthedocs.io/en/latest/user/quickstart/#json-response-content

# get the address of whoever signed this message
def advanced_verify(file_data_in_bytes: bytes, signature: str) -> str:
    message = encode_defunct(file_data_in_bytes);
    # there is a glitch with this library, when passing the signature it will fail verification.
    # in this code we extract v, r, and s value from the signature
    # this values are needed to recover the address
    # if you are confused by [:] operator: https://stackoverflow.com/a/663175
    r = signature[0:66];
    s = "0x{}".format(signature[66:130]);
    v = "0x{}".format(signature[130:132]);
    return w3.eth.account.recover_message(message, vrs=(v, r, s));

# verify that the appropriate data has been signed, token_id is the verification key
def easy_verify(file_path: str, token_id: int) -> bool:
    file_data_in_bytes = file_to_bytes(file_path);
    token_uri = get_token_uri(token_id)["URI"];
    data = get_data_from_token_uri(token_uri);
    return advanced_verify(file_data_in_bytes, data["signature"]).lower() == data["userAddress"].lower(); # compare addresses in lowercase

# convert file into bytes
def file_to_bytes(file_path: str) -> bytes:
    file_reader = open(file_path, "rb") # open file in [r]eading and [b]inary mode
    data = file_reader.read();
    file_reader.close();
    return data;
