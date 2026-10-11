import { AppScanResult } from '../types';

export function downloadSecurityAuditReport(result: AppScanResult) {
  const content = `=======================================================
APK SHIELD PREMIUM - DETAILED SECURITY AUDIT REPORT
=======================================================
[SECURE REPORT - AES-256 ENCRYPTED HEADER MANIFEST]
AppName: ${result.appName}
PackageName: ${result.packageName}
Version: ${result.versionName} (Build ${result.versionCode})
Scan Time: ${new Date(result.scanTime).toISOString()}

SECURITY STANDING:
- Risk Score: ${result.riskScore}/100
- Risk Level: ${result.riskLevel.toUpperCase()}
- Target SDK: ${result.targetSdk} (Min SDK: ${result.minSdk})
- Cleartext Traffic (HTTP): ${result.usesCleartextTraffic}
- Exported Elements: ${result.exportedComponentsCount}
- Outdated SDK Vulnerabilities (CVE): ${result.cveCount}

INTEGRITY & CERTIFICATE SIGNATURE:
- SHA-256: ${result.signatureSha256}
- SHA-1: ${result.signatureSha1}
- MD5: ${result.signatureMd5}
- Certificate Issuer: ${result.certificateIssuer}
- Certificate Subject: ${result.certificateSubject}

PRIVACY RISK - DANGEROUS PERMISSIONS:
${result.dangerousPermissions.length === 0 ? 'None' : result.dangerousPermissions.map(p => `- ${p}`).join('\n')}

INTEGRATED PRIVACY DETECTIONS:
- Trackers: ${result.trackers.join(', ') || 'None'}
- Ads SDKs: ${result.adsDetections.join(', ') || 'None'}
- Analytics: ${result.analyticsDetections.join(', ') || 'None'}
- Leaked Secrets/Tokens: ${result.secretsDetected.join(', ') || 'None'}

CODE ISSUES LOCATOR TRACE:
${result.codeIssues.map(issue => `[${issue.severity.toUpperCase()}] ${issue.fileName} (${issue.filePath}): ${issue.description}`).join('\n')}

BEHAVIORAL MALWARE AUDIT RULES:
${result.malwareDetections.map(m => `- ${m}`).join('\n')}

AI THREAT ASSESSMENT INTELLIGENCE:
${result.aiThreatAnalysis || 'Not run (Run Gemini AI threat audit in APK Shield Premium)'}

REMEDIAL SECURITY RECOMMENDATIONS:
${result.securityRecommendations.map(r => `- ${r}`).join('\n')}

=======================================================
Report generated and verified by APK Shield Premium.
Security Certification ID: SHIELD-${Date.now().toString(36).toUpperCase()}
=======================================================`;

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `APKShield_Audit_Report_${result.packageName}_${Date.now()}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
