import { gql } from '@apollo/client';

export const BasicLayoutFragment = gql`
  fragment BasicLayoutFragment on AdditionalSectionsSectionsBasicLayout {
    fieldGroupName
    hideSectionTitle
    sectionDesc
    sectionTitle
    sectionLabel
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
  }
`;
