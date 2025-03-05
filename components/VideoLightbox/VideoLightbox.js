import React, { useState, useRef, useEffect } from 'react';
import DOMPurify from 'isomorphic-dompurify';
import styles from './VideoLightbox.module.scss';
import PlayLightboxIcon from '../../icons/play-lightbox-icon.svg';

const SUPPORTED_SERVICES = ['youtube.com', 'youtu.be', 'vimeo.com'];

const VideoLightbox = ({ videoUrl, embed }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [videoSrc, setVideoSrc] = useState('');
  const [iframeAttributes, setIframeAttributes] = useState(null);
  const dialogRef = useRef(null);
  const videoRef = useRef(null); // Ref for the HTML5 video element

  // Function to check if a URL belongs to a supported service
  const isSupportedService = (url) => {
    return SUPPORTED_SERVICES.some((service) => url.includes(service));
  };

  // Function to extract and sanitize iframe attributes
  const extractIframeAttributes = (embedHtml) => {
    if (!embedHtml) return null;

    const parser = new DOMParser();
    const doc = parser.parseFromString(embedHtml, 'text/html');
    const iframe = doc.querySelector('iframe');

    if (!iframe || !iframe.src || !isSupportedService(iframe.src)) {
      return null; // Stop if not a supported embed
    }

    const attributes = {};
    for (const attr of iframe.attributes) {
      attributes[attr.name] = DOMPurify.sanitize(attr.value);
    }

    // Ensure autoplay is enabled
    if (!attributes.src.includes('autoplay=1')) {
      attributes.src += (attributes.src.includes('?') ? '&' : '?') + 'autoplay=1';
    }

    return attributes;
  };

  // Open the dialog and determine video source
  const openDialog = () => {
    setIsOpen(true);
  };

  // Close the dialog and stop the video
  const closeDialog = () => {
    setIsOpen(false);
    setVideoSrc('');
    setIframeAttributes(null);

    // Stop HTML5 video playback
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  useEffect(() => {
    if (isOpen && dialogRef.current) {
      dialogRef.current.showModal(); // Open the dialog
    } else if (dialogRef.current) {
      dialogRef.current.close(); // Close the dialog
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      if (embed) {
        const extractedAttributes = extractIframeAttributes(embed);
        if (extractedAttributes) {
          setIframeAttributes(extractedAttributes);
          return;
        } else {
          setIframeAttributes(null); // Ensure we don't display an invalid iframe
        }
      }
      setVideoSrc(videoUrl);
    }
  }, [isOpen, videoUrl, embed]);

  return (
    <>
      <button onClick={openDialog} className={styles.openBtn}>
        <span className="screen-reader-text">Toggle video lightbox</span>
        <PlayLightboxIcon />
      </button>

      <dialog ref={dialogRef} className={styles.dialog}>
        <div className={styles.dialogContent}>
          <button onClick={closeDialog} className={styles.closeBtn}>
            Close
          </button>
          {iframeAttributes ? (
            <iframe
              width={iframeAttributes.width || '640'}
              height={iframeAttributes.height || '360'}
              src={iframeAttributes.src}
              allow="autoplay; fullscreen"
              allowFullScreen
              title={iframeAttributes.title || 'Embedded Video'}
              referrerPolicy="strict-origin-when-cross-origin"
            ></iframe>
          ) : (
            videoSrc && (
              <video ref={videoRef} width="640" height="360" controls autoPlay>
                <source src={videoSrc} type="video/mp4" />
              </video>
            )
          )}
        </div>
      </dialog>
    </>
  );
};

export default VideoLightbox;
