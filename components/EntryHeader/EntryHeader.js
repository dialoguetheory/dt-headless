import className from 'classnames/bind';
import { Heading, PostInfo, Container, FeaturedImage } from '../../components';
import styles from './EntryHeader.module.scss';
import { gql } from '@apollo/client';

let cx = className.bind(styles);

export default function EntryHeader({ title, image, date, author, className }) {
  const hasText = title || date || author;

  return (
    <div className={cx(['component', className])}>
      {image && (
        <FeaturedImage
          image={image}
          className={cx('image')}
          priority
        />
      )}

      {hasText && (
        <div className={cx('text', { 'has-image': image })}>
          <Container>
            {!!title && <Heading className={cx('title')}>{title}</Heading>}
            <PostInfo
              className={cx('byline')}
              author={author}
              date={date}
            />
          </Container>
        </div>
      )}
    </div>
  );
}
export const GET_ANCHOR = gql`
  query GetAnchor($slug: ID!) {
    anchor(id: $slug, idType: SLUG) {
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
