import { gql } from '@apollo/client';

export const MENU_ITEMS_QUERY = gql`
  query MENU_ITEMS($location: MenuLocationEnum!) {
    menuItems(where: { location: $location }) {
      nodes {
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
        megaMenu {
          enableMegaMenu
        }
      }
    }
  }
`;
