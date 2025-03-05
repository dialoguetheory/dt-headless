import { gql } from '@apollo/client';
import * as MENUS from '../constants/menus';
import { SiteInfoFragment } from '../fragments/GeneralSettings';
import { SectionsFragment } from '../components/Sections/SectionsFragment';
import { NavigationMenuItemFragment } from '../fragments/NavigationItems';
import className from 'classnames/bind';
import styles from "../styles/modules/Front-page.module.scss";
import { CardPost } from '../components';
import { PageProvider } from '../context/PageContext';

import {
  SiteHead,
  Header,
  SiteFooter,
  Main,
  Hero,
  FeaturedImage,
  AdditionalSections
} from '../components';

const cx = className.bind(styles);

const MainContent = ({ page, sections, posts }) => {
  if (page) {
    const sections = page.additionalSections?.sections || [];
    return (
      <>
        <Hero page={page} />
        <AdditionalSections sections={sections} />
      </>
    );
  }

  return (
    <div className={cx('posts-grid')}>
      {posts.length > 0 ? (
        posts.map((post) => <CardPost key={post.id} post={post} />)
      ) : (
        <p>No posts found.</p>
      )}
    </div>
  );
};

export default function Component(props) {
  if (process.env.NODE_ENV === 'development') {
    if (props.loading) return <p>Loading...</p>;
  }

  const { title: siteTitle, description: siteDescription } = props.data.generalSettings;
  const primaryMenu = props?.data?.headerMenuItems?.nodes ?? [];
  const footerMenu = props?.data?.footerMenuItems?.nodes ?? [];
  const posts = props?.data?.posts?.nodes ?? [];
  const { 
    title, 
    featuredImage, 
    databaseId, 
    seo,
    link
  } = props?.data?.page ?? {
    title: '',
    link: ''
  };

  return (
    <PageProvider pageLink={link}>
      <SiteHead fullHead={seo?.fullHead} frontPage={true} />
      <Header
        title={siteTitle}
        description={siteDescription}
        menuItems={primaryMenu}
      />
      <Main className={`${cx('main')} grid grid--full light-area"`} role={'main'}>
        <MainContent databaseId={databaseId} title={title} featuredImage={featuredImage} page={props?.data?.page} posts={posts} />
      </Main>
      <SiteFooter 
        footerMenu={footerMenu} 
      />
    </PageProvider>
  );
}

Component.variables = ({ databaseId }, ctx) => {
  const id = databaseId || "0";
  return {
    databaseId: id,
    headerLocation: MENUS.PRIMARY_LOCATION,
    footerLocation: MENUS.FOOTER_LOCATION,
    asPreview: ctx?.asPreview,
    isDefaultId: id === "0" 
  };
};

Component.query = gql`
  ${SiteInfoFragment}
  ${NavigationMenuItemFragment}
  ${FeaturedImage.fragments.entry}
  ${SectionsFragment}
  query GetPageData(
    $databaseId: ID! = "0"
    $headerLocation: MenuLocationEnum
    $footerLocation: MenuLocationEnum
    $asPreview: Boolean = false,
    $isDefaultId: Boolean = false
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
    posts @include(if: $isDefaultId) {
      nodes {
        id
        title
        excerpt
        ...FeaturedImageFragment
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
