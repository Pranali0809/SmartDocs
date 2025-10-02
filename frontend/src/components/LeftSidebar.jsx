import React, { useState } from 'react';
import '../css/LeftSidebar.css';

const LeftSidebar = ({ isCollapsed, onToggle }) => {
  const [activeTab, setActiveTab] = useState('sections');

  const sections = [
    { id: 1, name: 'Introduction', icon: '📄' },
    { id: 2, name: 'Main Content', icon: '📝' },
    { id: 3, name: 'Conclusion', icon: '✅' },
    { id: 4, name: 'References', icon: '📚' }
  ];

  const tools = [
    { id: 'templates', name: 'Templates', icon: '📋' },
    { id: 'images', name: 'Images', icon: '🖼️' },
    { id: 'tables', name: 'Tables', icon: '📊' },
    { id: 'comments', name: 'Comments', icon: '💬' }
  ];

  return (
    <>
      <div className={`left-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        <button className="sidebar-toggle" onClick={onToggle}>
          {isCollapsed ? '→' : '←'}
        </button>

        {!isCollapsed && (
          <div className="sidebar-content">
            <div className="sidebar-tabs">
              <button
                className={`tab-btn ${activeTab === 'sections' ? 'active' : ''}`}
                onClick={() => setActiveTab('sections')}
              >
                Sections
              </button>
              <button
                className={`tab-btn ${activeTab === 'tools' ? 'active' : ''}`}
                onClick={() => setActiveTab('tools')}
              >
                Tools
              </button>
            </div>

            <div className="sidebar-body">
              {activeTab === 'sections' && (
                <div className="sections-list">
                  {sections.map((section) => (
                    <div key={section.id} className="section-item">
                      <span className="section-icon">{section.icon}</span>
                      <span className="section-name">{section.name}</span>
                    </div>
                  ))}
                  <button className="add-section-btn">
                    <span>+</span>
                    Add Section
                  </button>
                </div>
              )}

              {activeTab === 'tools' && (
                <div className="tools-list">
                  {tools.map((tool) => (
                    <div key={tool.id} className="tool-item">
                      <span className="tool-icon">{tool.icon}</span>
                      <span className="tool-name">{tool.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default LeftSidebar;
