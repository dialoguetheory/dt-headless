import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import className from 'classnames/bind';
import styles from './MediaSlider.module.scss';

let cx = className.bind(styles || {});

const ProgressBar = ({ carousel, totalSlides }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (carousel) {
      const updateProgress = () => {
        const currentIndex = carousel.selectedIndex || 0;
        setProgress(((currentIndex + 1) / totalSlides) * 100);
      };

      // Update progress on carousel change
      carousel.on('change', updateProgress);

      // Set initial progress
      updateProgress();

      return () => {
        carousel.off('change', updateProgress);
      };
    }
  }, [carousel, totalSlides]);

  return (
    <div className={cx('progress-bar-container')}>
      <div
        className={cx('progress-bar')}
        style={{ width: `${progress}%`, transition: 'width 0.3s ease' }}
      />
    </div>
  );
};

ProgressBar.propTypes = {
  carousel: PropTypes.object,
  totalSlides: PropTypes.number,
};

export default ProgressBar;
