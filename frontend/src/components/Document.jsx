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
import { useCookies } from 'react-cookie';
import { useNavigate } from "react-router-dom";
import LogOutButton from './LogOutButton';

Quill.register("modules/cursors", QuillCursors);

const Document = () => {
  const { docId } = useParams();
  const navigate = useNavigate();
  const [cookies] = useCookies(['authToken']);
  const doc = shareDBConnection.get("collection", docId);
  const presence = shareDBConnection.getDocPresence("collection", docId);

  console.log("🚀 Document Component - Starting with docId:", docId);
  console.log("🔐 Auth token exists:", !!cookies.authToken);
  console.log("📄 ShareDB doc:", doc);
  console.log("👥 ShareDB presence:", presence);

  // Initialize Quill after doc subscription
  const { editorRef, quillRef, initializeQuill, content, suggestionText, overlayPos, isLoading } = useQuillEditor(doc, presence);
  
  console.log("🎯 useQuillEditor returned:", {
    editorRef: !!editorRef,
    quillRef: !!quillRef,
    initializeQuill: !!initializeQuill,
    content: content?.length || 0,
    suggestionText,
    overlayPos,
    isLoading
  });

  // Verify authentication
  useEffect(() => {
    console.log("🔍 Checking authentication...");
    const authToken = cookies.authToken;
    if (!authToken) {
      console.log("❌ No auth token found, redirecting to login");
      navigate('/');
      return;
    }
    console.log("✅ Auth token found:", authToken.substring(0, 20) + "...");
  }, [cookies.authToken, navigate]);
  // Subscribe to the doc first
  useEffect(() => {
    console.log("📡 Setting up ShareDB subscription for doc:", docId);
    
    doc.subscribe((err) => {
      if (err) {
        console.error("❌ ShareDB subscription error:", err);
        return;
      }
      console.log("✅ ShareDB doc subscribed successfully");
      console.log("📄 Doc data:", doc.data);
      initializeQuill();
    });

    return () => {
      console.log("🧹 Cleaning up Document component");
      quillRef.current = null;
    };
  }, [doc, initializeQuill]);

  return (
    <>
      <LogOutButton />
      <div className="container">
        <div className="title-bar">
          <input
            className="title"
            defaultValue="Untitled Document"
            placeholder="Document Title"
          />
          <div className="debug-info" style={{ fontSize: '12px', color: '#666' }}>
            Doc ID: {docId} | Connected: {doc.type ? '✅' : '❌'}
          </div>
        </div>
        
        <div className="editor-container" style={{ position: 'relative' }}>
          <div ref={editorRef} className="editor-wrapper">
            {!editorRef.current && (
              <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                Loading editor...
              </div>
            )}
          </div>
          
          <SuggestionOverlay
            editorRef={editorRef}
            suggestionText={suggestionText}
            overlayPos={overlayPos}
            isLoading={isLoading}
          />
        </div>
        
        {/* Debug Panel */}
        <div style={{ 
          position: 'fixed', 
          bottom: '10px', 
          right: '10px', 
          background: 'rgba(0,0,0,0.8)', 
          color: 'white', 
          padding: '10px', 
          borderRadius: '5px',
          fontSize: '12px',
          maxWidth: '300px'
        }}>
          <div>🔧 Debug Info:</div>
          <div>Editor Ref: {editorRef.current ? '✅' : '❌'}</div>
          <div>Quill Ref: {quillRef.current ? '✅' : '❌'}</div>
          <div>Content Length: {content?.length || 0}</div>
          <div>AI Suggestion: {suggestionText || 'None'}</div>
          <div>AI Loading: {isLoading ? '⏳' : '✅'}</div>
          <div>ShareDB Connected: {doc.type ? '✅' : '❌'}</div>
        </div>
      </div>
    </>
  );
};

export default Document;
