import { gql } from '@apollo/client';
import * as MENUS from '../constants/menus';
import { SiteInfoFragment } from '../fragments/GeneralSettings';
import { SectionsFragment } from '../components/Sections/SectionsFragment';
import { NavigationMenuItemFragment } from '../fragments/NavigationItems';
import className from 'classnames/bind';
import styles from "../styles/modules/Front-page.module.scss";

import {
  SiteHead,
  Header,
  Footer,
  Main,
  Hero,
  FeaturedImage,
  AdditionalSections
} from '../components';

let cx = className.bind(styles);

export default function Component(props) {

  if (process.env.NODE_ENV === 'development') {
    if (props.loading) return <p>Loading...</p>;
  }

  const { title: siteTitle, description: siteDescription } =
    props.data.generalSettings;
  const primaryMenu = props?.data?.headerMenuItems?.nodes ?? [];
  const footerMenu = props?.data?.footerMenuItems?.nodes ?? [];
  const sections = props?.data?.page?.additionalSections?.sections || [];
  const { 
    title, 
    featuredImage, 
    databaseId, 
    link,
    seo,
  } = props?.data?.page ?? {
    title: '',
  };

  // Have to set this here because Yoast fullHead doesn't seem to recognize front page. 
  let fullHead = seo?.fullHead || '';
  if (fullHead) {
    fullHead = fullHead.replace(
      /<meta\s+property="og:type"\s+content="[^"]*"\s*\/?>/i, 
      `<meta property="og:type" content="website" />`
    );
  }

  return (
    <>
      <SiteHead fullHead={fullHead} />
      <Header
        title={siteTitle}
        description={siteDescription}
        menuItems={primaryMenu}
      />
      <Main className={`${cx('main')} grid grid--full light-area"`} role={'main'}>
        <Hero databaseId={databaseId} title={title} featuredImage={featuredImage} />
        <AdditionalSections sections={sections} />
      </Main>
      <Footer title={siteTitle} menuItems={footerMenu} />
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
