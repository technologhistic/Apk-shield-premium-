export interface PremiumCodeIssue {
  fileName: string;
  filePath: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  description: string;
}

export interface AppScanResult {
  packageName: string;
  appName: string;
  versionName: string;
  versionCode: number;
  isApkFile: boolean;
  apkPath: string;
  minSdk: number;
  targetSdk: number;
  signatureMd5: string;
  signatureSha1: string;
  signatureSha256: string;
  certificateSubject: string;
  certificateIssuer: string;
  permissions: string[];
  dangerousPermissions: string[];
  trackers: string[];
  adsDetections: string[];
  analyticsDetections: string[];
  secretsDetected: string[];
  isObfuscated: boolean;
  suspiciousPatterns: string[];
  exportedComponentsCount: number;
  networkUrls: string[];
  usesCleartextTraffic: boolean;
  cveCount: number;
  riskScore: number; // 0 to 100
  riskLevel: 'Safe' | 'Low' | 'Medium' | 'High' | 'Critical';
  aiThreatAnalysis?: string | null;
  securityRecommendations: string[];
  codeIssues: PremiumCodeIssue[];
  malwareDetections: string[];
  scanTime: number;
}

export interface InstalledAppItem {
  packageName: string;
  appName: string;
  isSystem: boolean;
  targetSdk: number;
  iconName?: string;
  iconColor?: string;
  category?: string;
}

export interface WhitelistApp {
  packageName: string;
  developerCertSha256: string;
}

export type ScreenType = 'dashboard' | 'scan' | 'reports' | 'history' | 'settings' | 'premium';

export interface PremiumFeature {
  id: string;
  name: string;
  iconName: string;
  category: 'Security' | 'Privacy' | 'Reports' | 'Cloud';
  description: string;
  status: string;
}

export type ToolState = 'IDLE' | 'RUNNING' | 'SUCCESS' | 'CANCELLED';

export interface CveExposure {
  appName: string;
  packageName: string;
  cveId: string;
  severity: string;
  score: number;
  description: string;
}

export interface MalwareFinding {
  appName: string;
  packageName: string;
  behaviorPattern: string;
  riskLevel: string;
  indicators: string[];
}
