import { useState, useCallback, useRef } from 'react';
import { useLazyQuery } from '@apollo/client';
import { GET_SMART_SUGGESTION } from '../queries/AI';

export const useAIAutocomplete = () => {
  const [suggestion, setSuggestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const debounceTimeoutRef = useRef(null);
  const lastRequestRef = useRef(null);

  const [getSmartSuggestion] = useLazyQuery(GET_SMART_SUGGESTION, {
    fetchPolicy: 'no-cache',
    onCompleted: (data) => {
      setIsLoading(false);
      if (data?.getSmartSuggestion?.success && data.getSmartSuggestion.suggestion) {
        setSuggestion(data.getSmartSuggestion.suggestion);
      } else {
        setSuggestion('');
      }
    },
    onError: (error) => {
      console.error('AI Suggestion Error:', error);
      setIsLoading(false);
      setSuggestion('');
    },
  });

  const requestSuggestion = useCallback((fullText, cursorPosition) => {
    // Clear previous timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Clear current suggestion while typing
    setSuggestion('');

    // Create a unique request ID to handle race conditions
    const requestId = Date.now();
    lastRequestRef.current = requestId;

    // Debounce the API call
    debounceTimeoutRef.current = setTimeout(() => {
      // Only proceed if this is still the latest request
      if (lastRequestRef.current === requestId) {
        setIsLoading(true);
        getSmartSuggestion({
          variables: {
            fullText,
            cursorPosition,
          },
        });
      }
    }, 1000); // 1 second debounce
  }, [getSmartSuggestion]);

  const clearSuggestion = useCallback(() => {
    setSuggestion('');
    setIsLoading(false);
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
  }, []);

  const acceptSuggestion = useCallback(() => {
    const currentSuggestion = suggestion;
    setSuggestion('');
    return currentSuggestion;
  }, [suggestion]);

  return {
    suggestion,
    isLoading,
    requestSuggestion,
    clearSuggestion,
    acceptSuggestion,
  };
};