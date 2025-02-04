import { gql } from '@apollo/client';

export const MediaSliderLayoutFragment = gql`
  fragment MediaSliderLayoutFragment on AdditionalSectionsSectionsMediaSliderLayout {
    fieldGroupName
    sectionDesc
    sectionLabel
    sectionTitle
    hideSectionTitle
    slides {
      ... on AdditionalSectionsSectionsSlidesEmbedLayout {
        embedDesc
        embedTitle
        embedVideo
        embedImage {
          node {
            altText
            caption
            mediaItemUrl
          }
        }
      }
      ... on AdditionalSectionsSectionsSlidesImageLayout {
        fieldGroupName
        image {
          node {
            altText
            caption
            mediaItemUrl
          }
        }
      }
    }
    anchorDest {
      nodes {
        databaseId
      }
    }
    adaptiveHeight
    captions
    cellAlign
    counter
    pageDots
    pauseOnHover
    previousNextButtons
    progressBar
    speed
    setGallerySize
    thumbs
    timer
    transition
    wrapAround
  }
`;
