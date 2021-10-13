import Post from '../../src/models/post';
import User from '../../src/models/user';
import * as db from '../db';
import { postMock, userMock } from '../mocks';
import { createTestServer } from '../server';
import { gql } from 'apollo-server-core';

describe('User Resolvers', () => {
  beforeAll(() => db.connectToDb('user'));

  afterAll(db.dropDb);
  afterAll(db.disconnectDb);

  it('query user by id & bookmarks should be in a corrected form', async () => {
    const post = await Post.create(postMock);
    const user = await User.create({
      ...userMock,
      bookmarks: [{ _id: post.id }],
    });

    const server = createTestServer(user);

    const GET_USER = gql`
      query userQuery($id: String!) {
        user(id: $id) {
          email
          username
          fullName
          bookmarks {
            caption
          }
        }
      }
    `;

    const { data } = await server.query(GET_USER, {
      variables: {
        id: user.id,
      },
    });

    expect(data).toMatchSnapshot();
  });
});
