import { gql } from 'apollo-server-core';

export default gql`
  type Comment {
    _id: String!
    content: String!
    post: Post!
    likes: [User!]
    replyTo: Comment
    replies: [Comment]
    createdBy: User!
  }
  input NewCommentInput {
    content: String!
    postId: String!
  }
  input NewReplyInput {
    content: String!
    postId: String
    replyTo: String!
  }
  input UpdateCommentInput {
    commentId: String!
    content: String!
  }
  type Query {
    comment(commentId: String!): Comment
    comments(postId: String!): [Comment!]
  }
  type Mutation {
    createComment(input: NewCommentInput!): Comment!
    createReply(input: NewReplyInput!): Comment!
    updateComment(input: UpdateCommentInput!): Comment!
    deleteComment(commentId: String!): Comment!
    toggleLike(commentId: String!): Comment!
  }
`;
