import axios from "axios";
import { API_CONFIG } from "../constants";

interface RequestBodyInput {
  proof: string;
  publicAddress: string;
  jwtToken: string;
  signature_v: string;
  signature_r: string;
  signature_s: string;
}

export async function addPublicAddress(requestBody: RequestBodyInput) {
  return (await axios.post(`${API_CONFIG}/addPublicAddress`, requestBody)).data;
}
