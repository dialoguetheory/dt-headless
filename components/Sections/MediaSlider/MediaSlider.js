import React, { useEffect, useRef, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Section } from "../../../components";
import DOMPurify from "isomorphic-dompurify"
import className from 'classnames/bind';
import styles from './MediaSlider.module.scss';
import CustomButtons from './CustomButtons';
import CustomPageDots from './CustomPageDots';
import SliderCounter from './SliderCounter';
import ProgressBar from './ProgressBar';
import TimerBar from './TimerBar';
import 'flickity/dist/flickity.min.css';

let cx = className.bind(styles || {});

const MediaSliderSection = ({
  index,
  sectionTitle,
  hideSectionTitle,
  sectionDesc,
  sectionClasses,
  slides = [],
  adaptiveHeight = false,
  captions = false,
  cellAlign = 'center',
  wrapAround = false,
  speed = false,
  setGallerySize = true,
  thumbs = false,
  previousNextButtons = [],
  pageDots = [],
  timer = [],
  counter = false,
  progressBar = false,
  pauseOnHover = true,
  dataFromPrevious, 
  onDataPass,
}) => {
  const originalSliderRef = useRef(null);
  const originalInstanceRef = useRef(null);
  const thumbnailSliderRef = useRef(null);
  const [sliderState, setSliderState] = useState('default');

  const initializeCarousel = useCallback(() => {
    const Flickity = require('flickity');
    if (originalInstanceRef.current) originalInstanceRef.current.destroy();

    const options = {
      cellAlign,
      wrapAround,
      autoPlay: speed,
      adaptiveHeight,
      setGallerySize,
      prevNextButtons: previousNextButtons.includes('true'),
      pageDots: pageDots.includes('true'),
      pauseAutoPlayOnHover: pauseOnHover,
    };

    originalInstanceRef.current = new Flickity(originalSliderRef.current, options);
    setSliderState(originalInstanceRef.current.player?.state || 'default');

    originalInstanceRef.current.on('change', () => {
      setSliderState(originalInstanceRef.current.player?.state || 'default');
    });

    if (pauseOnHover) {
      const handleHover = (state) => () => setSliderState(state);

      const sliderElement = originalSliderRef.current;
      sliderElement.addEventListener('mouseenter', handleHover('paused'));
      sliderElement.addEventListener('mouseleave', handleHover(originalInstanceRef.current.player?.state || 'default'));

      return () => {
        sliderElement.removeEventListener('mouseenter', handleHover('paused'));
        sliderElement.removeEventListener('mouseleave', handleHover('default'));
      };
    }
  }, [cellAlign, wrapAround, speed, adaptiveHeight, setGallerySize, previousNextButtons, pageDots, pauseOnHover]);

  const initializeThumbnails = useCallback(() => {
    if (!thumbs) return;

    const Flickity = require('flickity');
    if (thumbnailSliderRef.current) {
      new Flickity(thumbnailSliderRef.current, {
        asNavFor: originalSliderRef.current,
        contain: true,
        pageDots: false,
        cellAlign: 'left',
      });
    }
  }, [thumbs]);

  useEffect(() => {
    if (typeof window === 'undefined' || !slides.length) return;

    const cleanupCarousel = initializeCarousel();
    initializeThumbnails();

    return () => {
      cleanupCarousel?.();
      originalInstanceRef.current?.destroy();
    };
  }, [initializeCarousel, initializeThumbnails, slides]);

  if (!sectionTitle && !sectionDesc && !slides.length) return null;

  const hideHeader = !sectionTitle || (hideSectionTitle && !sectionDesc) ? 'visually-hidden' : '';

  const props = {
    id: index,
    classes: cx('media-slider', 'js-contains-slider', sectionClasses)
  }

  return (

    <Section props={props} dataFromPrevious={dataFromPrevious} onDataPass={onDataPass} data-slider={"wrapper"}>
      <div className={cx('section__header', 'col-2-span-12', 'flex-dir-col', hideHeader)}>
        {sectionTitle && (
          <h2 className={cx('section__title', 'h2', { 'visually-hidden': hideSectionTitle })}>
            {sectionTitle}
          </h2>
        )}
        {sectionDesc && (
          <div className={cx('section__desc', 'rt')} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(sectionDesc) }} />
        )}
      </div>

      {slides.length > 0 && (
        <div className={cx('section__content', 'col-1-span-14')} data-state={sliderState}>
          <div ref={originalSliderRef} className={cx('slider', 'js-slider', { 'js-slider-principal': thumbs })} data-slider={"principal"}>
            {slides.map((slide, idx) => (
              <div key={`original-${idx}`} className={cx('slider-cell')}>
                <figure>
                  <img
                    src={slide.image.node.sourceUrl}
                    alt={slide.image.node.altText}
                    sizes={slide.image.node.sizes}
                    srcSet={slide.image.node.srcSet}
                  />
                  {captions && slide.image.node.caption && (
                    <figcaption>{slide.image.node.caption}</figcaption>
                  )}
                </figure>
              </div>
            ))}
          </div>

          {previousNextButtons.includes('custom') && (
            <CustomButtons
              onNext={() => originalInstanceRef.current.next()}
              onPrev={() => originalInstanceRef.current.previous()}
            />
          )}

          {pageDots.includes('custom') && (
            <CustomPageDots
              carousel={originalInstanceRef.current}
              totalSlides={slides.length}
              customClass=""
            />
          )}

          {counter && <SliderCounter carousel={originalInstanceRef.current} totalSlides={slides.length} />}
          {progressBar && <ProgressBar carousel={originalInstanceRef.current} totalSlides={slides.length} />}
          {timer && timer.includes('single') && (
            <TimerBar carousel={originalInstanceRef.current} autoPlayDuration={speed} />
          )}

          {thumbs && (
            <div ref={thumbnailSliderRef} className={cx('slider', 'js-slider', 'js-slider-thumbnails')} data-slider={"thumbnails"}>
              {slides.map((slide, idx) => (
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
      )}
    </Section>
  );
};

MediaSliderSection.propTypes = {
  index: PropTypes.number.isRequired,
  dataFromPrevious: PropTypes.object,
  onDataPass: PropTypes.func,
  sectionTitle: PropTypes.string,
  hideSectionTitle: PropTypes.bool,
  sectionDesc: PropTypes.string,
  sectionClasses: PropTypes.string,
  slides: PropTypes.arrayOf(
    PropTypes.shape({
      embedVideo: PropTypes.string,
      videoDesc: PropTypes.string,
      youtubeEmbedImage: PropTypes.shape({
        node: PropTypes.shape({
          altText: PropTypes.string,
          sourceUrl: PropTypes.string,
          sizes: PropTypes.string,
          srcSet: PropTypes.string,
        }),
      }),
      image: PropTypes.shape({
        node: PropTypes.shape({
          altText: PropTypes.string,
          sizes: PropTypes.string,
          sourceUrl: PropTypes.string,
          srcSet: PropTypes.string,
          caption: PropTypes.string,
        }),
      }),
    })
  ),
  cellAlign: PropTypes.arrayOf(PropTypes.oneOf(['left', 'center', 'right'])),
  previousNextButtons: PropTypes.arrayOf(PropTypes.oneOf(['false', 'true', 'custom'])),
  pageDots: PropTypes.arrayOf(PropTypes.oneOf(['false', 'true', 'custom'])),
  wrapAround: PropTypes.bool,
  speed: PropTypes.number,
  adaptiveHeight: PropTypes.bool,
  thumbs: PropTypes.bool,
  setGallerySize: PropTypes.bool,
  captions: PropTypes.bool,
  counter: PropTypes.bool,
  pauseOnHover: PropTypes.bool,
  progressBar: PropTypes.bool,
  timer: PropTypes.arrayOf(PropTypes.oneOf(['single', 'all'])),
  dataFromPrevious: PropTypes.object,
  onDataPass: PropTypes.func,
};

export default MediaSliderSection;