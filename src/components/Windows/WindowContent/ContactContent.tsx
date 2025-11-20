import { useEffect, useState } from 'react';
import styles from './ContactContent.module.css';

interface ContactContentProps {
  onSend?: (payload: { subject: string; body: string }) => void;
}

export const ContactContent = ({ onSend }: ContactContentProps) => {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  useEffect(() => {
    onSend?.({ subject, body });
  }, [subject, body, onSend]);

  return (
    <div className={styles.contactWindow}>
      <div className={styles.formRow}>
        <label htmlFor="contact-to">To:</label>
        <input id="contact-to" value="irfannsubasi@gmail.com" disabled />
      </div>
      <div className={styles.formRow}>
        <label htmlFor="contact-subject">Subject:</label>
        <input
          id="contact-subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Enter subject"
        />
      </div>
      <textarea
        className={styles.messageArea}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Enter your message here..."
      />
    </div>
  );
};
