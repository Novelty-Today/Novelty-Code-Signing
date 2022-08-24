import axios from "axios";
import { API_CONFIG } from "../constants";

interface RequestBodyInput {
  signature: string;
  proof: string;
  publicAddress: string;
  jwtToken: string;
}

export async function addPublicAddress(requestBody: RequestBodyInput) {
  return (await axios.post(`${API_CONFIG}/addPublicAddress`, requestBody)).data;
}
