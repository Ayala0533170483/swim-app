import React, { useState, useEffect } from 'react';
import Branch from './Branch';
import BranchesMap from './BranchesMap';
import useHandleError from '../hooks/useHandleError';
import useHandleDisplay from '../hooks/useHandleDisplay';
import '../styles/Branches.css';

function BranchesPage() {
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [loading, setLoading] = useState(true);

  const { handleError, clearErrors } = useHandleError();
  const [branches, setBranches, updateBranch, deleteBranch, addBranch] = useHandleDisplay([]);

  const fetchBranches = async () => {
    try {
      setLoading(true);
      clearErrors();

      const response = await fetch('http://localhost:3000/branches', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        handleError('getError', new Error(`Server error: ${response.status}`), true);
        return;
      }

      const result = await response.json();

      if (result.success) {
        setBranches(result.data);
      } else {
        handleError('getError', new Error(result.error || 'Unknown error'), true);
      }

    } catch (error) {
      console.error('Network error:', error);
      handleError('getError', error, false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleBranchSelect = (branchId) => {
    setSelectedBranch(selectedBranch === branchId ? null : branchId);
  };

  if (loading) {
    return (
      <div className="branches-page">
        <div className="container">
          <div className="branches-header">
            <h1>הסניפים שלנו</h1>
            <p>מצא את הסניף הקרוב אליך והצטרף למשפחת השחייה שלנו</p>
          </div>

          {/* רשימת הסניפים קודם */}
          <div className="branches-grid">
            {branches.map((branch) => (
              <Branch
                key={branch.pool_id}
                branch={branch}
                isSelected={selectedBranch === branch.pool_id}
                onSelect={handleBranchSelect}
              />
            ))}
          </div>

          {/* המפה אחרי הרשימה */}
          <div className="map-section">
            <h2>מפת הסניפים</h2>
            <BranchesMap
              branches={branches}
              selectedBranch={selectedBranch}
              onBranchSelect={handleBranchSelect}
            />
          </div>
        </div>
      </div>
    );

  }

  if (!branches || branches.length === 0) {
    return (
      <div className="branches-page">
        <div className="container">
          <div className="no-branches">אין סניפים זמינים כרגע</div>
          <button onClick={fetchBranches} className="btn-primary">
            נסה שוב
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="branches-page">
      <div className="container">
        <div className="branches-header">
          <h1>הסניפים שלנו</h1>
          <p>מצא את הסניף הקרוב אליך והצטרף למשפחת השחייה שלנו</p>
        </div>


        {/* רשימת הסניפים */}
        <div className="branches-grid">
          {branches.map((branch) => (
            <Branch
              key={branch.pool_id}
              branch={branch}
              isSelected={selectedBranch === branch.pool_id}
              onSelect={handleBranchSelect}
            />
          ))}
        </div>

        {/* המפה */}
        <div className="map-section">
          <h2>מפת הסניפים</h2>
          <BranchesMap
            branches={branches}
            selectedBranch={selectedBranch}
            onBranchSelect={handleBranchSelect}
          />
        </div>

      </div>
    </div>
  );
}

export default BranchesPage;
