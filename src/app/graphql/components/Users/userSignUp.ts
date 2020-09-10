import { User } from "#root/infra/database/models";
import {hashUtil} from "#root/infra/encryption";

const signUpResolver = (context: any, { username, password }: { username: string; password: string }) => {
  let hashedPassword = hashUtil.hashPassword(password);
  return User.create({ username: username, password: hashedPassword})
  .then(user=>{
    return {username:user.username}
  })
  .catch((err)=>{
    return err;
  })
};

export default signUpResolver;