import { useEffect, useState } from 'react';
import '../css/message.css';

/**
 * Message component
 * 
 * @param {Object} props The properties object
 * @param {string} props.messageKey The key of the message to display
 * @returns {React.ReactNode} The Message component
 */
const Message = (props) => {
  const { messageKey } = props;
  const [message, setMessage] = useState('');
  useEffect(() => {
    fetch(`${window.sr.api}shelf-runner/v1/message/${messageKey}`)
      .then(response => response.json())
      .then(data => {
        setMessage(data.data.value);
      });
  }, [messageKey]);
  return <div className="sr-message" dangerouslySetInnerHTML={{ __html: message }} />;
};


export default Message;