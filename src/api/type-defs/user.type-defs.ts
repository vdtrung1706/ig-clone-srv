import { gql } from 'apollo-server-core';

export default gql`
  type User {
    _id: String!
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
    followers: [User]
    following: [User]
    createdAt: String
    updatedAt: String
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
  }
  type Query {
    me: User!
    user(id: String!): User!
    users: [User!]
  }
  type Mutation {
    updateMe(input: UpdateMeInput!): User!
  }
`;
