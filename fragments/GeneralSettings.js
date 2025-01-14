import { gql } from '@apollo/client';

export const SiteInfoFragment = gql`
  fragment SiteInfoFragment on GeneralSettings {
    title
    description
  }
`;
