import React, { useState, useEffect } from 'react';
import { fetchData } from '../js-files/GeneralRequests';
import useHandleDisplay from '../hooks/useHandleDisplay';
import useHandleError from '../hooks/useHandleError';
import Message from './Message';
import '../styles/Message.css';

function Messages() {
  const [messages, setMessages, updateMessage, deleteMessage] = useHandleDisplay([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const { handleError } = useHandleError();

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const data = await fetchData('messages', '', handleError);
      setMessages(data.data || data);
    } catch (error) {
      handleError('getError', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredMessages = () => {
    if (!messages) return [];

    switch (filter) {
      case 'pending':
        return messages.filter(msg => !msg.is_handled);
      case 'handled':
        return messages.filter(msg => msg.is_handled);
      default:
        return messages.filter(msg => !msg.is_handled);
    }
  };

  const handleUpdateMessage = (updatedMessage) => {
    updateMessage(updatedMessage);
  };

  const handleDeleteMessage = (messageId) => {
    deleteMessage(messageId);
  };

  const filteredMessages = getFilteredMessages();
  const pendingCount = messages ? messages.filter(msg => !msg.is_handled).length : 0;
  const handledCount = messages ? messages.filter(msg => msg.is_handled).length : 0;

  if (loading) {
    return (
      <div className="messages-container">
        <div className="loading">טוען הודעות...</div>
      </div>
    );
  }

  return (
    <div className="messages-container">
      <div className="messages-header">
        <h1>הודעות צור קשר</h1>
        <div className="messages-stats">
          <span>סה"כ: {messages?.length || 0}</span>
          <span>חדשות: {pendingCount}</span>
          <span>מטופלות: {handledCount}</span>
        </div>
      </div>

      <div className="messages-filters">
        <button
          className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          חדשות ({pendingCount})
        </button>
        <button
          className={`filter-btn ${filter === 'handled' ? 'active' : ''}`}
          onClick={() => setFilter('handled')}
        >
          מטופלות ({handledCount})
        </button>
      </div>

      <div className="messages-list">
        {filteredMessages.length === 0 ? (
          <div className="no-messages">
            <h3>אין הודעות להצגה</h3>
            <p>לא נמצאו הודעות בקטגוריה שנבחרה</p>
          </div>
        ) : (
          filteredMessages.map(message => (
            <Message
              key={message.id}
              message={message}
              onUpdate={handleUpdateMessage}
              onDelete={handleDeleteMessage}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Messages;
