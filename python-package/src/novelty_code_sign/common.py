# convert file into bytes
from eth_account import account


def file_to_bytes(file_path: str) -> bytes:
    file_reader = open(file_path, "rb") # open file in [r]eading and [b]inary mode
    data = file_reader.read();
    file_reader.close();
    return data;

def get_address_from_private_key(private_key: str) -> str:
    return (account.Account.from_key(private_key)).address;
