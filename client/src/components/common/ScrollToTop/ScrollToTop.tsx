import React, { useState, useEffect } from 'react';
import { ArrowUpShort } from 'react-bootstrap-icons';

import styles from './ScrollToTop.module.scss';

const ScrollToTop: React.FC = () => {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const checkScrollTop = (): void => {
      if (!showScroll && window.scrollY > 400) {
        setShowScroll(true);
      } else if (showScroll && window.scrollY <= 400) {
        setShowScroll(false);
      }
    };

    window.addEventListener('scroll', checkScrollTop);
    return () => window.removeEventListener('scroll', checkScrollTop);
  }, [showScroll]);

  const scrollToTop = (): void => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!showScroll) return null;

  return (
    <div
      className={`${styles.scrollTop} rounded-2 p-2 d-flex align-items-center justify-content-center`}
      onClick={scrollToTop}
      role="button"
      aria-label="Scroll to top"
    >
      <ArrowUpShort size={28} />
    </div>
  );
};

export default ScrollToTop;
