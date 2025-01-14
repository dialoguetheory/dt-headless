export function addGTMScript(gtmId) {
    const gtmScript = document.createElement('script');
    gtmScript.async = true;
    gtmScript.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;
  
    const gtmDataLayerScript = document.createElement('script');
    gtmDataLayerScript.textContent = `
      (function(w,d,s,l,i){
        w[l]=w[l]||[];
        w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
        var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),
            dl=l!='dataLayer'?'&l='+l:'';
        j.async=true;
        j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
        f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${gtmId}');
    `;
  
    document.head.appendChild(gtmScript);
    document.head.appendChild(gtmDataLayerScript);
  
    return () => {
      document.head.removeChild(gtmScript);
      document.head.removeChild(gtmDataLayerScript);
    };
  }
  