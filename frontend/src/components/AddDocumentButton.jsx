import React from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_DOCUMENT } from '../queries/Document';
import{useSelector} from 'react-redux';

const AddDocBut = ({setDocument}) => {
const userId = useSelector((state) => state.auth.userId);
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
    } catch (error) {
      console.error(error);
    }
  }
  return (
      <div className="w-32 h-32 bg-transparent border-dotted border-2 border-black rounded-md flex flex-col items-center justify-center text-black cursor-pointer"
      onClick={addDocument}>
        <div className="text-3xl mb-2">+</div>
        <div className="text-center">Add Document</div>
      </div>
  );
};
export default AddDocBut;