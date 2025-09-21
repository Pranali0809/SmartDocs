// hooks/useQuillEditor.js
import "../css/Document.css";

import { useCallback, useRef, useState, useEffect } from "react";
import Quill from "quill";
import QuillCursors from "quill-cursors";
import { randomColor } from "randomcolor";
import { useAIAutocomplete } from "./useAIAutocomplete";

Quill.register("modules/cursors", QuillCursors);

export const useQuillEditor = (doc, presence) => {
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

  // Update overlay position when AI suggestion changes
  useEffect(() => {
    if (aiSuggestion && quillRef.current) {
      const quill = quillRef.current;
      const range = quill.getSelection();
      if (range) {
        const bounds = quill.getBounds(range.index);
        setOverlayPos({ 
          top: bounds.top + bounds.height + 5, 
          left: bounds.left 
        });
      }
    }
  }, [aiSuggestion]);

  const initializeQuill = useCallback(() => {
    if (!editorRef.current) return;

    // Clear previous editor
    editorRef.current.innerHTML = "";
    const editorDiv = document.createElement("div");
    editorRef.current.appendChild(editorDiv);

    // Create new Quill editor
    quillRef.current = new Quill(editorDiv, {
      theme: "snow",
      modules: { cursors: true },
    });

    const quill = quillRef.current;

    // Load initial document content
    if (doc.data) {
      quill.setContents(doc.data);
    }

    setContent(quill.root.innerHTML);

    // Cursors
    const cursors = quill.getModule("cursors");
    cursors.createCursor("cursor", "Pranali", "pink");

    const localPresence = presence.create();

    // Handle text changes
    quill.on("text-change", (delta, oldDelta, source) => {
      if (source === "user") {
        doc.submitOp(delta, { source: quill }, (err) => {
          if (err) console.error("Submit OP returned an error:", err);
        });
        setContent(quill.root.innerHTML);

        // Get current text and cursor position for AI suggestions
        const range = quill.getSelection();
        if (range) {
          const fullText = quill.getText();
          const cursorPosition = range.index;
          
          // Only request suggestion if there's meaningful text
          if (fullText.trim().length > 2) {
            // Get the current word being typed
            const textBeforeCursor = fullText.substring(0, cursorPosition);
            const words = textBeforeCursor.split(/\s+/);
            const currentWord = words[words.length - 1] || '';
            
            // Only request if current word has at least 2 characters
            if (currentWord.length >= 2) {
              requestSuggestion(fullText, cursorPosition);
            } else {
              clearSuggestion();
            }
          }
        }
      }
    });

    // Apply remote changes
    doc.on("op", (op, source) => {
      if (quill && source !== quill) {
        quill.updateContents(op);
      }
    });

    // Handle Tab key for accepting AI suggestions
    quill.keyboard.addBinding({ key: 9 }, (range, context) => {
      if (aiSuggestion) {
        const currentRange = quill.getSelection();
        if (currentRange) {
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
      if (aiSuggestion) {
        clearSuggestion();
        return false;
      }
      return true;
    });

    // Handle presence
    presence.subscribe();
    presence.on("receive", (id, cursorData) => {
      if (cursorData.range === null) {
        console.log("remote left");
      } else {
        const name = cursorData?.name || "Anonymous";
        cursors.createCursor(id, name, randomColor());
        cursors.moveCursor(id, cursorData.range);
      }
    });

    // Update presence when selection changes
    quill.on("selection-change", (range, oldRange, source) => {
      if (source !== "user") return;
      if (!range) return;

      setTimeout(() => cursors.moveCursor("cursor", range));
      localPresence.submit({ range, name: "Pranali" }, (error) => {
        if (error) throw error;
      });
    });

    // Clear suggestions when selection changes (user moves cursor)
    quill.on("selection-change", (range, oldRange, source) => {
      if (source === "user" && range && oldRange && range.index !== oldRange.index) {
        clearSuggestion();
      }
    });
  }, [doc, presence, requestSuggestion, clearSuggestion, acceptSuggestion, aiSuggestion]);

  return { editorRef, quillRef, initializeQuill, content, suggestionText: aiSuggestion, overlayPos, isLoading };
};
