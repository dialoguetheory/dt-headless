import { useEffect, useState, useMemo, useCallback } from 'react';
import { useQuery } from '@apollo/client';
import Link from 'next/link';
import classNames from 'classnames/bind';
import styles from './MobileMenu.module.scss';
import { flatListToHierarchical } from '@faustwp/core';
import { MENU_ITEMS_QUERY } from './MobileMenuItemsQuery.js';
import { MegaMenuSubMenu } from '../../components';
import { isValidUrl } from '../../utils/isValidUrl';
import MenuToggleIcon from '../../icons/menu-toggle-icon.svg';
import * as BREAKPOINTS from '../../constants/breakpoints';

const cx = classNames.bind(styles);

const openStartedClass = 'tray-open-started';
const openedClass = 'tray-opened';

export default function MobileMenu({ location, className, ariaControls }) {
  const [currentPath, setCurrentPath] = useState('');
  const [isNavShown, setIsNavShown] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [openStates, setOpenStates] = useState({});

  const { data, loading, error } = useQuery(MENU_ITEMS_QUERY, { variables: { location } });

  // Set current path
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname.endsWith('/') ? window.location.pathname : `${window.location.pathname}/`);
    }
  }, []);

  // Manage scroll-lock based on nav visibility
  useEffect(() => {
    const htmlElement = document.documentElement;
    if (isNavShown) {
      htmlElement.classList.add('scroll-lock');
    } else {
      htmlElement.classList.remove('scroll-lock');
    }
    return () => htmlElement.classList.remove('scroll-lock');
  }, [isNavShown]);

  // Handle resizing to close nav on larger screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > BREAKPOINTS.MD) {
        setIsNavShown(false);
        setIsOpening(false);
        setOpenStates({});
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Toggle the entire navigation
  const toggleNavigation = useCallback(() => {
    if (!isNavShown) {
      setIsOpening(true);
      setTimeout(() => {
        setIsOpening(false);
        setIsNavShown(true);
      }, 300);
    } else {
      setIsNavShown(false);
    }
  }, [isNavShown]);

  // Toggle individual menu items
  const toggleMenuItem = useCallback(id => {
    setOpenStates(prev => ({ ...prev, [id]: !prev[id] }));
  }, []);

  // Check if a menu item is open
  const isMenuItemOpen = useCallback(id => !!openStates[id], [openStates]);

  // Process hierarchical menu items
  const hierarchicalMenuItems = useMemo(() => 
    data?.menuItems?.nodes ? flatListToHierarchical(data.menuItems.nodes) : [], [data]);

  // Render menu items recursively
  const renderMenuItems = useCallback((items, depth = 0) => 
    items.map(menuItem => {
      const { id, url, title, label, cssClasses, megaMenu, path, databaseId, target, linkRelationship } = menuItem;
      const isValid = isValidUrl(url);
      const isOpen = isMenuItemOpen(id);
      const isCurrent = currentPath === path;
      const enableMegaMenu = megaMenu?.enableMegaMenu;

      if (!isValid) return null;

      return (
        <li key={id} className={cx('menu-item', cssClasses, `menu-item-depth-${depth}`)}>
          <Link
            href={url || '#'}
            title={title || undefined}
            target={target || undefined}
            rel={target === '_blank' && !linkRelationship ? 'noopener noreferrer' : linkRelationship || undefined}
            aria-current={isCurrent ? 'page' : undefined}
            className={cx('menu-btn', `menu-btn-depth-${depth}`, { 'is-current': isCurrent, 'toggle-btn': enableMegaMenu })}
            aria-expanded={enableMegaMenu ? isOpen : undefined}
            onClick={e => {
              if (enableMegaMenu) {
                e.preventDefault();
                toggleMenuItem(id);
              }
            }}
          >
            {label || ''}
          </Link>
          {enableMegaMenu && <MegaMenuSubMenu item={databaseId} ariaHidden={isOpen ? 'false' : 'true'} />}
        </li>
      );
    }), [currentPath, openStates, toggleMenuItem, isMenuItemOpen]);

  if (process.env.NODE_ENV === 'development') {
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
  }

  return (
    <>
      <button
        type="button"
        id="js-tray__toggle"
        className={`${cx('tray__toggle')} hidden@md unbtn`}
        onClick={toggleNavigation}
        aria-label={isNavShown ? 'Close navigation' : 'Open navigation'}
        aria-controls={ariaControls}
        aria-expanded={isNavShown}
      >
        <div className={cx('tray__toggle-inner')}>
          <span className="screen-reader-text">Toggle mobile menu</span>
          <MenuToggleIcon />
        </div>
      </button>
      <div
        id="js-tray"
        className={cx('tray', { [openStartedClass]: isOpening, [openedClass]: isNavShown }, 'col-1-span-14', 'grid', 'grid--full')}
      >
        <nav
          id="js-nav--main--tray"
          className={`${cx('menu', className)} hidden@md`}
          role="navigation"
          aria-label={data?.menuItems?.nodes[0]?.menu?.node?.name || 'Menu'}
        >
          <ul className={cx('menu')}>
            {renderMenuItems(hierarchicalMenuItems)}
          </ul>
        </nav>
      </div>
    </>
  );
}
