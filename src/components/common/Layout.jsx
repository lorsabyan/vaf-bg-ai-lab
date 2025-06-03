import React from 'react';
import { useApp } from '../../context/AppContext';
import Header from './Header';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import LoginForm from '../auth/LoginForm';
import MessageToast from '../ui/MessageToast';

function Layout({ children }) {
  const { state } = useApp();

  if (!state.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-indigo-100 flex items-center justify-center p-4">
        <LoginForm />
        <MessageToast />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <MainContent />
      </div>
      <MessageToast />
      {children}
    </div>
  );
}

export default Layout;
