import gql from 'graphql-tag';

const GET_AI_SUGGESTION = gql`
  query GetAISuggestion($context: String, $currentWord: String) {
    getAISuggestion(context: $context, currentWord: $currentWord) {
      suggestion
      success
      error
    }
  }
`;

const GET_SMART_SUGGESTION = gql`
  query GetSmartSuggestion($fullText: String!, $cursorPosition: Int!) {
    getSmartSuggestion(fullText: $fullText, cursorPosition: $cursorPosition) {
      suggestion
      success
      error
    }
  }
`;

export { GET_AI_SUGGESTION, GET_SMART_SUGGESTION };