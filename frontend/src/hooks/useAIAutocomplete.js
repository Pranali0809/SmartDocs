import { useState, useCallback, useRef } from 'react';
import { useLazyQuery } from '@apollo/client';
import { GET_SMART_SUGGESTION } from '../queries/AI';

export const useAIAutocomplete = () => {
  console.log("🤖 useAIAutocomplete hook initialized");
  
  const [suggestion, setSuggestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const debounceTimeoutRef = useRef(null);
  const lastRequestRef = useRef(null);

  const [getSmartSuggestion] = useLazyQuery(GET_SMART_SUGGESTION, {
    fetchPolicy: 'no-cache',
    onCompleted: (data) => {
      console.log("✅ AI suggestion completed:", data);
      setIsLoading(false);
      if (data?.getSmartSuggestion?.success && data.getSmartSuggestion.suggestion) {
        console.log("💡 Setting AI suggestion:", data.getSmartSuggestion.suggestion);
        setSuggestion(data.getSmartSuggestion.suggestion);
      } else {
        console.log("🚫 No valid suggestion received");
        setSuggestion('');
      }
    },
    onError: (error) => {
      console.error('❌ AI Suggestion Error:', error);
      setIsLoading(false);
      setSuggestion('');
    },
  });

  const requestSuggestion = useCallback((fullText, cursorPosition) => {
    console.log("🤖 Requesting AI suggestion:", { 
      fullTextLength: fullText.length, 
      cursorPosition,
      textAroundCursor: fullText.substring(Math.max(0, cursorPosition - 20), cursorPosition + 20)
    });
    
    // Clear previous timeout
    if (debounceTimeoutRef.current) {
      console.log("⏰ Clearing previous debounce timeout");
      clearTimeout(debounceTimeoutRef.current);
    }

    // Clear current suggestion while typing
    setSuggestion('');

    // Create a unique request ID to handle race conditions
    const requestId = Date.now();
    lastRequestRef.current = requestId;
    console.log("🆔 Created request ID:", requestId);

    // Debounce the API call
    debounceTimeoutRef.current = setTimeout(() => {
      console.log("⏰ Debounce timeout triggered for request:", requestId);
      // Only proceed if this is still the latest request
      if (lastRequestRef.current === requestId) {
        console.log("🚀 Making AI API call...");
        setIsLoading(true);
        getSmartSuggestion({
          variables: {
            fullText,
            cursorPosition,
          },
        });
      } else {
        console.log("🚫 Request outdated, skipping API call");
      }
    }, 1000); // 1 second debounce
  }, [getSmartSuggestion]);

  const clearSuggestion = useCallback(() => {
    console.log("🧹 Clearing AI suggestion");
    setSuggestion('');
    setIsLoading(false);
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
  }, []);

  const acceptSuggestion = useCallback(() => {
    console.log("✅ Accepting AI suggestion:", suggestion);
    const currentSuggestion = suggestion;
    setSuggestion('');
    return currentSuggestion;
  }, [suggestion]);

  console.log("🤖 useAIAutocomplete state:", {
    suggestion,
    isLoading,
    hasDebounceTimeout: !!debounceTimeoutRef.current,
    lastRequestId: lastRequestRef.current
  });

  return {
    suggestion,
    isLoading,
    requestSuggestion,
    clearSuggestion,
    acceptSuggestion,
  };
};