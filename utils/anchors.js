import { useEffect } from "react";

const AnchorLinks = () => {
  useEffect(() => {
    const anchorLinks = document.querySelectorAll("a[data-anchor]");
    const anchorDests = document.querySelectorAll(".anchor-dest");

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function getHeaderOffset() {
      const style = getComputedStyle(document.body);
      let headerOffset = style.getPropertyValue("--header-offset");
      return headerOffset ? parseInt(headerOffset.replace(/\D/g, ""), 10) : 0;
    }

    function jumpToAnchor(hashSlug) {
      const target = document.querySelector(`[data-id='${hashSlug}'], #${hashSlug}`);
      if (!target) return console.warn(`Anchor destination ${hashSlug} does not exist on this page.`);

      const headerOffset = getHeaderOffset();
      const targetPosition = target.getBoundingClientRect().top;

      console.log(headerOffset);
      console.log(target.getBoundingClientRect().top);
      console.log(window.scrollY);
      console.log(targetPosition);

      if (prefersReducedMotion) {
        window.scrollTo(0, targetPosition);
      } else {
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }

      target.setAttribute("tabindex", "-1");
      target.focus();
    }

    function handleAnchorClick(event) {
      const link = event.currentTarget;
      const hashSlug = new URL(link.href).hash.substring(1);
      if (!hashSlug) return;

      if (window.location.pathname === link.pathname) {
        event.preventDefault();
        jumpToAnchor(hashSlug);
      }
    }

    function setupAnchorDestinations() {
      anchorDests.forEach(dest => {
        if (!dest.dataset.anchorParsed) {
          const anchorID = dest.id;
          if (anchorID) {
            dest.dataset.id = anchorID;
            dest.removeAttribute("id");
            dest.setAttribute("tabindex", "-1");
            dest.dataset.anchorParsed = true;
          }
        }
      });
    }

    // Add scroll position watcher
    let currentTarget = null;
    const handleScroll = () => {
      if (currentTarget) {
        const rect = currentTarget.getBoundingClientRect();
        console.log('Target position on scroll:', {
          top: rect.top,
          bottom: rect.bottom,
          height: rect.height,
          scrollY: window.scrollY,
          viewportHeight: window.innerHeight
        });
      }
    };

    // Update currentTarget when clicking an anchor
    const originalHandleAnchorClick = handleAnchorClick;
    handleAnchorClick = (event) => {
      const link = event.currentTarget;
      const hashSlug = new URL(link.href).hash.substring(1);
      if (!hashSlug) return;

      if (window.location.pathname === link.pathname) {
        event.preventDefault();
        currentTarget = document.querySelector(`[data-id='${hashSlug}'], #${hashSlug}`);
        jumpToAnchor(hashSlug);
      }
    };

    anchorLinks.forEach(link => link.addEventListener("click", handleAnchorClick));
    window.addEventListener('scroll', handleScroll);
    setupAnchorDestinations();

    // Handle page load with hash in URL
    if (window.location.hash) {
      setTimeout(() => {
        const hashSlug = window.location.hash.substring(1);
        currentTarget = document.querySelector(`[data-id='${hashSlug}'], #${hashSlug}`);
        jumpToAnchor(hashSlug);
      }, 1500);
    }

    const handleLoad = () => {
      console.log("AnchorLinks mounted - page fully loaded");
    };

    // If the page is already loaded, log immediately
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    return () => {
      window.removeEventListener('load', handleLoad);
      window.removeEventListener('scroll', handleScroll);
      anchorLinks.forEach(link => link.removeEventListener("click", handleAnchorClick));
      console.log("AnchorLinks unmounted");
    };
  }, []);

  return null; // This component only sets up event listeners
};

export default AnchorLinks;
