import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import className from 'classnames/bind';
import styles from './MediaSlider.module.scss';

let cx = className.bind(styles || {});

const SliderCounter = ({ carousel, totalSlides }) => {
  const [currentIndex, setCurrentIndex] = useState(1);

  useEffect(() => {
    if (carousel) {
      const updateIndex = () => {
        setCurrentIndex(carousel.selectedIndex + 1);
      };

      carousel.on('select', updateIndex);

      return () => {
        carousel.off('select', updateIndex);
      };
    }
  }, [carousel]);

  return (
    <div className={cx('slider__counter')}>
      <p className={cx('js-slider-index')}>{currentIndex}</p>
      <span> / </span>
      <p>{totalSlides}</p>
    </div>
  );
};

SliderCounter.propTypes = {
  carousel: PropTypes.object,
  totalSlides: PropTypes.number
};

export default SliderCounter;
