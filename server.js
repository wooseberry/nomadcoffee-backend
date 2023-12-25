require("dotenv").config();
import express from "express";
import logger from "morgan";
import { ApolloServer, gql } from "apollo-server-express";
import { graphqlUploadExpress } from "graphql-upload-minimal";
import { typeDefs, resolvers } from "./schema";
import { getUser } from "./users/users.utils";

const PORT = process.env.PORT;

const startServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    uploads: false,
    context: async ({ req }) => {
      return {
        loggedInUser: await getUser(req.headers.token),
      };
    },
  });

  const app = express();
  app.use(logger('tiny'));
  await server.start();
  app.use("/graphql",graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));
  server.applyMiddleware({ app });
  app.use("/static", express.static("uploads"));
  await new Promise((resolve) => app.listen({ port: PORT }, resolve));
  console.log(`🫧 Server: http://localhost:${PORT}${server.graphqlPath}🌳`);
};

startServer();