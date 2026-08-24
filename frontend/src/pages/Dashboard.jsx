import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { StatCard } from '../components/dashboard/StatCard';
import { ActivityTimeline } from '../components/dashboard/ActivityTimeline';
import { AnomalyBreakdown } from '../components/dashboard/AnomalyBreakdown';
import { RecentAnomalies } from '../components/dashboard/RecentAnomalies';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { useAnomalies } from '../hooks/useAnomalies';
import { useApp } from '../context/AppContext';
import { useFilter } from '../context/FilterContext';
import {
  ScrollText,
  ShieldAlert,
  AlertOctagon,
  Percent,
  Server,
  Activity,
} from 'lucide-react';

export function Dashboard() {
  const { onOpenMobileNav } = useOutletContext();
  const navigate = useNavigate();
  const { openDrawer } = useApp();
  const { updateFilter, setMultipleFilters } = useFilter();

  const { stats, timeline, topSources, severityBreakdown, loading, error, refetch } =
    useDashboardStats();

  const { anomalies, loading: loadingAnomalies } = useAnomalies(
    {},
    { initialLimit: 5 }
  );

  const handleSelectSource = (sourceIp) => {
    updateFilter('source', sourceIp);
    updateFilter('anomalyFilter', 'ANOMALIES_ONLY');
    navigate('/logs');
  };

  const handleSelectSeverity = (severityKey) => {
    updateFilter('severity', severityKey);
    updateFilter('anomalyFilter', 'ANOMALIES_ONLY');
    navigate('/anomalies');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        title="Overview"
        subtitle="Monitor application activity and investigate unusual behavior."
        onOpenMobileNav={onOpenMobileNav}
      />

      <div className="p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
        {/* Section 1: Compact Statistics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {/* Total Logs */}
          <StatCard
            title="Total Logs"
            value={stats?.totalLogs?.toLocaleString() || '12,480'}
            subtitle="Ingested across all services"
            icon={ScrollText}
            variant="normal"
            loading={loading}
            onClick={() => navigate('/logs')}
          />

          {/* Anomalies */}
          <StatCard
            title="Anomalies"
            value={stats?.anomalies?.toLocaleString() || '126'}
            subtitle="Flagged by detection engine"
            icon={ShieldAlert}
            variant="warning"
            trend={{ value: '+4.2%', isPositive: false }}
            loading={loading}
            onClick={() => navigate('/anomalies')}
          />

          {/* Critical */}
          <StatCard
            title="Critical"
            value={stats?.critical?.toLocaleString() || '18'}
            subtitle="Requires urgent triage"
            icon={AlertOctagon}
            variant="critical"
            loading={loading}
            onClick={() => handleSelectSeverity('CRITICAL')}
          />

          {/* Error Rate */}
          <StatCard
            title="Error Rate"
            value={`${stats?.errorRate || '3.8'}%`}
            subtitle="4xx & 5xx responses"
            icon={Percent}
            variant="info"
            trend={{ value: '-0.4%', isPositive: true }}
            loading={loading}
          />

          {/* Sources */}
          <StatCard
            title="Sources"
            value={stats?.sources || '42'}
            subtitle="Distinct client & host IPs"
            icon={Server}
            variant="normal"
            loading={loading}
          />
        </div>

        {/* Section 2: Activity Timeline Chart */}
        <ActivityTimeline
          timeline={timeline}
          loading={loading}
          onSelectBucket={() => navigate('/logs')}
        />

        {/* Section 3: Anomaly Severity Breakdown & Top Anomaly Sources */}
        <AnomalyBreakdown
          breakdown={severityBreakdown || undefined}
          topSources={topSources}
          onSelectSource={handleSelectSource}
          onSelectSeverity={handleSelectSeverity}
        />

        {/* Section 4: Recent Anomalies */}
        <RecentAnomalies
          anomalies={anomalies}
          loading={loadingAnomalies}
          onSelectAnomaly={(anomaly) => openDrawer(anomaly)}
        />
      </div>
    </div>
  );
}
