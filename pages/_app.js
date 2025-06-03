import { AppProvider } from '../src/context/AppContext';
import Layout from '../src/components/common/Layout';
import I18nWrapper from '../src/components/common/I18nWrapper';
import '../src/index.css';
import '../src/i18n/index.js';

export default function MyApp({ Component, pageProps }) {
  return (
    <I18nWrapper>
      <AppProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AppProvider>
    </I18nWrapper>
  );
}
