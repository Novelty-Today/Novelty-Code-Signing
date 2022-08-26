import webbrowser;
import string;
import random;
from . import sign;
from . import common;

def associate_public_key(private_key: str):
    letters = string.ascii_lowercase;
    proof = ''.join(random.choice(letters) for i in range(32));
    signature = sign.advanced_sign(proof, private_key);
    user_address = common.get_address_from_private_key(private_key);
    webbrowser.open(f"http://localhost:3000/?signature={signature}&proof={proof}&publicAddress={user_address}");
