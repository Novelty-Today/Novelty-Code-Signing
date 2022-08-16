from eth_account.messages import encode_defunct
import requests
from web3.auto import w3;
from . import common;
from . import constants;

# api function, calls /getTokenURI
def get_token_uri(token_id: int) -> dict:
    # we use format because python doesn't have template strings
    # https://www.geeksforgeeks.org/python-string-format-method/
    req = requests.get('{}/getTokenURI/{}'.format(constants.api_url,token_id));
    return req.json();

# retreive needed data from ipfs
# token uri should be obtained from get_token_uri
def get_data_from_token_uri(token_uri: str, gateway=constants.ipfs_gateway) -> dict:
    ipfs_hash = token_uri.replace("ipfs://", ""); # get hash from uri
    req = requests.get("{}/ipfs/{}".format(gateway, ipfs_hash));
    return req.json(); # https://requests.readthedocs.io/en/latest/user/quickstart/#json-response-content

# get the address of whoever signed this message
def advanced_verify(ipfs_uri, signature: str) -> str:
    message = encode_defunct(text=ipfs_uri);
    # there is a glitch with this library, when passing the signature it will fail verification.
    # in this code we extract v, r, and s value from the signature
    # this values are needed to recover the address
    # if you are confused by [:] operator: https://stackoverflow.com/a/663175
    r = signature[0:66];
    s = "0x{}".format(signature[66:130]);
    v = "0x{}".format(signature[130:132]);
    return w3.eth.account.recover_message(message, vrs=(v, r, s));

# verify that the appropriate data has been signed, token_id is the verification key
def easy_verify(ipfs_uri: str, token_id: int) -> bool:
    token_uri = get_token_uri(token_id)["URI"];
    data = get_data_from_token_uri(token_uri);
    return advanced_verify(ipfs_uri, data["signature"]).lower() == data["userAddress"].lower(); # compare addresses in lowercase

