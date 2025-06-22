import React, { useState, useEffect } from 'react';
import { fetchData } from '../js-files/GeneralRequests';
import useHandleError from '../hooks/useHandleError';
import useHandleDisplay from '../hooks/useHandleDisplay';
import Cookies from 'js-cookie';
import FileInput from './FileInput';
import '../styles/SendMessages.css';

function SendMessages() {
  const [users, setUsers, updateUser, deleteUser, addUser] = useHandleDisplay([]);
  const { handleError, clearErrors } = useHandleError();

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectAllStudents, setSelectAllStudents] = useState(false);
  const [selectAllTeachers, setSelectAllTeachers] = useState(false);
  const [subject, setSubject] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [attachedFile, setAttachedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        clearErrors();

        const allUsers = await fetchData('users', '', handleError);
    
        if (allUsers) {
          const mapped = allUsers
            .filter(u => u.type_id !== 1)    // מסננים מנהלים (1)
            .map(u => ({
              ...u,
              type_name: u.type_id === 2
                ? 'teacher'
                : u.type_id === 3
                  ? 'student'
                  : 'unknown'
            }));

          setUsers(mapped);
        }

      } catch (error) {
        handleError('getError', error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const handleUserSelection = (userId) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        const newSelected = prev.filter(id => id !== userId);
        updateGroupSelections(newSelected);
        return newSelected;
      } else {
        const newSelected = [...prev, userId];
        updateGroupSelections(newSelected);
        return newSelected;
      }
    });
  };

  const handleSelectAllStudents = () => {
    if (!users || users.length === 0) return;

    const students = users.filter(user => user.type_name === 'student');
    const studentIds = students.map(student => student.user_id);

    if (selectAllStudents) {
      const newSelected = selectedUsers.filter(id => !studentIds.includes(id));
      setSelectedUsers(newSelected);
      setSelectAllStudents(false);
    } else {
      const newSelected = [...new Set([...selectedUsers, ...studentIds])];
      setSelectedUsers(newSelected);
      setSelectAllStudents(true);
    }
  };

  const handleSelectAllTeachers = () => {
    if (!users || users.length === 0) return;

    const teachers = users.filter(user => user.type_name === 'teacher');
    const teacherIds = teachers.map(teacher => teacher.user_id);

    if (selectAllTeachers) {
      const newSelected = selectedUsers.filter(id => !teacherIds.includes(id));
      setSelectedUsers(newSelected);
      setSelectAllTeachers(false);
    } else {
      const newSelected = [...new Set([...selectedUsers, ...teacherIds])];
      setSelectedUsers(newSelected);
      setSelectAllTeachers(true);
    }
  };

  const updateGroupSelections = (selectedIds) => {
    if (!users || users.length === 0) return;

    const students = users.filter(user => user.type_name === 'student');
    const teachers = users.filter(user => user.type_name === 'teacher');

    const selectedStudents = students.filter(student => selectedIds.includes(student.user_id));
    const selectedTeachers = teachers.filter(teacher => selectedIds.includes(teacher.user_id));

    setSelectAllStudents(selectedStudents.length === students.length && students.length > 0);
    setSelectAllTeachers(selectedTeachers.length === teachers.length && teachers.length > 0);
  };

  // פונקציה פשוטה לטיפול בשינוי קובץ
  const handleFileChange = (file) => {
    setAttachedFile(file);
    if (file) {
      clearErrors(); // נקה שגיאות אם יש קובץ תקין
    }
  };

  // פונקציה לטיפול בשגיאות קובץ
  const handleFileError = (error) => {
    handleError('addError', error);
  };

  const handleSendMessage = async () => {
    try {
      clearErrors();

      if (selectedUsers.length === 0) {
        handleError('addError', new Error('אנא בחר לפחות משתמש אחד'));
        return;
      }

      if (!subject.trim()) {
        handleError('addError', new Error('אנא הזן נושא להודעה'));
        return;
      }

      if (!messageContent.trim()) {
        handleError('addError', new Error('אנא הזן תוכן להודעה'));
        return;
      }

      setSending(true);

      // יצירת רשימת נמענים עם הפרטים הנדרשים
      const recipients = users
        .filter(user => selectedUsers.includes(user.user_id))
        .map(user => ({
          name: user.name,
          email: user.email
        }));

      // יצירת FormData לשליחת הנתונים עם קובץ
      const formData = new FormData();
      formData.append('userIds', JSON.stringify(selectedUsers));
      formData.append('recipients', JSON.stringify(recipients));
      formData.append('subject', subject.trim());
      formData.append('messageContent', messageContent.trim());
      
      if (attachedFile) {
        formData.append('attachedFile', attachedFile);
      }

      // שליחת הבקשה לשרת
      const token = Cookies.get("accessToken");
      const response = await fetch('http://localhost:3000/email/send-general-message', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: formData
      });

      const result = await response.json();

      if (response.ok && result.totalSent > 0) {
        const message = result.totalFailed > 0 
          ? `ההודעה נשלחה ל-${result.totalSent} מתוך ${result.totalSent + result.totalFailed} משתמשים`
          : `ההודעה נשלחה בהצלחה ל-${result.totalSent} משתמשים!`;
        alert(message);
        
        // איפוס הטופס
        setSelectedUsers([]);
        setSelectAllStudents(false);
        setSelectAllTeachers(false);
        setSubject('');
        setMessageContent('');
        setAttachedFile(null);

      } else {
        throw new Error(result.error || 'שגיאה בשליחת ההודעה');
      }

    } catch (error) {
      handleError('addError', error, true);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <div className="loading">טוען משתמשים...</div>;
  }

  if (!users || users.length === 0) {
    return (
      <div className="no-users">
        <h3>לא נמצאו משתמשים</h3>
        <p>אין משתמשים זמינים לשליחת הודעות</p>
      </div>
    );
  }

  const students = users.filter(user => user.type_name === 'student');
  const teachers = users.filter(user => user.type_name === 'teacher');

  return (
    <div className="send-messages-container">
      <div className="messages-header">
        <h1>שליחת הודעות למשתמשים</h1>
      </div>

      <div className="group-selection">
        <div className="group-options">

          <label className="group-checkbox">
            <input
              type="checkbox"
              checked={selectAllStudents}
              onChange={handleSelectAllStudents}
              disabled={students.length === 0}
            />
            כל התלמידים ({students.length})
          </label>

          <label className="group-checkbox">
            <input
              type="checkbox"
              checked={selectAllTeachers}
              onChange={handleSelectAllTeachers}
              disabled={teachers.length === 0}
            />
            כל המורים ({teachers.length})
          </label>

        </div>
      </div>

      <div className="message-users-section">
        <h3>בחר משתמשים ({selectedUsers.length} נבחרו)</h3>
        <div className="message-users-list">
          {users.map(user => (
            <div key={user.user_id} className="user-card">
              <input
                type="checkbox"
                id={`user-${user.user_id}`}
                checked={selectedUsers.includes(user.user_id)}
                onChange={() => handleUserSelection(user.user_id)}
              />
              <div className="user-info">
                <div className="user-name">{user.name}</div>
                <div className="user-details">
                  <span className={`user-type ${user.type_name}`}>
                    {user.type_name === 'student' ? 'תלמיד' : 'מורה'}
                  </span>
                  <span className="user-email">{user.email}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="message-form">
        <h3>פרטי ההודעה</h3>

        <div className="form-group">
          <label htmlFor="subject">נושא ההודעה:</label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="הזן נושא להודעה"
            disabled={sending}
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">תוכן ההודעה:</label>
          <textarea
            id="content"
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            placeholder="הזן את תוכן ההודעה"
            rows="6"
            disabled={sending}
          />
        </div>

        <div className="form-group">
          <label>קובץ מצורף (אופציונלי):</label>
          <FileInput
            value={attachedFile}
            onChange={handleFileChange}
            onError={handleFileError}
            disabled={sending}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            placeholder="בחר קובץ..."
            fieldKey="attachedFile"
            showPreview={true}
          />
          <small className="file-hint">
            קבצים מותרים: PDF, Word, תמונות (מקסימום 5MB)
          </small>
        </div>

        <button
          className="send-button"
          onClick={handleSendMessage}
          disabled={sending || selectedUsers.length === 0}
        >
          {sending ? 'שולח...' : `שלח הודעה (${selectedUsers.length} נמענים)`}
        </button>
      </div>
    </div>
  );
}

export default SendMessages;
