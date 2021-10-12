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
    verified: Boolean
    bookmarks: [Post]
  }
  input UpdateMeInput {
    email: String
    username: String
    password: String
    fullName: String
    avatar: String
    bio: String
    website: String
    private: Boolean
    verified: Boolean
    bookmarks: [UpdatePostInput]
  }
  type Query {
    me: User!
    user(id: String!): User!
    users: [User!]
  }
  type Mutation {
    updateMe(input: UpdateMeInput!): User
  }
`;
