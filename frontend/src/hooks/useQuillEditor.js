// hooks/useQuillEditor.js
import "../css/Document.css";

import { useCallback, useRef, useState, useEffect } from "react";
import Quill from "quill";
import QuillCursors from "quill-cursors";
import { randomColor } from "randomcolor";
import { useAIAutocomplete } from "./useAIAutocomplete";

Quill.register("modules/cursors", QuillCursors);

export const useQuillEditor = (doc, presence) => {
  console.log("🎯 useQuillEditor hook called with:", { doc: !!doc, presence: !!presence });
  
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const suggestionRangeRef = useRef(null);

  const [content, setContent] = useState("");
  const [overlayPos, setOverlayPos] = useState({ top: 0, left: 0 });

  const {
    suggestion: aiSuggestion,
    isLoading,
    requestSuggestion,
    clearSuggestion,
    acceptSuggestion,
  } = useAIAutocomplete();

  console.log("🤖 AI Autocomplete state:", {
    aiSuggestion,
    isLoading,
    requestSuggestion: !!requestSuggestion,
    clearSuggestion: !!clearSuggestion,
    acceptSuggestion: !!acceptSuggestion
  });

  // Update overlay position when AI suggestion changes
  useEffect(() => {
    console.log("📍 Updating overlay position for suggestion:", aiSuggestion);
    if (aiSuggestion && quillRef.current) {
      const quill = quillRef.current;
      const range = quill.getSelection();
      if (range) {
        const bounds = quill.getBounds(range.index);
        const newPos = { 
          top: bounds.top + bounds.height + 5, 
          left: bounds.left 
        };
        console.log("📍 New overlay position:", newPos);
        setOverlayPos(newPos);
      }
    }
  }, [aiSuggestion]);

  const initializeQuill = useCallback(() => {
    console.log("🚀 Initializing Quill editor...");
    
    if (!editorRef.current) return;

    // Clear previous editor
    editorRef.current.innerHTML = "";
    const editorDiv = document.createElement("div");
    editorRef.current.appendChild(editorDiv);

    console.log("📝 Creating Quill instance...");
    // Create new Quill editor
    quillRef.current = new Quill(editorDiv, {
      theme: "snow",
      modules: { cursors: true },
    });

    const quill = quillRef.current;
    console.log("✅ Quill instance created:", !!quill);

    // Load initial document content
    if (doc.data) {
      console.log("📄 Loading initial doc data:", doc.data);
      quill.setContents(doc.data);
    } else {
      console.log("📄 No initial doc data, setting empty content");
      quill.setContents([{ insert: '\n' }]);
    }

    setContent(quill.root.innerHTML);
    console.log("📝 Initial content set:", quill.root.innerHTML.length, "characters");

    // Cursors
    const cursors = quill.getModule("cursors");
    cursors.createCursor("cursor", "Pranali", "pink");
    console.log("👆 Cursors module initialized");

    const localPresence = presence.create();
    console.log("👥 Local presence created");

    // Handle text changes
    quill.on("text-change", (delta, oldDelta, source) => {
      console.log("📝 Text changed:", { source, delta });
      
      if (source === "user") {
        doc.submitOp(delta, { source: quill }, (err) => {
          if (err) {
            console.error("❌ Submit OP error:", err);
          } else {
            console.log("✅ Operation submitted successfully");
          }
        });
        setContent(quill.root.innerHTML);

        // Get current text and cursor position for AI suggestions
        const range = quill.getSelection();
        if (range) {
          const fullText = quill.getText();
          const cursorPosition = range.index;
          
          console.log("🎯 Cursor info:", { 
            cursorPosition, 
            fullTextLength: fullText.length,
            textAroundCursor: fullText.substring(Math.max(0, cursorPosition - 10), cursorPosition + 10)
          });
          
          // Only request suggestion if there's meaningful text
          if (fullText.trim().length > 2) {
            // Get the current word being typed
            const textBeforeCursor = fullText.substring(0, cursorPosition);
            const words = textBeforeCursor.split(/\s+/);
            const currentWord = words[words.length - 1] || '';
            
            console.log("🔤 Current word analysis:", {
              currentWord,
              wordLength: currentWord.length,
              lastFewWords: words.slice(-3)
            });
            
            // Only request if current word has at least 2 characters
            if (currentWord.length >= 2) {
              console.log("🤖 Requesting AI suggestion...");
              requestSuggestion(fullText, cursorPosition);
            } else {
              console.log("🚫 Word too short, clearing suggestion");
              clearSuggestion();
            }
          } else {
            console.log("🚫 Text too short, not requesting suggestion");
          }
        }
      }
    });

    // Apply remote changes
    doc.on("op", (op, source) => {
      console.log("📡 Remote operation received:", { op, source: source === quill ? 'local' : 'remote' });
      if (quill && source !== quill) {
        quill.updateContents(op);
      }
    });

    // Handle Tab key for accepting AI suggestions
    quill.keyboard.addBinding({ key: 9 }, (range, context) => {
      console.log("⌨️ Tab key pressed, AI suggestion:", aiSuggestion);
      if (aiSuggestion) {
        const currentRange = quill.getSelection();
        if (currentRange) {
          console.log("✅ Accepting AI suggestion:", aiSuggestion);
          quill.insertText(currentRange.index, acceptSuggestion(), "user");
          // Move cursor to end of inserted text
          quill.setSelection(currentRange.index + aiSuggestion.length);
        }
        return false; // prevent default tab
      }
      return true; // allow default tab behavior
    });

    // Handle Escape key to dismiss suggestions
    quill.keyboard.addBinding({ key: 27 }, () => {
      console.log("⌨️ Escape key pressed");
      if (aiSuggestion) {
        console.log("🚫 Clearing AI suggestion");
        clearSuggestion();
        return false;
      }
      return true;
    });

    // Handle presence
    console.log("👥 Setting up presence...");
    presence.subscribe();
    presence.on("receive", (id, cursorData) => {
      console.log("👥 Presence received:", { id, cursorData });
      if (cursorData.range === null) {
        console.log("👋 Remote user left");
      } else {
        const name = cursorData?.name || "Anonymous";
        cursors.createCursor(id, name, randomColor());
        cursors.moveCursor(id, cursorData.range);
        console.log("👆 Remote cursor updated:", { id, name });
      }
    });

    // Update presence when selection changes
    quill.on("selection-change", (range, oldRange, source) => {
      if (source !== "user") return;
      if (!range) return;

      setTimeout(() => cursors.moveCursor("cursor", range));
      localPresence.submit({ range, name: "Pranali" }, (error) => {
        if (error) {
          console.error("❌ Presence submit error:", error);
        } else {
          console.log("👥 Presence updated successfully");
        }
      });
    });

    // Clear suggestions when selection changes (user moves cursor)
    quill.on("selection-change", (range, oldRange, source) => {
      if (source === "user" && range && oldRange && range.index !== oldRange.index) {
        console.log("👆 Cursor moved, clearing suggestions");
        clearSuggestion();
      }
    });
    
    console.log("✅ Quill editor fully initialized");
  }, [doc, presence, requestSuggestion, clearSuggestion, acceptSuggestion, aiSuggestion]);

  console.log("🎯 useQuillEditor returning:", {
    editorRef: !!editorRef,
    quillRef: !!quillRef,
    initializeQuill: !!initializeQuill,
    content: content?.length || 0,
    suggestionText: aiSuggestion,
    overlayPos,
    isLoading
  });

  return { editorRef, quillRef, initializeQuill, content, suggestionText: aiSuggestion, overlayPos, isLoading };
};
