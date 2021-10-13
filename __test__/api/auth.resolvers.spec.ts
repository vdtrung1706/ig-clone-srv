import * as db from '../db';
import { testClient } from '../server';
import { user } from '../mocks';
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

beforeAll(db.connectToDb);

afterAll(db.dropDb);
afterAll(db.disconnectDb);

describe('Auth Resolvers', () => {
  beforeAll(db.connectToDb);

  afterAll(db.dropDb);
  afterAll(db.disconnectDb);

  it('sign up successfully', async () => {
    const result = await testClient.mutate(SIGNUP_MUTATION, {
      variables: {
        input: user,
      },
    });
    expect(result).toMatchSnapshot();
  });

  it('sign in successfully w/ token req', async () => {
    const result = (await testClient.mutate(SIGNIN_MUTATION, {
      variables: {
        input: {
          email: user.email,
          password: user.password,
        },
      },
    })) as any;

    expect(result.data.signin.user).toEqual({
      email: user.email,
      username: user.username,
      fullName: user.fullName,
    });

    testClient.setOptions({
      request: {
        headers: {
          authorization: result.data.signin.token,
        },
      },
    });

    const { data } = await testClient.query(GET_ME);

    expect(data).toEqual({
      me: {
        email: user.email,
        username: user.username,
      },
    });
  });
});
