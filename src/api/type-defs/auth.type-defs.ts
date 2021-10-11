import { gql } from 'apollo-server-core';

export default gql`
  type AuthUser {
    token: String!
    user: User!
  }
  input SigninInput {
    email: String!
    password: String!
  }
  input SignupInput {
    email: String!
    password: String!
    username: String!
    fullName: String!
  }
  type Mutation {
    signin(input: SigninInput!): AuthUser!
    signup(input: SignupInput!): AuthUser!
  }
`;
