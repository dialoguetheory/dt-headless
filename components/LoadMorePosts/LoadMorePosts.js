import { useQuery, gql } from "@apollo/client";
import { CardPost, FeaturedImage } from "../../components";

const GET_POSTS = gql`
  ${FeaturedImage.fragments.entry}
  query getPosts($first: Int!, $after: String, $postType: ContentTypeEnum = POST) {
    contentNodes(first: $first, after: $after, where: { contentTypes: [$postType] }) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          databaseId
          ... on Post {
            title
            slug
            date
            ...FeaturedImageFragment
          }
          ... on Page {
            title
            slug
            date
            ...FeaturedImageFragment
          }

        }
      }
    }
  }
`;

const BATCH_SIZE = 5;

export default function LoadMorePost({ postType = 'POST' }) {
  const { data, loading, error, fetchMore } = useQuery(GET_POSTS, {
    variables: { first: BATCH_SIZE, after: null, postType },
  });

  if (error) {
    console.log(error);
    return <p>Sorry, an error happened. Reload Please</p>;
  }

  if (!data && loading) {
    return <p>Loading...</p>;
  }

  if (!data?.contentNodes.edges.length) {
    return <p>no posts have been published</p>;
  }

  const posts = data.contentNodes.edges.map((edge) => edge.node);
  const haveMorePosts = Boolean(data?.contentNodes?.pageInfo?.hasNextPage);

  /**
   * Handles the "Load More" button click event
   * Fetches the next batch of posts and adds them to the existing list
   * 
   * @param {Event} event - The form submission event
   * @returns {Promise<void>}
   */
  const handleLoadMore = async (event) => {
    // Prevents the form's default submission behavior which would refresh the page
    event.preventDefault();
    
    try {
      // Wait for the fetchMore operation to complete
      await fetchMore({
        // Specify the variables for the next query
        variables: {
          // endCursor from the previous query's pageInfo becomes the 'after' parameter
          after: data.contentNodes.pageInfo.endCursor,
          // Pass along the postType (POST, PAGE, etc.) from props
          postType
        },
        
        // This function tells Apollo how to merge the new data with existing data
        updateQuery: (previousResult, { fetchMoreResult }) => {
          // If no new data was fetched, keep the previous data unchanged
          if (!fetchMoreResult) return previousResult;

          return {
            contentNodes: {
              // Spread all properties from the new contentNodes result
              ...fetchMoreResult.contentNodes,
              edges: [
                // Combine the old edges (posts) array...
                ...previousResult.contentNodes.edges,
                // ...with the new edges (posts) array
                ...fetchMoreResult.contentNodes.edges,
              ],
            },
          };
        },
      });
    } catch (error) {
      // If anything goes wrong during the fetch, log it to the console
      console.error('Error loading more posts:', error);
    }
  };

  return (
    <>
      <ul>
        {posts.map((post) => {
          return (
            <CardPost key={post.id} post={post} />
          );
        })}
      </ul>
      {haveMorePosts && (
        <form method="post" onSubmit={handleLoadMore}>
          <button type="submit">Load More</button>
        </form>
      )}
    </>
  );
}