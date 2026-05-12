import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { useLayoutEffect, useMemo, useRef } from 'react';

import { useGetMessage } from '../hooks/useGetMessage';

import '../css/message.css';

gsap.registerPlugin(SplitText);

/**
 * Message component
 *
 * @param {Object} props The properties object
 * @param {string} props.messageKey The key of the message to display
 * @returns {React.ReactNode} The Message component
 */
export const Message = (props) => {
  const { messageKey, alignCenter = false } = props;
  const message = useGetMessage(messageKey);
  const containerRef = useRef(null);

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
          delay: 0.3,
        });
      },
    });

    return () => {
      gsap.killTweensOf(split.chars);
      split.kill();
    };
  }, [message]);

  // Stabilize the dangerouslySetInnerHTML object reference across renders.
  const innerHtml = useMemo(() => ({ __html: message }), [message]);

  return (
    <div
      ref={containerRef}
      className={`sr-message ${!message ? 'is-loading' : ''} ${alignCenter ? 'sr-message--center' : ''}`}
      dangerouslySetInnerHTML={innerHtml}
    />
  );
};
