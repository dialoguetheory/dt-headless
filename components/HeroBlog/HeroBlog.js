import React from "react";
import classNames from "classnames/bind";
import { Section, BackgroundImage, BackgroundVideo } from "..";
import styles from "./Hero.module.scss";
import DOMPurify from "isomorphic-dompurify";

const cx = classNames.bind(styles);

export default function Hero({
  page
}) {

  const props = {
    id: 'hero',
    classes: cx("hero", page?.className),
    bgVideo: page?.bgVideo?.node ?? null,
    bgImage: page?.featuredImage?.node ?? null
  }

  return (
    <Section props={props}>
      {props.bgImage && <BackgroundImage img={props.bgImage} />}
      {props.bgVideo && <BackgroundVideo video={props.bgVideo} />}
      <div className={cx('hero__header', 'col-2-span-12')}>
        {page?.title && (
          <h2 className={cx("hero__title")}>{page.title}</h2>
        )}
        {page?.content && (
          <div className={cx('hero__desc', 'rt')} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(page.content) }} />
        )}
      </div>
    </Section>
  );
}