import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './MegaMenuSubMenu.module.scss';
import { useQuery, gql } from '@apollo/client';
import DOMPurify from 'dompurify';

const cx = classNames.bind(styles);

const GET_MENU_ITEM = gql`
  query menuItem($id: ID!) {
    menuItem(id: $id, idType: DATABASE_ID) {
      megaMenu {
        megaDesc
      }
    }
  }
`;

export default function MegaMenuSubMenu({ item, ariaHidden }) {
  const { loading, error, data } = useQuery(GET_MENU_ITEM, {
    variables: { id: item },
  });

  // Handle loading, error, or missing description
  if (loading || error || !data?.menuItem?.megaMenu?.megaDesc) return null;

  // Sanitize the HTML content
  const sanitizedDescription = DOMPurify.sanitize(data.menuItem.megaMenu.megaDesc);

  return (
    <div
      className={`${cx('mega')} grid grid--full`}
      aria-hidden={ariaHidden}
    >
      <div className={`${cx('mega__container')} col-2-span-12 grid`}>
        <div
          className={`${cx('mega-description')} col-1-span-4`}
          dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
        />
      </div>
    </div>
  );
}

MegaMenuSubMenu.propTypes = {
  item: PropTypes.number.isRequired,
  ariaHidden: PropTypes.string,
};
