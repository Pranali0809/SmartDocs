import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import store from './store';
import { Provider } from 'react-redux';

import {ApolloClient, InMemoryCache,ApolloProvider,createHttpLink } from '@apollo/client';
import {persistStore,} from "redux-persist";
import {PersistGate} from "redux-persist/integration/react";


const httpLink = createHttpLink({
  // uri: 'https://collab-doc-obej.onrender.com/graphql',
  uri: 'http://localhost:4200/graphql',
  credentials: 'include',
});


const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistStore(store)}>
        <App />
      </PersistGate>
    </Provider>
    </ApolloProvider>
  </React.StrictMode>
);
