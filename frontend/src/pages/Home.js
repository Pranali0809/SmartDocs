import AddDocumentButton from '../components/AddDocumentButton'
import DocumentList from '../components/DocumentList'
import UserProfileSettings from '../components/UserProfileSettings'
import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';
import '../css/Home.css';

const Home = () => {
  const [document, setDocument] = useState([]);
  const [cookies, setCookie, removeCookie] = useCookies(['authToken']);
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [userSettings, setUserSettings] = useState({
    displayName: 'User',
    cursorColor: '#4285f4',
    profilePhoto: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    verifyToken();
  }, [])

  const verifyToken = () => {
    const authToken = cookies["authToken"];
    if (!authToken) {
      navigate(`/`);
    }
  }

  const handleLogout = () => {
    removeCookie('authToken');
    navigate('/');
  };

  const handleUpdateSettings = (newSettings) => {
    setUserSettings(newSettings);
  };

  return (
    <div className='home-container'>
      <header className='home-header'>
        <div className='header-left'>
          <div className='logo-section'>
            <div className='logo-icon'>📄</div>
            <h1 className='app-title'>SmartDocs</h1>
          </div>
        </div>
        <div className='header-right'>
          <button
            className='profile-btn'
            onClick={() => setShowProfileSettings(true)}
          >
            {userSettings.profilePhoto ? (
              <img src={userSettings.profilePhoto} alt='Profile' />
            ) : (
              <div className='profile-avatar' style={{ backgroundColor: userSettings.cursorColor }}>
                {userSettings.displayName.charAt(0)}
              </div>
            )}
          </button>
          <button className='logout-btn' onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      </header>

      <main className='home-main'>
        <div className='documents-section'>
          <div className='section-header'>
            <h2>Recent documents</h2>
            <AddDocumentButton setDocument={setDocument} />
          </div>
          <DocumentList document={document} />
        </div>
      </main>

      <UserProfileSettings
        isOpen={showProfileSettings}
        onClose={() => setShowProfileSettings(false)}
        userSettings={userSettings}
        onUpdateSettings={handleUpdateSettings}
      />
    </div>
  )
}

export default Home
