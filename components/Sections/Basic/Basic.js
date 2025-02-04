import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './Basic.module.scss';
import { Section } from "../../../components";
import DOMPurify from 'dompurify';

let cx = classNames.bind(styles);

const BasicSection = ({
  sectionTitle,
  hideSectionTitle,
  sectionDesc,
  sectionClasses,
  onPageCount,
  dataFromPrevious, 
  onDataPass,
}) => {

  if (!sectionTitle && !sectionDesc) {
    return null;
  }

  let hideHeader = (!sectionTitle || (hideSectionTitle && !sectionDesc)) ? true : false;

  const props = {
    id: onPageCount,
    classes: cx('simple', sectionClasses)
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
    </Section>
  );
};

BasicSection.propTypes = {
  sectionTitle: PropTypes.string,
  hideSectionTitle: PropTypes.bool,
  sectionDesc: PropTypes.string,
  sectionClasses: PropTypes.string,
  onPageCount: PropTypes.number.isRequired,
  dataFromPrevious: PropTypes.object,
  onDataPass: PropTypes.func,
};

export default BasicSection;
