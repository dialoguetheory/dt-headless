import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './MegaMenuSubMenu.module.scss';
import { useQuery, gql } from '@apollo/client';

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

  if (loading || error || !data?.menuItem?.megaMenu?.megaDesc) {
    return null; // Prevent rendering unnecessary content
  }

  return (
    <div
      className={`${cx('mega')} grid grid--full`}
      aria-hidden={ariaHidden}
    >
      <div className={`${cx('mega__container')} col-2-span-12 grid`}>
        <div
          className={`${cx('mega-description')} col-1-span-4`}
          dangerouslySetInnerHTML={{ __html: data.menuItem.megaMenu.megaDesc }}
        />
      </div>
    </div>
  );
}

MegaMenuSubMenu.propTypes = {
  item: PropTypes.number.isRequired,
  ariaHidden: PropTypes.string,
};
