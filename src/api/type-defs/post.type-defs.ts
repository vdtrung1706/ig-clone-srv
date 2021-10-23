import { gql } from 'apollo-server-core';

export default gql`
  type Post {
    _id: String!
    author: User!
    image: String
    caption: String
    hashtags: [String]
    createdAt: String
  }
  input NewPostInput {
    image: String
    caption: String
    hashtags: [String]
  }
  input UpdatePostInput {
    postId: String!
    image: String
    caption: String
    hashtags: [String]
  }
  type Query {
    post(postId: ID!): Post
    posts: [Post]
  }
  type Mutation {
    createPost(input: NewPostInput!): Post
    updatePost(input: UpdatePostInput!): Post
    deletePost(postId: String!): Post
  }
`;
