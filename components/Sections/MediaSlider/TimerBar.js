import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import className from 'classnames/bind';
import styles from './MediaSlider.module.scss';

const cx = className.bind(styles);

const TimerBar = ({ carousel, autoPlayDuration }) => {
  const [progress, setProgress] = useState(0);
  let timer;

  useEffect(() => {
    if (!carousel || !autoPlayDuration || carousel.player?.state !== 'playing') return;

    const updateProgress = () => {
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const percentage = Math.min((elapsed / autoPlayDuration) * 100, 100);
        setProgress(percentage);

        if (percentage < 100) {
          timer = requestAnimationFrame(animate);
        }
      };

      animate();
    };

    const resetProgress = () => {
      cancelAnimationFrame(timer);
      setProgress(0);
      updateProgress();
    };

    updateProgress();
    carousel.on('change', resetProgress);

    return () => {
      cancelAnimationFrame(timer);
      carousel.off('change', resetProgress);
    };
  }, [carousel, autoPlayDuration]);

  return (
    <div className={cx('timer-bar-container')}>
      <div
        className={cx('timer-bar')}
        style={{
          width: `${progress}%`,
        }}
      />
    </div>
  );
};

TimerBar.propTypes = {
  carousel: PropTypes.object,
  autoPlayDuration: PropTypes.number
};

export default TimerBar;
