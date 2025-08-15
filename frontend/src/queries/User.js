import gql from 'graphql-tag';

const CREATE_USER = gql`
  mutation($email: String!, $password: String!) {
    createUser(email: $email, password: $password) {
      userId
      token
      tokenExpiration
    }
  }
`;

const LOGIN=gql`
  mutation($email: String!, $password: String!) {
    login(email: $email, password: $password){
      userId
      token
      tokenExpiration
    }
  }
`;

export {CREATE_USER,LOGIN}