import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Shield,
  FileCheck,
  Cpu,
  Key,
  Zap,
  ExternalLink,
  ChevronRight,
  FolderOpen
} from 'lucide-react';
import { AppScanResult } from '../../types';

interface ScanScreenProps {
  isScanning: boolean;
  scanningApp: string;
  scanProgress: number;
  isPremium: boolean;
  scanHistory?: AppScanResult[];
  onSelectReport?: (report: AppScanResult) => void;
  onScanApkFile: (file: File) => void;
}

export const ScanScreen: React.FC<ScanScreenProps> = ({
  isScanning,
  scanningApp,
  scanProgress,
  isPremium,
  scanHistory = [],
  onSelectReport,
  onScanApkFile
}) => {
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

  return (
    <div className="space-y-6 pb-8 relative">
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
          Upload and inspect Android Package (.apk) binaries for security threats
        </p>
      </div>

      {/* APK File Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all duration-300 relative overflow-hidden group ${
          dragActive
            ? 'border-[#10B981] bg-[#10B981]/15 scale-[1.01] shadow-[0_0_30px_rgba(16,185,129,0.2)]'
            : 'border-[#334155]/80 bg-[#1E2942]/60 hover:bg-[#1E2942]/90 hover:border-[#10B981]/60'
        }`}
      >
        <div className="flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-[#10B981]/15 text-[#10B981] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(16,185,129,0.25)]">
            <UploadCloud className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-white mb-1.5">
            Scan Android APK File
          </h3>
          <p className="text-xs text-[#94A3B8] max-w-sm mb-5 leading-relaxed">
            Drag & drop any <span className="font-mono text-[#10B981]">.apk</span> file here or click to browse from device storage
          </p>

          <button
            type="button"
            className="px-6 py-2.5 rounded-xl bg-[#10B981] text-black text-xs font-black tracking-wider uppercase flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-transform group-hover:scale-105 pointer-events-none"
          >
            <FolderOpen className="w-4 h-4" />
            <span>Select .APK File</span>
          </button>
        </div>
      </div>

      {/* Security Analysis Capabilities */}
      <div>
        <h3 className="text-xs font-bold tracking-widest text-[#94A3B8]/80 uppercase mb-3">
          Inspection Pipeline
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="bg-[#1E2942]/70 border border-[#334155]/50 rounded-2xl p-4 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-[#121929] text-[#10B981] shrink-0">
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-white">Manifest Disassembly</h4>
              <p className="text-[#94A3B8] text-[11px] mt-0.5 leading-relaxed">
                Audits permissions, intent filters, exported activities, and cleartext HTTP traffic.
              </p>
            </div>
          </div>

          <div className="bg-[#1E2942]/70 border border-[#334155]/50 rounded-2xl p-4 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-[#121929] text-[#06B6D4] shrink-0">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-white">Cryptographic Hashes</h4>
              <p className="text-[#94A3B8] text-[11px] mt-0.5 leading-relaxed">
                Calculates SHA-256, SHA-1, and MD5 file signatures and certificate authority roots.
              </p>
            </div>
          </div>

          <div className="bg-[#1E2942]/70 border border-[#334155]/50 rounded-2xl p-4 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-[#121929] text-[#F59E0B] shrink-0">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-white">Heuristic Malware Rules</h4>
              <p className="text-[#94A3B8] text-[11px] mt-0.5 leading-relaxed">
                Detects SMS billing trojans, spyware surveillance combinations, and obfuscation.
              </p>
            </div>
          </div>

          <div className="bg-[#1E2942]/70 border border-[#334155]/50 rounded-2xl p-4 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-[#121929] text-[#10B981] shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-white">Gemini Threat AI</h4>
              <p className="text-[#94A3B8] text-[11px] mt-0.5 leading-relaxed">
                Deep neural cognitive analysis evaluating code intent and zero-day exposure vectors.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recently Scanned APK Files (Real history only) */}
      {scanHistory.length > 0 && (
        <div>
          <h3 className="text-xs font-bold tracking-widest text-[#94A3B8]/80 uppercase mb-3">
            Recently Scanned APK Files ({scanHistory.length})
          </h3>
          <div className="space-y-2.5">
            {scanHistory.map((report, idx) => {
              const itemColor =
                report.riskLevel === 'Safe' || report.riskLevel === 'Low'
                  ? '#10B981'
                  : report.riskLevel === 'Medium'
                  ? '#F59E0B'
                  : '#EF4444';

              return (
                <div
                  key={`${report.packageName}-${idx}`}
                  onClick={() => onSelectReport?.(report)}
                  className="bg-[#1E2942]/80 hover:bg-[#1E2942] border border-[#334155]/50 hover:border-[#10B981]/40 rounded-2xl p-3.5 flex items-center justify-between cursor-pointer transition-all active:scale-[0.99]"
                >
                  <div className="min-w-0 pr-3">
                    <h4 className="text-sm font-bold text-white truncate">
                      {report.appName}
                    </h4>
                    <p className="text-[11px] font-mono text-[#94A3B8] truncate">
                      {report.packageName}
                    </p>
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
                      {report.riskLevel} • {report.riskScore}/100
                    </span>
                    <ChevronRight className="w-4 h-4 text-[#94A3B8]" />
                  </div>
                </div>
              );
            })}
          </div>
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
            <h3 className="text-base font-black text-white truncate max-w-full px-4 mb-5">
              {scanningApp || 'Analyzing APK File...'}
            </h3>

            {/* Circular Gauge */}
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#1E293B"
                  strokeWidth={8}
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#10B981"
                  strokeWidth={8}
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
          </div>
        </div>
      )}
    </div>
  );
};
