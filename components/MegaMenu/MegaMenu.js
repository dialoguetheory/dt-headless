import { useEffect, useState, useMemo, useCallback } from 'react';
import { useQuery } from '@apollo/client';
import Link from 'next/link';
import classNames from 'classnames/bind';
import styles from './MegaMenu.module.scss';
import stylesFromWP from './MegaMenuClassesFromWP.module.scss';
import { flatListToHierarchical } from '@faustwp/core';
import { MENU_ITEMS_QUERY } from './MegaMenuItemsQuery.js';
import { isValidUrl } from '../../utils/isValidUrl';
import { MegaMenuSubMenu } from '../../components';

const cx = classNames.bind(styles);
const cxFromWp = classNames.bind(stylesFromWP);

export default function MegaMenu({ location, className }) {
  const [currentPath, setCurrentPath] = useState('');
  const [openStates, setOpenStates] = useState({});

  const { data, loading, error } = useQuery(MENU_ITEMS_QUERY, { variables: { location } });

  // Update current path
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      setCurrentPath(path.endsWith('/') ? path : `${path}/`);
    }
  }, []);

  // Close menus when clicking outside
  const handleOutsideClick = useCallback((e) => {
    if (!e.target.closest('#js-nav--main--mega')) setOpenStates({});
  }, []);

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [handleOutsideClick]);

  // Memoize hierarchical menu items
  const hierarchicalMenuItems = useMemo(() => {
    const nodes = data?.menuItems?.nodes || [];
    return flatListToHierarchical(nodes);
  }, [data]);

  // Toggle menu state
  const handleToggleMenu = useCallback((id) => {
    setOpenStates((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const isMenuItemOpen = useCallback((id) => !!openStates[id], [openStates]);

  // Utility: Get attributes for <Link>
  const getLinkAttributes = ({ url, target, linkRelationship, enableMegaMenu, isOpen, isCurrent }) => ({
    href: url || '#',
    target: target || undefined,
    rel: target === '_blank' && !linkRelationship ? 'noopener noreferrer' : linkRelationship || undefined,
    'aria-current': isCurrent ? 'page' : undefined,
    'aria-expanded': enableMegaMenu ? isOpen : undefined,
  });

  // Render menu items
  const renderMenuItems = (items, depth = 0) =>
    items.map((menuItem) => {
      const {
        id,
        url,
        title,
        label,
        cssClasses,
        megaMenu,
        path,
        databaseId,
      } = menuItem;

      if (!isValidUrl(url)) return null;

      const isOpen = isMenuItemOpen(id);
      const isCurrent = currentPath === path;
      const enableMegaMenu = megaMenu?.enableMegaMenu;

      return (
        <li
          key={id}
          className={cx('menu-item', cxFromWp(cssClasses), `menu-item-depth-${depth}`)}
        >
          <Link
            className={cx('menu-btn', `menu-btn-depth-${depth}`, {
              'is-current': isCurrent,
              'toggle-btn': enableMegaMenu,
            })}
            {...getLinkAttributes({ url, target: menuItem.target, linkRelationship: menuItem.linkRelationship, enableMegaMenu, isOpen, isCurrent })}
            title={title || undefined}
            onClick={(e) => {
              if (enableMegaMenu) {
                e.preventDefault();
                handleToggleMenu(id);
              }
            }}
          >
            {label || ''}
          </Link>
          {enableMegaMenu && (
            <MegaMenuSubMenu
              item={databaseId}
              ariaHidden={isOpen ? 'false' : 'true'}
            />
          )}
        </li>
      );
    });

  if (process.env.NODE_ENV === 'development') {
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
  }

  return (
    <nav
      id="js-nav--main--mega"
      className={className}
      role="navigation"
      aria-label={data?.menuItems?.nodes?.[0]?.menu?.node?.name || 'Menu'}
    >
      <ul className={cx('menu')}>
        {renderMenuItems(hierarchicalMenuItems)}
      </ul>
    </nav>
  );
}
