import { gql } from '@apollo/client';
import { BasicLayoutFragment } from './Basic/BasicLayoutFragment';
import { AccordionLayoutFragment } from './Accordion/AccordionLayoutFragment';
import { MediaSliderLayoutFragment } from './MediaSlider/MediaSliderLayoutFragment';

export const SectionsFragment = gql`
  fragment SectionsFragment on Page {
    additionalSections {
      sections {
        fieldGroupName
        ...BasicLayoutFragment
        ...AccordionLayoutFragment
        ...MediaSliderLayoutFragment
      }
    }
  }
  ${BasicLayoutFragment}
  ${AccordionLayoutFragment}
  ${MediaSliderLayoutFragment}
`;
