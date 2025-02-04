import { gql } from '@apollo/client';

export const AccordionLayoutFragment = gql`
  fragment AccordionLayoutFragment on AdditionalSectionsSectionsAccordionLayout {
    fieldGroupName
    hideSectionTitle
    sectionLabel
    sectionTitle
    sectionDesc
    anchorDest {
      nodes {
        databaseId
      }
    }
    items {
      itemTitle
      itemContent
    }
  }
`;
