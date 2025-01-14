import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { gql } from '@apollo/client';
import Link from 'next/link';
import styles from './NavigationMenu.module.scss';
import stylesFromWP from './NavigationMenuClassesFromWP.module.scss';
import { flatListToHierarchical } from '@faustwp/core';

let cx = classNames.bind(styles);
let cxFromWp = classNames.bind(stylesFromWP);

export default function NavigationMenu({ menuItems, className }) {
  if (!menuItems) {
    return null;
  }

  const [currentPath, setCurrentPath] = useState('');

  useEffect(() => {
    let path = window.location.pathname;
    if (!path.endsWith('/')) {
      path += '/';
    }
    setCurrentPath(path);
  }, []);

  const hierarchicalMenuItems = flatListToHierarchical(menuItems);

  function renderMenu(items, depth = 0) {
    return (
      <ul
        className={cx('menu', depth > 0 ? 'sub-menu' : '', 'flex')}
        data-depth={depth}>
        {items.map((item) => {
          const { id, path, label, children, cssClasses } = item;

          if (!item.hasOwnProperty('__typename')) {
            return null;
          }

          const additionalClasses = [];

          const itemClasses = cx(
            'menu-item',
            depth === 0 ? 'menu-item-depth-0' : `menu-item-depth-${depth}`,
            cxFromWp(cssClasses),
            additionalClasses
          );

          const isCurrent = currentPath === path;

          const linkAttributes = {
            className: cx(
              'menu-btn',
              `menu-btn-depth-${depth}`,
              children.length && 'has-children',
              isCurrent && 'is-current'
            ),
            href: path || '#',
            ...(item.title && { title: item.title }),
            ...(item.target && { target: item.target }),
            ...(item.target === '_blank' && !item.linkRelationship ? { rel: 'noopener noreferrer' } : item.linkRelationship && { rel: item.linkRelationship }),
            ...(isCurrent && { 'aria-current': 'page' }),
            ...(children.length && { role: 'button' }),
            ...(children.length && { 'aria-expanded': 'false' })
          };

          return (
            <li key={id} className={itemClasses}>
              <Link {...linkAttributes}>{label ?? ''}</Link>
              {children.length ? renderMenu(children, depth + 1) : null}
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <nav
      className={cx(['component', className])}
      role="navigation"
      aria-label={`${menuItems[0]?.menu?.node?.name} menu`}>
      {renderMenu(hierarchicalMenuItems)}
    </nav>
  );
}

NavigationMenu.fragments = {
  entry: gql`
    fragment NavigationMenuItemFragment on MenuItem {
      id
      path
      label
      parentId
      cssClasses
      title
      target
      linkRelationship
      menu {
        node {
          name
        }
      }
    }
  `,
};
