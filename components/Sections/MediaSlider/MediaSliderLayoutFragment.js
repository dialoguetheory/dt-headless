import { gql } from '@apollo/client';

export const MediaSliderLayoutFragment = gql`
  fragment MediaSliderLayoutFragment on AdditionalSectionsSectionsMediaSliderLayout {
    fieldGroupName
    sectionDesc
    sectionLabel
    sectionTitle
    hideSectionTitle
    slides {
      ... on AdditionalSectionsSectionsSlidesImageLayout {
        image {
          node {
            altText
            sizes(size: LARGE)
            sourceUrl
            srcSet
            caption
          }
        }
      }
      ... on AdditionalSectionsSectionsSlidesYoutubeEmbedLayout {
        embedVideo
        videoDesc
        youtubeEmbedImage {
          node {
            altText
            sizes(size: LARGE)
            sourceUrl
            srcSet
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
