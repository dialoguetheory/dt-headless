import Image from 'next/image';
import classNames from 'classnames/bind';
import styles from './CardPost.module.scss';
import DOMPurify from "isomorphic-dompurify";

const cx = classNames.bind(styles);

export default function CardPost({ post }) {
  return (
    <article key={post.id} className={cx('post-card')}>
      {post.featuredImage?.node?.sourceUrl && (
        <div className={cx('post-image')}>
          <Image
            src={post.featuredImage.node.sourceUrl}
            alt={post.featuredImage.node.altText || post.title}
            width={600}
            height={400}
            priority={false}
            style={{ objectFit: 'cover' }}
          />
        </div>
      )}
      <h2>{post.title}</h2>
      <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.excerpt) }} />
      <div className={cx('post-meta')}>
        <time dateTime={post.date}>
          {new Date(post.date).toLocaleDateString()}
        </time>
      </div>
    </article>
  );
}