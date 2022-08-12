from eth_account.messages import encode_defunct
import requests
from web3.auto import w3;
#Signing
def add_signature(filename: str, signature: str, timestamp: str, user_address: str) -> dict:
    post_data = {'filename': filename, 'signature': signature, 'timestamp': timestamp, 'userAddress': user_address}
    req = requests.post('http://localhost:8080/addSignature', json=post_data);
    return req.json();

def advanced_sign(file_data_in_bytes: bytes, private_key: str) -> str:
    # convert private key from 0x... format to bytes format needed by web3.py
    # typing error here is a false positive
    decoded_private_key = w3.toBytes(hexstr=private_key); # type: ignore
    message = encode_defunct(file_data_in_bytes);
    return w3.toHex(w3.eth.account.sign_message(message, private_key=decoded_private_key).signature);

def easy_sign(file_data_in_bytes: bytes, filename: str, timestamp: str, user_address: str, private_key: str):
    signature = advanced_sign(file_data_in_bytes, private_key);
    return add_signature(filename, signature, timestamp, user_address);
#verify
def get_token_uri(token_id: int) -> dict:
    req = requests.get('http://localhost:8080/getTokenURI/{}'.format(token_id));
    return req.json();

def get_data_from_token_uri(token_uri: str, gateway="https://novelty.pinata.cloud") -> dict:
    ipfs_hash = token_uri.replace("ipfs://", "");
    req = requests.get("{}/ipfs/{}".format(gateway, ipfs_hash));
    return req.json();

def advanced_verify(file_data_in_bytes: bytes, signature: str) -> str:
    message = encode_defunct(file_data_in_bytes);
    r = signature[0:66];
    s = "0x{}".format(signature[66:130]);
    v = "0x{}".format(signature[130:132]);
    return w3.eth.account.recover_message(message, vrs=(v, r, s));

def easy_verify(file_data_in_bytes: bytes, token_id: int) -> bool:
    token_uri = get_token_uri(token_id)["URI"];
    data = get_data_from_token_uri(token_uri);
    return advanced_verify(file_data_in_bytes, data["signature"]).lower() == data["userAddress"].lower();
