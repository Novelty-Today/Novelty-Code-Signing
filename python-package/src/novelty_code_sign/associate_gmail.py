import webbrowser;
import string;
import random;
from . import sign;
from . import common;

def associate_public_key(private_key: str):
    letters = string.ascii_lowercase;
    proof = ''.join(random.choice(letters) for i in range(32)); # generate random 32 characters
    signature = sign.advanced_sign(proof, private_key);
    signature_v = "0x{}".format(signature[130:132]);
    signature_r = signature[0:66];
    signature_s = "0x{}".format(signature[66:130]);
    user_address = common.get_address_from_private_key(private_key);
    webbrowser.open(f"http://localhost:3000/?signature_v={signature_v}&signature_r={signature_r}&signature_s={signature_s}&proof={proof}&publicAddress={user_address}");
