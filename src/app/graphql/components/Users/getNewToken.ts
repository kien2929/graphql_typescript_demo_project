import { jwtUtil } from "#root/infra/jwt";
import accessEnv from "#root/infra/accessEnv";
import { ApolloError } from "apollo-server";

const accessSecret = accessEnv("ACCESS_SECRET");
const accessLife = accessEnv("ACCESS_TOKEN_LIFE");
const refreshSecret = accessEnv("REFRESH_SECRET");
const getNewToken = (context: any, { refreshToken }: { refreshToken: string }) => {
  interface JwtPayload {
    data: any
  }
  return jwtUtil
    .verify(refreshToken, refreshSecret)
    .then((res) => {
      const jwtPayload = res as JwtPayload;
      if (!res) {
        return new ApolloError("Wrong hashed data", "404");
      }
      let accessToken = jwtUtil.generate(jwtPayload, accessSecret, accessLife);
      return { accessToken: accessToken }
    })
    .catch(err => {
      return new ApolloError("Wrong refresh token", "400");
    })
}
export default getNewToken