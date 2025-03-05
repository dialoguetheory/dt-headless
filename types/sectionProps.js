import PropTypes from 'prop-types';

export const commonSectionProps = {
  index: PropTypes.number.isRequired,
  fieldGroupName: PropTypes.string,
  sectionClasses: PropTypes.string,
  anchorDest: PropTypes.shape({
    nodes: PropTypes.arrayOf(
      PropTypes.shape({
        anchorCustomFields: PropTypes.shape({
          anchorSlug: PropTypes.string
        })
      })
    )
  }),
  dataFromPrevious: PropTypes.object,
  onDataPass: PropTypes.func
};