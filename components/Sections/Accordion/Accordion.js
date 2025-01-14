import PropTypes from 'prop-types';
import className from 'classnames/bind';
import styles from './Accordion.module.scss';
import useSectionProps from '../../../hooks/useSectionProps';
import {
  handleItem,
  shrink,
  open
} from './accordionScripts';

let cx = className.bind(styles);

const AccordionSection = ({
  sectionTitle,
  hideSectionTitle,
  sectionDesc,
  sectionClasses,
  items,
  dataFromPrevious, 
  onDataPass,
  index
}) => {

  if (!sectionTitle && !sectionDesc && !items) {
    return null;
  }

  let hideHeader = (!sectionTitle || (hideSectionTitle && !sectionDesc)) && 'visually-hidden';
  let { sectionProps } = useSectionProps({}, dataFromPrevious, onDataPass);

  return (
    <section id={index} className={cx('section', 'col-1-span-14', 'grid', 'grid--full', `${sectionClasses}`, `${sectionProps.classes}`)}>
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
      <div className="section__content col-2-span-12 col-3-span-9@md">
        {items.map((item, index) => {
          const { title, desc } = item;
          if (!title || !desc) {
            return null;
          }
          return (
            <details className={cx('details')} key={index}>
              <summary className={cx('summary', 'h3')} onClick={(e) => handleItem(e, open, shrink)}>
                {title}
              </summary>
              <div className={cx('js-accordion-content', 'content')}>
                <div className={cx('rt')} dangerouslySetInnerHTML={{ __html: desc }} />
              </div>
            </details>
          );
        })}
      </div>
    </section>
  );
};

AccordionSection.propTypes = {
  sectionTitle: PropTypes.string,
  hideSectionTitle: PropTypes.bool,
  sectionDesc: PropTypes.string,
  sectionClasses: PropTypes.string,
  dataFromPrevious: PropTypes.object,
  onDataPass: PropTypes.func,
};

export default AccordionSection;