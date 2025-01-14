import { gql } from '@apollo/client';

export const SEOFragment = gql`
  query GetSeoData($id: ID!) {
    post(id: $id, idType: DATABASE_ID) {
      seo {
        title
        metaDesc
        opengraphTitle
        opengraphImage {
          mediaItemUrl
          mediaDetails {
            width
            height
            file
          }
        }
      }
    }
    page(id: $id, idType: DATABASE_ID) {
      seo {
        title
        metaDesc
        opengraphTitle
        opengraphImage {
          mediaItemUrl
          mediaDetails {
            width
            height
            file
          }
        }
      }
    }
  }
`;
