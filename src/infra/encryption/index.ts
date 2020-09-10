import * as bcrypt from "bcryptjs";
import accessEnv from "../accessEnv";

const HASH_LENGTH:number = + accessEnv("HASH_LENGTH")

const hashPassword = (password:string)=>{ 
  return bcrypt.hashSync(password,HASH_LENGTH);
}

const comparePassword = (password:string, hashedPassword:string)=>{
  return bcrypt.compareSync(password, hashedPassword);
}
export const hashUtil = {
  hashPassword,
  comparePassword
}