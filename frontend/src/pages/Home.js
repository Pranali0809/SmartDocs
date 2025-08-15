import AddDocumentButton from '../components/AddDocumentButton'
import DocumentList from '../components/DocumentList'
import Document from '../components/Document'
import { useState,useEffect } from 'react'
import { useParams, useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';
import LogOutButton from '../components/LogOutButton';

const Home = () => {
  const [document,setDocument]=useState([]);
  const [cookies, setCookie] = useCookies(['authToken']);
  const navigate=useNavigate();
  useEffect(() => {
    verifyToken()

  }, [])
  
  const verifyToken = () => {
    const authToken = cookies["authToken"];
    console.log(authToken);

    if (!authToken) {
      navigate(`/`);
  };
}
  return (
    <>

      <LogOutButton/>
    <div className='p-4 h-screen w-screen'>
      <AddDocumentButton  setDocument={setDocument}/>
      <DocumentList document={document}/>
      {/* <Document/> */}
    </div>
    </>
  )
}


export default Home
