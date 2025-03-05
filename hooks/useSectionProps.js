import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';

const useSectionProps = (args = {}, dataFromPrevious = {}, onDataPass) => {
  const initialProps = {
    classes: '',
    bgColor: 'light-1',
    rememberBgColor: false
  };

  const props = { ...initialProps, ...args };
  const [sectionProps, setSectionProps] = useState(props);
  const [currentData, setCurrentData] = useState(dataFromPrevious);

  useEffect(() => {
    const newData = { bgColor: props.bgColor };

    // Update `currentData` if necessary
    if (JSON.stringify(newData) !== JSON.stringify(currentData)) {
      setCurrentData(newData);
      if (onDataPass) {
        onDataPass(newData);
      }
    }

    // Dynamically compute classes
    const computedClasses = classNames({
      [props.classes]: !!props.classes, // Include base classes if any
      [props.bgColor]: true, // Always add the current bgColor
      'bg-color-repeated': dataFromPrevious.bgColor === newData.bgColor,
    });

    // Update `sectionProps` with the computed classes
    setSectionProps((prev) => ({
      ...prev,
      classes: computedClasses,
    }));

  }, [props.classes, props.bgColor, dataFromPrevious, onDataPass, currentData]);

  return { sectionProps, currentData };
};

export default useSectionProps;
