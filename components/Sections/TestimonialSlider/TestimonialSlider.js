import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Section } from "../../../components";
import className from 'classnames/bind';
import styles from './TestimonialSlider.module.scss';
import 'flickity/dist/flickity.min.css'; // Import Flickity CSS

let cx = className.bind(styles);
let agent = true;

const TestimonialSliderSection = ({
  sectionTitle,
  hideSectionTitle,
  sectionDesc,
  sectionClasses,
  slides,
  index,
  adaptiveHeight,
  captions,
  cellAlign,
  wrapAround,
  speed,
  setGallerySize,
  thumbs,
  onPageCount,
  dataFromPrevious, 
  onDataPass,
}) => {
  const originalSliderRef = useRef(null);
  const thumbnailSliderRef = useRef(null);
  const agentSliderRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const Flickity = require('flickity');

      const originalInstance = new Flickity(originalSliderRef.current, {
        cellAlign: cellAlign || 'center',
        wrapAround: wrapAround || false,
        autoPlay: speed || false,
        adaptiveHeight: adaptiveHeight || false,
        setGallerySize: setGallerySize || true,
      });

      let thumbnailInstance;
      if (thumbs) {
        thumbnailInstance = new Flickity(thumbnailSliderRef.current, {
          asNavFor: originalSliderRef.current,
          contain: true,
          pageDots: false,
          cellAlign: 'left',
        });
      }

      let agentInstance;
      if (agent) {
        agentInstance = new Flickity(agentSliderRef.current, {
          cellAlign: 'center',
          wrapAround: true,
          pageDots: true,
          autoPlay: false,
        });
      }

      return () => {
        originalInstance.destroy();
        if (thumbs && thumbnailInstance) thumbnailInstance.destroy();
        if (agent && agentInstance) agentInstance.destroy();
      };
    }
  }, [cellAlign, wrapAround, speed, adaptiveHeight, setGallerySize, slides, thumbs]);

  if (!sectionTitle && !sectionDesc && !slides) {
    return null;
  }

  const hideHeader = (!sectionTitle || (hideSectionTitle && !sectionDesc)) && 'visually-hidden';

  const props = {
    id: onPageCount,
    classes: `${cx('testimonial-slider')} js-contains-slider`
  }

  return (
    <Section props={props} dataFromPrevious={dataFromPrevious} onDataPass={onDataPass}>
      <div className={cx('section__header', 'col-2-span-12', 'flex-dir-col', `${hideHeader}`)}>
        {sectionTitle && (
          <h2
            className={cx('section__title', 'h2', {
              'visually-hidden': hideSectionTitle,
            })}
          >
            {sectionTitle}
          </h2>
        )}
        {sectionDesc && (
          <div className={cx('section__desc', 'rt')} dangerouslySetInnerHTML={{ __html: sectionDesc }} />
        )}
      </div>
      <div className="section__content col-1-span-14">

        {/* Main Slider */}
        <div ref={originalSliderRef} className={cx('slider', 'js-slider', { 'js-slider-principal': agent })}>
          {slides && slides.length > 0 && slides.map((slide, idx) => (
            <div key={`original-${idx}`} className={cx('slider-cell')}>
              <figure>
                <img
                  src={slide.image.node.sourceUrl}
                  alt={slide.image.node.altText}
                  sizes={slide.image.node.sizes}
                  srcSet={slide.image.node.srcSet}
                />
                {captions && slide.image.node.caption && <figcaption>{slide.image.node.caption}</figcaption>}
              </figure>
            </div>
          ))}
        </div>

        {/* Agent Slider */}
        {agent && (
          <div ref={agentSliderRef} className={cx('slider', 'js-slider', 'js-slider-agent')}>
            {slides && slides.length > 0 && slides.map((slide, idx) => (
              <div key={`agent-${idx}`} className={cx('slider-cell')}>
                <div className={cx('agent-card')}>
                  <img
                    src={slide.image.node.sourceUrl}
                    alt={slide.image.node.altText}
                    sizes={slide.image.node.sizes}
                    srcSet={slide.image.node.srcSet}
                  />
                  <div className={cx('agent-details')}>
                    <h3>{slide.agentName || 'Agent Name'}</h3>
                    <p>{slide.agentTitle || 'Agent Title'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Thumbnails Slider */}
        {thumbs && (
          <div ref={thumbnailSliderRef} className={cx('slider', 'js-slider', 'js-slider-thumbnails')}>
            {slides && slides.length > 0 && slides.map((slide, idx) => (
              <div key={`thumbnail-${idx}`} className={cx('slider-cell')}>
                <img
                  src={slide.image.node.sourceUrl}
                  alt={slide.image.node.altText}
                  sizes={slide.image.node.sizes}
                  srcSet={slide.image.node.srcSet}
                />
              </div>
            ))}
          </div>
        )}

        
      </div>
    </Section>
  );
};

TestimonialSliderSection.propTypes = {
  sectionTitle: PropTypes.string,
  hideSectionTitle: PropTypes.bool,
  sectionDesc: PropTypes.string,
  sectionClasses: PropTypes.string,
  slides: PropTypes.arrayOf(PropTypes.shape({
    sourceUrl: PropTypes.string,
    altText: PropTypes.string,
    caption: PropTypes.string,
    sizes: PropTypes.string,
    srcSet: PropTypes.string,
  })),
  dataFromPrevious: PropTypes.object,
  onDataPass: PropTypes.func,
  cellAlign: PropTypes.arrayOf(PropTypes.oneOf(['left', 'center', 'right'])),
  wrapAround: PropTypes.bool,
  speed: PropTypes.number,
  adaptiveHeight: PropTypes.bool,
  thumbs: PropTypes.bool,
  setGallerySize: PropTypes.bool,
  captions: PropTypes.bool,
  timer: PropTypes.bool,
  counter: PropTypes.bool,
  onPageCount: PropTypes.number.isRequired,
  dataFromPrevious: PropTypes.object,
  onDataPass: PropTypes.func,
};

export default TestimonialSliderSection;
