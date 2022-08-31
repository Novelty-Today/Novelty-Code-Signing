import webbrowser;
import string;
import random
import requests;
from . import constants;
from . import sign;
from . import common;

def associate_public_key(private_key: str):
    letters = string.ascii_lowercase;
    proof = ''.join(random.choice(letters) for i in range(32)); # generate random 32 characters
    signature = sign.advanced_sign(proof, private_key);
    signature_v = f"0x{signature[130:132]}";
    signature_r = signature[0:66];
    signature_s = f"0x{signature[66:130]}";
    user_address = common.get_address_from_private_key(private_key);
    webbrowser.open(f"http://localhost:3000/?signature_v={signature_v}&signature_r={signature_r}&signature_s={signature_s}&proof={proof}&publicAddress={user_address}");
def get_email_from_address(address: str):
    req = requests.get(f"{constants.api_url}/getEmailFromPublicAddress/{address}");
    return req.json()["email"];
