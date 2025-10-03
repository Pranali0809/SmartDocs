import { gql } from '@apollo/client';

export const RAG_QUERY = gql`
  query RagQuery($content: String!, $question: String!) {
    ragQuery(content: $content, question: $question) {
      success
      answer
      context
      timestamp
      error
    }
  }
`;

export const RAG_SUMMARIZE = gql`
  query RagSummarize($content: String!) {
    ragSummarize(content: $content) {
      success
      summary
      statistics {
        word_count
        character_count
        original_length
      }
      timestamp
      error
    }
  }
`;

export const RAG_ANALYZE = gql`
  query RagAnalyze($content: String!) {
    ragAnalyze(content: $content) {
      success
      word_count
      sentence_count
      character_count
      average_word_length
      top_words {
        word
        count
      }
      timestamp
      error
    }
  }
`;

export const RAG_HEALTH = gql`
  query RagHealth {
    ragHealth {
      success
      status
      error
    }
  }
`;
