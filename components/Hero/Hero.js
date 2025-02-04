import React from "react";
import { gql, useQuery } from "@apollo/client";
import classNames from "classnames/bind";
import { Section } from "../../components";
import styles from "./Hero.module.scss";
import DOMPurify from 'dompurify';

const cx = classNames.bind(styles);

export default function Hero({
  databaseId,
  title,
  content,
  className,
  featuredImage
}) {
  const { loading, error, data } = useQuery(HERO_QUERY, {
    variables: { databaseId },
  });

  if (process.env.NODE_ENV === "development") {
    if (loading) return <p>Loading Hero...</p>;
    if (error) return <p>Error loading Hero data: {error.message}</p>;
  }

  const props = {
    id: 'hero',
    classes: cx("hero", className),
    bgVideo: data?.page?.heroBg?.bgVideo?.node ?? null,
    bgImage: featuredImage?.node ?? null
  }

  return (
    <Section props={props}>
      <div className={cx('hero__header', 'col-2-span-12')}>
        {title && (
          <h2 className={cx("hero__title")}>{title}</h2>
        )}
        {content && (
          <div className={cx('section__desc', 'rt')} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize('test') }} />
        )}
      </div>
    </Section>
  );
}

const HERO_QUERY = gql`
  query GetHeroData($databaseId: ID!) {
    page(id: $databaseId, idType: DATABASE_ID) {
      heroBg {
        bgVideo {
          node {
            mediaItemUrl
            imagesTextLegibilityOptions {
              bgAlign
              bgColor
              bgTint
              bgTintColor
            }
          }
        }
      }
    }
  }
`;