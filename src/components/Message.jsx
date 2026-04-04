import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import '../css/message.css';

gsap.registerPlugin(SplitText);

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
  const containerRef = useRef(null);

  useEffect(() => {
    fetch(`${window.sr.api}shelf-runner/v1/message/${messageKey}`)
      .then((response) => response.json())
      .then((data) => {
        setMessage(data.data.value);
      });
  }, [messageKey]);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!message || !el) return undefined;

    const split = SplitText.create(el, {
      type: 'chars, words',
      onSplit(self) {
        return gsap.from(self.chars, {
          autoAlpha: 0,
          duration: 0.001,
          stagger: 0.005,
          ease: 'none',
        });
      },
    });

    return () => {
      gsap.killTweensOf(split.chars);
      split.kill();
    };
  }, [message]);

  return (
    <div
      ref={containerRef}
      className="sr-message"
      dangerouslySetInnerHTML={{ __html: message }}
    />
  );
};

export default Message;
