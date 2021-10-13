import * as db from '../db';
import { createTestServer } from '../server';
import { userMock } from '../mocks';
import { gql } from 'apollo-server-core';

const SIGNIN_MUTATION = gql`
  mutation signinMutation($input: SigninInput!) {
    signin(input: $input) {
      token
      user {
        email
        username
        fullName
      }
    }
  }
`;

const SIGNUP_MUTATION = gql`
  mutation signupMutation($input: SignupInput!) {
    signup(input: $input) {
      user {
        email
        username
        fullName
      }
    }
  }
`;

const GET_ME = gql`
  query {
    me {
      email
      username
    }
  }
`;

describe('Auth Resolvers', () => {
  beforeAll(() => db.connectToDb('auth'));

  afterAll(db.dropDb);
  afterAll(db.disconnectDb);

  const server = createTestServer();

  it('sign up successfully', async () => {
    const result = await server.mutate(SIGNUP_MUTATION, {
      variables: {
        input: userMock,
      },
    });
    expect(result).toMatchSnapshot();
  });

  it('sign in successfully w/ token req', async () => {
    const result = (await server.mutate(SIGNIN_MUTATION, {
      variables: {
        input: {
          email: userMock.email,
          password: userMock.password,
        },
      },
    })) as any;

    expect(result.data.signin.user).toEqual({
      email: userMock.email,
      username: userMock.username,
      fullName: userMock.fullName,
    });

    server.setOptions({
      request: {
        headers: {
          authorization: result.data.signin.token,
        },
      },
    });

    const { data } = await server.query(GET_ME);

    expect(data).toEqual({
      me: {
        email: userMock.email,
        username: userMock.username,
      },
    });
  });
});
