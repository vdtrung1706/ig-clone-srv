import { gql } from 'apollo-server-core';

export default gql`
  type Follow {
    _id: String!
    user: User!
    following: [User!]
    followers: [User!]
  }
  type Query {
    getFollow(userId: String!): Follow!
  }
  type Mutation {
    toggleFollow(userId: String!): [User!]
    deleteFollower(userId: String!): [User!]
  }
`;
