import { gql } from 'apollo-server-core';

export default gql`
  type User {
    email: String!
    username: String!
    password: String!
    fullName: String!
    avatar: String
    bio: String
    website: String
    private: Boolean
    confirmed: Boolean
    bookmarks: [Post]
  }
  type Query {
    hello: String
  }
`;
