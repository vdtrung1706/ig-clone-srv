import { gql } from 'apollo-server-core';

export default gql`
  type Post {
    author: User!
    image: String
    caption: String
    hashtags: [String]
    createdAt: String
  }
`;
