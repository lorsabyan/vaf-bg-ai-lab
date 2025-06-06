import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import SearchPanel from '../articles/SearchPanel';

function Sidebar() {
  const { state, dispatch, ActionTypes } = useApp();

  useEffect(() => {
    // Auto-close sidebar when resizing to desktop size
    const handleResize = () => {
      if (window.innerWidth >= 1024) { // lg breakpoint
        dispatch({ type: ActionTypes.TOGGLE_SIDEBAR });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch, ActionTypes]);

  const closeSidebar = () => {
    if (window.innerWidth < 1024) {
      dispatch({ type: ActionTypes.TOGGLE_SIDEBAR });
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {state.sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto
          w-80 lg:w-96 bg-white border-r border-gray-200 
          transform transition-transform duration-300 ease-in-out
          flex flex-col shrink-0 shadow-lg lg:shadow-none
          ${state.sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Mobile close button */}
        <div className="lg:hidden flex justify-end p-4 border-b">
          <button
            onClick={closeSidebar}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>        {/* Content - Always show articles search */}
        <div className="flex-1 overflow-hidden">
          <SearchPanel onArticleSelect={closeSidebar} />
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
