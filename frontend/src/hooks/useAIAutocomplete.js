import { useState, useCallback, useRef } from 'react';
import { useLazyQuery } from '@apollo/client';
import { GET_SMART_SUGGESTION } from '../queries/AI';

export const useAIAutocomplete = () => {
  // console.log("🤖 useAIAutocomplete hook initialized");
  
  const [suggestion, setSuggestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const debounceTimeoutRef = useRef(null);
  const lastRequestRef = useRef(null);

  const [getSmartSuggestion] = useLazyQuery(GET_SMART_SUGGESTION, {
    fetchPolicy: 'no-cache',
    onCompleted: (data) => {
      // console.log("✅ AI suggestion completed:", data);
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
      // console.log("⏰ Clearing previous debounce timeout");
      clearTimeout(debounceTimeoutRef.current);
    }

    // Clear current suggestion while typing
    setSuggestion('');

    // Create a unique request ID to handle race conditions
    const requestId = Date.now();
    lastRequestRef.current = requestId;
    // console.log("🆔 Created request ID:", requestId);

    // Debounce the API call
    debounceTimeoutRef.current = setTimeout(() => {
      // console.log("⏰ Debounce timeout triggered for request:", requestId);
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

  // console.log("🤖 useAIAutocomplete state:", {
  //   suggestion,
  //   isLoading,
  //   hasDebounceTimeout: !!debounceTimeoutRef.current,
  //   lastRequestId: lastRequestRef.current
  // });

  return {
    suggestion,
    isLoading,
    requestSuggestion,
    clearSuggestion,
    acceptSuggestion,
  };
};


// 🖊 Example Typing Scenario
// Let’s say you are typing "hello" in the editor.

// ⏱ Step 1 — You type "h"
// fullText = "h"

// cursorPosition = 1

// Code flow:

// Log first line:

// js
// Copy code
// console.log("🤖 Requesting AI suggestion:", { fullTextLength: 1, cursorPosition: 1, textAroundCursor: "h" });
// Check for previous timeout

// debounceTimeoutRef.current is null (first time).

// So clearTimeout does nothing.

// Clear current suggestion

// setSuggestion('') → removes any old suggestion.

// Create new request ID

// requestId = 1724593849123 (example number from Date.now()).

// Store it in lastRequestRef.current.

// Schedule timeout

// js
// Copy code
// debounceTimeoutRef.current = setTimeout(..., 1000);
// debounceTimeoutRef.current = 42 (browser gives timeout ID 42).

// ⏱ Step 2 — You type "e" (within 1s)
// Now fullText = "he"

// cursorPosition = 2

// Code flow:

// Log again → new text and cursor position printed.

// Clear previous timeout

// debounceTimeoutRef.current = 42

// clearTimeout(42) → cancels the first scheduled call.

// Reset suggestion → setSuggestion('') again.

// Create new request ID

// requestId = 1724593849800

// Store it in lastRequestRef.current.

// Schedule new timeout

// debounceTimeoutRef.current = 43

// ⏱ Step 3 — You stop typing for >1s
// After 1000ms, setTimeout finally fires:

// js
// Copy code
// console.log("⏰ Debounce timeout triggered for request:", 1724593849800);
// if (lastRequestRef.current === requestId) → true (this is still the latest request)

// setIsLoading(true) → shows spinner/loading state

// Trigger Apollo query:

// js
// Copy code
// getSmartSuggestion({
//   variables: { fullText: "he", cursorPosition: 2 },
// });
// Apollo sends a network request to your GraphQL backend with these variables.

// 🔁 If you typed again before timeout fired:
// The previous timeout would be cleared and never executed — only the very last one runs.
// This is why you don’t spam the backend with requests every keystroke — just once you pause.

