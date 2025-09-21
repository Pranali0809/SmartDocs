// Import the root resolver for GraphQL operations
const rootResolver= require('../resolvers/index.js');
// Import utilities to create an executable GraphQL schema
const {makeExecutableSchema}=require('@graphql-tools/schema')
const {gql}=require('graphql-tag');

// Define GraphQL type definitions (schema)
const typeDefs=gql`
    type User{
        _id:ID!
        email:String!
        password:String!
    }
    type AuthData{
        userId:String!
        token:String!
        tokenExpiration:Int!
    }
    type Document{
        _id:ID!
        title:String
        owner:String
        content:String!
        associatedUsers:[String]
    }
    type AISuggestion{
        suggestion:String!
        success:Boolean!
        error:String
    }
    type Query{
        authData(email:String!,password:String!):AuthData!
        getDocuments(userId: String!): [Document]!
        getDocument(docId:String!):Document!
        getAISuggestion(context:String, currentWord:String):AISuggestion!
        getSmartSuggestion(fullText:String!, cursorPosition:Int!):AISuggestion!
    }
    type Subscription{
        documentChanged(documentId:String!,userId:String):Document
    }
    type Mutation{
        createUser(email:String!,password:String!):AuthData!
        login(email:String!,password:String!):AuthData!
        createDocument(userId:String!):Document!
        updateDocument(documentId:String!,content: String!): Document!
        addClickedDocuments(userId: String!, docId: String!): Document!
        changeDocumentTitle(title:String!,docId:String!):Document!
        deleteDocument(docId:String!):Document!
    }
`;

// Create the executable GraphQL schema by combining type definitions and resolvers
const schema = makeExecutableSchema({
    typeDefs,
    resolvers:rootResolver,
  });
  
// Export the schema for use in the server
module.exports = schema;
