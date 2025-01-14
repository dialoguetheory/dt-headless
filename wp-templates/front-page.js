import { useQuery, gql } from '@apollo/client';
import * as MENUS from '../constants/menus';
import { SiteInfoFragment } from '../fragments/GeneralSettings';
import className from 'classnames/bind';
import styles from "../styles/modules/Front-page.module.scss";

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
} from '../components';

let cx = className.bind(styles);

export default function Component(props) {

  if (props.loading) {
    return <>Loading...</>;
  }

  const { title: siteTitle, description: siteDescription } =
    props.data.generalSettings;
  const primaryMenu = props?.data?.headerMenuItems?.nodes ?? [];
  const footerMenu = props?.data?.footerMenuItems?.nodes ?? [];
  const { title, content, featuredImage } = props?.data?.page ?? { title: '' };

  return (
    <>
      <SEO
        title={siteTitle}
        description={siteDescription}
        imageUrl="https://example.com/image.jpg"
        url="https://example.com"
      />
      <Header
        title={siteTitle}
        description={siteDescription}
        menuItems={primaryMenu}
      />
      <Main className={cx(`main`)}>
        <>
          <EntryHeader title={`title`} image={featuredImage?.node} />
          <Container>
            <ContentWrapper content={content} />
          </Container>
        </>
      </Main>
      <Footer title={siteTitle} menuItems={footerMenu} />
    </>
  );
}

Component.variables = () => {
  return {
    headerLocation: MENUS.PRIMARY_LOCATION,
    footerLocation: MENUS.FOOTER_LOCATION
  };
};

Component.query = gql`
  ${SiteInfoFragment}
  ${NavigationMenu.fragments.entry}
  query GetPageData(
    $headerLocation: MenuLocationEnum
    $footerLocation: MenuLocationEnum
  ) {
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
