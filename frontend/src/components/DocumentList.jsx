import React, { useEffect, useState } from 'react';
import { useQuery,useMutation } from '@apollo/client';
import { GET_DOCUMENTS } from '../queries/Document';
import { DELETE_DOCUMENT } from '../queries/Document';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

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
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Documents Associated with User {userId}
      </h2>
      <button
        onClick={getDocuments}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        display documents
      </button>
      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">Error: {error.message}</p>}
      <ul className="space-y-3">
        {(documents.length ? documents : data?.getDocuments || []).map((document) => (
          <li
            key={document._id}
            
            className="flex items-center justify-between cursor-pointer p-4 bg-gray-100 rounded hover:bg-blue-100 transition"
          >
            <div onClick={() => openDocument(document._id)} className="flex-1">
            <h3 className="text-lg font-semibold text-gray-700">{document.title}</h3>
          </div>
          <div>
            <button
            onClick={() => handleDeleteDocument(document._id)}
            className="ml-4 text-red-500 hover:text-red-700"
            title="Delete Document"
          >
            {/* Bin SVG icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          </div>
          </li>
          
        ))}
      </ul>
    </div>
  );
};

export default DocumentList;