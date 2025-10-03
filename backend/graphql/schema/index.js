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
    type RAGQueryResult{
        success:Boolean!
        answer:String!
        context:[String]
        timestamp:String
        error:String
    }
    type RAGSummaryResult{
        success:Boolean!
        summary:String!
        statistics:DocumentStatistics
        timestamp:String
        error:String
    }
    type DocumentStatistics{
        word_count:Int
        character_count:Int
        original_length:Int
    }
    type RAGAnalysisResult{
        success:Boolean!
        word_count:Int
        sentence_count:Int
        character_count:Int
        average_word_length:Float
        top_words:[TopWord]
        timestamp:String
        error:String
    }
    type TopWord{
        word:String!
        count:Int!
    }
    type RAGHealthResult{
        success:Boolean!
        status:String!
        error:String
    }
    type Query{
        authData(email:String!,password:String!):AuthData!
        getDocuments(userId: String!): [Document]!
        getDocument(docId:String!):Document!
        getAISuggestion(context:String, currentWord:String):AISuggestion!
        getSmartSuggestion(fullText:String!, cursorPosition:Int!):AISuggestion!
        ragQuery(content:String!, question:String!):RAGQueryResult!
        ragSummarize(content:String!):RAGSummaryResult!
        ragAnalyze(content:String!):RAGAnalysisResult!
        ragHealth:RAGHealthResult!
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
