import React, { useState } from 'react';
import {
  Star,
  Search,
  Lock,
  Play,
  Zap,
  Code,
  Download,
  CloudUpload,
  Shield,
  Bug,
  AlertOctagon,
  X,
  CheckCircle2
} from 'lucide-react';
import {
  PremiumFeature,
  InstalledAppItem,
  AppScanResult
} from '../../types';
import { PremiumFeatureWorkspace } from './PremiumFeatureWorkspace';

interface PremiumScreenProps {
  isPremium: boolean;
  installedApps: InstalledAppItem[];
  scanHistory: AppScanResult[];
  isRealTimeEnabled: boolean;
  isCloudSyncEnabled: boolean;
  onTogglePremium: () => void;
  onToggleRealTime: () => void;
  onShowToast: (message: string) => void;
}

export const PremiumScreen: React.FC<PremiumScreenProps> = ({
  isPremium,
  installedApps,
  scanHistory,
  isRealTimeEnabled,
  isCloudSyncEnabled,
  onTogglePremium,
  onToggleRealTime,
  onShowToast
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeFeature, setActiveFeature] = useState<PremiumFeature | null>(null);
  const [showSubscribeDialog, setShowSubscribeDialog] = useState(false);

  const features: PremiumFeature[] = [
    {
      id: 'ai_analysis',
      name: 'AI Threat Analysis',
      iconName: 'Zap',
      category: 'Security',
      description:
        "Integrate with Google's state-of-the-art Gemini 2.5/3.5 models to evaluate code intent and zero-day exploits in seconds.",
      status: 'Ready'
    },
    {
      id: 'batch_scan',
      name: 'Batch APK Scan',
      iconName: 'Code',
      category: 'Security',
      description:
        'Scan multiple local packages and uninstalled APK binaries simultaneously in parallel sandbox threads.',
      status: 'Ready'
    },
    {
      id: 'pdf_export',
      name: 'PDF Report Export',
      iconName: 'Download',
      category: 'Reports',
      description:
        'Compile and export a detailed, military-grade encrypted scan log and mitigation checklist.',
      status: 'Ready'
    },
    {
      id: 'cloud_backup',
      name: 'Cloud Backup',
      iconName: 'CloudUpload',
      category: 'Cloud',
      description:
        'Sync your scan history and reports to our secure cloud database with end-to-end encryption.',
      status: isCloudSyncEnabled ? 'Sync Active' : 'Sync Inactive'
    },
    {
      id: 'realtime_protection',
      name: 'Real-Time Protection',
      iconName: 'Shield',
      category: 'Privacy',
      description:
        'Actively intercept package installations and background activities in real-time to prevent exploits.',
      status: isRealTimeEnabled ? 'Shield Active' : 'Shield Suspended'
    },
    {
      id: 'cve_scan',
      name: 'CVE Vulnerability Scan',
      iconName: 'Bug',
      category: 'Security',
      description:
        'Query your system against the latest global CVE catalogs to detect outdated components.',
      status: 'Ready'
    },
    {
      id: 'malware_scan',
      name: 'Advanced Malware Scan',
      iconName: 'AlertOctagon',
      category: 'Privacy',
      description:
        'Run heuristic-rule behavioral analysis to check for malicious package traits and obfuscated trojans.',
      status: 'Ready'
    }
  ];

  const getFeatureIcon = (iconName: string) => {
    switch (iconName) {
      case 'Zap':
        return <Zap className="w-5 h-5 text-amber-400" />;
      case 'Code':
        return <Code className="w-5 h-5 text-amber-400" />;
      case 'Download':
        return <Download className="w-5 h-5 text-amber-400" />;
      case 'CloudUpload':
        return <CloudUpload className="w-5 h-5 text-amber-400" />;
      case 'Shield':
        return <Shield className="w-5 h-5 text-amber-400" />;
      case 'Bug':
        return <Bug className="w-5 h-5 text-amber-400" />;
      case 'AlertOctagon':
        return <AlertOctagon className="w-5 h-5 text-amber-400" />;
      default:
        return <Star className="w-5 h-5 text-amber-400" />;
    }
  };

  const filteredFeatures = features.filter((feature) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      feature.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      feature.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feature.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (activeFeature) {
    return (
      <PremiumFeatureWorkspace
        feature={activeFeature}
        installedApps={installedApps}
        scanHistory={scanHistory}
        isRealTimeEnabled={isRealTimeEnabled}
        isCloudSyncEnabled={isCloudSyncEnabled}
        onToggleRealTime={onToggleRealTime}
        onClose={() => setActiveFeature(null)}
        onShowToast={onShowToast}
      />
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-sm font-black tracking-widest text-amber-400 uppercase">
          APK Shield Premium
        </h2>
        <p className="text-xs text-[#94A3B8] mt-0.5">
          Interactive command center with active neural shielding
        </p>
      </div>

      {/* Hero Banner */}
      <div className="rounded-3xl p-6 bg-gradient-to-br from-[#131526] via-[#1E1035] to-[#0F242F] border border-amber-400/30 text-center relative overflow-hidden shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center mx-auto mb-3 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
          <Star className="w-7 h-7 fill-amber-400" />
        </div>
        <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-wide">
          {isPremium ? (
            <span className="text-[#10B981]">ACTIVE PREMIUM SECURITY COGNITION</span>
          ) : (
            'FREE TRIAL SUBSCRIPTION SUSPENDED'
          )}
        </h3>
        <p className="text-xs text-white/70 max-w-sm mx-auto mt-1 leading-relaxed">
          {isPremium
            ? 'All heuristic sandboxes and deep AI audits are fully unlocked.'
            : 'Unlock Gemini API, Bulk scan threads, and exported reports.'}
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search premium features..."
          className="w-full bg-[#1E2942]/80 border border-[#334155]/60 rounded-xl pl-10 pr-9 py-2.5 text-xs text-white placeholder-[#94A3B8] focus:outline-none focus:border-amber-400"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {['All', 'Security', 'Privacy', 'Reports', 'Cloud'].map((category) => {
          const isSelected = selectedCategory === category;
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`flex-1 min-w-[70px] py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-amber-400 text-black shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                  : 'bg-[#1E2942]/80 text-[#94A3B8] hover:text-white hover:bg-[#1E2942]'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Features List */}
      <div>
        <h3 className="text-xs font-bold tracking-widest text-[#94A3B8]/80 uppercase mb-3">
          Interactive Premium Suite ({filteredFeatures.length})
        </h3>

        {filteredFeatures.length === 0 ? (
          <div className="bg-[#1E2942]/40 border border-[#334155]/40 rounded-2xl p-8 text-center text-xs text-[#94A3B8]">
            No premium features found.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredFeatures.map((feature) => (
              <div
                key={feature.id}
                className="bg-[#1E2942]/80 border border-[#334155]/60 hover:border-amber-400/40 rounded-2xl p-4 transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center shrink-0">
                    {getFeatureIcon(feature.iconName)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-white truncate">
                        {feature.name}
                      </h4>
                      {!isPremium && <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                    </div>

                    <div className="flex items-center gap-2 mt-0.5 text-[10px]">
                      <span className="text-[#06B6D4] font-bold uppercase">
                        {feature.category}
                      </span>
                      <span className="text-white/20">•</span>
                      <span
                        className={
                          feature.status.includes('Active')
                            ? 'text-[#10B981] font-semibold'
                            : 'text-[#94A3B8]'
                        }
                      >
                        {feature.status}
                      </span>
                    </div>

                    <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">
                      {feature.description}
                    </p>

                    <button
                      onClick={() => {
                        if (isPremium) {
                          setActiveFeature(feature);
                        } else {
                          setShowSubscribeDialog(true);
                        }
                      }}
                      className={`w-full mt-3.5 h-10 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-transform active:scale-[0.99] cursor-pointer ${
                        isPremium
                          ? 'bg-[#10B981] text-black hover:bg-[#10B981]/90 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                          : 'bg-amber-400 text-black hover:bg-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                      }`}
                    >
                      {isPremium ? (
                        <>
                          <Play className="w-3.5 h-3.5 fill-black" />
                          <span>Launch {feature.name}</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5" />
                          <span>Unlock {feature.name}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Subscription Toggle Panel */}
      <div className="bg-[#1E2942]/90 border border-[#334155]/60 rounded-3xl p-5 text-center">
        {!isPremium ? (
          <div>
            <h4 className="text-sm font-bold text-white">APK Shield Premium License</h4>
            <div className="flex items-baseline justify-center gap-1 my-2">
              <span className="text-3xl font-black text-amber-400 font-mono">$9.99</span>
              <span className="text-xs text-[#94A3B8]">/month</span>
            </div>
            <button
              onClick={onTogglePremium}
              className="w-full h-11 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.3)]"
            >
              Unlock Premium Trial Now
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-center gap-2 text-[#10B981] mb-1">
              <CheckCircle2 className="w-5 h-5" />
              <h4 className="text-sm font-bold">Premium Protection is Active!</h4>
            </div>
            <p className="text-xs text-[#94A3B8] mb-4">
              Renew date: Oct 28, 2026 • Simulated Developer License
            </p>
            <button
              onClick={onTogglePremium}
              className="w-full h-10 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/40 text-xs font-bold transition-colors cursor-pointer"
            >
              Deactivate Simulated Trial
            </button>
          </div>
        )}
      </div>

      {/* Subscribe Dialog */}
      {showSubscribeDialog && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-sm w-full bg-[#13111C] border border-amber-400/40 rounded-3xl p-6 text-center space-y-4 animate-scale-up shadow-[0_0_50px_rgba(245,158,11,0.2)]">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/15 border border-amber-400/30 text-amber-400 flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-white uppercase tracking-wide">
              Unlock Elite Tools
            </h3>
            <p className="text-xs text-white/80 leading-relaxed">
              This feature is part of the APK Shield Premium security suite. Activate the trial license now to immediately execute deep Gemini neural audits, perform bulk scans, compile secure PDF records, and enable cloud database backups.
            </p>
            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  onTogglePremium();
                  setShowSubscribeDialog(false);
                }}
                className="w-full h-11 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Start Trial ($9.99/mo)
              </button>
              <button
                onClick={() => setShowSubscribeDialog(false)}
                className="w-full py-2 text-xs font-semibold text-[#94A3B8] hover:text-white"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
