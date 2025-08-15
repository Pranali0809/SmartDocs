// backend/graphql/resolvers/documentResolver.js
const Document = require("../../models/Document.js");
const User = require("../../models/User.js");
const { PubSub } = require("graphql-subscriptions");
const pubsub = new PubSub();

// const initShareDB = require("../../connections/sharedb.js");

const connection=require('../../server.js');



const documentResolver = {
  Query: {
    async getDocuments(_, { userId }, context) {
      try {
        // Validate input
        if (!userId) {
          throw new Error("User ID is required");
        }

        const user = await User.findOne({ uid: userId });
        if (!user) {
          throw new Error("User not found");
        }
        
        const associatedDocumentIds = user.associatedDocuments || [];
        const documents = await Document.find({ _id: { $in: associatedDocumentIds } });
        return documents;
      } catch (error) {
        throw new Error(error.message);
      }
    },

    async getDocument(_, { docId }, context) {
      try {
        // Validate input
        if (!docId) {
          throw new Error("Document ID is required");
        }

        const result = await Document.findOne({ _id: docId });
        if (!result) {
          throw new Error("Document not found");
        }
        
        return result;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
  Mutation: {
    async createDocument(_, { userId }, context) {
      try {
        // Validate input
        if (!userId) {
          throw new Error("User ID is required");
        }

        // Check if user exists
        const user = await User.findOne({ uid: userId });
        if (!user) {
          throw new Error("User not found");
        }

        const document = new Document({
          title: "Untitled",
          owner: userId,
          content: "",
          associatedUsers: [userId],
        });
        const result = await document.save();

        // Add document to user's createdDocuments
        await User.findOneAndUpdate(
          { uid: userId },
          { $push: { createdDocuments: result._id } }
        );

        // Initialize ShareDB document for real-time editing (optional)
        if (connection) {
          try {
            // let doc = connection.get("collaborations", result._id);
            let doc = context.sharedbConnection.get('collection', result._id);

            doc.fetch(function (err) {
              if (err) {
                console.error("ShareDB document creation error:", err);
              } else {
                doc.create([{ insert: "" }], "rich-text");
              }
            });
          } catch (error) {
            console.warn("ShareDB initialization failed for document:", error.message);
          }
        } else {
          console.warn("ShareDB not available - real-time collaboration disabled");
        }

        return {
          _id: result._id,
          title: result.title,
          owner: result.owner,
          content: result.content,
          associatedUsers: result.associatedUsers,
        };
      } catch (error) {
        throw new Error(error.message);
      }
    },

    async changeDocumentTitle(_, { title, docId }) {
      try {
        // Validate inputs
        if (!title || !docId) {
          throw new Error("Title and Document ID are required");
        }

        const document = await Document.findOneAndUpdate(
          { _id: docId },
          { title },
          { new: true }
        );
        
        if (!document) {
          throw new Error("Document not found");
        }
        
        return document;
      } catch (error) {
        throw new Error(`Failed to update document title: ${error.message}`);
      }
    },

    updateDocument(_parent, args) {
      const _id = args.documentId;
      const content = args.content;
      
      // Validate inputs
      if (!_id || content === undefined) {
        throw new Error("Document ID and content are required");
      }
      
      pubsub.publish("DOCUMENT_CHANGED", { documentChanged: { _id, content } });
      return { _id, content };
    },
  },

  Subscription: {
    documentChanged: {
      subscribe: () => pubsub.asyncIterator(["DOCUMENT_CHANGED"]),
    },
  },
};

module.exports = documentResolver;