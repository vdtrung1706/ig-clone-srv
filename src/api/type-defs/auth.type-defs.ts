import { gql } from 'apollo-server-core';

export default gql`
  type AuthUser {
    token: String!
    user: User!
  }
  input AuthInput {
    email: String!
    password: String!
  }
  type Mutation {
    signin(input: AuthInput!): AuthUser!
  }
`;
