import React, { createContext, useContext, useState, useCallback } from 'react';

const FilterContext = createContext();

const initialFilters = {
  search: '',
  severity: 'ALL',
  status: 'ALL',
  anomalyFilter: 'ALL', // 'ALL', 'ANOMALIES_ONLY', 'NORMAL_ONLY'
  source: '',
  minScore: 0,
};

export function FilterProvider({ children }) {
  const [filters, setFilters] = useState(initialFilters);

  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const setMultipleFilters = useCallback((newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  const hasActiveFilters = Boolean(
    filters.search ||
    filters.severity !== 'ALL' ||
    filters.status !== 'ALL' ||
    filters.anomalyFilter !== 'ALL' ||
    filters.source ||
    filters.minScore > 0
  );

  return (
    <FilterContext.Provider
      value={{
        filters,
        updateFilter,
        setMultipleFilters,
        clearFilters,
        hasActiveFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilter() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
}
