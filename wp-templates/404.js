import { gql } from '@apollo/client';
import * as MENUS from '../constants/menus';
import { SiteInfoFragment } from '../fragments/GeneralSettings';
import { SectionsFragment } from '../components/Sections/SectionsFragment';
import { NavigationMenuItemFragment } from '../fragments/NavigationItems';
import classNames from 'classnames/bind';
import styles from "../styles/modules/Page.module.scss";

import {
  SiteHead,
  SiteFooter,
  Header,
  Main,
  Hero,
  FeaturedImage,
  AdditionalSections
} from '../components';

const cx = classNames.bind(styles);

export default function Component(props) {
  if (process.env.NODE_ENV === 'development') {
    if (props.loading) return <p>Loading...</p>;
  }

  const { title: siteTitle, description: siteDescription } =
    props?.data?.generalSettings;
  const primaryMenu = props?.data?.headerMenuItems?.nodes ?? [];
  const footerMenu = props?.data?.footerMenuItems?.nodes ?? [];
  const sections = props?.data?.page?.additionalSections?.sections || [];


  return (
    <>
      <SiteHead fullHead={props?.data?.page?.seo?.fullHead} />
      <Header
        title={siteTitle}
        description={siteDescription}
        menuItems={primaryMenu}
      />
      <Main className={`${cx('main')} grid grid--full light-area"`} role={'main'}>
        <Hero page={props?.data?.page} />
      </Main>
      <SiteFooter 
        footerMenu={footerMenu} 
      />
    </>
  );
}

Component.variables = ({ databaseId }, ctx) => {
  return {
    databaseId,
    headerLocation: MENUS.PRIMARY_LOCATION,
    footerLocation: MENUS.FOOTER_LOCATION,
    asPreview: ctx?.asPreview,
  };
};

Component.query = gql`
  ${SiteInfoFragment}
  ${NavigationMenuItemFragment}
  ${FeaturedImage.fragments.entry}
  ${SectionsFragment}
  query GetPageData(
    $databaseId: ID!
    $headerLocation: MenuLocationEnum
    $footerLocation: MenuLocationEnum
    $asPreview: Boolean = false
  ) {
    page(id: $databaseId, idType: DATABASE_ID, asPreview: $asPreview) {
      databaseId
      title
      content
      link
      ...FeaturedImageFragment
      ...SectionsFragment
      seo {
        metaDesc
        title
        fullHead
      }
      heroBg {
        bgVideo {
          node {
            mediaItemUrl
            imagesTextLegibilityOptions {
              bgAlign
              bgColor
              bgTint
              bgTintColor
            }
          }
        }
      }
    }
    generalSettings {
      ...SiteInfoFragment
    }
    footerMenuItems: menuItems(where: { location: $footerLocation }) {
      nodes {
        ...NavigationMenuItemFragment
      }
    }
    headerMenuItems: menuItems(where: { location: $headerLocation }) {
      nodes {
        ...NavigationMenuItemFragment
      }
    }
  }
`;
