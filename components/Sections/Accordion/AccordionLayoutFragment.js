import { gql } from '@apollo/client';

export const AccordionLayoutFragment = gql`
  fragment AccordionLayoutFragment on AdditionalSectionsSectionsAccordionLayout {
    fieldGroupName
    hideSectionTitle
    sectionTitle
    sectionDesc
    anchorDest {
      nodes {
        databaseId
      }
    }
    items {
      desc
      title
    }
  }
`;
