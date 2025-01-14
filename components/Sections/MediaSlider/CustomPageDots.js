import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import className from 'classnames/bind';
import styles from './MediaSlider.module.scss';

let cx = className.bind(styles || {});

const CustomPageDots = ({ carousel, totalSlides, customClass }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (carousel) {
      carousel.on('select', () => {
        setCurrentIndex(carousel.selectedIndex);
      });
    }
  }, [carousel]);

  const handleDotClick = (index) => {
    if (carousel) {
      carousel.select(index);
    }
  };

  return (
    <div className={cx('page-dots', customClass)}>
      {Array.from({ length: totalSlides }).map((_, index) => (
        <button
          key={index}
          className={cx('page-dot', { 'is-active': index === currentIndex })}
          onClick={() => handleDotClick(index)}
        />
      ))}
    </div>
  );
};

CustomPageDots.propTypes = {
  carousel: PropTypes.object,
  totalSlides: PropTypes.number,
  customClass: PropTypes.string,
};

export default CustomPageDots;
