import PropTypes from 'prop-types';
import className from 'classnames/bind';
import styles from './Basic.module.scss';
import useSectionProps from '../../../hooks/useSectionProps';

let cx = className.bind(styles);

const BasicSection = ({
  sectionTitle,
  hideSectionTitle,
  sectionDesc,
  sectionClasses,
  dataFromPrevious, 
  onDataPass
}) => {

  if (!sectionTitle && !sectionDesc) {
    return null;
  }

  let hideHeader = (!sectionTitle || (hideSectionTitle && !sectionDesc)) && 'visually-hidden';
  let { sectionProps } = useSectionProps({}, dataFromPrevious, onDataPass);
  
  return (
    <section className={cx('section', 'col-1-span-14', 'grid', 'grid--full', `${sectionClasses}`, `${sectionProps.classes}`)}>
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
    </section>
  );
};

BasicSection.propTypes = {
  sectionTitle: PropTypes.string,
  hideSectionTitle: PropTypes.bool,
  sectionDesc: PropTypes.string,
  sectionClasses: PropTypes.string,
  dataFromPrevious: PropTypes.object,
  onDataPass: PropTypes.func,
};

export default BasicSection;