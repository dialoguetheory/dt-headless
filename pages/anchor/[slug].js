import { gql } from '@apollo/client';
import { getNextStaticProps } from '@faustwp/core';

// 1. Define the GraphQL query separately for better readability
const GET_ANCHOR = gql`
  query GetAnchor($id: ID!) {
    anchor(id: $id, idType: URI) {
      anchorCustomFields {
        anchorSlug
        anchorPage {
          nodes {
            link
            uri
          }
        }
      }
    }
  }
`;

// 2. Simple component since we're only handling redirects
const AnchorPage = () => null;

// 3. Attach query to component
AnchorPage.query = GET_ANCHOR;

// 4. Simplified variables function
AnchorPage.variables = (ctx) => ({
  id: ctx?.params?.slug || ''
});

// 5. Main static props function with clear error handling
export async function getStaticProps(ctx) {
  try {
    // console.log('Processing slug:', ctx.params.slug);
    
    const props = await getNextStaticProps(ctx, {
      Page: AnchorPage,
      params: ctx
    });

    // Log the response data
    // console.log('Query response:', JSON.stringify(props.props.data, null, 2));

    // Get the anchor fields
    const anchorFields = props?.props?.data?.anchor?.anchorCustomFields;
    
    // Build redirect URL with hash if both URI and slug exist
    const redirectUrl = anchorFields?.anchorPage?.nodes?.[0]?.uri && anchorFields?.anchorSlug
      ? `${anchorFields.anchorPage.nodes[0].uri}#${anchorFields.anchorSlug}`
      : null;

    // Return appropriate redirect
    return {
      redirect: {
        destination: redirectUrl || '/404',
        permanent: false,
      }
    };
  } catch (error) {
    console.error('Error processing anchor:', error);
    return {
      redirect: {
        destination: '/404',
        permanent: false,
      }
    };
  }
}

// 6. Standard static paths config
export function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking'
  }
}

export default AnchorPage;
