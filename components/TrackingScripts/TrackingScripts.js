import { useEffect } from 'react';
import { addGTMScript } from '../../utils/gtm';
import { addGAScript } from '../../utils/ga';
import { addGTMNoScript } from '../../utils/gtmNoScript';

export default function TrackingScripts() {
  const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

  useEffect(() => {
    if (GTM_ID) {
      const removeGTM = addGTMScript(GTM_ID);
      const removeGTMNoScript = addGTMNoScript(GTM_ID);
      return () => {
        removeGTM();
        removeGTMNoScript();
      };
    }
    if (GA_ID) {
      const removeGA = addGAScript(GA_ID);
      return () => removeGA();
    }
  }, [GTM_ID, GA_ID]);

  return null;
}
