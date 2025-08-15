// backend/test-server.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config();

async function runTests() {
  console.log('🧪 SmartDocs Backend - Comprehensive Test Suite');
  console.log('==============================================\n');

  let testResults = {
    passed: 0,
    failed: 0,
    tests: []
  };

  // Test 1: Environment Variables
  console.log('1️⃣ Testing Environment Variables...');
  const requiredEnvVars = [
    'MONGODB_URI',
    'JWT_SECRET',
    'FIREBASE_API_KEY',
    'FIREBASE_AUTH_DOMAIN',
    'FIREBASE_PROJECT_ID',
    'FIREBASE_STORAGE_BUCKET',
    'FIREBASE_MESSAGING_SENDER_ID',
    'FIREBASE_APP_ID'
  ];

  let envTestPassed = true;
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      console.log(`   ❌ Missing: ${envVar}`);
      envTestPassed = false;
    } else {
      console.log(`   ✅ Found: ${envVar}`);
    }
  }

  if (envTestPassed) {
    console.log('   ✅ All environment variables are set\n');
    testResults.passed++;
  } else {
    console.log('   ❌ Some environment variables are missing\n');
    testResults.failed++;
  }
  testResults.tests.push({ name: 'Environment Variables', passed: envTestPassed });

  // Test 2: MongoDB Connection
  console.log('2️⃣ Testing MongoDB Connection...');
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('   ✅ MongoDB connection successful');
    testResults.passed++;
    testResults.tests.push({ name: 'MongoDB Connection', passed: true });
  } catch (error) {
    console.log(`   ❌ MongoDB connection failed: ${error.message}`);
    testResults.failed++;
    testResults.tests.push({ name: 'MongoDB Connection', passed: false });
  }
  console.log('');

  // Test 3: Model Loading
  console.log('3️⃣ Testing Model Loading...');
  try {
    const User = require('./models/User.js');
    const Document = require('./models/Document.js');
    console.log('   ✅ User model loaded successfully');
    console.log('   ✅ Document model loaded successfully');
    testResults.passed++;
    testResults.tests.push({ name: 'Model Loading', passed: true });
  } catch (error) {
    console.log(`   ❌ Model loading failed: ${error.message}`);
    testResults.failed++;
    testResults.tests.push({ name: 'Model Loading', passed: false });
  }
  console.log('');

  // Test 4: GraphQL Schema
  console.log('4️⃣ Testing GraphQL Schema...');
  try {
    const schema = require('./graphql/schema/index.js');
    console.log('   ✅ GraphQL schema loaded successfully');
    testResults.passed++;
    testResults.tests.push({ name: 'GraphQL Schema', passed: true });
  } catch (error) {
    console.log(`   ❌ GraphQL schema loading failed: ${error.message}`);
    testResults.failed++;
    testResults.tests.push({ name: 'GraphQL Schema', passed: false });
  }
  console.log('');

  // Test 5: GraphQL Resolvers
  console.log('5️⃣ Testing GraphQL Resolvers...');
  try {
    const resolvers = require('./graphql/resolvers/index.js');
    const userResolver = require('./graphql/resolvers/UserResolver.js');
    const documentResolver = require('./graphql/resolvers/DocumentResolver.js');
    
    // Check if resolvers have required properties
    const hasQuery = resolvers.Query && Object.keys(resolvers.Query).length > 0;
    const hasMutation = resolvers.Mutation && Object.keys(resolvers.Mutation).length > 0;
    const hasSubscription = resolvers.Subscription && Object.keys(resolvers.Subscription).length > 0;
    
    console.log(`   ✅ Query resolvers: ${Object.keys(resolvers.Query || {}).length} found`);
    console.log(`   ✅ Mutation resolvers: ${Object.keys(resolvers.Mutation || {}).length} found`);
    console.log(`   ✅ Subscription resolvers: ${Object.keys(resolvers.Subscription || {}).length} found`);
    
    if (hasQuery && hasMutation) {
      console.log('   ✅ GraphQL resolvers loaded successfully');
      testResults.passed++;
      testResults.tests.push({ name: 'GraphQL Resolvers', passed: true });
    } else {
      throw new Error('Missing required resolver types');
    }
  } catch (error) {
    console.log(`   ❌ GraphQL resolvers loading failed: ${error.message}`);
    testResults.failed++;
    testResults.tests.push({ name: 'GraphQL Resolvers', passed: false });
  }
  console.log('');

  // Test 6: Firebase Configuration
  console.log('6️⃣ Testing Firebase Configuration...');
  try {
    const { app } = require('./connections/firebaseconfig.js');
    console.log('   ✅ Firebase app initialized successfully');
    testResults.passed++;
    testResults.tests.push({ name: 'Firebase Configuration', passed: true });
  } catch (error) {
    console.log(`   ❌ Firebase configuration failed: ${error.message}`);
    testResults.failed++;
    testResults.tests.push({ name: 'Firebase Configuration', passed: false });
  }
  console.log('');

  // Test 7: ShareDB Setup
  console.log('7️⃣ Testing ShareDB Setup...');
  try {
    const ShareDB = require('sharedb');
    const richText = require('rich-text');
    const backend = new ShareDB({
      db: require('sharedb-mongo')(process.env.MONGODB_URI, { useUnifiedTopology: true }),
      presence: true,
      doNotForwardSendPresenceErrorsToClient: true,
    });
    console.log('   ✅ ShareDB backend initialized successfully');
    testResults.passed++;
    testResults.tests.push({ name: 'ShareDB Setup', passed: true });
  } catch (error) {
    console.log(`   ❌ ShareDB setup failed: ${error.message}`);
    testResults.failed++;
    testResults.tests.push({ name: 'ShareDB Setup', passed: false });
  }
  console.log('');

  // Test 8: Dependencies Check
  console.log('8️⃣ Testing Required Dependencies...');
  const requiredDeps = [
    'express',
    'cors',
    '@apollo/server',
    'graphql',
    'mongoose',
    'jsonwebtoken',
    'bcrypt',
    // 'firebase',
    'sharedb',
    'ws'
  ];

  let depsTestPassed = true;
  for (const dep of requiredDeps) {
    try {
      require(dep);
      console.log(`   ✅ ${dep} is available`);
    } catch (error) {
      console.log(`   ❌ ${dep} is missing`);
      depsTestPassed = false;
    }
  }

  if (depsTestPassed) {
    console.log('   ✅ All required dependencies are available');
    testResults.passed++;
  } else {
    console.log('   ❌ Some dependencies are missing');
    testResults.failed++;
  }
  testResults.tests.push({ name: 'Dependencies', passed: depsTestPassed });
  console.log('');



  // Summary
  console.log('📊 Test Summary');
  console.log('==============');
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`📈 Success Rate: ${Math.round((testResults.passed / (testResults.passed + testResults.failed)) * 100)}%`);
  console.log('');

  if (testResults.failed === 0) {
    console.log('🎉 All tests passed! Backend is ready to run.');
    console.log('🚀 Run "npm run dev" to start the development server.');
    process.exit(0);
  } else {
    console.log('⚠️  Some tests failed. Please fix the issues before starting the server.');
    console.log('');
    console.log('Failed tests:');
    testResults.tests.filter(test => !test.passed).forEach(test => {
      console.log(`   ❌ ${test.name}`);
    });
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Run the tests
runTests().catch(error => {
  console.error('❌ Test suite failed:', error);
  process.exit(1);
}); 