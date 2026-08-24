import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { FilterProvider } from './context/FilterContext';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { Logs } from './pages/Logs';
import { Anomalies } from './pages/Anomalies';
import { Settings } from './pages/Settings';

export function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <FilterProvider>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="logs" element={<Logs />} />
              <Route path="anomalies" element={<Anomalies />} />
              <Route path="settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </FilterProvider>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
