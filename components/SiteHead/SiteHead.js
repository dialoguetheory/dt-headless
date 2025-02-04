import parse from 'html-react-parser';
import Head from 'next/head';
import { TrackingScripts } from '../../components';

const SiteHead = ({ fullHead = false }) => {
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