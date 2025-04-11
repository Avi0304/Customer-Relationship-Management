import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

const ticketId = '67f77d1b57bbfcbd90f3b001';

// Hardcoded JWT tokens for testing
const adminToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2VjYjZmMjFkYzc2YTc3MTcyOTcxM2UiLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE3NDQzNDQ1NTgsImV4cCI6MTc0NDM0ODE1OH0.ptYemWR-mec1Iw0t-unPZGJRNnv2HbVsuFsg5tIdMqU';

const customerToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2VlMWE0ZWIzNzdkNDczN2JjMDFjNDAiLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNzQ0MzQ0NTk1LCJleHAiOjE3NDQzNDgxOTV9.1pE_gni6pIbhf8ZBiqfTdg8Xhg4atF3UNqr8-iHPxOI';

const SocketTest = () => {
  const [adminMessage, setAdminMessage] = useState('');
  const [customerMessage, setCustomerMessage] = useState('');
  const [adminChatLog, setAdminChatLog] = useState([]);
  const [customerChatLog, setCustomerChatLog] = useState([]);

  // Refs to hold individual sockets
  const adminSocketRef = useRef(null);
  const customerSocketRef = useRef(null);

  useEffect(() => {
    const adminSocket = io('http://localhost:8080', {
      transports: ['websocket'],
      auth: { token: adminToken },
    });

    const customerSocket = io('http://localhost:8080', {
      transports: ['websocket'],
      auth: { token: customerToken },
    });

    adminSocketRef.current = adminSocket;
    customerSocketRef.current = customerSocket;

    // Admin socket events
    adminSocket.on('connect', () => {
      console.log('✅ Admin connected');
      adminSocket.emit('joinTicketRoom', ticketId);
    });

    adminSocket.on('receiveMessage', (data) => {
      setAdminChatLog((prev) => [...prev, { sender: data.senderRole, text: data.message }]);
    });

    // Customer socket events
    customerSocket.on('connect', () => {
      console.log('✅ Customer connected');
      customerSocket.emit('joinTicketRoom', ticketId);
    });

    customerSocket.on('receiveMessage', (data) => {
      setCustomerChatLog((prev) => [...prev, { sender: data.senderRole, text: data.message }]);
    });

    // Cleanup on unmount
    return () => {
      adminSocket.disconnect();
      customerSocket.disconnect();
    };
  }, []);

  const sendAdminMessage = () => {
    if (!adminMessage.trim()) return;
    const msg = {
      ticketId,
      senderId: '67ecb6f21dc76a771729713e',
      senderRole: 'Admin',
      message: adminMessage,
    };
    adminSocketRef.current.emit('sendMessage', msg);
    setAdminChatLog((prev) => [...prev, { sender: 'You (Admin)', text: adminMessage }]);
    setAdminMessage('');
  };

  const sendCustomerMessage = () => {
    if (!customerMessage.trim()) return;
    const msg = {
      ticketId,
      senderId: '67ee1a4eb377d4737bc01c40',
      senderRole: 'Customer',
      message: customerMessage,
    };
    customerSocketRef.current.emit('sendMessage', msg);
    setCustomerChatLog((prev) => [...prev, { sender: 'You (Customer)', text: customerMessage }]);
    setCustomerMessage('');
  };

  return (
    <div style={{ display: 'flex', gap: '40px', padding: '20px', fontFamily: 'Arial' }}>
      {/* Admin Chat Box */}
      <div style={{ width: '50%' }}>
        <h2>🧑‍💼 Admin Chat</h2>
        <input
          type="text"
          value={adminMessage}
          onChange={(e) => setAdminMessage(e.target.value)}
          placeholder="Admin: Type a message"
          style={{ padding: '8px', width: '80%' }}
        />
        <button onClick={sendAdminMessage} style={{ padding: '8px 12px', marginLeft: '10px' }}>
          Send
        </button>
        <div
          style={{
            marginTop: '10px',
            border: '1px solid #ccc',
            padding: '10px',
            height: '300px',
            overflowY: 'auto',
          }}
        >
          {adminChatLog.map((msg, idx) => (
            <div key={idx}>
              <strong>{msg.sender}:</strong> {msg.text}
            </div>
          ))}
        </div>
      </div>

      {/* Customer Chat Box */}
      <div style={{ width: '50%' }}>
        <h2>🙋 Customer Chat</h2>
        <input
          type="text"
          value={customerMessage}
          onChange={(e) => setCustomerMessage(e.target.value)}
          placeholder="Customer: Type a message"
          style={{ padding: '8px', width: '80%' }}
        />
        <button onClick={sendCustomerMessage} style={{ padding: '8px 12px', marginLeft: '10px' }}>
          Send
        </button>
        <div
          style={{
            marginTop: '10px',
            border: '1px solid #ccc',
            padding: '10px',
            height: '300px',
            overflowY: 'auto',
          }}
        >
          {customerChatLog.map((msg, idx) => (
            <div key={idx}>
              <strong>{msg.sender}:</strong> {msg.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SocketTest;
