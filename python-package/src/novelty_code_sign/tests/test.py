#!/usr/bin/env python3
from novelty_code_sign import verify as novelty_verify;
from novelty_code_sign import sign as novelty_sign;
from novelty_code_sign import common as novelty_common;
from novelty_code_sign import associate_gmail as novelty_associate;
import json;

# file = open("./keys.json", "r");
# data = json.load(file);
# private_key = f'0x{data["private_key"]}';
# novelty_associate.associate_public_key(data["private_key"]);
print(novelty_associate.get_email_from_address("0xA4faFa5523F63EE58aE7b56ad8EB5a344A19F266"));
