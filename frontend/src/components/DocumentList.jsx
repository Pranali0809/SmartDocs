import React, { useEffect,useState } from 'react'
import { useMutation } from '@apollo/client';
import { GET_DOCUMENTS } from '../queries/Document';
import{useSelector} from 'react-redux';
import { useNavigate } from 'react-router-dom';
const DocumentList = ({document}) => {
    const navigate = useNavigate(); 
    const [documents, setDocuments] = useState([]);
    const userId = useSelector((state) => state.auth.userId);
    const [getDocumentMutation] = useMutation(GET_DOCUMENTS);

    const getDocuments =async()=>{

        try {
            const { data } = await getDocumentMutation({
              variables: {
                userId,
              }
            });
            console.log(data.getDocuments);
            setDocuments(data.getDocuments);

          } catch (error) {
            console.error(error);
          }
    }

    const openDocument = (docId) => {
      // Navigate to QuillSetup component with the document id as a parameter
      navigate(`/smartdoc/${docId}`);
    };
  
    useEffect(() => {
        getDocuments();
      },[document]);
  return (
    <div>
      <h2>Documents Associated with User {userId}</h2>
      <button onClick={getDocuments}>hiii</button>
      <ul>
       
        {documents && documents.map(document => (
          <li key={document._id} onClick={() => openDocument(document._id)}>
            <h3>{document.title}</h3>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DocumentList
