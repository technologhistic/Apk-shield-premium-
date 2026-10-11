import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Bug,
  Zap,
  Shield,
  Cloud,
  Layers,
  Info,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { AppScanResult, InstalledAppItem } from '../../types';

interface DashboardScreenProps {
  securityScore: number;
  activeThreats: number;
  safeApps: number;
  isPremium: boolean;
  isRealTimeEnabled: boolean;
  scanHistory: AppScanResult[];
  isScanning: boolean;
  scanningApp: string;
  scanProgress: number;
  installedApps: InstalledAppItem[];
  onNavigateToScan: () => void;
  onNavigateToHistory: () => void;
  onInspectReport: (report: AppScanResult) => void;
  onRapidScan: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  securityScore,
  activeThreats,
  safeApps,
  isPremium,
  isRealTimeEnabled,
  scanHistory,
  isScanning,
  scanningApp,
  scanProgress,
  onNavigateToScan,
  onNavigateToHistory,
  onInspectReport,
  onRapidScan
}) => {
  // Determine score color
  const scoreColor =
    securityScore >= 85 ? '#10B981' : securityScore >= 60 ? '#F59E0B' : '#EF4444';

  const statusText =
    securityScore >= 85
      ? 'System Fully Protected'
      : securityScore >= 60
      ? 'Review Active Warnings'
      : 'Critical Risks Detected!';

  // SVG Radial Gauge calculation
  // Angle: from -225 deg to 45 deg (sweep of 270 deg)
  const radius = 64;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * (270 / 360);
  const strokeDashoffset = arcLength - (arcLength * (securityScore / 100));

  return (
    <div className="space-y-5 pb-6">
      {/* Center Score Indicator Card */}
      <div className="bg-[#1E2942]/90 border border-[#334155]/60 rounded-3xl p-6 shadow-xl relative overflow-hidden backdrop-blur-sm">
        <div className="absolute top-0 right-0 w-64 h-64 bg-radial from-[#10B981]/5 to-transparent pointer-events-none" />

        <div className="flex flex-col items-center text-center">
          {/* Radial Meter */}
          <div className="relative w-44 h-44 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
              {/* Background Arc */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="transparent"
                stroke="#1E293B"
                strokeWidth={strokeWidth}
                strokeDasharray={`${arcLength} ${circumference}`}
                strokeLinecap="round"
                className="rotate-[135deg] origin-center"
              />
              {/* Value Arc */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="transparent"
                stroke={scoreColor}
                strokeWidth={strokeWidth}
                strokeDasharray={`${arcLength} ${circumference}`}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="rotate-[135deg] origin-center transition-all duration-1000 ease-out"
                style={{
                  filter: `drop-shadow(0 0 8px ${scoreColor}80)`
                }}
              />
            </svg>

            {/* Inner Content */}
            <div className="absolute flex flex-col items-center justify-center">
              <span
                className="text-5xl font-black tracking-tight"
                style={{ color: scoreColor }}
              >
                {securityScore}
              </span>
              <span className="text-[10px] font-bold tracking-widest text-[#94A3B8] mt-1">
                SECURITY SCORE
              </span>
            </div>
          </div>

          {/* Safety Status */}
          <div className="mt-4 flex items-center justify-center gap-2">
            {securityScore >= 85 ? (
              <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
            ) : securityScore >= 60 ? (
              <AlertTriangle className="w-5 h-5 text-[#F59E0B]" />
            ) : (
              <Bug className="w-5 h-5 text-[#EF4444]" />
            )}
            <span
              className="text-base font-bold tracking-wide"
              style={{ color: scoreColor }}
            >
              {statusText}
            </span>
          </div>
        </div>
      </div>

      {/* Main Scan Action Button */}
      <button
        onClick={onNavigateToScan}
        className="w-full h-14 rounded-2xl bg-[#10B981] hover:bg-[#10B981]/90 text-black font-bold text-sm flex items-center justify-center gap-2.5 shadow-[0_0_20px_rgba(16,185,129,0.25)] transition-all cursor-pointer active:scale-[0.98]"
      >
        <Zap className="w-5 h-5 fill-black" />
        <span>Scan Android APK File</span>
      </button>

      {/* Active Scanning Progress Card (if scanning in progress) */}
      {isScanning && (
        <div className="bg-[#10B981]/10 border border-[#10B981]/40 rounded-2xl p-4 animate-pulse">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#10B981] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
              Analyzing: {scanningApp || 'Scanning package...'}
            </span>
            <span className="text-xs font-mono font-bold text-[#10B981]">
              {Math.round(scanProgress * 100)}%
            </span>
          </div>
          <div className="w-full bg-[#121929] rounded-full h-2 overflow-hidden">
            <div
              className="bg-[#10B981] h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.round(scanProgress * 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Security Core Modules Status Grid */}
      <div>
        <h3 className="text-xs font-bold tracking-widest text-[#94A3B8]/70 uppercase mb-2">
          Shield System Shielding
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#1E2942]/70 border border-[#334155]/50 rounded-2xl p-4">
            <div className="w-9 h-9 rounded-xl bg-[#121929] flex items-center justify-center mb-3">
              <CheckCircle2
                className={`w-5 h-5 ${isRealTimeEnabled ? 'text-[#10B981]' : 'text-[#64748B]'}`}
              />
            </div>
            <h4 className="text-sm font-bold text-white">Real-Time Scan</h4>
            <p className="text-xs text-[#94A3B8]">
              {isRealTimeEnabled ? 'Fully Active' : 'Deactivated'}
            </p>
          </div>

          <div className="bg-[#1E2942]/70 border border-[#334155]/50 rounded-2xl p-4">
            <div className="w-9 h-9 rounded-xl bg-[#121929] flex items-center justify-center mb-3">
              <Cloud
                className={`w-5 h-5 ${isPremium ? 'text-[#06B6D4]' : 'text-[#F59E0B]'}`}
              />
            </div>
            <h4 className="text-sm font-bold text-white">Threat Intell.</h4>
            <p className="text-xs text-[#94A3B8]">
              {isPremium ? 'Advanced AI' : 'Local Core'}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Threat Summary Banner */}
      <div
        className={`bg-[#1E2942]/70 rounded-2xl p-4 flex items-center gap-3 border ${
          securityScore < 50 ? 'border-red-500/40' : 'border-[#334155]/50'
        }`}
      >
        <div className="p-2.5 rounded-xl bg-[#121929] shrink-0">
          <Info className="w-6 h-6" style={{ color: scoreColor }} />
        </div>
        <div>
          <div className="text-[11px] font-bold tracking-wider uppercase" style={{ color: scoreColor }}>
            Threat Threshold Monitor
          </div>
          <div className="text-xs font-semibold text-white/90 mt-0.5">
            Vulnerabilities: <span className="text-[#EF4444] font-bold">{activeThreats} High Risk</span> |{' '}
            <span className="text-[#10B981] font-bold">{safeApps} Clean Apps</span>
          </div>
        </div>
      </div>

      {/* Recent Shield Security Runs */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold tracking-widest text-[#94A3B8]/70 uppercase">
            Recent Shield Security Runs
          </h3>
          <button
            onClick={onNavigateToHistory}
            className="text-xs font-bold text-[#10B981] hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {scanHistory.length === 0 ? (
          <div className="bg-[#1E2942]/40 border border-[#334155]/40 rounded-2xl p-6 text-center">
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              No scanning logs found. Run a full scan on your installed packages or standalone APKs to populate device metrics.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {scanHistory.slice(0, 3).map((report, idx) => {
              const itemColor =
                report.riskLevel === 'Safe' || report.riskLevel === 'Low'
                  ? '#10B981'
                  : report.riskLevel === 'Medium'
                  ? '#F59E0B'
                  : '#EF4444';

              return (
                <div
                  key={`${report.packageName}-${idx}`}
                  onClick={() => onInspectReport(report)}
                  className="bg-[#1E2942]/70 hover:bg-[#1E2942] border border-[#334155]/50 hover:border-[#10B981]/40 rounded-2xl p-3.5 flex items-center justify-between cursor-pointer transition-all active:scale-[0.99]"
                >
                  <div className="min-w-0 pr-3">
                    <h4 className="text-sm font-bold text-white truncate">{report.appName}</h4>
                    <p className="text-[11px] font-mono text-[#94A3B8] truncate">{report.packageName}</p>
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                    <span
                      className="px-2.5 py-1 rounded-lg text-xs font-bold font-mono border"
                      style={{
                        backgroundColor: `${itemColor}15`,
                        borderColor: `${itemColor}40`,
                        color: itemColor
                      }}
                    >
                      Score: {report.riskScore}
                    </span>
                    <ChevronRight className="w-4 h-4 text-[#94A3B8]" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
