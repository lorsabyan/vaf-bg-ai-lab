import React from 'react';
import { AppProvider } from './context/AppContext';
import Layout from './components/common/Layout';

function App() {
  return (
    <AppProvider>
      <Layout />
    </AppProvider>
  );
}

export default App;
