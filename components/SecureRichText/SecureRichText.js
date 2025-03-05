import DOMPurify from 'isomorphic-dompurify';
import { usePageLink } from '../../context/PageContext';
import { gql, useApolloClient } from '@apollo/client';
import { useState, useEffect } from 'react';

const GET_ANCHOR_DATA = gql`
  query GetAnchor($id: ID!) {
    anchor(id: $id, idType: URI) {
      anchorCustomFields {
        anchorSlug
        anchorPage {
          nodes {
            link
          }
        }
      }
    }
  }
`;

const SecureRichText = ({ content, className, as: Element = 'div' }) => {
  const currentPath = usePageLink();
  const client = useApolloClient();
  const [processedContent, setProcessedContent] = useState(content);

  useEffect(() => {
    const processAnchors = async () => {
      if (typeof content !== 'string' || !content.includes('/anchor/')) {
        setProcessedContent(content);
        return;
      }

      let newContent = content;
      const anchorMatches = [...content.matchAll(/<a([^>]*?)href="([^"]*?\/anchor\/[^"]*?)"([^>]*?)>/g)];

      for (const match of anchorMatches) {
        const [fullMatch, before, href, after] = match;
        try {
          const anchorPath = href.split('/anchor/')[1];
          if (!anchorPath) continue;

          const { data } = await client.query({
            query: GET_ANCHOR_DATA,
            variables: { id: `/anchor/${anchorPath}` }
          });

          if (data?.anchor?.anchorCustomFields) {
            const { anchorSlug, anchorPage } = data.anchor.anchorCustomFields;
            const targetPage = anchorPage?.nodes?.[0]?.link;

            if (targetPage && anchorSlug) {
              const newHref = targetPage === currentPath 
                ? `#${anchorSlug}`
                : `${targetPage}#${anchorSlug}`;
              
              const newAnchor = `<a${before}href="${newHref}"${after} data-anchor="true" data-local="true">`;
              newContent = newContent.replace(fullMatch, newAnchor);
            }
          }
        } catch (error) {
          console.error('Error processing anchor:', error);
        }
      }

      setProcessedContent(newContent);
    };

    processAnchors();
  }, [content, currentPath, client]);

  const sanitizedContent = DOMPurify.sanitize(processedContent);

  return (
    <Element 
      {...(className && { className })}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
};

export default SecureRichText;

