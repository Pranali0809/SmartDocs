// backend/graphql/resolvers/userResolver.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../../models/User.js");
const admin = require("../../connections/firebaseconfig.js");

const { createUserWithEmailAndPassword, getAuth } = require("firebase/auth");

const userResolver = {
  Query: {
    async authData(_, { email, password }, context) {
      try {
        const user = await User.findOne({ email });
        if (!user) throw new Error("User Not Found");

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) throw new Error("Invalid password");

        const token = jwt.sign({ id: user.uid }, process.env.JWT_SECRET);
        return { userId: user.uid, token, tokenExpiration: 1 };
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
  Mutation: {
    async createUser(_, { email, password }, context) {
      try {
        const existingUser = await User.findOne({ email });
        if (existingUser) throw new Error("User exists already.");

        const userCredential = await admin.auth().createUser({
          email,
          password,
        });

        const user = userCredential;

        const token = jwt.sign({ id: user.uid }, process.env.JWT_SECRET);
        const hashedPassword = await bcrypt.hash(password, 12);

        const userMongoDB = new User({
          uid: user.uid,
          email,
          password: hashedPassword,
        });
        await userMongoDB.save();

        context.res.cookie("authToken", token, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
          secure: true,
          sameSite: "None",
        });

        return { userId: user.uid, token, tokenExpiration: 1 };
      } catch (error) {
        throw new Error(error.message);
      }
    },

    async login(_, { email, password }, context) {
      try {
        const user = await User.findOne({ email });
        if (!user) throw new Error("User Not Found");

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) throw new Error("Invalid password");

        const token = jwt.sign({ id: user.uid }, process.env.JWT_SECRET);
        return { userId: user.uid, token, tokenExpiration: 1 };
      } catch (error) {
        throw new Error(error.message);
      }
    },

    async addClickedDocuments(_, { userId, docId }, context) {
      try {
        // Validate inputs
        if (!userId || !docId) {
          throw new Error("User ID and Document ID are required");
        }

        // Add document to user's associatedDocuments
        const user = await User.findOneAndUpdate(
          { uid: userId },
          { $addToSet: { associatedDocuments: docId } },
          { new: true }
        );
        
        if (!user) {
          throw new Error("User not found");
        }

        // Add user to document's associatedUsers
        const Document = require("../../models/Document.js");
        const document = await Document.findOneAndUpdate(
          { _id: docId },
          { $addToSet: { associatedUsers: userId } },
          { new: true }
        );
        
        if (!document) {
          throw new Error("Document not found");
        }

        return document;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
};

module.exports = userResolver;