from eth_account.messages import encode_defunct
import requests
from web3.auto import w3;
def add_signature(filename, signature, timestamp, user_address):
    post_data = {'filename': filename, 'signature': signature, 'timestamp': timestamp, 'userAddress': user_address}
    req = requests.post('http://localhost:8080/addSignature', json=post_data);
    return req.json();
def get_token_uri(tokenId):
    req = requests.get('http://localhost:8080/getTokenURI/{}'.format(tokenId));
    return req.json();
def get_data_from_token_uri(token_uri, gateway="https://dweb.link"):
    ipfs_hash = token_uri.replace("ipfs://", "");
    req = requests.get("{}/ipfs/{}".format(gateway, ipfs_hash));
    return req.json();
def advanced_sign(data_to_sign, private_key):
    decoded_private_key = w3.toBytes(hexstr=private_key);
    message = encode_defunct(data_to_sign);
    return w3.toHex(w3.eth.account.sign_message(message, private_key=decoded_private_key).signature);
def advanced_verify(dataToVerify, signature):
    message = encode_defunct(dataToVerify);
    r = signature[0:66];
    s = "0x{}".format(signature[66:130]);
    v = "0x{}".format(signature[130:132]);
    return w3.eth.account.recover_message(message, vrs=(v, r, s));
def easy_sign(file_data_in_bytes, filename, timestamp, userAddress, private_key):
    signature = advanced_sign(file_data_in_bytes, private_key);
    return add_signature(filename, signature, timestamp, userAddress);
def easy_verify(file_data_in_bytes, token_id, comparisonAddress):
    token_uri = get_token_uri(token_id);
    data = get_data_from_token_uri(token_uri);
    return advanced_verify(file_data_in_bytes, data["signature"]) == comparisonAddress;
