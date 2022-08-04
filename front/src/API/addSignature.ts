import axios from "axios";
export interface AddSignatureInput {
	filename: string;
	signature: string;
	timestamp: string;
	userAddress: string;
}
export interface AddSignatureeOutput {
	status: "success" | "failure";
}
export const addSignature = async (body: AddSignatureInput) => {
	return (await axios.post("http://localhost:8080/addSignature", body)).data;
};
