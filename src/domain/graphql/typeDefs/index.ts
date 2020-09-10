import { gql } from "apollo-server";

const typeDefs = gql`
  type Chef {
    id:ID!
    name: String!
    restaurants: [Restaurant!]!
  }
  type AccessToken {
    accessToken:String!
  }
  type Tokens {
    accessToken:String!
    refreshToken:String!
  }
  type Restaurant {
    id: ID!
    name: String!
  }
  type User{
    username:String!
    password:String!
  }
  type Mutation {
    createChef(name: String!): Chef!
    createRestaurant(chefId: ID!, name: String!): Restaurant!
    logIn(username:String!, password:String!):Tokens!
    signUp(username:String!, password:String!):User!
  }

  type Query {
    chefs: [Chef!]!
    getNewToken(refreshToken:String!):AccessToken!
  }
`;

export default typeDefs;
