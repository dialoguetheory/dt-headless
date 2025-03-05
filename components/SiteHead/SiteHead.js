import parse from 'html-react-parser';
import Head from 'next/head';
import { TrackingScripts } from '../../components';

const SiteHead = ({ fullHead = false, frontPage = false }) => {

  if (frontPage && fullHead) {
    fullHead = fullHead.replace(
      /<meta\s+property="og:type"\s+content="[^"]*"\s*\/?>/i, 
      `<meta property="og:type" content="website" />`
    );
    }

  return (
    <>
      <Head>
        {fullHead && parse(fullHead)}
      </Head>
      <TrackingScripts />
    </>
  );
};

export default SiteHead;