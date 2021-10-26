import { gql } from 'apollo-server-core';

export default gql`
  type User {
    _id: String!
    email: String!
    username: String!
    fullName: String!
    avatar: String
    bio: String
    website: String
    private: Boolean
    verified: Boolean
    bookmarks: [Post]
    createdAt: String
    updatedAt: String
  }
  type Me {
    _id: String!
    email: String!
    username: String!
    fullName: String!
    password: String!
    avatar: String
    bio: String
    website: String
    private: Boolean
    verified: Boolean
    bookmarks: [Post]
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
    me: Me!
    user(id: String!): User!
  }
  type Mutation {
    updateMe(input: UpdateMeInput!): Me!
  }
`;
