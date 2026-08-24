import React, { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [selectedLog, setSelectedLog] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const openDrawer = useCallback((log) => {
    setSelectedLog(log);
    setIsDrawerOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false);
    // keep selectedLog for slide-out animation, then clear after 200ms
    setTimeout(() => {
      setSelectedLog(null);
    }, 200);
  }, []);

  const openUploadModal = useCallback(() => {
    setIsUploadModalOpen(true);
  }, []);

  const closeUploadModal = useCallback(() => {
    setIsUploadModalOpen(false);
  }, []);

  const addToast = useCallback((toast) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast = {
      id,
      type: toast.type || 'info', // 'success', 'error', 'info', 'warning'
      title: toast.title || '',
      message: toast.message || '',
      duration: toast.duration || 4000,
    };
    setToasts((prev) => [...prev, newToast]);

    if (newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const triggerGlobalRefresh = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
    addToast({
      type: 'info',
      title: 'Refreshing Data',
      message: 'Fetching latest logs and anomaly engine metrics...',
      duration: 2000,
    });
  }, [addToast]);

  return (
    <AppContext.Provider
      value={{
        selectedLog,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
        isUploadModalOpen,
        openUploadModal,
        closeUploadModal,
        toasts,
        addToast,
        removeToast,
        refreshTrigger,
        triggerGlobalRefresh,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
