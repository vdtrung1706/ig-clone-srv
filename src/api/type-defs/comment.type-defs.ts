import { gql } from 'apollo-server-core';

export default gql`
  type Comment {
    _id: String!
    content: String!
    author: User!
    post: Post!
    likes: [User!]
    replyTo: Comment
    replies: [Comment]
  }
  input NewCommentInput {
    content: String!
    postId: String!
  }
  input NewReplyInput {
    content: String!
    postId: String!
    replyTo: String!
  }
  input UpdateCommentInput {
    content: String!
  }
  type Query {
    comment(id: String!): Comment
    comments(postId: String!): [Comment!]
  }
  type Mutation {
    createComment(input: NewCommentInput!): Comment!
    createReply(input: NewReplyInput!): Comment!
    updateComment(input: UpdateCommentInput!): Comment!
    deleteComment(id: String!): Comment!
    toggleLike(id: String): Comment!
  }
`;
