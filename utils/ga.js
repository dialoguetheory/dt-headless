export function addGAScript(gaId) {
    const gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
  
    const gaInitScript = document.createElement('script');
    gaInitScript.textContent = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${gaId}');
    `;
  
    document.head.appendChild(gaScript);
    document.head.appendChild(gaInitScript);
  
    return () => {
      document.head.removeChild(gaScript);
      document.head.removeChild(gaInitScript);
    };
  }
  