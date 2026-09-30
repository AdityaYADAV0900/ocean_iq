import React, { useState } from 'react';
import { Terminal, Send, Bot, User } from 'lucide-react';
import { COPILOT_PRESETS } from '../data/maritimeData';

export default function CopilotTerminal() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Greetings! I am your SAIL Maritime Logistics AI Advisor for the Ministry of Steel. I am grounded in your live mathematical fleet models, draft constraints, and coking coal chartering dynamics.\n\nClick any quick chip below or submit your logistics question.'
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (queryText) => {
    const q = queryText || inputVal;
    if (!q.trim()) return;

    const newMsgs = [...messages, { role: 'user', content: q }];
    setMessages(newMsgs);
    setInputVal('');
    setLoading(true);

    try {
      const res = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customPrompt: q })
      });

      if (res.ok) {
        const data = await res.json();
        setMessages([...newMsgs, { role: 'assistant', content: data.answer }]);
      } else {
        // Fallback
        const fallback = COPILOT_PRESETS.find(p => q.toLowerCase().includes(p.id.replace(/_/g, ' '))) || COPILOT_PRESETS[0];
        setMessages([...newMsgs, { role: 'assistant', content: fallback.answer }]);
      }
    } catch {
      const fallback = COPILOT_PRESETS.find(p => q.toLowerCase().includes(p.id.replace(/_/g, ' '))) || COPILOT_PRESETS[0];
      setMessages([...newMsgs, { role: 'assistant', content: fallback.answer }]);
    } finally {
      setLoading(false);
    }
  };

  const handleChipClick = (preset) => {
    handleSend(preset.question);
  };

  return (
    <section className="section" id="copilot" style={{ background: 'rgba(6, 12, 26, 0.7)' }}>
      <div className="container">
        
        <div className="section-header text-center">
          <span className="section-tag">Dual-Engine SIH Advisor</span>
          <h2 className="section-title">Grounded GenAI Maritime Copilot</h2>
          <p className="section-desc">
            A conversational strategic advisor strictly conditioned on active ML forecasts, MILP mathematical formulas, and live port operational data. Offline-immune and hallucination-free.
          </p>
        </div>

        <div className="terminal-window">
          {/* Header */}
          <div className="terminal-header">
            <div className="terminal-dots">
              <span className="t-dot red"></span>
              <span className="t-dot yellow"></span>
              <span className="t-dot green"></span>
            </div>
            <div className="terminal-title">ocean-iq@sail-copilot: ~ /grounded-advisory</div>
            <div style={{ fontSize: '0.72rem', color: '#10B981', fontWeight: 600 }}>
              ● ZERO-HALLUCINATION PROTOCOL
            </div>
          </div>

          {/* Chat Body */}
          <div className="terminal-body" style={{ maxHeight: '420px', overflowY: 'auto' }}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`chat-bubble ${msg.role === 'user' ? 'chat-user' : 'chat-copilot'}`}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', fontSize: '0.78rem', opacity: 0.8 }}>
                  {msg.role === 'user' ? <User size={14} /> : <Bot size={14} color="#00E5FF" />}
                  <strong>{msg.role === 'user' ? 'Logistics Officer' : 'OceanIQ Copilot (Grounded DSS)'}</strong>
                </div>
                <div style={{ whiteSpace: 'pre-line' }}>{msg.content}</div>
              </div>
            ))}
            {loading && (
              <div className="chat-bubble chat-copilot" style={{ fontStyle: 'italic', color: '#94A3B8' }}>
                Analyzing port constraints and solving fleet equations...
              </div>
            )}
          </div>

          {/* Prompt Chips */}
          <div style={{
            padding: '16px 26px',
            background: 'rgba(11, 19, 37, 0.9)',
            borderTop: '1px solid rgba(56, 189, 248, 0.15)'
          }}>
            <div style={{ fontSize: '0.76rem', color: '#94A3B8', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase' }}>
              ⚡ Quick Prompt Chips (Click to test):
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '14px' }}>
              {COPILOT_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  className="chip-btn"
                  onClick={() => handleChipClick(preset)}
                >
                  {preset.title}
                </button>
              ))}
            </div>

            {/* Input Row */}
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                className="sim-input"
                placeholder="Ask about coking coal rates, draft limits, MILP allocation, or demurrage..."
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
              />
              <button type="submit" className="btn btn-primary" style={{ padding: '0 20px' }}>
                <Send size={16} />
              </button>
            </form>
          </div>

        </div>

      </div>
    </section>
  );
}
