import { gql } from '@apollo/client';

export const MediaSliderLayoutFragment = gql`
  fragment MediaSliderLayoutFragment on AdditionalSectionsSectionsMediaSliderLayout {
    fieldGroupName
    sectionDesc
    sectionLabel
    sectionTitle
    hideSectionTitle
    slides {
      ... on AdditionalSectionsSectionsSlidesVideoLayout {
        caption
        videoUrl
        fieldGroupName
        image {
          node {
            altText
            caption
            mediaItemUrl
            sourceUrl
            sizes
            srcSet
          }
        }
      }
      ... on AdditionalSectionsSectionsSlidesEmbedLayout {
        caption
        embed
        fieldGroupName
        image {
          node {
            altText
            caption
            mediaItemUrl
            sourceUrl
            sizes
            srcSet
          }
        }
      }
      ... on AdditionalSectionsSectionsSlidesImageLayout {
        fieldGroupName
        image {
          node {
            altText
            caption
            srcSet
            sourceUrl
            mediaItemUrl
            sizes
          }
        }
      }
    }
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
    autoPlay
    adaptiveHeight
    captions
    cellAlign
    dots
    buttons
    speed
    thumbs
    transition
    wrapAround
  }
`;
