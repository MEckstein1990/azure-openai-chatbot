import React, { useState } from 'react';

function App() {
  const [input, setInput] = useState('');
  const [chatLog, setChatLog] = useState([]); // {sender: "user" | "bot", message: string}
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setChatLog((prev) => [...prev, { sender: 'user', message: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });

      if (!response.ok) {
        const errorData = await response.json();
        setChatLog((prev) => [...prev, { sender: 'bot', message: `Error: ${errorData.error || response.statusText}` }]);
      } else {
        const data = await response.json();
        setChatLog((prev) => [...prev, { sender: 'bot', message: data.response }]);
      }
    } catch (error) {
      setChatLog((prev) => [...prev, { sender: 'bot', message: `Error: ${error.message}` }]);
    }

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: 'auto', padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <h1>Azure OpenAI Chatbot</h1>
      <div style={{ minHeight: 400, border: '1px solid #ccc', padding: 10, borderRadius: 8, overflowY: 'auto' }}>
        {chatLog.length === 0 && <p>Start the conversation by typing a message below.</p>}
        {chatLog.map((entry, idx) => (
          <div key={idx} style={{ textAlign: entry.sender === 'user' ? 'right' : 'left', marginBottom: 10 }}>
            <div
              style={{
                display: 'inline-block',
                padding: '10px 15px',
                borderRadius: 20,
                backgroundColor: entry.sender === 'user' ? '#0078D7' : '#E5E5EA',
                color: entry.sender === 'user' ? 'white' : 'black',
                whiteSpace: 'pre-wrap',
                maxWidth: '80%'
              }}
            >
              {entry.message}
            </div>
          </div>
        ))}
      </div>
      <textarea
        rows={3}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        style={{ width: '100%', padding: 10, marginTop: 10, resize: 'none', fontSize: 16 }}
        placeholder="Type your message here..."
        disabled={loading}
      />
      <button
        onClick={handleSend}
        disabled={loading || !input.trim()}
        style={{ marginTop: 10, padding: '10px 20px', fontSize: 16, cursor: 'pointer' }}
      >
        {loading ? 'Sending...' : 'Send'}
      </button>
    </div>
  );
}

export default App;
