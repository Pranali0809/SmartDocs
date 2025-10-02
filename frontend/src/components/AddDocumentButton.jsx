import React from 'react';
import {useNavigate} from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { CREATE_DOCUMENT } from '../queries/Document';
import{useSelector} from 'react-redux';
import '../css/AddDocumentButton.css';

const AddDocBut = ({setDocument}) => {
const userId = useSelector((state) => state.auth.userId);
const navigate = useNavigate();
console.log(userId);
  const [createDocumentMutation] = useMutation(CREATE_DOCUMENT);  
  const addDocument=async()=>{
    try {
      const { data } = await createDocumentMutation({
        variables: {
          userId: userId,
        }
      });
      console.log(data.createDocument);
      setDocument(data.createDocument);
      // navigate(`/smartdoc/${data.createDocument._id}`);
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <button className="add-document-btn" onClick={addDocument}>
      <span className="add-icon">+</span>
      <span className="add-label">New</span>
    </button>
  );
};
export default AddDocBut;