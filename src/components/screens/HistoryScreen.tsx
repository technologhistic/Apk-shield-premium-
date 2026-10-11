import React, { useState } from 'react';
import { History, Trash2, ExternalLink, ShieldCheck, AlertTriangle } from 'lucide-react';
import { AppScanResult } from '../../types';

interface HistoryScreenProps {
  history: AppScanResult[];
  onSelectReport: (report: AppScanResult) => void;
  onClearHistory: () => void;
  onNavigateToScan: () => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  history,
  onSelectReport,
  onClearHistory,
  onNavigateToScan
}) => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  return (
    <div className="space-y-5 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold tracking-widest text-[#10B981] uppercase">
            Threat Scan History
          </h2>
          <p className="text-xs text-[#94A3B8]">
            A records timeline of historical package analyses
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={() => setShowClearConfirm(true)}
            className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-colors flex items-center justify-center cursor-pointer"
            title="Clear all history logs"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Confirmation Dialog */}
      {showClearConfirm && (
        <div className="bg-[#13111C] border border-red-500/40 rounded-2xl p-4 space-y-3 animate-fade-in">
          <div className="flex items-center gap-2 text-red-400 font-bold text-xs">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Clear all saved security audit records?</span>
          </div>
          <p className="text-[11px] text-[#94A3B8]">
            This will permanently erase all local diagnostic reports from storage.
          </p>
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              onClick={() => setShowClearConfirm(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#94A3B8] hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onClearHistory();
                setShowClearConfirm(false);
              }}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-red-500 text-white hover:bg-red-600 transition-colors"
            >
              Confirm Erase
            </button>
          </div>
        </div>
      )}

      {/* History Items */}
      {history.length === 0 ? (
        <div className="bg-[#1E2942]/40 border border-[#334155]/40 rounded-3xl p-10 text-center flex flex-col items-center justify-center my-6">
          <div className="w-16 h-16 rounded-2xl bg-[#121929] flex items-center justify-center text-[#94A3B8] mb-4">
            <History className="w-8 h-8 opacity-40" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">Scan History is Empty</h3>
          <p className="text-xs text-[#94A3B8] max-w-sm leading-relaxed mb-6">
            Once you perform static or AI behavioral analyses on target apps, fully detailed security audit reports are saved here securely.
          </p>
          <button
            onClick={onNavigateToScan}
            className="px-5 py-2.5 rounded-xl bg-[#10B981] text-black font-bold text-xs hover:bg-[#10B981]/90 transition-all cursor-pointer"
          >
            Launch First Scan
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((report, idx) => {
            const riskColor =
              report.riskLevel === 'Safe' || report.riskLevel === 'Low'
                ? '#10B981'
                : report.riskLevel === 'Medium'
                ? '#F59E0B'
                : '#EF4444';

            const formattedTime = new Date(report.scanTime).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <div
                key={`${report.packageName}-${idx}`}
                onClick={() => onSelectReport(report)}
                className="bg-[#1E2942]/80 hover:bg-[#1E2942] border border-[#334155]/50 hover:border-[#10B981]/40 rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all active:scale-[0.99] group"
              >
                <div className="min-w-0 pr-3">
                  <h4 className="text-sm font-bold text-white truncate group-hover:text-[#10B981] transition-colors">
                    {report.appName}
                  </h4>
                  <p className="text-[11px] font-mono text-[#94A3B8] truncate">
                    {report.packageName}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5 text-[10px]">
                    <span className="text-[#06B6D4] font-semibold">
                      {report.isApkFile ? 'Offline APK File' : 'Installed Package'}
                    </span>
                    <span className="text-white/20">•</span>
                    <span className="text-[#94A3B8]">{formattedTime}</span>
                  </div>
                </div>

                <div className="shrink-0 flex flex-col items-end gap-1.5">
                  <span
                    className="px-2.5 py-1 rounded-lg text-xs font-black tracking-wider uppercase border"
                    style={{
                      backgroundColor: `${riskColor}15`,
                      borderColor: `${riskColor}40`,
                      color: riskColor
                    }}
                  >
                    {report.riskLevel}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-[#94A3B8]">
                    <span>Score: {report.riskScore}</span>
                    <ExternalLink className="w-3 h-3 text-[#10B981]" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
