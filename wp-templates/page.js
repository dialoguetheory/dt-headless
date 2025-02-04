import { gql } from '@apollo/client';
import * as MENUS from '../constants/menus';
import { SiteInfoFragment } from '../fragments/GeneralSettings';
import { SectionsFragment } from '../components/sections/SectionsFragment';
import { NavigationMenuItemFragment } from '../fragments/NavigationItems';
import PageSections from '../components/Sections/Sections.js';

import {
  Header,
  Footer,
  Main,
  Container,
  ContentWrapper,
  EntryHeader,
  FeaturedImage,
  SiteHead,
} from '../components';

export default function Component(props) {
  if (process.env.NODE_ENV === 'development') {
    if (props.loading) return <p>Loading...</p>;
  }

  const { title: siteTitle, description: siteDescription } =
    props?.data?.generalSettings;
  const primaryMenu = props?.data?.headerMenuItems?.nodes ?? [];
  const footerMenu = props?.data?.footerMenuItems?.nodes ?? [];
  const { 
    title, 
    content, 
    featuredImage, 
    databaseId, 
    link 
  } = props?.data?.page ?? {
    title: '',
  };
  const sections = props?.data?.page?.additionalSections?.sections || [];

  return (
    <>
      <SiteHead fullHead={fullHead} />
      <Header
        title={siteTitle}
        description={siteDescription}
        menuItems={primaryMenu}
      />
      <Main>
        <>
          <EntryHeader title={title} image={featuredImage?.node} />
          <Container>
            <ContentWrapper content={content} />
            <PageSections sections={sections} />
          </Container>
        </>
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
