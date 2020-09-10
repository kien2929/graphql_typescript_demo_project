import { User } from "#root/infra/database/models";
import { hashUtil } from "#root/infra/encryption";
import { jwtUtil } from "#root/infra/jwt"
import accessEnv from "#root/infra/accessEnv"
import { AuthenticationError, ApolloError } from "apollo-server"

const accessSecret = accessEnv("ACCESS_SECRET");
const refreshSecret = accessEnv("REFRESH_SECRET");
const accessLife = +accessEnv("ACCESS_TOKEN_LIFE");
const refreshLife = +accessEnv("REFRESH_TOKEN_LIFE");
const logInResolver = (context: any, { username, password }: { username: string; password: string }) => {
  
  if (username == "" || password == "") {
    return new ApolloError("Must logged in", "404");
  }
  return User
    .findOne({ where: { username: username } })
    .then((user) => {
      if (!user) {
        return new AuthenticationError("Not found user");
      }
      if (user.password == undefined) {
        return new ApolloError("Database error");
      }
      if (!hashUtil.comparePassword(password, user.password)) {
        return new AuthenticationError("Wrong password");
      }
      const accessToken = jwtUtil.generate({ username: user?.username }, accessSecret, accessLife);
      const refreshToken = jwtUtil.generate({ username: user?.username }, refreshSecret, refreshLife);
      return { accessToken, refreshToken }
    })
    .catch((err) => { return new ApolloError("Database error","500") })
};

export default logInResolver;