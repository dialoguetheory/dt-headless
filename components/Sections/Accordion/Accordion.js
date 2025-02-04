import className from 'classnames/bind';
import { Section } from "../../../components";
import styles from './Accordion.module.scss';
import DOMPurify from 'dompurify';
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
  onPageCount,
  dataFromPrevious, 
  onDataPass,
}) => {

  if (!sectionTitle && !sectionDesc && !items) {
    return null;
  }

  let hideHeader = (!sectionTitle || (hideSectionTitle && !sectionDesc)) ? true : false;

  const props = {
    id: onPageCount,
    classes: cx("accordion", sectionClasses)
  }

  return (
    <Section props={props} dataFromPrevious={dataFromPrevious} onDataPass={onDataPass}>
      <div className={cx('section__header', 'flex-dir-col', 'col-2-span-12', {
        'visually-hidden': hideHeader,
        })}
      >
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
            <div className={cx('section__desc', 'rt')} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(sectionDesc) }} />
        )}
      </div>
      <div className={cx('section__content', 'col-2-span-12', 'col-3-span-9@md')}>
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
                <div className={cx('rt')} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(desc) }} />
              </div>
            </details>
          );
        })}
      </div>
    </Section>
  );
};

AccordionSection.propTypes = {
  sectionTitle: PropTypes.string,
  hideSectionTitle: PropTypes.bool,
  sectionDesc: PropTypes.string,
  sectionClasses: PropTypes.string,
  onPageCount: PropTypes.number.isRequired,
  dataFromPrevious: PropTypes.object,
  onDataPass: PropTypes.func,
};

export default AccordionSection;