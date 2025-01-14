import { gql } from '@apollo/client';
import * as MENUS from '../constants/menus';
import { SiteInfoFragment } from '../fragments/GeneralSettings';
import { SectionsFragment } from '../components/sections/SectionsFragment';
import PageSections from '../components/Sections/Sections.js';

import {
  Header,
  Footer,
  Main,
  Container,
  ContentWrapper,
  EntryHeader,
  NavigationMenu,
  FeaturedImage,
  SEO,
  TrackingScripts
} from '../components';

export default function Component(props) {
  if (props.loading) {
    return <>Loading...</>;
  }
  const { title: siteTitle, description: siteDescription } = 
    props?.data?.generalSettings;
  const primaryMenu = props?.data?.headerMenuItems?.nodes ?? [];
  const footerMenu = props?.data?.footerMenuItems?.nodes ?? [];
  const { title, content, featuredImage, databaseId, link } = props?.data?.page ?? {
    title: '',
  };
  const sections = props?.data?.page?.additionalSections?.sections || [];

  return (
    <>
      <SEO
        title={title}
        description={siteDescription}
        image={featuredImage}
        url={link}
        databaseId={databaseId}
      />
      <TrackingScripts />
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
  ${NavigationMenu.fragments.entry}
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
