import { PermitApplication } from '../types/permit';
import { INITIAL_APPLICATIONS } from '../data/initialApplications';

const STORAGE_KEY = 'gentri_building_permits_db_v1';
const ACTIVE_APP_KEY = 'gentri_building_permits_active_id';

export function loadApplicationsFromStorage(): PermitApplication[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveApplicationsToStorage(INITIAL_APPLICATIONS);
      return INITIAL_APPLICATIONS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    saveApplicationsToStorage(INITIAL_APPLICATIONS);
    return INITIAL_APPLICATIONS;
  } catch (error) {
    console.error('Failed to load applications from localStorage:', error);
    return INITIAL_APPLICATIONS;
  }
}

export function saveApplicationsToStorage(apps: PermitApplication[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
  } catch (error) {
    console.error('Failed to save applications to localStorage:', error);
  }
}

export function getActiveApplicationId(): string {
  try {
    return localStorage.getItem(ACTIVE_APP_KEY) || INITIAL_APPLICATIONS[0].id;
  } catch {
    return INITIAL_APPLICATIONS[0].id;
  }
}

export function setActiveApplicationId(id: string): void {
  try {
    localStorage.setItem(ACTIVE_APP_KEY, id);
  } catch (error) {
    console.error('Failed to set active application id:', error);
  }
}

export function formatCurrencyPHP(amount: number): string {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(val: number): string {
  return new Intl.NumberFormat('en-PH').format(val);
}

export function generateReferenceCode(serial: string, year = new Date().getFullYear()): string {
  const cleanSerial = serial.trim().replace(/[^0-9A-Za-z]/g, '');
  return `GENTRI-BP-${year}-${cleanSerial || 'NEW'}`;
}

export function calculateCompliance(app: PermitApplication): {
  complianceRate: number;
  verifiedCount: number;
  flaggedCount: number;
  pendingCount: number;
  totalCount: number;
  overallStatus: 'Ready for Approval' | 'Action Required' | 'Under Initial Review' | 'Rejected / Suspended';
} {
  const totalCount = app.requirements.length;
  if (totalCount === 0) {
    return {
      complianceRate: 0,
      verifiedCount: 0,
      flaggedCount: 0,
      pendingCount: 0,
      totalCount: 0,
      overallStatus: 'Under Initial Review',
    };
  }

  const verifiedCount = app.requirements.filter((r) => r.status === 'Verified' || r.status === 'Exempt / Not Applicable').length;
  const flaggedCount = app.flaggedIssues.filter((i) => i.status === 'Open').length;
  const pendingCount = app.requirements.filter((r) => r.status === 'Pending Upload' || r.status === 'Uploaded').length;

  const complianceRate = Math.round((verifiedCount / totalCount) * 100);

  let overallStatus: 'Ready for Approval' | 'Action Required' | 'Under Initial Review' | 'Rejected / Suspended' = 'Under Initial Review';

  if (flaggedCount > 0) {
    const hasCritical = app.flaggedIssues.some((i) => i.status === 'Open' && i.severity === 'CRITICAL');
    overallStatus = hasCritical ? 'Action Required' : 'Action Required';
  } else if (verifiedCount === totalCount) {
    overallStatus = 'Ready for Approval';
  } else if (pendingCount > 0) {
    overallStatus = 'Under Initial Review';
  }

  return {
    complianceRate,
    verifiedCount,
    flaggedCount,
    pendingCount,
    totalCount,
    overallStatus,
  };
}
