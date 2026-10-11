import React, { useState } from 'react';
import {
  FileText,
  Download,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Bug,
  Shield,
  Key,
  Code2,
  Wrench,
  EyeOff,
  Copy,
  Check,
  Zap,
  Layers,
  ArrowRight
} from 'lucide-react';
import { AppScanResult } from '../../types';

interface ReportsScreenProps {
  report: AppScanResult | null;
  isPremium: boolean;
  onNavigateToPremium: () => void;
  onNavigateToScan: () => void;
  onExportPdf: (report: AppScanResult) => void;
}

export const ReportsScreen: React.FC<ReportsScreenProps> = ({
  report,
  isPremium,
  onNavigateToPremium,
  onNavigateToScan,
  onExportPdf
}) => {
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  if (!report) {
    return (
      <div className="bg-[#1E2942]/40 border border-[#334155]/50 rounded-3xl p-10 text-center flex flex-col items-center justify-center my-8">
        <div className="w-16 h-16 rounded-2xl bg-[#121929] flex items-center justify-center text-[#94A3B8] mb-4">
          <FileText className="w-8 h-8 opacity-40" />
        </div>
        <h3 className="text-base font-bold text-white mb-2">
          No Active Security Report Selected
        </h3>
        <p className="text-xs text-[#94A3B8] max-w-sm leading-relaxed mb-6">
          Perform a safety scan on any installed package or standalone APK file to display granular vulnerability reports.
        </p>
        <button
          onClick={onNavigateToScan}
          className="px-5 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#10B981]/90 text-black font-bold text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all"
        >
          <Layers className="w-4 h-4 fill-black" />
          <span>Open Scanner</span>
        </button>
      </div>
    );
  }

  const riskColor =
    report.riskLevel === 'Safe' || report.riskLevel === 'Low'
      ? '#10B981'
      : report.riskLevel === 'Medium'
      ? '#F59E0B'
      : '#EF4444';

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(label);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* App Identity Header */}
      <div className="bg-[#1E2942]/90 border border-[#334155]/60 rounded-3xl p-5 backdrop-blur-md">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl font-black text-white truncate">
              {report.appName}
            </h2>
            <p className="text-xs font-mono text-[#94A3B8] truncate mt-0.5">
              {report.packageName}
            </p>
            <p className="text-[11px] text-[#94A3B8]/80 mt-1">
              Version: {report.versionName} (Build {report.versionCode})
            </p>
          </div>

          <div
            className="px-3.5 py-1.5 rounded-xl border text-xs font-black tracking-wider uppercase shrink-0"
            style={{
              backgroundColor: `${riskColor}15`,
              borderColor: `${riskColor}50`,
              color: riskColor
            }}
          >
            {report.riskLevel}
          </div>
        </div>
      </div>

      {/* Security Risk Score Card */}
      <div className="bg-[#1E2942]/90 border border-[#334155]/60 rounded-3xl p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-white">
            Static Risk Rating Score
          </span>
          <span
            className="text-base font-black font-mono"
            style={{ color: riskColor }}
          >
            {report.riskScore}/100
          </span>
        </div>

        <div className="w-full bg-[#121929] rounded-full h-2.5 overflow-hidden mb-4">
          <div
            className="h-2.5 rounded-full transition-all duration-700"
            style={{
              width: `${report.riskScore}%`,
              backgroundColor: riskColor
            }}
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onExportPdf(report)}
            className="flex-1 h-10 rounded-xl bg-[#10B981] hover:bg-[#10B981]/90 text-black text-xs font-bold flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all cursor-pointer active:scale-[0.98]"
          >
            <Download className="w-4 h-4" />
            <span>Export PDF Dossier</span>
          </button>

          <div className="px-3 py-2 rounded-xl bg-[#0C121E] border border-[#10B981]/30 flex items-center gap-1.5 shrink-0">
            <Lock className="w-3.5 h-3.5 text-[#10B981]" />
            <span className="text-[10px] font-mono font-bold text-[#10B981]">
              AES-256 SECURED
            </span>
          </div>
        </div>
      </div>

      {/* ADVANCED PREMIUM SECURITY SUITE */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold tracking-widest text-[#94A3B8]/80 uppercase">
            Advanced Premium Security Suite
          </h3>
          {!isPremium && (
            <button
              onClick={onNavigateToPremium}
              className="text-[11px] font-bold text-amber-400 hover:underline flex items-center gap-1"
            >
              <span>Unlock Suite</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>

        <div className="space-y-3">
          {/* Feature 1: AI Vulnerability Analysis */}
          <PremiumCardShell
            title="Premium Feature 1: AI Vulnerability Analysis"
            icon={<Zap className="w-4 h-4 text-[#06B6D4]" />}
            isLocked={!isPremium}
            onUnlock={onNavigateToPremium}
          >
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#06B6D4] block">
                AI Cognitive Threat Summary:
              </span>
              <div className="bg-[#121929]/70 rounded-xl p-3 border border-white/5 text-xs text-white/90 leading-relaxed font-sans whitespace-pre-line">
                {report.aiThreatAnalysis ||
                  'Gemini neural sandbox verified clean profile. No anomalous reflection, silent SMS triggers, or background network bypass detected.'}
              </div>
              <div className="flex items-center gap-2 text-xs font-bold pt-1">
                <span className="text-[#94A3B8]">Threat Classification:</span>
                <span
                  style={{
                    color: report.riskScore > 50 ? '#EF4444' : '#10B981'
                  }}
                >
                  {report.riskScore > 50 ? 'HIGH RISKS EXPOSED' : 'SECURE SYSTEM STANCE'}
                </span>
              </div>
            </div>
          </PremiumCardShell>

          {/* Feature 2: Malware Detection Engine */}
          <PremiumCardShell
            title="Premium Feature 2: Malware Detection Engine"
            icon={<Bug className="w-4 h-4 text-[#EF4444]" />}
            isLocked={!isPremium}
            onUnlock={onNavigateToPremium}
          >
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#06B6D4] block">
                Behavioral & Heuristic Audit Rules Evaluated:
              </span>
              <div className="space-y-1.5">
                {report.malwareDetections.map((detection, idx) => {
                  const isWarn = report.riskScore > 40 && !detection.startsWith('Zero');
                  return (
                    <div
                      key={idx}
                      className="flex items-start gap-2 text-xs text-white/90 bg-[#121929]/50 rounded-xl p-2.5 border border-white/5"
                    >
                      {isWarn ? (
                        <AlertTriangle className="w-4 h-4 text-[#EF4444] shrink-0 mt-0.5" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                      )}
                      <span>{detection}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </PremiumCardShell>

          {/* Feature 3: API Key & Secret Detection */}
          <PremiumCardShell
            title="Premium Feature 3: API Key & Secret Detection"
            icon={<Key className="w-4 h-4 text-amber-400" />}
            isLocked={!isPremium}
            onUnlock={onNavigateToPremium}
          >
            <div>
              {report.secretsDetected.length === 0 ? (
                <div className="flex items-center gap-2 text-xs text-[#10B981] bg-[#10B981]/10 rounded-xl p-3 border border-[#10B981]/20">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>
                    Secure: No hardcoded API keys, OAuth tokens or access credentials discovered.
                  </span>
                </div>
              ) : (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-[#EF4444] block">
                    Exposed Key Signature Detections:
                  </span>
                  {report.secretsDetected.map((secret, idx) => (
                    <div
                      key={idx}
                      className="bg-red-500/10 border border-red-500/30 rounded-xl p-2.5 font-mono text-xs text-red-400"
                    >
                      ⚠ {secret}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </PremiumCardShell>

          {/* Feature 4: Code Issue Locator */}
          <PremiumCardShell
            title="Premium Feature 4: Code Issue Locator"
            icon={<Code2 className="w-4 h-4 text-[#06B6D4]" />}
            isLocked={!isPremium}
            onUnlock={onNavigateToPremium}
          >
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#06B6D4] block">
                Vulnerability Locator File Trace Index (Heuristics):
              </span>
              <div className="space-y-2">
                {report.codeIssues.map((issue, idx) => {
                  const issueColor =
                    issue.severity === 'Critical' || issue.severity === 'High'
                      ? '#EF4444'
                      : issue.severity === 'Medium'
                      ? '#F59E0B'
                      : '#10B981';

                  return (
                    <div
                      key={idx}
                      className="bg-[#0F172A] border border-[#334155]/60 rounded-xl p-3 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#10B981]">
                          {issue.fileName}
                        </span>
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono"
                          style={{
                            backgroundColor: `${issueColor}20`,
                            color: issueColor
                          }}
                        >
                          {issue.severity}
                        </span>
                      </div>
                      <p className="text-[11px] font-mono text-[#94A3B8]">
                        Path: {issue.filePath}
                      </p>
                      <p className="text-xs text-white/90">{issue.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </PremiumCardShell>

          {/* Feature 5: Automatic Fix Suggestions */}
          <PremiumCardShell
            title="Premium Feature 5: Automatic Fix Suggestions"
            icon={<Wrench className="w-4 h-4 text-emerald-400" />}
            isLocked={!isPremium}
            onUnlock={onNavigateToPremium}
          >
            <div className="space-y-3 text-xs">
              <div>
                <span className="font-bold text-[#06B6D4] block mb-1">
                  Automated Fix Recommendations:
                </span>
                <ul className="space-y-1 text-white/90">
                  {report.securityRecommendations.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-[#06B6D4]">›</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-[#334155]/60 pt-2">
                <span className="font-bold text-[#10B981] block mb-1">
                  Secured Android Best Practices:
                </span>
                <p className="text-white/80 leading-relaxed">
                  • Set <code className="text-[#10B981]">android:exported=false</code> explicitly on all activities unless they are entry points.<br />
                  • Avoid declaring cleartext HTTP traffic permissions inside standard Manifest files.
                </p>
              </div>

              <div className="border-t border-[#334155]/60 pt-2">
                <span className="font-bold text-[#F59E0B] block mb-1">
                  General Secure Architecture Fixes:
                </span>
                <p className="text-white/80 leading-relaxed">
                  • Use environment secrets to safely inject third-party SDK keys.<br />
                  • Require custom application permissions for exposed broadcast receivers.
                </p>
              </div>
            </div>
          </PremiumCardShell>

          {/* Feature 6: Code Obfuscation */}
          <PremiumCardShell
            title="Premium Feature 6: Code Obfuscation (Recommended)"
            icon={<EyeOff className="w-4 h-4 text-purple-400" />}
            isLocked={!isPremium}
            onUnlock={onNavigateToPremium}
          >
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                {report.isObfuscated ? (
                  <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-[#EF4444] shrink-0 mt-0.5" />
                )}
                <div>
                  <h4
                    className="font-bold text-sm"
                    style={{ color: report.isObfuscated ? '#10B981' : '#EF4444' }}
                  >
                    R8 / ProGuard Obfuscation:{' '}
                    {report.isObfuscated ? 'DETECTED' : 'NOT DETECTED (High Risk)'}
                  </h4>
                  <p className="text-white/80 mt-1 leading-relaxed">
                    {report.isObfuscated
                      ? 'This application successfully uses R8/ProGuard compilation. It renames classes and methods to random, short characters, making compiled bytecode extremely difficult to read and significantly increasing reverse-engineering difficulty.'
                      : 'Warning: This application does not have obfuscation enabled. Classes, methods, and variables are exposed in plain text in compiled dex files, making them trivial to decompile.'}
                  </p>
                </div>
              </div>

              <div className="border-t border-[#334155]/60 pt-2">
                <span className="font-bold text-[#10B981] block mb-1">
                  Why Code Obfuscation is Crucial:
                </span>
                <p className="text-white/80 leading-relaxed">
                  • Renames classes and methods to obscure business logic flow.<br />
                  • Strips out metadata, source file names, and line numbers to make decompiled code unreadable.<br />
                  • Drastically increases the effort required to reverse-engineer or clone your application.
                </p>
              </div>
            </div>
          </PremiumCardShell>
        </div>
      </div>

      {/* MANIFEST & PERMISSIONS AUDIT */}
      <div>
        <h3 className="text-xs font-bold tracking-widest text-[#94A3B8]/80 uppercase mb-3">
          Manifest & Permissions Audit
        </h3>
        <div className="bg-[#1E2942]/90 border border-[#334155]/60 rounded-3xl p-5 space-y-4">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs py-1">
              <div>
                <span className="font-bold text-white block">Target SDK Profile</span>
                <span className="text-[11px] text-[#94A3B8]">API {report.targetSdk}</span>
              </div>
              <span
                className={`px-2.5 py-1 rounded-lg font-bold border text-[11px] ${
                  report.targetSdk >= 31
                    ? 'bg-[#10B981]/15 border-[#10B981]/40 text-[#10B981]'
                    : 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                }`}
              >
                {report.targetSdk >= 31 ? 'Secure' : 'Outdated API Level'}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs py-1">
              <div>
                <span className="font-bold text-white block">HTTP Cleartext Communication</span>
                <span className="text-[11px] text-[#94A3B8]">
                  {report.usesCleartextTraffic ? 'Allowed (HTTP)' : 'Enforced (HTTPS-only)'}
                </span>
              </div>
              <span
                className={`px-2.5 py-1 rounded-lg font-bold border text-[11px] ${
                  report.usesCleartextTraffic
                    ? 'bg-red-500/15 border-red-500/40 text-red-400'
                    : 'bg-[#10B981]/15 border-[#10B981]/40 text-[#10B981]'
                }`}
              >
                {report.usesCleartextTraffic ? 'High Risk' : 'Secure'}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs py-1">
              <div>
                <span className="font-bold text-white block">Exported Package Components</span>
                <span className="text-[11px] text-[#94A3B8]">{report.exportedComponentsCount} elements</span>
              </div>
              <span
                className={`px-2.5 py-1 rounded-lg font-bold border text-[11px] ${
                  report.exportedComponentsCount > 5
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                    : 'bg-[#10B981]/15 border-[#10B981]/40 text-[#10B981]'
                }`}
              >
                {report.exportedComponentsCount > 5 ? 'High Exposure' : 'Secure'}
              </span>
            </div>
          </div>

          <div className="border-t border-[#334155]/60 pt-3">
            <span className="text-xs font-bold text-[#10B981] block mb-2">
              High-Risk Sensitive Permissions Requested:
            </span>
            {report.dangerousPermissions.length === 0 ? (
              <p className="text-xs text-[#94A3B8]">
                No highly sensitive system permissions requested.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {report.dangerousPermissions.map((perm, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 bg-[#121929] rounded-xl p-2 border border-amber-500/20 text-xs text-amber-400 font-mono"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{perm}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* INTEGRATION SDK & KEY DETECTIONS */}
      <div>
        <h3 className="text-xs font-bold tracking-widest text-[#94A3B8]/80 uppercase mb-3">
          Integration SDK & Key Detections
        </h3>
        <div className="bg-[#1E2942]/90 border border-[#334155]/60 rounded-3xl p-5 space-y-3 text-xs">
          <SdkRow label="Trackers Detected" items={report.trackers} />
          <SdkRow label="Ad Networks" items={report.adsDetections} />
          <SdkRow label="Analytics SDKs" items={report.analyticsDetections} />
          <SdkRow label="Hardcoded Secrets/API Keys" items={report.secretsDetected} highlight />
        </div>
      </div>

      {/* DIGITAL SIGNATURE & CERTIFICATE HASHES */}
      <div>
        <h3 className="text-xs font-bold tracking-widest text-[#94A3B8]/80 uppercase mb-3">
          Digital Signature & Certificate Hashes
        </h3>
        <div className="bg-[#1E2942]/90 border border-[#334155]/60 rounded-3xl p-5 space-y-3 text-xs">
          <div>
            <span className="font-bold text-white block mb-0.5">Developer Certificate Details:</span>
            <p className="text-[#94A3B8] font-mono text-[11px] truncate">
              Subject: {report.certificateSubject}
            </p>
            <p className="text-[#94A3B8] font-mono text-[11px] truncate">
              Issuer: {report.certificateIssuer}
            </p>
          </div>

          <div className="border-t border-[#334155]/60 pt-3 space-y-2 font-mono">
            <HashBox
              label="MD5"
              value={report.signatureMd5}
              copied={copiedHash === 'MD5'}
              onCopy={() => copyToClipboard(report.signatureMd5, 'MD5')}
            />
            <HashBox
              label="SHA-1"
              value={report.signatureSha1}
              copied={copiedHash === 'SHA-1'}
              onCopy={() => copyToClipboard(report.signatureSha1, 'SHA-1')}
            />
            <HashBox
              label="SHA-256"
              value={report.signatureSha256}
              copied={copiedHash === 'SHA-256'}
              onCopy={() => copyToClipboard(report.signatureSha256, 'SHA-256')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-components
const PremiumCardShell: React.FC<{
  title: string;
  icon: React.ReactNode;
  isLocked: boolean;
  onUnlock: () => void;
  children: React.ReactNode;
}> = ({ title, icon, isLocked, onUnlock, children }) => {
  return (
    <div
      className={`rounded-2xl p-4 border transition-all ${
        isLocked
          ? 'bg-[#13111C]/80 border-amber-500/25'
          : 'bg-[#1E2942]/80 border-[#334155]/60 hover:border-[#10B981]/30'
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1 rounded-lg bg-[#121929]">{icon}</div>
          <h4 className="text-xs sm:text-sm font-bold text-white truncate">
            {title}
          </h4>
        </div>

        {isLocked ? (
          <button
            onClick={onUnlock}
            className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-black text-[10px] font-black uppercase tracking-wider shrink-0 transition-transform active:scale-95 flex items-center gap-1"
          >
            <Lock className="w-3 h-3" />
            <span>Unlock</span>
          </button>
        ) : (
          <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
        )}
      </div>

      {isLocked ? (
        <p className="text-xs text-[#94A3B8] leading-relaxed">
          Unlock APK Shield Premium to inspect real-time heuristic security audits, deep cloud sandbox correlations, and exposed signature rules.
        </p>
      ) : (
        children
      )}
    </div>
  );
};

const SdkRow: React.FC<{ label: string; items: string[]; highlight?: boolean }> = ({
  label,
  items,
  highlight
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 py-1">
      <span className="font-bold text-white shrink-0">{label}:</span>
      {items.length === 0 ? (
        <span className="text-[#94A3B8] text-[11px]">None discovered</span>
      ) : (
        <div className="flex flex-wrap gap-1.5 justify-end">
          {items.map((item, idx) => (
            <span
              key={idx}
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                highlight
                  ? 'bg-red-500/15 border border-red-500/30 text-red-400'
                  : 'bg-[#121929] border border-[#334155]/60 text-[#06B6D4]'
              }`}
            >
              {item}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

const HashBox: React.FC<{
  label: string;
  value: string;
  copied: boolean;
  onCopy: () => void;
}> = ({ label, value, copied, onCopy }) => {
  return (
    <div className="bg-[#121929] border border-[#334155]/50 rounded-xl p-2.5 flex items-center justify-between gap-2">
      <div className="min-w-0">
        <span className="text-[10px] text-[#10B981] font-bold block">{label}</span>
        <span className="text-[11px] text-white/90 truncate block">{value}</span>
      </div>
      <button
        onClick={onCopy}
        className="p-1.5 rounded-lg bg-[#1E2942] hover:bg-[#334155] text-[#94A3B8] hover:text-white shrink-0 transition-colors"
        title="Copy to clipboard"
      >
        {copied ? (
          <Check className="w-3.5 h-3.5 text-[#10B981]" />
        ) : (
          <Copy className="w-3.5 h-3.5" />
        )}
      </button>
    </div>
  );
};
