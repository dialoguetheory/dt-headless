import { useEffect, useState, useMemo } from 'react';
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

  // Set current path
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentPath(
        window.location.pathname.endsWith('/')
          ? window.location.pathname
          : `${window.location.pathname}/`
      );
    }
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest('#js-nav--main--mega')) setOpenStates({});
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  // Hierarchical menu items
  const hierarchicalMenuItems = useMemo(
    () => (data?.menuItems?.nodes ? flatListToHierarchical(data.menuItems.nodes) : []),
    [data]
  );

  // Toggle menu item state
  const handleToggleMenu = (id) => {
    setOpenStates((prev) => ({
      [id]: !prev[id], // Toggle the clicked item
    }));
  };

  // Check if menu item is open
  const isMenuItemOpen = (id) => !!openStates[id];

  // Render menu items
  const renderMenuItems = (items, depth = 0) => {
    return items.map((menuItem) => {
      const {
        id,
        url,
        title,
        label,
        cssClasses,
        megaMenu,
        path,
        databaseId,
        target,
        linkRelationship,
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
            href={url || '#'}
            title={title || undefined}
            target={target || undefined}
            rel={
              target === '_blank' && !linkRelationship
                ? 'noopener noreferrer'
                : linkRelationship || undefined
            }
            aria-current={isCurrent ? 'page' : undefined}
            aria-expanded={enableMegaMenu ? isOpen : undefined}
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
  };

  if (process.env.NODE_ENV === 'development') {
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
  }

  return (
    <nav
      id="js-nav--main--mega"
      className={`${cx('component', 'menu', className)} visible@md`}
      role="navigation"
      aria-label={data?.menuItems?.nodes[0]?.menu?.node?.name || 'Menu'}
    >
      <ul className={`${cx('menu')} has-megas js-has-megas`}>
        {renderMenuItems(hierarchicalMenuItems)}
      </ul>
    </nav>
  );
}
