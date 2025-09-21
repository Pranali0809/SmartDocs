import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import QuillCursors from "quill-cursors";
import { randomColor } from "randomcolor";
import "../css/Document.css";
import shareDBConnection from "../connections/Sharedb.js";
import { SuggestionOverlay } from "./SuggestionOverlay.jsx";
import { useQuillEditor } from "../hooks/useQuillEditor.js";

Quill.register("modules/cursors", QuillCursors);

const Document = () => {
  const { docId } = useParams();
  const doc = shareDBConnection.get("collection", docId);
  const presence = shareDBConnection.getDocPresence("collection", docId);


  // Initialize Quill after doc subscription
  const { editorRef, quillRef, initializeQuill, content, suggestionText,   overlayPos,} = useQuillEditor(doc, presence);
  // Subscribe to the doc first
  useEffect(() => {
    doc.subscribe((err) => {
      if (err) throw err;
      initializeQuill();
    });

    return () => {
      quillRef.current = null;
    };
  }, [doc, initializeQuill]);

  return (
    <div className="container">
      <div ref={editorRef}></div>
      <SuggestionOverlay
      editorRef={editorRef}
      suggestionText={suggestionText}
      overlayPos={overlayPos}
/>

    </div>
  );
};

export default Document;
