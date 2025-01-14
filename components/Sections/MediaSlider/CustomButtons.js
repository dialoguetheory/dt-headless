import React from 'react';
import PropTypes from 'prop-types';
import className from 'classnames/bind';
import styles from './MediaSlider.module.scss';

let cx = className.bind(styles || {});

const CustomButtons = ({ onNext, onPrev }) => (
  <div className={cx('btns')}>
    <button onClick={onPrev} className={cx('btn', 'btn--prev')}>Custom Previous</button>
    <button onClick={onNext} className={cx('btn', 'btn--next')}>Custom Next</button>
  </div>
);

CustomButtons.propTypes = {
  onNext: PropTypes.func.isRequired,
  onPrev: PropTypes.func.isRequired,
};

export default CustomButtons;
