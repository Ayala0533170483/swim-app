import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { userContext } from './App';
import { fetchData } from '../js-files/GeneralRequests';
import UserCard from './UserCard';
import '../styles/UserManagement.css';

function UserManagement({ userType }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userData } = useContext(userContext);
  const { username } = useParams();

  useEffect(() => {
    loadUsers();
  }, [userType]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await fetchData(`users`,userType, handleError);
      
      setUsers(data);
      
    } catch (err) {
      console.error('Error loading users:', err);
      setError('שגיאה בטעינת המשתמשים');
    } finally {
      setLoading(false);
    }
  };

  const handleError = (type, error) => {
    console.error(`${type}:`, error);
    setError('שגיאה בטעינת הנתונים');
  };

  if (loading) {
    return (
      <div className="user-management-page">
        <div className="container">
          <div className="loading">טוען נתונים...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-management-page">
        <div className="container">
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  const pageTitle = userType === 'students' ? 'ניהול תלמידים' : 'ניהול מורים';
  const emptyMessage = userType === 'students' ? 'אין תלמידים במערכת' : 'אין מורים במערכת';

  return (
    <div className="user-management-page">
      <div className="container">
        <div className="page-header">
          <h1>{pageTitle}</h1>
          <p>צפייה וניהול {userType === 'students' ? 'תלמידים' : 'מורים'} במערכת</p>
        </div>

        {users.length === 0 ? (
          <div className="no-users">
            <h3>{emptyMessage}</h3>
            <p>לא נמצאו משתמשים פעילים מהסוג הזה במערכת</p>
          </div>
        ) : (
          <div className="users-section">
            <div className="users-count">
            <span>נמצאו {users.length} {userType === 'students' ? 'תלמידים' : 'מורים'}</span>

            </div>
            
            <div className="users-list">
              {users.map(user => (
                <UserCard 
                  key={user.user_id} 
                  user={user} 
                  userType={userType}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserManagement;
