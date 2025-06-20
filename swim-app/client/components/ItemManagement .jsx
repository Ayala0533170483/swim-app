import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { userContext } from './App';
import { fetchData } from '../js-files/GeneralRequests';
import UserCard from './UserCard';
import PoolCard from './PoolCard';
import AddItem from './AddItem';
import { addKeys, validationRules, poolConfig } from '../structures/PoolCardStructure';
import '../styles/ItemManagement .css';

function UserManagement({ userType }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayChanged, setDisplayChanged] = useState(false);
  const { userData } = useContext(userContext);
  const { username } = useParams();

  const isPoolManagement = userType === 'pools';

  useEffect(() => {
    loadItems();
  }, [userType]);

  useEffect(() => {
    if (displayChanged) {
      loadItems();
      setDisplayChanged(false);
    }
  }, [displayChanged]);

  const loadItems = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Loading items for userType:', userType);
      
      let data;
      if (isPoolManagement) {
        data = await fetchData('pools', '', handleError);
      } else {
        data = await fetchData('users', userType, handleError);
      }
      
      console.log('Received data:', data);
      
      if (Array.isArray(data)) {
        setItems(data);
      } else if (data && typeof data === 'object') {
        const arrayData = data.data || data.items || data.results || [];
        setItems(Array.isArray(arrayData) ? arrayData : []);
      } else {
        console.warn('Data is not an array:', data);
        setItems([]);
      }
      
    } catch (err) {
      console.error('Error loading items:', err);
      setError(isPoolManagement ? 'שגיאה בטעינת הבריכות' : 'שגיאה בטעינת המשתמשים');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleError = (type, error) => {
    console.error(`${type}:`, error);
    setError('שגיאה בטעינת הנתונים');
  };

  const addDisplay = (newItem) => {
    setItems(prev => Array.isArray(prev) ? [...prev, newItem] : [newItem]);
  };

  const updateDisplay = (updatedItem) => {
    setItems(prev => {
      if (!Array.isArray(prev)) return [updatedItem];
      
      return prev.map(item => {
        let itemId, updatedId;
        if (isPoolManagement) {
          itemId = item.pool_id;
          updatedId = updatedItem.pool_id;
        } else {
          itemId = item.user_id || item.id;
          updatedId = updatedItem.user_id;
        }
        
        return itemId === updatedId ? updatedItem : item;
      });
    });
  };

  const deleteDisplay = (deletedId) => {
    setItems(prev => {
      if (!Array.isArray(prev)) return [];
      
      return prev.filter(item => {
        // זיהוי נכון של ID לפי סוג הפריט
        let itemId;
        
        if (isPoolManagement) {
          itemId = item.pool_id || item.id;
        } else {
          itemId = item.user_id || item.id;
        }
        
        return itemId !== deletedId;
      });
    });
  };

  // הגדרת הנתונים לפי סוג הניהול
  const getManagementConfig = () => {
    if (isPoolManagement) {
      return {
        ...poolConfig,
        CardComponent: PoolCard,
        showAddButton: true,
        addKeys: addKeys,
        validationRules: validationRules
      };
    } else {
      // הגדרות המשתמשים הקיימות
      return {
        pageTitle: userType === 'students' ? 'ניהול תלמידים' : 'ניהול מורים',
        description: `צפייה וניהול ${userType === 'students' ? 'תלמידים' : 'מורים'} במערכת`,
        emptyMessage: userType === 'students' ? 'אין תלמידים במערכת' : 'אין מורים במערכת',
        addButtonText: userType === 'students' ? 'הוסף תלמיד חדש' : 'הוסף מורה חדש',
        CardComponent: UserCard,
        showAddButton: false,
        addKeys: [],
        validationRules: {}
      };
    }
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

  const config = getManagementConfig();

  // בדיקה נוספת לפני הרינדור
  if (!Array.isArray(items)) {
    console.error('Items is not an array:', items);
    return (
      <div className="user-management-page">
        <div className="container">
          <div className="error-message">שגיאה בטעינת הנתונים - פורמט לא תקין</div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-management-page">
      <div className="container">
        {/* הריבוע הכחול - רק כותרת ותיאור */}
        <div className="page-header">
          <h1>{config.pageTitle}</h1>
          <p>{config.description}</p>
        </div>

        {/* כפתור הוספה - מחוץ לריבוע הכחול */}
        {config.showAddButton && (
          <div className="add-item-section">
            <AddItem
              type="pools"
              keys={config.addKeys}
              addDisplay={addDisplay}
              nameButton={config.addButtonText}
              setDisplayChanged={setDisplayChanged}
              validationRules={config.validationRules}
            />
          </div>
        )}

        {items.length === 0 ? (
          <div className="no-users">
            <h3>{config.emptyMessage}</h3>
            <p>לא נמצאו פריטים פעילים מהסוג הזה במערכת</p>
          </div>
        ) : (
          <div className="users-section">
            <div className="users-list">
              {items.map(item => {
                // מפתח נכון לפי סוג הפריט
                const key = isPoolManagement ? (item.pool_id || item.id) : (item.user_id || item.id);
                
                return (
                  <config.CardComponent 
                    key={key}
                    {...(isPoolManagement ? 
                      { pool: item, updateDisplay, deleteDisplay, setDisplayChanged } : 
                      { user: item, userType }
                    )}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserManagement;
