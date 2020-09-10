import * as cors from "cors";
import * as express from "express";
import * as bodyParser from "body-parser";
import { ApolloServer, makeExecutableSchema } from "apollo-server-express";
import { applyMiddleware } from 'graphql-middleware';
import permissions from "#root/infra/authentication"
import resolvers from "#root/domain/graphql/resolvers";
import typeDefs from "#root/domain/graphql/typeDefs";
import accessEnv from "#root/infra/accessEnv";
// import {logger} from '#root/helpers/logger';


const PORT = accessEnv("PORT", 4000);

const schema = applyMiddleware(
  makeExecutableSchema({
    typeDefs,
    resolvers,
    // logger
  }),
  permissions
);

const apolloServer = new ApolloServer({
  schema,
  context: ({ req }: { req: any }) => ({
    user: { accessToken: req.headers['x-access-token'] }
  }),
});

const app = express();

app.use(
  cors({
    origin: (origin, cb) => cb(null, true),
    credentials: true,
    preflightContinue: true,
    exposedHeaders: [
      "Access-Control-Allow-Headers",
      "Access-Control-Allow-Origin, Origin, X-Requested-With, Content-Type, Accept",
      "X-Password-Expired"
    ],
    optionsSuccessStatus: 200
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
apolloServer.applyMiddleware({ app, path: "/graphql" });

app.listen(PORT, "0.0.0.0", () => {
  console.info(`Test server listening on http://localhost:${PORT}/graphql`);
});
