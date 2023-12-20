import { gql } from "apollo-server";

export default gql`
  type User {
    id: String!
    username: String!
    email: String!
    name: String
    location: String
    password: String!
    avatarURL: String
    githubUsername: String
  }
  type ErrorUser {
    ok: Boolean!
    user: User
    error: String
  }
  type Mutation {
    createAccount(
      username: String!
      email: String!
      name: String
      location: String
      password: String!
      avatarURL: String
      githubUsername: String
    ): ErrorUser
  }
  type Query {
    seeProfile(username: String!): User
  }
`;