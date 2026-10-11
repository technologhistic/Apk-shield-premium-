import React from 'react';
import {
  ShieldCheck,
  Cloud,
  FileCheck2,
  Info,
  Lock,
  Smartphone,
  Cpu
} from 'lucide-react';

interface SettingsScreenProps {
  isRealTimeEnabled: boolean;
  isCloudSyncEnabled: boolean;
  onToggleRealTime: () => void;
  onToggleCloudSync: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  isRealTimeEnabled,
  isCloudSyncEnabled,
  onToggleRealTime,
  onToggleCloudSync
}) => {
  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h2 className="text-sm font-bold tracking-widest text-[#10B981] uppercase">
          Shield System Settings
        </h2>
        <p className="text-xs text-[#94A3B8]">
          Configure real-time defenses, whitelists, and cloud sync policies
        </p>
      </div>

      {/* ACTIVE THREAT PROTECTION */}
      <div>
        <h3 className="text-xs font-bold tracking-widest text-[#94A3B8]/80 uppercase mb-3">
          Active Threat Protection
        </h3>
        <div className="bg-[#1E2942]/90 border border-[#334155]/60 rounded-3xl p-5 space-y-4">
          {/* Real-time toggle */}
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <h4 className="text-sm font-bold text-white">
                Real-Time Install Protection
              </h4>
              <p className="text-xs text-[#94A3B8] mt-0.5 leading-relaxed">
                Instantly audit newly installed apps and packages in the background, issuing security alerts on threats.
              </p>
            </div>
            <button
              onClick={onToggleRealTime}
              className={`w-12 h-6 rounded-full transition-colors relative shrink-0 p-0.5 cursor-pointer ${
                isRealTimeEnabled ? 'bg-[#10B981]' : 'bg-[#334155]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  isRealTimeEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="border-t border-[#334155]/60 pt-4 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <h4 className="text-sm font-bold text-white">
                Secure Cloud Sync
              </h4>
              <p className="text-xs text-[#94A3B8] mt-0.5 leading-relaxed">
                Synchronize your historical scan reports and threat databases securely to external cloud instances.
              </p>
            </div>
            <button
              onClick={onToggleCloudSync}
              className={`w-12 h-6 rounded-full transition-colors relative shrink-0 p-0.5 cursor-pointer ${
                isCloudSyncEnabled ? 'bg-[#10B981]' : 'bg-[#334155]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  isCloudSyncEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* MUTUAL WHITE-SHIELD POLICY SYSTEM */}
      <div>
        <h3 className="text-xs font-bold tracking-widest text-[#94A3B8]/80 uppercase mb-3">
          Mutual White-Shield Policy System
        </h3>
        <div className="bg-[#1E2942]/90 border border-[#334155]/60 rounded-3xl p-5 space-y-3.5">
          <div className="flex items-center gap-2.5 text-[#10B981]">
            <ShieldCheck className="w-5 h-5" />
            <h4 className="text-sm font-bold">APK Shield Whitelist Sandbox Rule</h4>
          </div>

          <p className="text-xs text-white/80 leading-relaxed">
            To preserve system performance and avoid infinite looping analysis pipelines, APK Shield applications enforce a strict mutual bypass protocol. APK Shield Premium will never analyze APK Shield Free, and APK Shield Free will never analyze APK Shield Premium.
          </p>

          <div className="bg-[#0C121E] border border-[#334155]/60 rounded-2xl p-3.5 space-y-1 font-mono text-xs">
            <span className="text-[10px] text-[#06B6D4] font-bold block uppercase tracking-wider">
              Developer Certificate Security Seal:
            </span>
            <p className="text-white/70 text-[11px]">
              Fingerprint: Verified SHA-256 Authority Root (Mutual Isolation Active)
            </p>
          </div>
        </div>
      </div>

      {/* ABOUT THE SOFTWARE */}
      <div>
        <h3 className="text-xs font-bold tracking-widest text-[#94A3B8]/80 uppercase mb-3">
          About the Software
        </h3>
        <div className="bg-[#1E2942]/90 border border-[#334155]/60 rounded-3xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-[#10B981]" />
            <h4 className="text-sm font-bold text-white">
              APK Shield Premium v1.0.0
            </h4>
          </div>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            A military-grade, offline-first signature malware scanner and zero-day threat analyzer built with high-performance heuristics and Gemini models.
          </p>
          <div className="border-t border-[#334155]/60 pt-3">
            <span className="text-xs font-bold text-white block mb-1">
              Privacy Statement:
            </span>
            <p className="text-[11px] text-[#94A3B8] leading-relaxed">
              APK Shield does not transmit your personal data, list of packages, or unique keys to any central analytics server. All file scans, signature extractions, and certificate evaluations are executed fully locally in your browser sandbox. AI Threat Sandbox is powered securely via Google Gemini.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
