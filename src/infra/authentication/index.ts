import { rule, shield, chain, or, not } from 'graphql-shield';
import { jwtUtil } from '#root/infra/jwt';
import accessEnv from "#root/infra/accessEnv"
interface payloadJwt {
  data:any
}
const accessSecret = accessEnv("ACCESS_SECRET");

const isAuthenticated = rule()((parent: any, args: any, context: any) => {
  const token = context.user.accessToken
  
  if (!token) {
    return false;
  }
  return jwtUtil.verify(token, accessSecret)
    .then((user) => {
      const dataUser = user as payloadJwt;
      context.data=dataUser.data;
      return !!user
    })
    .catch(err => {
      return false;
    })
});

const isAdmin = rule()((parent: any, args: any, context: any) => { 
  return context.data.username.includes('kien') 
});

const isMessageParticipant = rule()((parent: any, args: any, context: any) => {
  const participantIds = context.Message.getParticipantIds(args.id)
  return participantIds.includes(context.user.id);
});

const permissions = shield({
  Query: {

  },
  Mutation: {
    createChef: chain(isAuthenticated,isAdmin),
    createRestaurant: isAuthenticated
  }
});

export default permissions;