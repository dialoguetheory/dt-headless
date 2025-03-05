import classNames from 'classnames/bind';
import styles from "./Background.module.scss";

const cx = classNames.bind(styles);

export default function BackgroundVideo({
  video,
  wrapClasses
}) {
  if (!video) return null;

  const {
    mediaItemUrl,
    imagesTextLegibilityOptions = {}
  } = video;

  const { bgTint, bgTintColor } = imagesTextLegibilityOptions;
  const bgTintOpacity = Math.abs(bgTint) / 10;

  const renderTint = bgTint !== null && bgTint !== 0;

  return (
    <div className={cx('bg-wrap', wrapClasses)}>
      <video
        src={mediaItemUrl}
        preload={"auto"}
        muted
        loop
        autoPlay
        playsInline
        loading={"lazy"}
        aria-hidden={"true"}
      />
      {renderTint && (
        <div
          className="tint"
          style={{
            backgroundColor: bgTintColor || '#0A0A0A',
            opacity: bgTintOpacity,
          }}
        />
      )}
    </div>
  );
}
