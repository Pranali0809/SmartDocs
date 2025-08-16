import gql from 'graphql-tag';


const GET_DOCUMENTS = gql`
  query($userId: String!) {
    getDocuments(userId: $userId) {
      _id
      title
      owner
      content
      associatedUsers
    }
  }
`;

const GET_DOCUMENT = gql`
  query($docId: String!) {
    getDocument(docId: $docId) {
      _id
      title
      owner
      content
      associatedUsers
    }
  }
`;

const CREATE_DOCUMENT = gql`
mutation($userId: String!){
  createDocument(userId: $userId) {
    
    _id
      title
      owner
      content
      associatedUsers
  }
}
`;

const DELETE_DOCUMENT = gql`
  mutation($docId: String!) {
    deleteDocument(docId: $docId) {
      _id
      title
    }
  }
`;

const DOCUMENT_CHANGED_SUBSCRIPTION = gql`
  subscription DocumentChanged($docId: String!) {
    documentChanged(docId: $docId) {
      _id
      title
      owner
      content
      associatedUsers
    }
  }
`;


const ADD_CLICKED_DOCUMENTS = gql`
  mutation($userId: String!, $docId: String!) {
    addClickedDocuments(userId: $userId, docId: $docId) {
      _id
      title
      owner
      content
      associatedUsers
    }
  }
`;

// Mutation to change a document's title
const CHANGE_DOCUMENT_TITLE = gql`
  mutation($docId: String!, $title: String!) {
    changeDocumentTitle(docId: $docId, title: $title) {
      _id
      title
      owner
      content
      associatedUsers
    }
  }
`;

export {
  CREATE_DOCUMENT,
  DOCUMENT_CHANGED_SUBSCRIPTION,
  GET_DOCUMENTS,
  GET_DOCUMENT,
  DELETE_DOCUMENT,
  ADD_CLICKED_DOCUMENTS,
  CHANGE_DOCUMENT_TITLE
};