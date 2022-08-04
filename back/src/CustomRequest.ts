import { Request } from "express";

export interface CustomRequest<T> extends Request {
	body: T;
}

export interface AddSignatureInput {
	filename: string;
	signature: string;
	timestamp: string;
	userAddress: string;
  }
  
