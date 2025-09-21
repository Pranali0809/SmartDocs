// components/GhostOverlay.js
import React from "react";
import "../css/Document.css";

export const SuggestionOverlay = ({ editorRef, suggestionText, overlayPos, isLoading }) => {
  if (!editorRef.current || !suggestionText) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: overlayPos.top,
        left: overlayPos.left,
        background: isLoading ? "rgba(100,100,100,0.8)" : "rgba(0,0,0,0.75)",
        color: "white",
        padding: "4px 8px",
        borderRadius: "4px",
        fontSize: "12px",
        pointerEvents: "none",
        maxWidth: "300px",
        wordWrap: "break-word",
        zIndex: 1000,
      }}
    >
      {isLoading ? (
        <span style={{ fontStyle: "italic" }}>Thinking...</span>
      ) : (
        <>
          <span style={{ opacity: 0.7, fontSize: "10px" }}>TAB to accept • ESC to dismiss</span>
          <br />
          <span style={{ fontStyle: "italic" }}>{suggestionText}</span>
        </>
      )}
    </div>
  );
};
