import React, { useState, useEffect } from 'react';
import {
  ScreenType,
  InstalledAppItem,
  AppScanResult
} from './types';
import {
  INITIAL_INSTALLED_APPS,
  analyzeLocalApp,
  analyzeUploadedApkFile,
  isProtectedCompanion
} from './services/securityAnalyzer';
import { requestAiThreatAnalysis } from './services/geminiService';
import { downloadSecurityAuditReport } from './services/pdfService';
import { Header, BottomNav } from './components/navigation/Navbar';
import { DashboardScreen } from './components/screens/DashboardScreen';
import { ScanScreen } from './components/screens/ScanScreen';
import { ReportsScreen } from './components/screens/ReportsScreen';
import { HistoryScreen } from './components/screens/HistoryScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { PremiumScreen } from './components/screens/PremiumScreen';
import { Bell, CheckCircle2, AlertTriangle, X } from 'lucide-react';

interface ToastMessage {
  id: string;
  text: string;
  type?: 'info' | 'success' | 'warn';
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('dashboard');
  const [installedApps, setInstalledApps] = useState<InstalledAppItem[]>(INITIAL_INSTALLED_APPS);
  const [scanHistory, setScanHistory] = useState<AppScanResult[]>([]);
  const [selectedReport, setSelectedReport] = useState<AppScanResult | null>(null);

  // Feature Flags
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState<boolean>(true);
  const [isCloudSyncEnabled, setIsCloudSyncEnabled] = useState<boolean>(false);

  // Scanning State
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanningApp, setScanningApp] = useState<string>('');
  const [scanProgress, setScanProgress] = useState<number>(0);

  // Toast System
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (text: string, type: 'info' | 'success' | 'warn' = 'info') => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Prepopulate history with initial realistic scans on mount
  useEffect(() => {
    const seedHistory = async () => {
      try {
        const cleanerApp = INITIAL_INSTALLED_APPS.find((a) => a.packageName === 'com.cleaner.speedup.smspay');
        const bankApp = INITIAL_INSTALLED_APPS.find((a) => a.packageName === 'com.safebank.mobile.secure');

        if (cleanerApp && bankApp) {
          const report1 = await analyzeLocalApp(cleanerApp);
          const report2 = await analyzeLocalApp(bankApp);
          setScanHistory([report1, report2]);
          setSelectedReport(report1);
        }
      } catch (err) {
        console.error('Failed to seed initial reports', err);
      }
    };
    seedHistory();
  }, []);

  // System Security Calculations
  const securityScore = React.useMemo(() => {
    if (scanHistory.length === 0) return 100;
    const avgRisk = scanHistory.reduce((acc, curr) => acc + curr.riskScore, 0) / scanHistory.length;
    return Math.max(0, Math.min(100, Math.round(100 - avgRisk)));
  }, [scanHistory]);

  const activeThreats = React.useMemo(() => {
    return scanHistory.filter((r) => r.riskLevel === 'High' || r.riskLevel === 'Critical').length;
  }, [scanHistory]);

  const safeApps = React.useMemo(() => {
    return scanHistory.filter((r) => r.riskLevel === 'Safe' || r.riskLevel === 'Low').length;
  }, [scanHistory]);

  // Execute App Scan
  const handleScanApp = async (packageName: string) => {
    const target = installedApps.find((a) => a.packageName === packageName);
    const targetName = target ? target.appName : packageName;

    setIsScanning(true);
    setScanningApp(targetName);
    setScanProgress(0.1);

    setTimeout(() => setScanProgress(0.4), 400);
    setTimeout(() => setScanProgress(0.75), 900);

    setTimeout(async () => {
      setScanProgress(1.0);
      try {
        let result: AppScanResult;
        if (target) {
          result = await analyzeLocalApp(target);
        } else {
          result = await analyzeLocalApp({
            packageName,
            appName: packageName,
            isSystem: false,
            targetSdk: 34
          });
        }

        // Run AI Analysis if Premium
        if (isPremium && !isProtectedCompanion(packageName)) {
          const aiAnalysis = await requestAiThreatAnalysis(result);
          result = { ...result, aiThreatAnalysis: aiAnalysis };
        }

        setIsScanning(false);
        setScanProgress(0);

        if (isProtectedCompanion(packageName)) {
          showToast('Protected APK Shield application detected. Scan skipped.', 'info');
        } else {
          setScanHistory((prev) => [result, ...prev.filter((r) => r.packageName !== result.packageName)]);
          setSelectedReport(result);
          showToast(`Scan completed: ${result.appName} is rated ${result.riskLevel}`, 'success');
        }

        setCurrentScreen('reports');
      } catch (err: any) {
        setIsScanning(false);
        setScanProgress(0);
        showToast(`Scan failed: ${err.message || 'Unknown error'}`, 'warn');
      }
    }, 1500);
  };

  // Execute APK File Scan
  const handleScanApkFile = async (file: File) => {
    setIsScanning(true);
    setScanningApp(file.name);
    setScanProgress(0.15);

    setTimeout(() => setScanProgress(0.5), 500);
    setTimeout(() => setScanProgress(0.85), 1000);

    setTimeout(async () => {
      setScanProgress(1.0);
      try {
        let result = await analyzeUploadedApkFile(file);

        if (isPremium && !isProtectedCompanion(result.packageName)) {
          const aiAnalysis = await requestAiThreatAnalysis(result);
          result = { ...result, aiThreatAnalysis: aiAnalysis };
        }

        setIsScanning(false);
        setScanProgress(0);

        if (isProtectedCompanion(result.packageName)) {
          showToast('Protected APK Shield application detected. Scan skipped.', 'info');
        } else {
          setScanHistory((prev) => [result, ...prev.filter((r) => r.packageName !== result.packageName)]);
          setSelectedReport(result);
          showToast(`APK File Scan completed: ${result.appName} is rated ${result.riskLevel}`, 'success');
        }

        setCurrentScreen('reports');
      } catch (err: any) {
        setIsScanning(false);
        setScanProgress(0);
        showToast(`Failed to parse APK: ${err.message || 'Invalid package'}`, 'warn');
      }
    }, 1600);
  };

  // Rapid Scan shortcut
  const handleRapidScan = () => {
    const uninspected = installedApps.find(
      (app) => !scanHistory.some((h) => h.packageName === app.packageName) && !isProtectedCompanion(app.packageName)
    ) || installedApps[2] || installedApps[0];

    if (uninspected) {
      handleScanApp(uninspected.packageName);
    }
  };

  const handleClearHistory = () => {
    setScanHistory([]);
    setSelectedReport(null);
    showToast('Scan database history logs deleted.', 'info');
  };

  const handleTogglePremium = () => {
    const nextVal = !isPremium;
    setIsPremium(nextVal);
    if (nextVal) {
      showToast('APK Shield Premium unlocked: Unlimited scans and Gemini AI Analysis active.', 'success');
    } else {
      showToast('Premium subscription suspended. AI analysis disabled.', 'info');
    }
  };

  const handleToggleRealTime = () => {
    const nextVal = !isRealTimeEnabled;
    setIsRealTimeEnabled(nextVal);
    if (nextVal) {
      showToast('Real-Time active defense shielding enabled.', 'success');
    } else {
      showToast('Warning: Real-Time app installation scanner is now inactive.', 'warn');
    }
  };

  const handleToggleCloudSync = () => {
    const nextVal = !isCloudSyncEnabled;
    setIsCloudSyncEnabled(nextVal);
    if (nextVal) {
      showToast('Cloud backup and history synchronization enabled.', 'success');
    } else {
      showToast('Cloud sync and remote reports disabled.', 'info');
    }
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-white flex flex-col antialiased">
      {/* Top Header */}
      <Header isPremium={isPremium} onTogglePremium={handleTogglePremium} />

      {/* Toast Alert System */}
      <div className="fixed top-16 left-0 right-0 z-50 pointer-events-none flex flex-col items-center gap-2 px-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto max-w-md w-full px-4 py-3 rounded-2xl shadow-2xl border flex items-center justify-between gap-3 text-xs font-semibold backdrop-blur-md animate-fade-in ${
              toast.type === 'success'
                ? 'bg-[#10B981]/20 border-[#10B981]/50 text-[#10B981]'
                : toast.type === 'warn'
                ? 'bg-red-500/20 border-red-500/50 text-red-400'
                : 'bg-[#06B6D4]/20 border-[#06B6D4]/50 text-[#06B6D4]'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {toast.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : toast.type === 'warn' ? (
                <AlertTriangle className="w-4 h-4 shrink-0" />
              ) : (
                <Bell className="w-4 h-4 shrink-0" />
              )}
              <span className="truncate">{toast.text}</span>
            </div>
            <button
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              className="text-white/60 hover:text-white shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Main Screen Content Viewport */}
      <main className="flex-1 max-w-xl w-full mx-auto p-4 sm:p-5 pb-24">
        {currentScreen === 'dashboard' && (
          <DashboardScreen
            securityScore={securityScore}
            activeThreats={activeThreats}
            safeApps={safeApps}
            isPremium={isPremium}
            isRealTimeEnabled={isRealTimeEnabled}
            scanHistory={scanHistory}
            isScanning={isScanning}
            scanningApp={scanningApp}
            scanProgress={scanProgress}
            installedApps={installedApps}
            onNavigateToScan={() => setCurrentScreen('scan')}
            onNavigateToHistory={() => setCurrentScreen('history')}
            onInspectReport={(report) => {
              setSelectedReport(report);
              setCurrentScreen('reports');
            }}
            onRapidScan={handleRapidScan}
          />
        )}

        {currentScreen === 'scan' && (
          <ScanScreen
            installedApps={installedApps}
            isScanning={isScanning}
            scanningApp={scanningApp}
            scanProgress={scanProgress}
            isPremium={isPremium}
            onScanApp={handleScanApp}
            onScanApkFile={handleScanApkFile}
          />
        )}

        {currentScreen === 'reports' && (
          <ReportsScreen
            report={selectedReport}
            isPremium={isPremium}
            onNavigateToPremium={() => setCurrentScreen('premium')}
            onNavigateToScan={() => setCurrentScreen('scan')}
            onExportPdf={downloadSecurityAuditReport}
          />
        )}

        {currentScreen === 'history' && (
          <HistoryScreen
            history={scanHistory}
            onSelectReport={(report) => {
              setSelectedReport(report);
              setCurrentScreen('reports');
            }}
            onClearHistory={handleClearHistory}
            onNavigateToScan={() => setCurrentScreen('scan')}
          />
        )}

        {currentScreen === 'settings' && (
          <SettingsScreen
            isRealTimeEnabled={isRealTimeEnabled}
            isCloudSyncEnabled={isCloudSyncEnabled}
            onToggleRealTime={handleToggleRealTime}
            onToggleCloudSync={handleToggleCloudSync}
          />
        )}

        {currentScreen === 'premium' && (
          <PremiumScreen
            isPremium={isPremium}
            installedApps={installedApps}
            scanHistory={scanHistory}
            isRealTimeEnabled={isRealTimeEnabled}
            isCloudSyncEnabled={isCloudSyncEnabled}
            onTogglePremium={handleTogglePremium}
            onToggleRealTime={handleToggleRealTime}
            onShowToast={showToast}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav
        currentScreen={currentScreen}
        onSelectScreen={setCurrentScreen}
        isPremium={isPremium}
        onTogglePremium={handleTogglePremium}
      />
    </div>
  );
}
