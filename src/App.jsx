import React from 'react';
import { AppProvider } from './context/AppContext';
import Layout from './components/common/Layout';
import I18nWrapper from './components/common/I18nWrapper';

function App() {
  return (
    <I18nWrapper>
      <AppProvider>
        <Layout />
      </AppProvider>
    </I18nWrapper>
  );
}

export default App;
