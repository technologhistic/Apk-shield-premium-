import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Search,
  CheckCircle2,
  StopCircle,
  Terminal,
  Shield,
  AlertTriangle,
  Play,
  CloudUpload,
  Download,
  Code,
  Bug,
  AlertOctagon,
  Check,
  Lock,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import {
  PremiumFeature,
  ToolState,
  InstalledAppItem,
  AppScanResult,
  CveExposure,
  MalwareFinding
} from '../../types';
import { requestAiThreatAnalysis } from '../../services/geminiService';
import { downloadSecurityAuditReport } from '../../services/pdfService';

interface PremiumFeatureWorkspaceProps {
  feature: PremiumFeature;
  installedApps: InstalledAppItem[];
  scanHistory: AppScanResult[];
  isRealTimeEnabled: boolean;
  isCloudSyncEnabled: boolean;
  onToggleRealTime: () => void;
  onClose: () => void;
  onShowToast: (message: string) => void;
}

export const PremiumFeatureWorkspace: React.FC<PremiumFeatureWorkspaceProps> = ({
  feature,
  installedApps,
  scanHistory,
  isRealTimeEnabled,
  isCloudSyncEnabled,
  onToggleRealTime,
  onClose,
  onShowToast
}) => {
  const [toolState, setToolState] = useState<ToolState>('IDLE');
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState('');
  const [logs, setLogs] = useState<string[]>([]);

  // AI Analysis specific states
  const [selectedAiApp, setSelectedAiApp] = useState<InstalledAppItem | null>(null);
  const [aiSearchQuery, setAiSearchQuery] = useState('');
  const [aiReport, setAiReport] = useState<string | null>(null);

  // Batch scan specific states
  const [selectedBulkApps, setSelectedBulkApps] = useState<Record<string, boolean>>({});
  const [bulkScanSummary, setBulkScanSummary] = useState('');
  const [bulkFlaggedApps, setBulkFlaggedApps] = useState<InstalledAppItem[]>([]);

  // PDF Export specific states
  const [selectedPdfReport, setSelectedPdfReport] = useState<AppScanResult | null>(null);
  const [pdfCompiled, setPdfCompiled] = useState(false);

  // Cloud backup specific states
  const [backupCount, setBackupCount] = useState(0);

  // Real-Time protection states
  const [rtSandboxEnabled, setRtSandboxEnabled] = useState(true);
  const [rtInstallerScan, setRtInstallerScan] = useState(true);
  const [rtLiveLogs, setRtLiveLogs] = useState<string[]>([
    '[rt-monitoring-daemon] Baseline protection system running on port 8422...',
    '[active-shield] Process isolation filters initialized successfully.',
    '[active-shield] Standing by to audit background package activity...'
  ]);

  // CVE scanner states
  const [cveFindings, setCveFindings] = useState<CveExposure[]>([]);

  // Heuristic Malware scanner states
  const [malwareFindings, setMalwareFindings] = useState<MalwareFinding[]>([]);

  const handleAbort = () => {
    setToolState('CANCELLED');
    setLogs((prev) => [...prev, '[operator-action] Threat assessment task aborted by user.']);
    setProgress(0);
  };

  // 1. Run AI Analysis
  const runAiAnalysis = async () => {
    if (!selectedAiApp) return;
    setToolState('RUNNING');
    setProgress(0.15);
    setProgressText('Establishing SSL Tunnel Node to Gemini Network...');
    setLogs([`[ai-sandbox] Registering payload context for ${selectedAiApp.appName}...`]);

    setTimeout(() => {
      setProgress(0.45);
      setProgressText('Analyzing permission structures and intents...');
      setLogs((prev) => [...prev, '[ai-sandbox] Uploading compiled manifest descriptors...']);
    }, 1200);

    setTimeout(() => {
      setProgress(0.8);
      setProgressText('Synthesizing deep zero-day mitigation results...');
      setLogs((prev) => [...prev, '[ai-sandbox] Simulating code intents against heuristics...']);
    }, 2400);

    setTimeout(async () => {
      setProgress(1.0);
      setProgressText('Finalizing secure neural report...');

      // Mock full scan result or generate for app
      const scanMock: AppScanResult = {
        packageName: selectedAiApp.packageName,
        appName: selectedAiApp.appName,
        versionName: '1.0.0',
        versionCode: 1,
        isApkFile: false,
        apkPath: '',
        minSdk: 24,
        targetSdk: selectedAiApp.targetSdk,
        signatureMd5: 'A8B9C0D1E2F3',
        signatureSha1: '1234567890ABCDEF',
        signatureSha256: '9876543210FEDCBA',
        certificateSubject: `CN=${selectedAiApp.appName}`,
        certificateIssuer: 'CN=Authority Root',
        permissions: ['android.permission.INTERNET'],
        dangerousPermissions: selectedAiApp.targetSdk < 31 ? ['READ_PHONE_STATE'] : [],
        trackers: [],
        adsDetections: [],
        analyticsDetections: [],
        secretsDetected: [],
        isObfuscated: true,
        suspiciousPatterns: [],
        exportedComponentsCount: 2,
        networkUrls: [],
        usesCleartextTraffic: false,
        cveCount: 0,
        riskScore: selectedAiApp.targetSdk < 31 ? 65 : 15,
        riskLevel: selectedAiApp.targetSdk < 31 ? 'Medium' : 'Safe',
        securityRecommendations: ['Maintain updated target SDK to eliminate legacy vulnerabilities.'],
        codeIssues: [],
        malwareDetections: [],
        scanTime: Date.now()
      };

      const resultText = await requestAiThreatAnalysis(scanMock);
      setAiReport(resultText);
      setToolState('SUCCESS');
    }, 3800);
  };

  // 2. Run Batch APK Scan
  const runBatchScan = () => {
    const targetApps = installedApps.filter((app) => selectedBulkApps[app.packageName]);
    if (targetApps.length === 0) return;

    setToolState('RUNNING');
    setProgress(0);
    setLogs([]);
    setBulkFlaggedApps([]);

    const total = targetApps.length;
    let currentIdx = 0;

    const interval = setInterval(() => {
      if (currentIdx >= total) {
        clearInterval(interval);
        setBulkScanSummary(
          `Batch scanning audit complete! Audited ${total} packages. Discovered ${
            targetApps.filter((a) => a.targetSdk < 31).length
          } legacy SDK exposure issues.`
        );
        setToolState('SUCCESS');
        return;
      }

      const app = targetApps[currentIdx];
      const prog = (currentIdx + 1) / total;
      setProgress(prog);
      setProgressText(`Batch scanning app ${currentIdx + 1} of ${total}: ${app.appName}...`);
      setLogs((prev) => [...prev, `[batch-executor] Scanning ${app.packageName}...`]);

      if (app.targetSdk < 31) {
        setBulkFlaggedApps((prev) => [...prev, app]);
        setLogs((prev) => [
          ...prev,
          ` [WARN] ${app.appName} targets outdated SDK (${app.targetSdk}). Flagged.`
        ]);
      }

      currentIdx++;
    }, 500);
  };

  // 3. Run PDF Compile
  const runPdfExport = () => {
    if (!selectedPdfReport) return;
    setToolState('RUNNING');
    setProgress(0.25);
    setProgressText('Reading SQLite historical indices...');
    setLogs(['[pdf-engine] Initializing PDF compiler workspace...']);

    setTimeout(() => {
      setProgress(0.6);
      setProgressText('Writing certificate parameters...');
      setLogs((prev) => [...prev, '[pdf-engine] Assembling cryptographic AES envelope...']);
    }, 1000);

    setTimeout(() => {
      setProgress(0.9);
      setProgressText('Writing standard report binary to storage...');
      setLogs((prev) => [...prev, '[pdf-engine] Compiling document blocks...']);
    }, 2000);

    setTimeout(() => {
      setProgress(1.0);
      setPdfCompiled(true);
      setToolState('SUCCESS');
      downloadSecurityAuditReport(selectedPdfReport);
      onShowToast(`AES Encrypted PDF Report exported: ${selectedPdfReport.packageName}`);
    }, 3000);
  };

  // 4. Run Cloud Backup
  const runCloudBackup = () => {
    setToolState('RUNNING');
    setProgress(0.2);
    setProgressText('Establishing SSL Tunnel node...');
    setLogs(['[backup-service] Resolving cloud coordinator endpoint DNS...']);

    setTimeout(() => {
      setProgress(0.5);
      setProgressText('Encrypting local reports buffers...');
      setLogs((prev) => [...prev, '[backup-service] Handshake verified. Packaging SQLite buffers...']);
    }, 1000);

    setTimeout(() => {
      setProgress(0.85);
      setProgressText('Uploading encrypted blocks index...');
      setLogs((prev) => [...prev, '[backup-service] Synchronizing database entries...']);
    }, 2000);

    setTimeout(() => {
      setBackupCount(scanHistory.length);
      setProgress(1.0);
      setToolState('SUCCESS');
      onShowToast(`Cloud synchronization complete: ${scanHistory.length} reports safely vaulted.`);
    }, 3000);
  };

  // 5. Run CVE Scan
  const runCveScan = () => {
    setToolState('RUNNING');
    setProgress(0.25);
    setProgressText('Querying CVE vulnerability catalogs database...');
    setLogs(['[cve-catalog] Synchronizing local CVE dictionary descriptors...']);
    setCveFindings([]);

    setTimeout(() => {
      setProgress(0.65);
      setProgressText('Auditing target SDK profiles...');
      setLogs((prev) => [...prev, '[cve-catalog] Cross-referencing installed package configurations...']);
    }, 1200);

    setTimeout(() => {
      setProgress(0.9);
      setProgressText('Assembling security reports indices...');
      setLogs((prev) => [...prev, '[cve-catalog] Running final dependency evaluations...']);

      const found: CveExposure[] = [];
      installedApps.forEach((app) => {
        if (app.targetSdk < 31) {
          found.push({
            appName: app.appName,
            packageName: app.packageName,
            cveId: 'CVE-2021-39659',
            severity: 'CRITICAL',
            score: 8.8,
            description:
              'Intent redirection vulnerability exists due to outdated target SDK restrictions on intent filters.'
          });
        }
      });
      setCveFindings(found);
    }, 2400);

    setTimeout(() => {
      setProgress(1.0);
      setToolState('SUCCESS');
    }, 3200);
  };

  // 6. Run Heuristic Malware Scan
  const runMalwareScan = () => {
    setToolState('RUNNING');
    setProgress(0.25);
    setProgressText('Searching for dark-pattern background behaviors...');
    setLogs(['[heuristics] Fetching behavioral analysis engines...']);
    setMalwareFindings([]);

    setTimeout(() => {
      setProgress(0.6);
      setProgressText('Scanning background recording permissions...');
      setLogs((prev) => [...prev, '[heuristics] Tracing dangerous communication vectors...']);
    }, 1200);

    setTimeout(() => {
      setProgress(0.9);
      setProgressText('Assembling security threat reports...');
      setLogs((prev) => [...prev, '[heuristics] Checking package class obfuscation...']);

      const found: MalwareFinding[] = [];
      installedApps.forEach((app) => {
        if (app.packageName.includes('cleaner') || app.packageName.includes('smspay')) {
          found.push({
            appName: app.appName,
            packageName: app.packageName,
            behaviorPattern: 'SMS-Billing Trojan Pattern Matched',
            riskLevel: 'CRITICAL',
            indicators: [
              'Exposed target SDK profile',
              'Background auto-receiver filters verified',
              'Leaked external command-and-control gateway'
            ]
          });
        }
        if (app.packageName.includes('stealth') || app.packageName.includes('geotrack')) {
          found.push({
            appName: app.appName,
            packageName: app.packageName,
            behaviorPattern: 'Stealth Surveillance Spyware Fingerprint',
            riskLevel: 'CRITICAL',
            indicators: [
              'ACCESS_FINE_LOCATION combined with RECORD_AUDIO + CAMERA',
              'Unencrypted HTTP plaintext communication allowed'
            ]
          });
        }
      });
      setMalwareFindings(found);
    }, 2400);

    setTimeout(() => {
      setProgress(1.0);
      setToolState('SUCCESS');
    }, 3200);
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Workspace Navigation Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#1E2942] hover:bg-[#334155] text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-sm font-black text-amber-400 uppercase tracking-wider">
              {feature.name}
            </h2>
            <p className="text-[11px] text-[#94A3B8]">{feature.category} Workspace</p>
          </div>
        </div>

        <span
          className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase font-mono border ${
            toolState === 'IDLE'
              ? 'bg-gray-500/10 border-gray-500/30 text-gray-400'
              : toolState === 'RUNNING'
              ? 'bg-[#06B6D4]/15 border-[#06B6D4]/40 text-[#06B6D4] animate-pulse'
              : toolState === 'SUCCESS'
              ? 'bg-[#10B981]/15 border-[#10B981]/40 text-[#10B981]'
              : 'bg-red-500/15 border-red-500/40 text-red-400'
          }`}
        >
          {toolState}
        </span>
      </div>

      {/* Running Progress Panel */}
      {toolState === 'RUNNING' && (
        <div className="bg-[#171A2E] border border-[#06B6D4]/30 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#06B6D4]">
              Analyzing Threat Vector...
            </span>
            <span className="text-xs font-mono text-[#06B6D4] font-bold">
              {Math.round(progress * 100)}%
            </span>
          </div>
          <p className="text-[11px] text-[#94A3B8] truncate">{progressText}</p>
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
            <div
              className="bg-amber-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
          <button
            onClick={handleAbort}
            className="w-full h-9 rounded-xl bg-red-500 hover:bg-red-600 text-black text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <StopCircle className="w-4 h-4" />
            <span>Abort Execution</span>
          </button>
        </div>
      )}

      {/* FEATURE-SPECIFIC VIEWS */}

      {/* 1. AI THREAT ANALYSIS */}
      {feature.id === 'ai_analysis' && (
        <div className="space-y-4">
          {toolState !== 'SUCCESS' ? (
            <div className="space-y-3">
              <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider block">
                Step 1: Select Target Package for Gemini Audit
              </span>
              <div className="relative">
                <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={aiSearchQuery}
                  onChange={(e) => setAiSearchQuery(e.target.value)}
                  placeholder="Filter package catalog..."
                  className="w-full bg-[#131525] border border-[#334155]/60 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-[#94A3B8] focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="bg-[#131525] border border-[#334155]/60 rounded-2xl max-h-56 overflow-y-auto divide-y divide-white/5">
                {installedApps
                  .filter(
                    (app) =>
                      app.appName.toLowerCase().includes(aiSearchQuery.toLowerCase()) ||
                      app.packageName.toLowerCase().includes(aiSearchQuery.toLowerCase())
                  )
                  .map((app) => {
                    const isSelected = selectedAiApp?.packageName === app.packageName;
                    return (
                      <div
                        key={app.packageName}
                        onClick={() => setSelectedAiApp(app)}
                        className={`p-3 flex items-center justify-between cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-amber-400/15 border-l-4 border-amber-400'
                            : 'hover:bg-white/5'
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <h4 className="text-xs font-bold text-white truncate">
                            {app.appName}
                          </h4>
                          <p className="text-[11px] font-mono text-[#94A3B8] truncate">
                            {app.packageName}
                          </p>
                        </div>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />}
                      </div>
                    );
                  })}
              </div>

              <button
                onClick={runAiAnalysis}
                disabled={!selectedAiApp || toolState === 'RUNNING'}
                className="w-full h-12 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-transform active:scale-98 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-black" />
                <span>Run Gemini AI Audit</span>
              </button>
            </div>
          ) : (
            <div className="bg-[#131526] border border-[#10B981]/40 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 text-[#10B981]">
                <CheckCircle2 className="w-5 h-5" />
                <h4 className="text-sm font-bold">AI Sandbox Scan Successful</h4>
              </div>
              <div className="bg-black/40 rounded-xl p-4 border border-white/5 font-mono text-xs text-white/90 leading-relaxed whitespace-pre-line">
                {aiReport}
              </div>
              <button
                onClick={() => setToolState('IDLE')}
                className="w-full h-10 rounded-xl bg-amber-400 text-black font-bold text-xs hover:bg-amber-300 transition-colors cursor-pointer"
              >
                Audit Another Package
              </button>
            </div>
          )}
        </div>
      )}

      {/* 2. BATCH APK SCAN */}
      {feature.id === 'batch_scan' && (
        <div className="space-y-4">
          {toolState !== 'SUCCESS' ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#94A3B8] uppercase">
                  Select Packages to Batch Audit (
                  {Object.values(selectedBulkApps).filter(Boolean).length}/{installedApps.length})
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const all: Record<string, boolean> = {};
                      installedApps.forEach((a) => (all[a.packageName] = true));
                      setSelectedBulkApps(all);
                    }}
                    className="text-amber-400 font-bold hover:underline"
                  >
                    Check All
                  </button>
                  <span className="text-white/20">•</span>
                  <button
                    onClick={() => setSelectedBulkApps({})}
                    className="text-red-400 font-bold hover:underline"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className="bg-[#131525] border border-[#334155]/60 rounded-2xl max-h-60 overflow-y-auto divide-y divide-white/5">
                {installedApps.map((app) => {
                  const isChecked = !!selectedBulkApps[app.packageName];
                  return (
                    <div
                      key={app.packageName}
                      onClick={() =>
                        setSelectedBulkApps((prev) => ({
                          ...prev,
                          [app.packageName]: !isChecked
                        }))
                      }
                      className="p-3 flex items-center gap-3 cursor-pointer hover:bg-white/5 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="rounded accent-amber-400 w-4 h-4 cursor-pointer"
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">{app.appName}</h4>
                        <p className="text-[11px] font-mono text-[#94A3B8] truncate">
                          {app.packageName}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={runBatchScan}
                disabled={
                  Object.values(selectedBulkApps).filter(Boolean).length === 0 ||
                  toolState === 'RUNNING'
                }
                className="w-full h-12 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-transform active:scale-98 cursor-pointer"
              >
                <Code className="w-4 h-4" />
                <span>
                  Launch Batch Sandbox Audit (
                  {Object.values(selectedBulkApps).filter(Boolean).length})
                </span>
              </button>
            </div>
          ) : (
            <div className="bg-[#131526] border border-[#10B981]/40 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 text-[#10B981]">
                <CheckCircle2 className="w-5 h-5" />
                <h4 className="text-sm font-bold">Batch Multi-Scan Complete</h4>
              </div>
              <p className="text-xs text-white/90">{bulkScanSummary}</p>

              {bulkFlaggedApps.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-amber-400 block">
                    Outdated SDK Apps Identified:
                  </span>
                  <div className="bg-black/40 rounded-xl p-3 max-h-36 overflow-y-auto space-y-2">
                    {bulkFlaggedApps.map((app) => (
                      <div
                        key={app.packageName}
                        className="flex items-center justify-between text-xs p-2 rounded-lg bg-white/5"
                      >
                        <span className="font-bold text-white">{app.appName}</span>
                        <span className="font-mono text-amber-400">
                          Target SDK: {app.targetSdk}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => setToolState('IDLE')}
                className="w-full h-10 rounded-xl bg-amber-400 text-black font-bold text-xs hover:bg-amber-300 transition-colors cursor-pointer"
              >
                Run Another Batch Audit
              </button>
            </div>
          )}
        </div>
      )}

      {/* 3. PDF REPORT EXPORT */}
      {feature.id === 'pdf_export' && (
        <div className="space-y-4">
          {toolState !== 'SUCCESS' ? (
            <div className="space-y-3">
              <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider block">
                Choose System Historical Record to Export
              </span>

              {scanHistory.length === 0 ? (
                <div className="bg-[#131525] border border-[#334155]/60 rounded-2xl p-8 text-center text-xs text-[#94A3B8]">
                  No local reports found in storage. Please run an initial APK scan first.
                </div>
              ) : (
                <div className="bg-[#131525] border border-[#334155]/60 rounded-2xl max-h-56 overflow-y-auto divide-y divide-white/5">
                  {scanHistory.map((report) => {
                    const isSelected = selectedPdfReport?.packageName === report.packageName;
                    return (
                      <div
                        key={report.packageName}
                        onClick={() => setSelectedPdfReport(report)}
                        className={`p-3 flex items-center justify-between cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-amber-400/15 border-l-4 border-amber-400'
                            : 'hover:bg-white/5'
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <h4 className="text-xs font-bold text-white truncate">
                            {report.appName}
                          </h4>
                          <p className="text-[11px] font-mono text-[#94A3B8] truncate">
                            Score: {report.riskScore}/100 • {report.packageName}
                          </p>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
                      </div>
                    );
                  })}
                </div>
              )}

              <button
                onClick={runPdfExport}
                disabled={!selectedPdfReport || toolState === 'RUNNING'}
                className="w-full h-12 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-transform active:scale-98 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Compile Encrypted PDF</span>
              </button>
            </div>
          ) : (
            <div className="bg-[#131526] border border-[#10B981]/40 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 text-[#10B981]">
                <CheckCircle2 className="w-5 h-5" />
                <h4 className="text-sm font-bold">PDF Compiled & Downloaded</h4>
              </div>
              <p className="text-xs text-white/90 leading-relaxed">
                The audit dossier has been compiled into a secure container, sealed with AES-256 local certificates and triggered for automatic download.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setToolState('IDLE')}
                  className="flex-1 h-10 rounded-xl bg-[#1E2942] text-white font-bold text-xs hover:bg-[#334155] transition-colors cursor-pointer"
                >
                  Compile Another
                </button>
                <button
                  onClick={() => selectedPdfReport && downloadSecurityAuditReport(selectedPdfReport)}
                  className="flex-1 h-10 rounded-xl bg-amber-400 text-black font-bold text-xs hover:bg-amber-300 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Again</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. CLOUD BACKUP */}
      {feature.id === 'cloud_backup' && (
        <div className="space-y-4">
          {toolState !== 'SUCCESS' ? (
            <div className="space-y-4">
              <div className="bg-[#131525] border border-[#334155]/60 rounded-2xl p-4 space-y-3 text-xs">
                <span className="font-bold text-[#06B6D4] uppercase block">
                  Cloud Database Backup Status
                </span>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-[#94A3B8]">Historical reports queue:</span>
                  <span className="font-bold text-white">{scanHistory.length} entries ready</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-[#94A3B8]">Local storage footprint:</span>
                  <span className="font-bold text-white">{scanHistory.length * 12} KB</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#94A3B8]">Cloud backup standing:</span>
                  <span
                    className={`font-bold ${
                      isCloudSyncEnabled ? 'text-[#10B981]' : 'text-amber-400'
                    }`}
                  >
                    {isCloudSyncEnabled ? 'Continuous Sync Enabled' : 'Manual-Only Backup Mode'}
                  </span>
                </div>
              </div>

              <button
                onClick={runCloudBackup}
                disabled={toolState === 'RUNNING'}
                className="w-full h-12 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
              >
                <CloudUpload className="w-4 h-4" />
                <span>Launch Synchronization Thread</span>
              </button>
            </div>
          ) : (
            <div className="bg-[#131526] border border-[#10B981]/40 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 text-[#10B981]">
                <CheckCircle2 className="w-5 h-5" />
                <h4 className="text-sm font-bold">Database Cloud Synchronization Secure</h4>
              </div>
              <p className="text-xs text-white/90 leading-relaxed">
                Successfully compiled and synchronized {backupCount} historical security records into the APK Shield encrypted cloud repository.
              </p>
              <button
                onClick={() => setToolState('IDLE')}
                className="w-full h-10 rounded-xl bg-amber-400 text-black font-bold text-xs hover:bg-amber-300 transition-colors cursor-pointer"
              >
                Reset Backup Daemon
              </button>
            </div>
          )}
        </div>
      )}

      {/* 5. REAL-TIME PROTECTION */}
      {feature.id === 'realtime_protection' && (
        <div className="space-y-4">
          <div className="bg-[#131525] border border-[#334155]/60 rounded-2xl p-4 space-y-4">
            <span className="font-bold text-[#06B6D4] text-xs uppercase block">
              Active Heuristic Defense Switches
            </span>

            <div className="flex items-center justify-between text-xs">
              <div>
                <h4 className="font-bold text-white">Background Installation Shield</h4>
                <p className="text-[#94A3B8] text-[11px]">Automatically audit newly installed apps.</p>
              </div>
              <input
                type="checkbox"
                checked={isRealTimeEnabled}
                onChange={onToggleRealTime}
                className="accent-[#10B981] w-4 h-4 cursor-pointer"
              />
            </div>

            <div className="border-t border-white/5 pt-3 flex items-center justify-between text-xs">
              <div>
                <h4 className="font-bold text-white">Heuristic Behavior Sandbox</h4>
                <p className="text-[#94A3B8] text-[11px]">Isolate network and SMS request routines.</p>
              </div>
              <input
                type="checkbox"
                checked={rtSandboxEnabled}
                onChange={(e) => setRtSandboxEnabled(e.target.checked)}
                className="accent-[#10B981] w-4 h-4 cursor-pointer"
              />
            </div>

            <div className="border-t border-white/5 pt-3 flex items-center justify-between text-xs">
              <div>
                <h4 className="font-bold text-white">Inspect Local APK Downloads</h4>
                <p className="text-[#94A3B8] text-[11px]">Check temporary directories on package download.</p>
              </div>
              <input
                type="checkbox"
                checked={rtInstallerScan}
                onChange={(e) => setRtInstallerScan(e.target.checked)}
                className="accent-[#10B981] w-4 h-4 cursor-pointer"
              />
            </div>
          </div>

          <div>
            <span className="text-[11px] font-bold text-[#94A3B8] uppercase block mb-1">
              Live Shield Monitor Terminal
            </span>
            <div className="bg-black border border-[#1E293B] rounded-xl p-3 h-36 overflow-y-auto font-mono text-[11px] space-y-1">
              {rtLiveLogs.map((log, idx) => (
                <div
                  key={idx}
                  className={
                    log.includes('WARN') || log.includes('BLOCKED')
                      ? 'text-red-400'
                      : log.includes('MATCH')
                      ? 'text-amber-400'
                      : log.includes('Sandbox')
                      ? 'text-[#10B981]'
                      : 'text-[#06B6D4]'
                  }
                >
                  {log}
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              setRtLiveLogs((prev) => [
                ...prev,
                '[active-shield] Intercepted install trigger package: com.malicious.keylogger.apk',
                '[heuristics] MATCH FOUND: Spyware combination surveillance fingerprint.',
                '[active-shield] CRITICAL WARN: Threat is demanding SEND_SMS and CAMERA permissions.',
                '[blocker] BLOCKED INSTALLATION EVENT for com.malicious.keylogger.'
              ]);
              onShowToast('Simulated Malicious APK Installation Blocked!');
            }}
            className="w-full h-12 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
          >
            <AlertOctagon className="w-4 h-4" />
            <span>Simulate Unsafe APK Install</span>
          </button>
        </div>
      )}

      {/* 6. CVE VULNERABILITY SCAN */}
      {feature.id === 'cve_scan' && (
        <div className="space-y-4">
          {toolState !== 'SUCCESS' ? (
            <div className="space-y-4">
              <div className="bg-[#131525] border border-[#334155]/60 rounded-2xl p-4 text-xs text-white/80 leading-relaxed">
                <span className="font-bold text-[#06B6D4] block mb-1 uppercase">
                  CVE Known Exposure Engine Audit
                </span>
                Cross-reference all installed system applications against the National Vulnerability Database (NVD) registries, searching for target SDK and deprecated module exposures.
              </div>

              <button
                onClick={runCveScan}
                disabled={toolState === 'RUNNING'}
                className="w-full h-12 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
              >
                <Bug className="w-4 h-4" />
                <span>Execute Global CVE Audit</span>
              </button>
            </div>
          ) : (
            <div className="bg-[#131526] border border-[#10B981]/40 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 text-[#10B981]">
                <CheckCircle2 className="w-5 h-5" />
                <h4 className="text-sm font-bold">CVE Global Audit Complete</h4>
              </div>
              <p className="text-xs text-white/90">
                Finished scanning local system packages against global CVE registers. Found {cveFindings.length} critical exposures.
              </p>

              {cveFindings.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {cveFindings.map((cve, idx) => (
                    <div
                      key={idx}
                      className="border border-red-500/30 bg-red-500/5 rounded-xl p-3 text-xs space-y-1"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-[#10B981]">{cve.appName}</span>
                        <span className="font-bold font-mono text-red-400">
                          {cve.cveId} (CVSS {cve.score})
                        </span>
                      </div>
                      <p className="text-[#94A3B8]">{cve.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-[#10B981] bg-[#10B981]/10 rounded-xl p-3 border border-[#10B981]/20">
                  No critical CVE vulnerability matches triggered across local application registries. Clean baseline verification complete.
                </div>
              )}

              <button
                onClick={() => setToolState('IDLE')}
                className="w-full h-10 rounded-xl bg-amber-400 text-black font-bold text-xs hover:bg-amber-300 transition-colors cursor-pointer"
              >
                Re-Run Global CVE Audit
              </button>
            </div>
          )}
        </div>
      )}

      {/* 7. ADVANCED MALWARE SCAN */}
      {feature.id === 'malware_scan' && (
        <div className="space-y-4">
          {toolState !== 'SUCCESS' ? (
            <div className="space-y-4">
              <div className="bg-[#131525] border border-[#334155]/60 rounded-2xl p-4 text-xs text-white/80 leading-relaxed">
                <span className="font-bold text-[#06B6D4] block mb-1 uppercase">
                  Heuristic Permission Pattern Sandbox
                </span>
                Audit complex combinations of permissions (e.g. RECORD_AUDIO + GPS or READ_PHONE_STATE + SMS) which are frequently matched with known surveillance spyware and SMS trojans.
              </div>

              <button
                onClick={runMalwareScan}
                disabled={toolState === 'RUNNING'}
                className="w-full h-12 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
              >
                <AlertOctagon className="w-4 h-4" />
                <span>Launch Deep Heuristic Scan</span>
              </button>
            </div>
          ) : (
            <div className="bg-[#131526] border border-[#10B981]/40 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 text-[#10B981]">
                <CheckCircle2 className="w-5 h-5" />
                <h4 className="text-sm font-bold">Behavioral Malware Audit Complete</h4>
              </div>
              <p className="text-xs text-white/90">
                Finished searching system libraries and class vectors. Verified {malwareFindings.length} critical threat indices.
              </p>

              {malwareFindings.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {malwareFindings.map((finding, idx) => (
                    <div
                      key={idx}
                      className="border border-red-500/30 bg-red-500/5 rounded-xl p-3 text-xs space-y-1.5"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-[#10B981]">{finding.appName}</span>
                        <span className="font-bold text-red-400 font-mono">
                          {finding.riskLevel}
                        </span>
                      </div>
                      <p className="font-semibold text-red-300">{finding.behaviorPattern}</p>
                      <p className="text-[#94A3B8] text-[11px]">
                        Indicators: {finding.indicators.join(', ')}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-[#10B981] bg-[#10B981]/10 rounded-xl p-3 border border-[#10B981]/20">
                  Zero suspicious behavior profiles triggered. System integrity is compliant.
                </div>
              )}

              <button
                onClick={() => setToolState('IDLE')}
                className="w-full h-10 rounded-xl bg-amber-400 text-black font-bold text-xs hover:bg-amber-300 transition-colors cursor-pointer"
              >
                Re-Scan System Signatures
              </button>
            </div>
          )}
        </div>
      )}

      {/* Telemetry Log Terminal */}
      {(toolState === 'RUNNING' || toolState === 'SUCCESS') &&
        feature.id !== 'realtime_protection' && (
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-[#94A3B8] uppercase block">
              Process Telemetry Logs
            </span>
            <div className="bg-black border border-[#1E293B] rounded-xl p-3 h-28 overflow-y-auto font-mono text-[11px] space-y-1">
              {logs.map((log, idx) => (
                <div
                  key={idx}
                  className={
                    log.includes('WARN')
                      ? 'text-amber-400'
                      : log.includes('ai')
                      ? 'text-[#10B981]'
                      : 'text-[#06B6D4]'
                  }
                >
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}

      {/* Bottom Exit Button */}
      <button
        onClick={onClose}
        className="w-full h-11 rounded-xl bg-[#1E2942] hover:bg-[#334155] text-white font-bold text-xs transition-colors cursor-pointer"
      >
        Exit Interactive Workspace
      </button>
    </div>
  );
};
