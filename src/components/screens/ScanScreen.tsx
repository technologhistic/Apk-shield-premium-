import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Search,
  Filter,
  Shield,
  Smartphone,
  CheckCircle2,
  Terminal,
  Cpu,
  FileCheck
} from 'lucide-react';
import { InstalledAppItem, AppScanResult } from '../../types';
import { isProtectedCompanion } from '../../services/securityAnalyzer';

interface ScanScreenProps {
  installedApps: InstalledAppItem[];
  isScanning: boolean;
  scanningApp: string;
  scanProgress: number;
  isPremium: boolean;
  onScanApp: (packageName: string) => void;
  onScanApkFile: (file: File) => void;
}

export const ScanScreen: React.FC<ScanScreenProps> = ({
  installedApps,
  isScanning,
  scanningApp,
  scanProgress,
  isPremium,
  onScanApp,
  onScanApkFile
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<'All' | 'System Apps' | 'User Apps' | 'Outdated SDK (< API 31)'>('All');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      onScanApkFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onScanApkFile(file);
    }
  };

  const filteredApps = installedApps.filter((app) => {
    const matchesSearch =
      app.appName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.packageName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      riskFilter === 'All'
        ? true
        : riskFilter === 'System Apps'
        ? app.isSystem
        : riskFilter === 'User Apps'
        ? !app.isSystem
        : app.targetSdk < 31;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-5 pb-8 relative">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".apk,application/vnd.android.package-archive"
        className="hidden"
      />

      {/* Header */}
      <div>
        <h2 className="text-sm font-bold tracking-widest text-[#10B981] uppercase">
          Malware Scan Center
        </h2>
        <p className="text-xs text-[#94A3B8]">
          Inspect installed package files or standalone APK executables
        </p>
      </div>

      {/* APK File Upload Card */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-3xl p-6 text-center cursor-pointer transition-all duration-300 relative overflow-hidden group ${
          dragActive
            ? 'border-[#10B981] bg-[#10B981]/15 scale-[1.01]'
            : 'border-[#334155]/70 bg-[#1E2942]/60 hover:bg-[#1E2942]/90 hover:border-[#10B981]/50'
        }`}
      >
        <div className="flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-2xl bg-[#10B981]/15 text-[#10B981] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <UploadCloud className="w-7 h-7" />
          </div>
          <h3 className="text-sm font-bold text-white mb-1">
            Scan Standalone APK File
          </h3>
          <p className="text-xs text-[#94A3B8] max-w-sm">
            Drag & drop <span className="font-mono text-[#10B981]">.apk</span> file here or click to select from storage
          </p>
        </div>
      </div>

      {/* Search Bar & Filter Options */}
      <div className="flex items-center gap-2 relative">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search installed packages..."
            className="w-full bg-[#1E2942]/80 border border-[#334155]/60 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-[#94A3B8] focus:outline-none focus:border-[#10B981] transition-colors"
          />
        </div>

        <div className="relative">
          <button
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className={`p-2.5 rounded-xl border transition-colors flex items-center justify-center ${
              showFilterDropdown || riskFilter !== 'All'
                ? 'bg-[#10B981]/15 border-[#10B981] text-[#10B981]'
                : 'bg-[#1E2942]/80 border-[#334155]/60 text-[#94A3B8] hover:text-white'
            }`}
          >
            <Filter className="w-4 h-4" />
          </button>

          {showFilterDropdown && (
            <div className="absolute right-0 top-12 w-48 bg-[#121929] border border-[#334155] rounded-xl shadow-2xl py-1.5 z-30 backdrop-blur-md">
              {(['All', 'System Apps', 'User Apps', 'Outdated SDK (< API 31)'] as const).map(
                (filterOption) => (
                  <button
                    key={filterOption}
                    onClick={() => {
                      setRiskFilter(filterOption);
                      setShowFilterDropdown(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition-colors ${
                      riskFilter === filterOption
                        ? 'bg-[#10B981]/15 text-[#10B981] font-bold'
                        : 'text-[#94A3B8] hover:bg-[#1E2942] hover:text-white'
                    }`}
                  >
                    <span>{filterOption === 'All' ? 'All Apps' : filterOption}</span>
                    {riskFilter === filterOption && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      </div>

      {/* Target Application Header & Count */}
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold tracking-wider text-[#94A3B8] uppercase">
          Target Applications ({filteredApps.length})
        </span>
        {riskFilter !== 'All' && (
          <span className="text-[#10B981] font-semibold">Active: {riskFilter}</span>
        )}
      </div>

      {/* Apps List */}
      {filteredApps.length === 0 ? (
        <div className="bg-[#1E2942]/40 border border-[#334155]/40 rounded-2xl p-8 text-center">
          <p className="text-xs text-[#94A3B8]">
            No applications match your search query.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredApps.map((app) => {
            const isProtected = isProtectedCompanion(app.packageName);
            return (
              <div
                key={app.packageName}
                className="bg-[#1E2942]/80 border border-[#334155]/50 hover:border-[#10B981]/40 rounded-2xl p-3.5 flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-3 min-w-0 pr-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-white/10"
                    style={{ backgroundColor: `${app.iconColor || '#10B981'}20` }}
                  >
                    <Smartphone
                      className="w-5 h-5"
                      style={{ color: app.iconColor || '#10B981' }}
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                        {app.appName}
                      </h4>
                      {isProtected && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40">
                          WHITE-SHIELD
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] font-mono text-[#94A3B8] truncate">
                      {app.packageName}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#121929] text-[#94A3B8] border border-[#334155]/40 font-mono">
                        Target SDK: {app.targetSdk}
                      </span>
                      {app.isSystem && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#06B6D4]/15 text-[#06B6D4] font-bold">
                          SYSTEM
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onScanApp(app.packageName)}
                  className="px-3.5 py-2 rounded-xl bg-[#10B981] hover:bg-[#10B981]/90 text-black text-xs font-black tracking-wider uppercase shrink-0 transition-transform active:scale-95 shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                >
                  Scan
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Animated Diagnostic Telemetry Modal Overlay */}
      {isScanning && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 animate-fade-in">
          <div className="max-w-md w-full bg-[#0F111A] border border-[#10B981]/40 rounded-3xl p-6 text-center shadow-[0_0_50px_rgba(16,185,129,0.15)] flex flex-col items-center">
            {/* Glowing Shield Icon */}
            <div className="relative mb-4">
              <div className="w-20 h-20 rounded-full bg-[#10B981]/15 border-2 border-[#10B981] flex items-center justify-center text-[#10B981] animate-pulse">
                <Shield className="w-10 h-10" />
              </div>
              <span className="absolute inset-0 rounded-full border border-[#10B981]/30 animate-ping" />
            </div>

            <span className="text-[11px] font-bold tracking-widest text-[#10B981] uppercase mb-1">
              Sandbox Diagnostic Running
            </span>
            <h3 className="text-base font-black text-white truncate max-w-full px-4 mb-4">
              {scanningApp || 'Analyzing Application...'}
            </h3>

            {/* Circular Gauge */}
            <div className="relative w-28 h-28 flex items-center justify-center mb-6">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#1E293B"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#10B981"
                  strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - scanProgress)}`}
                  strokeLinecap="round"
                  className="transition-all duration-300"
                />
              </svg>
              <span className="absolute font-mono font-bold text-lg text-[#10B981]">
                {Math.round(scanProgress * 100)}%
              </span>
            </div>

            {/* Telemetry logs terminal */}
            <div className="w-full bg-[#0C121E] border border-[#10B981]/30 rounded-xl p-3 text-left font-mono text-[11px] text-[#06B6D4] space-y-1.5 h-28 overflow-hidden shadow-inner">
              <div className="flex items-center gap-1.5 text-white/50 border-b border-white/10 pb-1 mb-1">
                <Terminal className="w-3 h-3 text-[#10B981]" />
                <span className="text-[10px]">DIAGNOSTIC TELEMETRY LOG</span>
              </div>
              <p>&gt; Initializing static signature parse...</p>
              {scanProgress > 0.3 && (
                <p>&gt; Decrypting cert verification hash values...</p>
              )}
              {scanProgress > 0.6 && (
                <p>&gt; Querying local malware classification cache...</p>
              )}
              {scanProgress > 0.8 && (
                <p className={isPremium ? 'text-[#10B981]' : 'text-amber-400'}>
                  {isPremium
                    ? '&gt; Querying Gemini AI advanced threat intelligence...'
                    : '&gt; Bypassing advanced AI threat check (Free tier)...'}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
