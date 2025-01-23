import { gql } from '@apollo/client';

export const NavigationMenuItemFragment = gql`
  fragment NavigationMenuItemFragment on MenuItem {
    id
    databaseId
    parentId
    path
    url
    label
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
`;
