
import * as jwt from "jsonwebtoken";

interface ResultObject{
	data:object
}

const generateToken = async (userData: any, secretSignature: string, tokenLife: number) => {	
	return new Promise((resolve, reject) => {
		jwt.sign(
      { data: userData },
      secretSignature, 
      { algorithm: "HS256", expiresIn: tokenLife, },
			(error, token) => {
				if (error) {
					return reject(error);
				}
				resolve(token);
			});
	});
}
const verifyToken = async (token: string, secretKey: string) => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, secretKey, (error, decoded) => {
			if (error) {
				reject(error);
			}
			const result = decoded as ResultObject
			resolve(result);
		});
	});
}
export const jwtUtil = {
  generate:generateToken,
	verify:verifyToken
}