import axios from "axios";

export interface GetTokenURIOutput {
	status: "success" | "error";
	URI: string;
}

export const getTokenURI = async (
	tokenId: number
): Promise<GetTokenURIOutput> => {
	return (await axios.get(`http://localhost:8080/getTokenURI/${tokenId}`))
		.data;
};
