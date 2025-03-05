import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './Basic.module.scss';
import { Section, SecureRichText } from "../../../components";
import { commonSectionProps } from '../../../types/sectionProps';

const cx = classNames.bind(styles);

const BasicSection = ({
  sectionLabel,
  sectionTitle,
  hideSectionTitle,
  sectionDesc,
  sectionClasses,
  index,
  dataFromPrevious, 
  onDataPass,
  anchorDest
}) => {
  if (!sectionTitle && !sectionDesc) return null;

  const hideHeader = !sectionTitle || (hideSectionTitle && !sectionDesc);

  const props = {
    id: index,
    classes: cx('simple', sectionClasses)
  }

  return (
    <Section anchorDest={anchorDest} props={props} dataFromPrevious={dataFromPrevious} onDataPass={onDataPass}>
      <div className={cx('section__header', 'flex-dir-col', 'col-2-span-12', {
        'visually-hidden': hideHeader,
        })}
      >
        {sectionTitle && (
          <h2 className={cx('section__title', 'h2', { 'visually-hidden': hideSectionTitle })}>
            {sectionTitle}
          </h2>
        )}
        {sectionLabel && (
          <p className={cx('section__label', 'visually-first')}>{sectionLabel}</p>
        )}
        {sectionDesc && (
          <SecureRichText content={sectionDesc} className={cx('section__desc', 'rt')} />
        )}
      </div>
    </Section>
  );
};

BasicSection.propTypes = {
  ...commonSectionProps,
  sectionTitle: PropTypes.string,
  sectionLabel: PropTypes.string,
  hideSectionTitle: PropTypes.bool,
  sectionDesc: PropTypes.string
};

export default BasicSection;
