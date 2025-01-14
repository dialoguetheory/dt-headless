import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { gql } from '@apollo/client';
import Link from 'next/link';
import styles from './MegaMenu.module.scss';
import stylesFromWP from './MegaMenuClassesFromWP.module.scss';
import { flatListToHierarchical } from '@faustwp/core';
// import { MegaMenu } from './MegaMenuScript';  // Import the MegaMenu class

let cx = classNames.bind(styles);
let cxFromWp = classNames.bind(stylesFromWP);

export default function MegaMenu({ menuItems, className }) {
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
    // const megaMenu = new MegaMenu();
  }, []);

  const hierarchicalMenuItems = flatListToHierarchical(menuItems);

  console.log(menuItems);

  function renderMenu(items, depth = 0) {
    return (
      <ul
        className={cx('menu', 'has-megas', 'js-has-megas', depth > 0 ? 'sub-menu' : '', 'flex')}
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
      id={`js-nav--main--mega`}
      className={cx(['component', className])}
      role="navigation"
      aria-label={`${menuItems[0]?.menu?.node?.name} menu`}>
      {renderMenu(hierarchicalMenuItems)}
    </nav>
  );
}

MegaMenu.fragments = {
  entry: gql`
    fragment MegaMenuItemFragment on MenuItem {
      id
      path
      label
      cssClasses
      title
      target
      linkRelationship
      parentId
      menu {
        node {
          name
        }
      }
      megaMenu {
        fieldGroupName
        megaDesc
        links {
          fieldGroupName
          itemText
          items {
            fieldGroupName
            ... on ItemsInternalLinkLayout {
              title
              post {
                nodes {
                  id
                }
              }
              fieldGroupName
            }
            ... on ItemsExternalLinkLayout {
              fieldGroupName
              title
              url
            }
          }
        }
      }
    }
  `,
};
