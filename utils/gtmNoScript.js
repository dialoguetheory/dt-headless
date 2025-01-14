export function addGTMNoScript(gtmId) {
    if (!gtmId) return null;
  
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.googletagmanager.com/ns.html?id=${gtmId}`;
    iframe.height = '0';
    iframe.width = '0';
    iframe.style.display = 'none';
    iframe.style.visibility = 'hidden';
  
    const noscriptElement = document.createElement('noscript');
    noscriptElement.appendChild(iframe);
  
    document.body.appendChild(noscriptElement);
  
    return () => {
      document.body.removeChild(noscriptElement);
    };
  }
  