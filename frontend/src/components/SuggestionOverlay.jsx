// components/GhostOverlay.js
import React from "react";
import "../css/Document.css";

export const SuggestionOverlay = ({ editorRef, suggestionText, overlayPos }) => {
  if (!editorRef.current || !suggestionText) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: overlayPos.top,
        left: overlayPos.left,
        background: "rgba(0,0,0,0.75)",
        color: "white",
        padding: "4px 8px",
        borderRadius: "4px",
        fontSize: "12px",
        pointerEvents: "none",
      }}
    >
      {suggestionText}
    </div>
  );
};
