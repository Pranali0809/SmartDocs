import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import QuillCursors from "quill-cursors";
import { randomColor } from "randomcolor";
import "../css/Document.css";
import shareDBConnection from "../connections/Sharedb.js";

Quill.register("modules/cursors", QuillCursors);

const Document = () => {
  const { docId } = useParams();
  const doc = shareDBConnection.get("collection", docId);
  console.log("document:", doc);
  const presence = shareDBConnection.getDocPresence("collection", docId);

  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const [content, setContent] = useState("");

  // Initialize Quill after doc subscription
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
    </div>
  );
};

export default Document;
