'use client';

import { useMemo, useState } from 'react';
import { SendHorizonal } from 'lucide-react';
import { PortalFrame } from '@/components/portal-frame';
import { Card, formatDate } from '@/components/common';
import { useApp } from '@/lib/storage';

export default function ClientMessagesPage() {
  const { state, sendMessage } = useApp();
  const [message, setMessage] = useState('');
  const thread = useMemo(() => state.messages.find(item => item.threadId === 'thread_ui_redesign') ?? state.messages[0], [state.messages]);

  const handleSend = () => {
    if (!message.trim() || !thread) {
      return;
    }

    sendMessage({
      fromUserId: state.session?.userId ?? 'user_client_rohan',
      toUserId: thread.fromUserId,
      threadId: thread.threadId,
      body: message
    });
    setMessage('');
  };

  return (
    <PortalFrame role="client" title="Messages" subtitle="Keep the conversation and status updates in one place.">
      <div className="detail-grid">
        <Card title="Thread">
          <div className="timeline">
            {(state.messages.filter(item => item.threadId === thread?.threadId) ?? []).map(item => (
              <div className="timeline-item" key={item.id}>
                <span className="timeline-dot success"></span>
                <span>
                  <strong>{state.users.find(user => user.id === item.fromUserId)?.name ?? 'Unknown'}</strong>
                  <p className="caption">{item.body}</p>
                </span>
                <span className="caption">{formatDate(item.createdAt)}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Compose">
          <div className="stack-2">
            <label className="field">
              <span>Write a message</span>
              <textarea className="textarea" value={message} onChange={event => setMessage(event.target.value)} placeholder="Ask for an update, approve work, or request a revision." />
            </label>
            <button className="primary-btn" type="button" onClick={handleSend}><SendHorizonal size={16} />Send</button>
          </div>
        </Card>
      </div>
    </PortalFrame>
  );
}
