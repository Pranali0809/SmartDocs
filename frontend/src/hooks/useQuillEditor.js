// hooks/useQuillEditor.js
import "../css/Document.css";

import { useCallback, useRef, useState } from "react";
import Quill from "quill";
import QuillCursors from "quill-cursors";
import { randomColor } from "randomcolor";

Quill.register("modules/cursors", QuillCursors);

export const useQuillEditor = (doc, presence) => {
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const [content, setContent] = useState("");

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
      console.log("Loaded document data:", doc.data);
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
      }
    });

    // Apply remote changes
    doc.on("op", (op, source) => {
      if (quill && source !== quill) {
        quill.updateContents(op);
      }
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
  }, [doc, presence]);

  return { editorRef, quillRef, initializeQuill, content };
};
