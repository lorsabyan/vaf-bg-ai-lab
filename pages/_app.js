import { AppProvider } from '../src/context/AppContext';
import Layout from '../src/components/common/Layout';
import I18nWrapper from '../src/components/common/I18nWrapper';
import Head from 'next/head';
import '../src/index.css';
import '../src/i18n/index.js';

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Brainograph AI Lab - VAF</title>
      </Head>
      <I18nWrapper>
        <AppProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </AppProvider>
      </I18nWrapper>
    </>
  );
}
