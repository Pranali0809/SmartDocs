import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import QuillCursors from "quill-cursors";
import "../css/Document.css";
import shareDBConnection from "../connections/Sharedb.js";
import { SuggestionOverlay } from "./SuggestionOverlay.jsx";
import { useQuillEditor } from "../hooks/useQuillEditor.js";
import { useCookies } from 'react-cookie';
import UserProfileSettings from './UserProfileSettings';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import DocumentStats from './DocumentStats';
import CollaborationChat from './CollaborationChat';
import AIChartPanel from './AIChartPanel';

Quill.register("modules/cursors", QuillCursors);

const Document = () => {
  const { docId } = useParams();
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(['authToken']);
  const doc = shareDBConnection.get("collection", docId);
  const presence = shareDBConnection.getDocPresence("collection", docId);

  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [userSettings, setUserSettings] = useState({
    displayName: 'User',
    cursorColor: '#4285f4',
    profilePhoto: ''
  });
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [aiPanelOpen, setAIPanelOpen] = useState(false);
  const [documentOpenedAt] = useState(Date.now());

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
    // console.log("🔍 Checking authentication...");
    const authToken = cookies.authToken;
    if (!authToken) {
      // console.log("❌ No auth token found, redirecting to login");
      navigate('/');
      return;
    }
    // console.log("✅ Auth token found:", authToken.substring(0, 20) + "...");
  }, [cookies.authToken, navigate]);
  // Subscribe to the doc first
  useEffect(() => {
    // console.log("📡 Setting up ShareDB subscription for doc:", docId);
    
    doc.subscribe((err) => {
      if (err) {
        // console.error("❌ ShareDB subscription error:", err);
        return;
      }
      // console.log("✅ ShareDB doc subscribed successfully");
      // console.log("📄 Doc data:", doc.data);
      initializeQuill();
    });

    return () => {
      // console.log("🧹 Cleaning up Document component");
      quillRef.current = null;
    };
  }, [doc, initializeQuill]);

  const handleLogout = () => {
    removeCookie('authToken');
    navigate('/');
  };

  const handleUpdateSettings = (newSettings) => {
    setUserSettings(newSettings);
  };

  return (
    <>
      <header className="document-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate('/home')}>
            ←
          </button>
          <input
            className="document-title-input"
            defaultValue="Untitled Document"
            placeholder="Document Title"
          />
        </div>
        <div className="header-right">
          <div className="collaborators-avatars">
            <div className="avatar" style={{ backgroundColor: '#4285f4' }}>J</div>
            <div className="avatar" style={{ backgroundColor: '#ea4335' }}>S</div>
          </div>
          <button className="share-btn">Share</button>
          <button
            className="profile-btn"
            onClick={() => setShowProfileSettings(true)}
          >
            {userSettings.profilePhoto ? (
              <img src={userSettings.profilePhoto} alt="Profile" />
            ) : (
              <div className="profile-avatar" style={{ backgroundColor: userSettings.cursorColor }}>
                {userSettings.displayName.charAt(0)}
              </div>
            )}
          </button>
        </div>
      </header>

      <LeftSidebar
        isCollapsed={leftSidebarCollapsed}
        onToggle={() => setLeftSidebarCollapsed(!leftSidebarCollapsed)}
      />

      <RightSidebar
        isCollapsed={rightSidebarCollapsed}
        onToggle={() => setRightSidebarCollapsed(!rightSidebarCollapsed)}
      />

      <main className={`document-main ${
        leftSidebarCollapsed ? 'left-collapsed' : ''
      } ${
        rightSidebarCollapsed ? 'right-collapsed' : ''
      }`}>
        <div className="editor-container">
          <div ref={editorRef} className="editor-wrapper">
            {!editorRef.current && (
              <div className="loading-editor">
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
      </main>

      <DocumentStats
        content={content}
        createdAt={Date.now() - 86400000}
        openedAt={documentOpenedAt}
      />

      <CollaborationChat
        isOpen={chatOpen}
        onToggle={() => setChatOpen(!chatOpen)}
        currentUser={userSettings}
      />

      <AIChartPanel
        isOpen={aiPanelOpen}
        onToggle={() => setAIPanelOpen(!aiPanelOpen)}
        documentContent={content}
      />

      <UserProfileSettings
        isOpen={showProfileSettings}
        onClose={() => setShowProfileSettings(false)}
        userSettings={userSettings}
        onUpdateSettings={handleUpdateSettings}
      />
    </>
  );
};

export default Document;
