import React, { useState, useEffect } from "react";
import classNames from 'classnames';
import * as BREAKPOINTS from '../../constants/breakpoints';


const Section = ({ props = {}, anchorDest, children, dataFromPrevious, onDataPass }) => {

    // Default settings with sensible fallbacks
    const defaultSettings = {
        // General
        classes: '', // Always add by leading with a space, e.g. sectionSettings.classes += ' my-class';
        isArtDirected: false,
        id: '',

        // Won't vary by source, even if art-directed
        bgTint: false,
        altText: false,
        hasBgMedia: false,

        // BG color
        bgColor: '', // light-1, light-2, dark-1, mixed
        bgTone: '', // light, dark, or unknown (used if mixed BG)
        rememberBgColor: true, // Set false if retrieving settings for something other than printing the section (e.g. preloading source media). This powers .bg-color-repeated class

        // Desktop (or only) image
        hasBgImage: false,
        sizeFormat: 'full', // Recommended: 'full' with originals auto-optimized via plugin. WP image uploads are auto-scaled down to 2500w anyway as of 2019. Use '2048x2048' if originals can't be compressed.
        bgImage: null,

        // Mobile image (determines if art direction is enabled or not)
        bgImageMobile: false,

        // Art-directed <picture> (varies by breakpoint)
        sources: {
            desktop: { breakpoint: BREAKPOINTS.MD, sizeFormat: 'full' },
            tablet: { breakpoint: BREAKPOINTS.SM, sizeFormat: '1536x1536' },
            mobile: { breakpoint: 0, sizeFormat: 'large' },
        },

        // Desktop (or only) video
        hasBgVideo: false,
        bgVideo: null,
    };

    // Merge defaultSettings with provided data
    let settings = { ...defaultSettings, ...props };

    // Update classes
    settings.classes = classNames(settings.classes, 'col-1-span-14', 'grid', 'grid--full', 'section');

    // Set ID
    settings.id = isNaN(settings.id) ? settings.id : `section${+settings.id}`;

    // =======================
    // BG Video Logic
    // =======================
    if (settings.bgVideo) {
        settings.hasBgVideo = true;
        settings.hasBgMedia = true;
        settings.bgColor = settings.bgVideo.imagesTextLegibilityOptions?.bgColor ?? null;
    }

    // =======================
    // BG Image(s) Logic
    // =======================
    if (settings.bgImage) {
        settings.hasBgImage = true;
        settings.hasBgMedia = true;
        settings.bgTint = settings.bgImage.imagesTextLegibilityOptions?.bgTint ?? null;
        settings.altText = settings.bgImage.altText ?? null;
    }

    if (settings.bgImageMobile) {
        settings.isArtDirected = true;
    }

    // State management for dynamic props and background color
    const [sectionProps, setSectionProps] = useState(settings);
    const [currentData, setCurrentData] = useState(dataFromPrevious);

    useEffect(() => {
        const newData = { bgColor: settings.bgColor };

        // Update `currentData` if necessary
        if (JSON.stringify(newData) !== JSON.stringify(currentData)) {
            setCurrentData(newData);
            if (onDataPass) {
                onDataPass(newData);
            }
        }

        const computedClasses = classNames({
            [settings.classes]: !!settings.classes, // Include base classes if any
            [settings.bgColor]: true, // Always add the current bgColor
            'bg-color-repeated': dataFromPrevious?.bgColor === newData.bgColor,
        });

        // Update `sectionProps` with the computed classes
        setSectionProps((prev) => ({
            ...prev,
            classes: computedClasses,
        }));
    }, [settings.classes, settings.bgColor, dataFromPrevious, onDataPass, currentData]);

    const anchorSlug = anchorDest?.nodes[0]?.anchorCustomFields?.anchorSlug;

    return (
        <section className={sectionProps.classes} data-element="section">
            {anchorSlug &&
                <div className={"anchor-dest"} style={{position: "relative"}} data-id={anchorSlug} data-name={anchorSlug}></div>
            }
            <div className="section-scroll-top" id={settings.id}></div>
            <div className="js-section-scroll-trigger section-scroll-trigger"></div>
            {children}
        </section>
    );
};

export default Section;
