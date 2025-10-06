import React from 'react';
import '../css/RightSidebar.css';

const RightSidebar = ({ isCollapsed, onToggle, contributors }) => {
  const defaultContributors = contributors || [
    { id: 1, name: 'John Doe', color: '#4285f4', contribution: 45 },
    { id: 2, name: 'Jane Smith', color: '#ea4335', contribution: 30 },
    { id: 3, name: 'Mike Johnson', color: '#34a853', contribution: 15 },
    { id: 4, name: 'Sarah Wilson', color: '#fbbc04', contribution: 10 }
  ];

  const totalContribution = defaultContributors.reduce((sum, c) => sum + c.contribution, 0);

  return (
    <div className={`right-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <button className="sidebar-toggle" onClick={onToggle}>
        {isCollapsed ? '←' : '→'}
      </button>

      {!isCollapsed && (
        <div className="sidebar-content">
          <div className="sidebar-header">
            <h3>Contributions</h3>
          </div>

          <div className="sidebar-body">
            <div className="contribution-chart">
              <svg width="100%" height="8" style={{ borderRadius: '4px', overflow: 'hidden' }}>
                {defaultContributors.reduce((acc, contributor, index) => {
                  const previousWidth = index > 0
                    ? defaultContributors.slice(0, index).reduce((sum, c) => sum + c.contribution, 0)
                    : 0;
                  const width = (contributor.contribution / totalContribution) * 100;
                  const x = (previousWidth / totalContribution) * 100;

                  return [
                    ...acc,
                    <rect
                      key={contributor.id}
                      x={`${x}%`}
                      y="0"
                      width={`${width}%`}
                      height="8"
                      fill={contributor.color}
                    />
                  ];
                }, [])}
              </svg>
            </div>

            <div className="contributors-list">
              {defaultContributors.map((contributor) => (
                <div key={contributor.id} className="contributor-item">
                  <div className="contributor-info">
                    <div
                      className="contributor-color"
                      style={{ backgroundColor: contributor.color }}
                    ></div>
                    <span className="contributor-name">{contributor.name}</span>
                  </div>
                  <div className="contributor-percentage">
                    {Math.round((contributor.contribution / totalContribution) * 100)}%
                  </div>
                </div>
              ))}
            </div>

            <div className="contribution-summary">
              <div className="summary-item">
                <span className="summary-label">Total Edits</span>
                <span className="summary-value">{totalContribution}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Active Contributors</span>
                <span className="summary-value">{defaultContributors.length}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RightSidebar;
