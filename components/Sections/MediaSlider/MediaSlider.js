import useEmblaCarousel from 'embla-carousel-react';
import PropTypes from 'prop-types';
import { Section, VideoLightbox, SecureRichText } from '../../../components';
import classNames from 'classnames/bind';
import styles from './MediaSlider.module.scss';
import { NextButton, PrevButton, usePrevNextButtons } from './buttons';
import { DotButton, useDotButton } from './dots';
import { commonSectionProps } from '../../../types/sectionProps';

const cx = classNames.bind(styles || {});

const MediaSliderSection = ({
  index,
  sectionTitle,
  hideSectionTitle,
  sectionDesc,
  sectionClasses,
  slides = [],
  autoPlay,
  adaptiveHeight,
  captions,
  wrapAround,
  speed = 4000,
  thumbs,
  buttons,
  dots,
  dataFromPrevious, 
  onDataPass,
  anchorDest
}) => {
  if (!slides.length && !sectionTitle && !sectionDesc) return null;

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    speed,
    draggable: true,
    containScroll: 'trimSnaps',
  });

  // console.log(emblaApi);

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi);
  const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } = usePrevNextButtons(emblaApi);

  const hideHeader = !sectionTitle || (hideSectionTitle && !sectionDesc);

  const props = {
    id: index,
    classes: cx('media-slider', 'js-contains-slider', sectionClasses)
  }

  return (
    <Section anchorDest={anchorDest} props={props} dataFromPrevious={dataFromPrevious} onDataPass={onDataPass}>
      <div className={cx('section__header', 'flex-dir-col', 'col-2-span-12', {
        'visually-hidden': hideHeader,
      })}>
        {sectionTitle && <h2 className={cx('h2', { 'visually-hidden': hideSectionTitle })}>{sectionTitle}</h2>}
        {sectionDesc && <SecureRichText content={sectionDesc} className={cx('section__desc', 'rt')} />}
      </div>

      {slides.length > 0 && (
        <div className={cx('section__content', 'col-2-span-12')}>
          <div className={cx("embla")}>
            <div className={cx("embla__viewport")} ref={emblaRef}>
              <div className={cx("embla__container")}>
                {slides.map((slide, idx) => (
                  <div className={cx("embla__slide")} key={idx}>
                    {slide.fieldGroupName === "AdditionalSectionsSectionsSlidesImageLayout" && <ImageSlide slide={slide} captions={captions} />}
                    {slide.fieldGroupName === "AdditionalSectionsSectionsSlidesVideoLayout" && <VideoSlide slide={slide} captions={captions} />}
                    {slide.fieldGroupName === "AdditionalSectionsSectionsSlidesEmbedLayout" && <EmbedSlide slide={slide} captions={captions} />}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={cx("embla__controls")}>
            {buttons &&
              <div className={cx("embla__buttons")}>
                <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
                <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
              </div>
            }
            {dots &&
              <div className={cx("embla__dots")}>
                {scrollSnaps.map((_, index) => (
                  <DotButton
                    key={index}
                    onClick={() => onDotButtonClick(index)}
                    className={cx('embla__dot', {
                      'embla__dot--selected': index === selectedIndex,
                    })}
                  />
                ))}
              </div>
            }
          </div>
        </div>
      )}
    </Section>
  );
};

const ImageSlide = ({ slide, captions }) => (
  <div className={cx('image')}>
    <figure>
      <img src={slide.image.node.sourceUrl} alt={slide.image.node.altText} sizes={slide.image.node.sizes} srcSet={slide.image.node.srcSet} />
      {captions && slide.image.node.caption && <SecureRichText content={slide.image.node.caption} as="figcaption" /> }
    </figure>
  </div>
);

const VideoSlide = ({ slide, captions }) => (
  <div className={cx('video')}>
    <figure>
      <img src={slide.image.node.sourceUrl} alt={slide.image.node.altText} sizes={slide.image.node.sizes} srcSet={slide.image.node.srcSet} />
      {captions && slide.caption && <SecureRichText content={slide.caption} as="figcaption" /> }
    </figure>
    <VideoLightbox videoUrl={slide.videoUrl} />
  </div>
);

const EmbedSlide = ({ slide, captions }) => (
  <div className={cx('embed')}>
    <figure>
      <img src={slide.image.node.sourceUrl} alt={slide.image.node.altText} sizes={slide.image.node.sizes} srcSet={slide.image.node.srcSet} />
      {captions && slide.caption && <SecureRichText content={slide.caption} as="figcaption" /> }
    </figure>
    <VideoLightbox embed={slide.embed} />
  </div>
);


MediaSliderSection.propTypes = {
  ...commonSectionProps,
  sectionTitle: PropTypes.string,
  hideSectionTitle: PropTypes.bool,
  sectionDesc: PropTypes.string,
  slides: PropTypes.arrayOf(
    PropTypes.shape({
      videoUrl: PropTypes.string,
      embed: PropTypes.string,
      caption: PropTypes.string,
      image: PropTypes.shape({
        node: PropTypes.shape({
          altText: PropTypes.string,
          caption: PropTypes.string,
          sourceUrl: PropTypes.string,
          mediaItemUrl: PropTypes.string,
          sizes: PropTypes.string,
          srcSet: PropTypes.string,
        }),
      }),
    })
  ),
  autoPlay: PropTypes.bool,
  cellAlign: PropTypes.string,
  buttons: PropTypes.bool,
  dots: PropTypes.bool,
  wrapAround: PropTypes.bool,
  speed: PropTypes.number,
  adaptiveHeight: PropTypes.bool,
  thumbs: PropTypes.bool,
  captions: PropTypes.bool
};

export default MediaSliderSection;
