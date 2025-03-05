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
        ... on Anchor {
          anchorCustomFields {
            fieldGroupName
            anchorSlug
          }
        }
      }
    }
    items {
      itemTitle
      itemContent
    }
  }
`;
