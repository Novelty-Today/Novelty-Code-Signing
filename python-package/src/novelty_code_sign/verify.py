from eth_account.messages import encode_defunct
import requests
from web3.auto import w3

from . import associate_gmail;
from . import constants;

# api function, calls /getTokenURI
def get_token_uri(token_id: int) -> dict:
    # looks like python does have format string
    req = requests.get(f"{constants.api_url}/getTokenURI/{token_id}");
    return req.json();

# retreive needed data from ipfs
# token uri should be obtained from get_token_uri
def get_data_from_token_uri(token_uri: str, gateway=constants.ipfs_gateway) -> dict:
    ipfs_hash = token_uri.replace("ipfs://", ""); # get hash from uri
    req = requests.get(f"{gateway}/ipfs/{ipfs_hash}");
    return req.json(); # https://requests.readthedocs.io/en/latest/user/quickstart/#json-response-content

# get the address of whoever signed this message
def advanced_verify(ipfs_uri, signature: str) -> str:
    message = encode_defunct(text=ipfs_uri);
    # there is a glitch with this library, when passing the signature it will fail verification.
    # in this code we extract v, r, and s value from the signature
    # this values are needed to recover the address
    # if you are confused by [:] operator: https://stackoverflow.com/a/663175
    signature_v = f"0x{signature[130:132]}";
    signature_r = signature[0:66];
    signature_s = f"0x{signature[66:130]}";
    return w3.eth.account.recover_message(message, vrs=(signature_v, signature_r, signature_s));

# verify that the appropriate data has been signed, token_id is the verification key
def easy_verify(ipfs_uri: str, token_id: int) -> bool:
    token_uri = get_token_uri(token_id)["URI"];
    data = get_data_from_token_uri(token_uri);
    return advanced_verify(ipfs_uri, data["signature"]).lower() == data["userAddress"].lower(); # compare addresses in lowercase
def easy_verify_email(ipfs_uri: str, token_id: int, email: str) -> bool:
    token_uri = get_token_uri(token_id)["URI"];
    data = get_data_from_token_uri(token_uri);
    return advanced_verify(ipfs_uri, data["signature"]).lower() == data["userAddress"].lower() and email.lower() == associate_gmail.get_email_from_address(data["userAddress"]).lower(); # compare addresses in lowercase
