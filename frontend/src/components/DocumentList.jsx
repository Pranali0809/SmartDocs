import React, { useEffect, useState } from 'react';
import { useQuery,useMutation } from '@apollo/client';
import { GET_DOCUMENTS } from '../queries/Document';
import { DELETE_DOCUMENT } from '../queries/Document';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import '../css/DocumentList.css';

const DocumentList = ({ document }) => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const userId = useSelector((state) => state.auth.userId);
  const { data, loading, error, refetch } = useQuery(GET_DOCUMENTS, {
    variables: { userId },
    skip: !userId,
  });
  const [deleteDocumentMutation] = useMutation(DELETE_DOCUMENT)

  const getDocuments = async () => {
    try {
      if (!userId) {
        throw new Error("User ID is required");
      }
      console.log("Fetching documents for user:", userId);
      const { data } = await refetch({ userId });
      if (!data || !data.getDocuments) {
        throw new Error("No documents found for this user");
      }
      setDocuments(data.getDocuments);
      console.log(data.getDocuments);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteDocument = async (docId) => {
    try {
      await deleteDocumentMutation({ variables: { docId } });
      setDocuments((docs) => docs.filter((doc) => doc._id !== docId));
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };



  const openDocument = (docId) => {
    navigate(`/smartdoc/${docId}`);
  };

  useEffect(() => {
    getDocuments();
  }, [document]);

  return (
    <div className="document-list-container">
      {loading && <p className="loading-message">Loading documents...</p>}
      {error && <p className="error-message">Error: {error.message}</p>}
      <div className="documents-grid">
        {(documents.length ? documents : data?.getDocuments || []).map((document) => (
          <div
            key={document._id}
            className="document-card"
            onClick={() => openDocument(document._id)}
          >
            <div className="document-preview">
              <div className="document-icon">📄</div>
            </div>
            <div className="document-info">
              <h3 className="document-title">{document.title || 'Untitled Document'}</h3>
              <div className="document-meta">
                <span className="doc-date">Opened {new Date().toLocaleDateString()}</span>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteDocument(document._id);
              }}
              className="delete-btn"
              title="Delete Document"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentList;