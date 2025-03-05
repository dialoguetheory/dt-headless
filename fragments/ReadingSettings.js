import { gql } from '@apollo/client';

// Define the fragment for ReadingSettings
export const ReadingSettingsFragment = gql`
  fragment ReadingSettingsFragment on AllSettings {
    readingSettingsPageForPosts
    readingSettingsPageOnFront
    readingSettingsPostsPerPage
  }
`;