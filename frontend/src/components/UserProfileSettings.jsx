import React, { useState } from 'react';
import '../css/UserProfileSettings.css';

const UserProfileSettings = ({ isOpen, onClose, userSettings, onUpdateSettings }) => {
  const [displayName, setDisplayName] = useState(userSettings.displayName || '');
  const [cursorColor, setCursorColor] = useState(userSettings.cursorColor || '#4285f4');
  const [profilePhoto, setProfilePhoto] = useState(userSettings.profilePhoto || '');

  const handleSave = () => {
    onUpdateSettings({
      displayName,
      cursorColor,
      profilePhoto
    });
    onClose();
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="profile-settings-overlay" onClick={onClose}>
      <div className="profile-settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="profile-settings-header">
          <h3>Profile Settings</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="profile-settings-content">
          <div className="setting-group">
            <label>Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your name"
              maxLength={30}
            />
          </div>

          <div className="setting-group">
            <label>Cursor Color</label>
            <div className="color-picker-container">
              <input
                type="color"
                value={cursorColor}
                onChange={(e) => setCursorColor(e.target.value)}
              />
              <span className="color-preview" style={{ backgroundColor: cursorColor }}></span>
              <span className="color-value">{cursorColor}</span>
            </div>
          </div>

          <div className="setting-group">
            <label>Profile Photo</label>
            <div className="photo-upload-container">
              {profilePhoto ? (
                <div className="photo-preview">
                  <img src={profilePhoto} alt="Profile" />
                  <button
                    className="remove-photo-btn"
                    onClick={() => setProfilePhoto('')}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label className="upload-label">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    style={{ display: 'none' }}
                  />
                  <div className="upload-placeholder">
                    <span className="upload-icon">📷</span>
                    <span>Upload Photo</span>
                  </div>
                </label>
              )}
            </div>
          </div>
        </div>

        <div className="profile-settings-footer">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSave}>Save Changes</button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileSettings;
