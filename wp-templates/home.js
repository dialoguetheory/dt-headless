import { useApolloClient } from '@apollo/client';
import { useState, useEffect } from 'react';
import { gql } from '@apollo/client';
import * as MENUS from '../constants/menus';
import { SiteInfoFragment } from '../fragments/GeneralSettings';
import { NavigationMenuItemFragment } from '../fragments/NavigationItems';
import classNames from 'classnames/bind';
import styles from "../styles/modules/Page.module.scss";
import { LoadMorePosts } from '../components';

import {
  SiteHead,
  Header,
  Footer,
  Main,
  HeroBlog,
  FeaturedImage
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
  const posts = props?.data?.posts?.nodes ?? [];

  const [blogPage, setBlogPage] = useState(null);
  const [error, setError] = useState(null);
  const client = useApolloClient();

  useEffect(() => {
    const fetchBlogPage = async () => {
      const pageId = props?.data?.allSettings?.readingSettingsPageForPosts;
      
      if (!pageId) {
        console.log('No blog page ID found in settings');
        return;
      }

      try {
        const result = await client.query({
          query: gql`
            ${FeaturedImage.fragments.entry}
            query GetBlogPage($id: ID!) {
              page(id: $id, idType: DATABASE_ID) {
                databaseId
                title
                ...FeaturedImageFragment
                seo {
                  fullHead
                }
              }
            }
          `,
          variables: { id: pageId }
        });
        
        if (!result.data.page) {
          console.log('Blog page not found in query result');
          return;
        }
        setBlogPage(result.data.page);
      } catch (error) {
        console.error('Error fetching blog page:', error.message);
      }
    };

    fetchBlogPage();
  }, [props?.data?.allSettings?.readingSettingsPageForPosts, client]);

  return (
    <>
      <SiteHead fullHead={blogPage?.seo?.fullHead} />
      <Header
        title={siteTitle}
        description={siteDescription}
        menuItems={primaryMenu}
      />
      <Main className={`${cx('main')} grid grid--full light-area"`} role={'main'}>
        <HeroBlog page={blogPage} />
        {posts.length > 0 && (
          <div className={cx('posts-grid col-2-span-12')}>
            <LoadMorePosts postType="POST" />
          </div> 
        )}
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
  ${NavigationMenuItemFragment}
  ${FeaturedImage.fragments.entry}
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
    allSettings {
      readingSettingsPageOnFront
      readingSettingsPageForPosts
      readingSettingsPostsPerPage
    }
    posts {
      nodes {
        id
        title
        excerpt
        ...FeaturedImageFragment
      }
    }
  }
`;
