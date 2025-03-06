import { useEffect, useRef } from "react";

const AnchorLinks = () => {
  const anchorLinksRef = useRef([]);

  useEffect(() => {
    console.log("AnchorLinks mounted - Effect starting");

    function getHeaderOffset() {
      const style = getComputedStyle(document.body);
      let headerOffset = style.getPropertyValue("--header-offset");
      return headerOffset ? parseInt(headerOffset.replace(/\D/g, ""), 10) : 80;
    }

    async function jumpToAnchor(hashSlug) {
      console.log('jumpToAnchor called with:', hashSlug);
      
      if (!hashSlug) {
        console.warn('No hash provided to jumpToAnchor');
        return;
      }

      // Wait for next frame to ensure DOM is ready
      await new Promise(resolve => requestAnimationFrame(resolve));

      // Clean the hashSlug to ensure it's just the ID
      const cleanHash = hashSlug.split('#').pop();
      console.log('Clean hash:', cleanHash);

      const target = document.querySelector(`[data-id='${cleanHash}'], #${cleanHash}`);
      console.log('Found target:', target);
      
      if (!target) {
        console.warn(`Anchor destination ${cleanHash} does not exist on this page.`);
        return;
      }

      // Calculate header offset first
      const headerOffset = getHeaderOffset();
      console.log('Header offset:', headerOffset);

      // Get the target's position
      const rect = target.getBoundingClientRect();
      const absoluteTop = rect.top + window.pageYOffset;
      const targetPosition = absoluteTop - headerOffset;

      // Smooth scroll to target position
      console.log('Smooth scrolling to position:', targetPosition);
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth"
      });

      // Wait for scroll to complete
      await new Promise(resolve => setTimeout(resolve, 1000));

      target.setAttribute("tabindex", "-1");
      target.focus();
      
      console.log('Scroll complete');
    }

    function handleAnchorClick(event) {
      // Use event delegation to check if clicked element is an anchor
      const link = event.target.closest('a[data-anchor], a[data-local="true"][data-anchor="true"]');
      if (!link) return;

      console.log('Anchor clicked:', link);
      
      // Handle both regular anchor links and local anchor links
      let hashSlug;
      
      if (link.dataset.local === 'true' && link.dataset.anchor === 'true') {
        // For local anchors, get just the hash part or the href itself
        const href = link.getAttribute('href');
        hashSlug = href.includes('#') ? href.split('#').pop() : href;
        console.log('Local anchor link clicked, processed href:', hashSlug);
      } else {
        // For regular anchors, extract from URL
        try {
          hashSlug = new URL(link.href).hash.substring(1);
          console.log('Regular anchor link clicked, hash:', hashSlug);
        } catch (e) {
          console.warn('Invalid URL:', link.href);
          return;
        }
      }
      
      if (!hashSlug) {
        console.log('No hash/href found in link');
        return;
      }

      // Remove leading # if present
      hashSlug = hashSlug.replace(/^#/, '');

      if (window.location.pathname === link.pathname || link.dataset.local === 'true') {
        event.preventDefault();
        console.log('Handling anchor click for:', hashSlug);
        jumpToAnchor(hashSlug);
      }
    }

    function setupAnchorDestinations() {
      console.log('Setting up anchor destinations');
      const anchorDests = document.querySelectorAll(".anchor-dest");
      anchorDests.forEach(dest => {
        if (!dest.dataset.anchorParsed) {
          const anchorID = dest.id;
          if (anchorID) {
            dest.dataset.id = anchorID;
            dest.removeAttribute("id");
            dest.setAttribute("tabindex", "-1");
            dest.dataset.anchorParsed = true;
            console.log('Processed anchor destination:', anchorID);
          }
        }
      });
    }

    function initializeAnchors() {
      console.log('Initializing anchors');
      // Add single click handler to document body using event delegation
      document.body.addEventListener("click", handleAnchorClick);
      setupAnchorDestinations();
    }

    // Handle initial hash if present
    if (window.location.hash) {
      const hashSlug = window.location.hash.substring(1);
      if (hashSlug) {
        console.log('Initial hash detected:', hashSlug);
        
        const handleInitialHash = () => {
          console.log('Handling initial hash');
          setTimeout(() => {
            jumpToAnchor(hashSlug);
          }, 100);
        };

        if (document.readyState === 'complete') {
          console.log('Document already complete, jumping immediately');
          handleInitialHash();
        } else {
          console.log('Waiting for load event');
          window.addEventListener('load', handleInitialHash, { once: true });
        }
      }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'complete') {
      console.log('Document already complete, initializing immediately');
      initializeAnchors();
    } else {
      console.log('Waiting for load event before initializing');
      window.addEventListener('load', () => {
        console.log('Page fully loaded, initializing anchors');
        initializeAnchors();
      });
    }

    // Cleanup function
    return () => {
      console.log("AnchorLinks cleanup starting");
      document.body.removeEventListener("click", handleAnchorClick);
      console.log("AnchorLinks unmounted - Cleanup complete");
    };
  }, []);

  return null;
};

export default AnchorLinks;
