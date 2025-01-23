import Head from 'next/head';
import { useQuery } from '@apollo/client';
import { SEOFragment } from './SEOFragment';

/**
 * Provide SEO related meta tags to a page.
 *
 * @param {Props} props The props object.
 * @param {string} props.title Used for the page title, og:title, twitter:title, etc.
 * @param {string} props.description Used for the meta description, og:description, twitter:description, etc.
 * @param {string} props.imageUrl Used for the og:image and twitter:image. NOTE: Must be an absolute url.
 * @param {string} props.url Used for the og:url and twitter:url.
 * @param {string} props.databaseId The ID used to fetch SEO data.
 *
 * @returns {React.ReactElement} The SEO component
 */
export default function SEO({ title, description, featuredImage, databaseId, url }) {
  // Fetch SEO data based on databaseId
  const { data, loading, error } = useQuery(SEOFragment, {
    variables: { id: databaseId },
  });

  // Return null if no data or databaseId is provided
  if (!databaseId && !title) {
    return null;
  }

  if (loading) return null; // Optionally, add loading state handling
  if (error) {
    console.error("Error fetching SEO data:", error);
    return null;
  }

  // Extract SEO data from the query result
  const seoData = data?.post?.seo || data?.page?.seo;
  
  // Use the data from the query if available, or fallback to the passed-in props
  const seoTitle = seoData?.title || title;
  const seoDescription = seoData?.metaDesc || description;
  const seoImageUrl = seoData?.opengraphImage?.mediaItemUrl || featuredImage?.node?.sourceUrl;
  const seoUrl = url;

  return (
    <>
      <Head>
        {/* Standard meta tags */}
        <meta property="og:type" content="website" />
        <meta property="twitter:card" content="summary_large_image" />

        {/* Set the title first */}
        {seoTitle && <title>{seoTitle}</title>}

        {/* Other meta tags */}
        {seoTitle && (
          <>
            <meta name="title" content={seoTitle} />
            <meta property="og:title" content={seoTitle} />
            <meta property="twitter:title" content={seoTitle} />
          </>
        )}

        {seoDescription && (
          <>
            <meta name="description" content={seoDescription} />
            <meta property="og:description" content={seoDescription} />
            <meta property="twitter:description" content={seoDescription} />
          </>
        )}

        {seoImageUrl && (
          <>
            <meta property="og:image" content={seoImageUrl} />
            <meta property="twitter:image" content={seoImageUrl} />
          </>
        )}

        {seoUrl && (
          <>
            <meta property="og:url" content={seoUrl} />
            <meta property="twitter:url" content={seoUrl} />
          </>
        )}
      </Head>
    </>
  );
}
