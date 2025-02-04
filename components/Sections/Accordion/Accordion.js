import PropTypes from 'prop-types';
import className from 'classnames/bind';
import { Section } from "../../../components";
import styles from './Accordion.module.scss';
import DOMPurify from "isomorphic-dompurify";

import {
  handleItem,
  shrink,
  open
} from './accordionScripts';

const cx = className.bind(styles);

const AccordionSection = ({
  sectionTitle,
  hideSectionTitle,
  sectionDesc,
  sectionClasses,
  items,
  index,
  dataFromPrevious, 
  onDataPass,
}) => {

  if (!sectionTitle && !sectionDesc) return null;

  const hideHeader = !sectionTitle || (hideSectionTitle && !sectionDesc);

  const props = {
    id: index,
    classes: cx("accordion", sectionClasses)
  }

  return (
    <Section props={props} dataFromPrevious={dataFromPrevious} onDataPass={onDataPass}>
      <div className={cx('section__header', 'flex-dir-col', 'col-2-span-12', {
        'visually-hidden': hideHeader,
        })}
      >
        {sectionTitle && (
          <h2 className={cx('section__title', 'h2', { 'visually-hidden': hideSectionTitle })}>
            {sectionTitle}
          </h2>
        )}
        {sectionDesc && (
            <div className={cx('section__desc', 'rt')} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(sectionDesc) }} />
        )}
      </div>
      <div className={cx('section__content', 'col-2-span-12', 'col-3-span-9@md')}>
        {items.map((item, index) => {
          const { itemTitle, itemContent } = item;
          if (!itemTitle || !itemContent) {
            return null;
          }
          return (
            <details className={cx('details')} key={index}>
              <summary className={cx('summary', 'h3')} onClick={(e) => handleItem(e, open, shrink)}>
                {itemTitle}
              </summary>
              <div className={cx('content')} data-accordion="content">
                {itemContent && (
                  <div className={cx('rt')} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(itemContent) }} />
                )}
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
  index: PropTypes.number.isRequired,
  dataFromPrevious: PropTypes.object,
  onDataPass: PropTypes.func,
};

export default AccordionSection;