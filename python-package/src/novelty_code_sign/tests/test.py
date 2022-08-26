#!/usr/bin/env python3
from novelty_code_sign import verify as novelty_verify;
from novelty_code_sign import sign as novelty_sign;
from novelty_code_sign import common as novelty_common;
from novelty_code_sign import associate_gmail as novelty_associate;
import json;

file = open("./keys.json", "r");
data = json.load(file);
private_key = "0x{}".format(data["private_key"]);
novelty_associate.associate_public_key(data["private_key"]);
