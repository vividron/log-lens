/**
 * Format timestamps into human-readable strings
 */
export function formatTimestamp(isoString, format = 'full') {
  if (!isoString) return '—';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;

    if (format === 'time') {
      return date.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    }

    if (format === 'time-ms') {
      const time = date.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      const ms = String(date.getMilliseconds()).padStart(3, '0');
      return `${time}.${ms}`;
    }

    if (format === 'date') {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }

    if (format === 'relative') {
      const now = new Date();
      const diffMs = now - date;
      const diffSecs = Math.floor(diffMs / 1000);
      const diffMins = Math.floor(diffSecs / 60);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffSecs < 60) return `${Math.max(0, diffSecs)}s ago`;
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      return `${diffDays}d ago`;
    }

    // Default full: "Aug 24, 2026 10:15:10.420"
    return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} ${date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}.${String(date.getMilliseconds()).padStart(3, '0')}`;
  } catch (e) {
    return isoString;
  }
}

/**
 * Format bytes to readable size (KB, MB, GB)
 */
export function formatBytes(bytes, decimals = 1) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Format number with commas (e.g. 12,480)
 */
export function formatNumber(num) {
  if (num === null || num === undefined) return '0';
  return num.toLocaleString();
}

/**
 * Get color mapping according to severity
 */
export function getSeverityConfig(severity) {
  const normalized = (severity || 'NORMAL').toUpperCase();
  switch (normalized) {
    case 'CRITICAL':
      return {
        label: 'CRITICAL',
        dotColor: 'bg-rose-500',
        textColor: 'text-rose-400',
        borderColor: 'border-rose-500/30',
        bgColor: 'bg-rose-950/30',
        hoverBg: 'hover:bg-rose-950/40',
        badgeBg: 'bg-rose-500/15',
        badgeBorder: 'border-rose-500/40',
        badgeText: 'text-rose-400',
        ringColor: '#ef4444',
      };
    case 'HIGH':
      return {
        label: 'HIGH',
        dotColor: 'bg-orange-500',
        textColor: 'text-orange-400',
        borderColor: 'border-orange-500/30',
        bgColor: 'bg-orange-950/30',
        hoverBg: 'hover:bg-orange-950/40',
        badgeBg: 'bg-orange-500/15',
        badgeBorder: 'border-orange-500/40',
        badgeText: 'text-orange-400',
        ringColor: '#f97316',
      };
    case 'WARNING':
    case 'MEDIUM':
      return {
        label: 'MEDIUM',
        dotColor: 'bg-amber-400',
        textColor: 'text-amber-400',
        borderColor: 'border-amber-500/30',
        bgColor: 'bg-amber-950/20',
        hoverBg: 'hover:bg-amber-950/30',
        badgeBg: 'bg-amber-500/15',
        badgeBorder: 'border-amber-500/40',
        badgeText: 'text-amber-400',
        ringColor: '#fbbf24',
      };
    case 'LOW':
    case 'INFO':
      return {
        label: 'LOW',
        dotColor: 'bg-sky-400',
        textColor: 'text-sky-400',
        borderColor: 'border-sky-500/20',
        bgColor: 'bg-sky-950/20',
        hoverBg: 'hover:bg-sky-950/30',
        badgeBg: 'bg-sky-500/10',
        badgeBorder: 'border-sky-500/30',
        badgeText: 'text-sky-400',
        ringColor: '#38bdf8',
      };
    case 'NORMAL':
    default:
      return {
        label: 'NORMAL',
        dotColor: 'bg-slate-500',
        textColor: 'text-slate-400',
        borderColor: 'border-slate-800',
        bgColor: 'bg-slate-900/30',
        hoverBg: 'hover:bg-slate-800/40',
        badgeBg: 'bg-slate-800/60',
        badgeBorder: 'border-slate-700/50',
        badgeText: 'text-slate-300',
        ringColor: '#64748b',
      };
  }
}

/**
 * Get HTTP status code styling
 */
export function getHttpStatusStyle(status) {
  const code = parseInt(status, 10);
  if (!code || isNaN(code)) {
    return {
      text: 'text-slate-400',
      bg: 'bg-slate-800/60',
      border: 'border-slate-700/50',
      label: status || '—',
    };
  }

  if (code >= 500) {
    return {
      text: 'text-rose-400',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/30',
      label: `${code}`,
    };
  }
  if (code >= 400) {
    return {
      text: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      label: `${code}`,
    };
  }
  if (code >= 300) {
    return {
      text: 'text-sky-400',
      bg: 'bg-sky-500/10',
      border: 'border-sky-500/30',
      label: `${code}`,
    };
  }
  if (code >= 200) {
    return {
      text: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
      label: `${code}`,
    };
  }

  return {
    text: 'text-slate-400',
    bg: 'bg-slate-800/60',
    border: 'border-slate-700/50',
    label: `${code}`,
  };
}

/**
 * Copy text to clipboard safely
 */
export async function copyToClipboard(text) {
  if (!navigator.clipboard) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (err) {
      document.body.removeChild(textArea);
      return false;
    }
  }
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    return false;
  }
}
