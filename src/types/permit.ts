/**
 * City of General Trias, Cavite - Building Regulatory Division (CBRDGTC)
 * Building Permit Types & Data Structures
 */

export type ApplicationType =
  | 'New Construction'
  | 'Erection'
  | 'Addition'
  | 'Alteration'
  | 'Renovation'
  | 'Conversion'
  | 'Repair'
  | 'Moving'
  | 'Demolition';

export type OccupancyGroup =
  | 'Group A - Residential (Dwellings)'
  | 'Group B - Residential (Hotels/Apartments)'
  | 'Group C - Education & Recreation'
  | 'Group D - Institutional'
  | 'Group E - Commercial (Business & Mercantile)'
  | 'Group F - Industrial (Non-Hazardous)'
  | 'Group G - Storage & Hazardous'
  | 'Group H - Assembly (Theaters/Halls)'
  | 'Group I - Assembly (Sports/Coliseums)'
  | 'Group J - Accessory & Agricultural';

export type RequirementCategory =
  | 'Cadastral & Legal'
  | 'Drawing Plans (20x30)'
  | 'Application Forms'
  | 'Professional Credentials'
  | 'Estimates & Specs'
  | 'Technical Computations'
  | 'Clearances & Certifications'
  | 'Contractor Compliance';

export type RequirementStatus =
  | 'Pending Upload'
  | 'Uploaded'
  | 'Verified'
  | 'Flagged with Issues'
  | 'Exempt / Not Applicable';

export type IssueSeverity = 'CRITICAL' | 'LEGAL' | 'TECHNICAL' | 'ADMIN';
export type IssueStatus = 'Open' | 'Resolved' | 'Under Review';

export interface UploadedDocument {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  dataUrl?: string;
  remarks?: string;
  verifiedBy?: string;
}

export interface RequirementItem {
  id: string;
  itemNo: number;
  category: RequirementCategory;
  title: string;
  specification: string;
  mandatoryCopies: number;
  status: RequirementStatus;
  uploadedFiles: UploadedDocument[];
  notes?: string;
  isMandatoryForCommercial?: boolean;
  isMandatoryForThreeStoreys?: boolean;
}

export interface FlaggedIssue {
  id: string;
  requirementId?: string;
  targetDocument: string;
  severity: IssueSeverity;
  title: string;
  description: string;
  rectification: string;
  flaggedAt: string;
  flaggedBy: string;
  status: IssueStatus;
  resolvedAt?: string;
  resolvedBy?: string;
  resolutionNotes?: string;
}

export interface SignatoryProfessional {
  id: string;
  role:
    | 'Architect (Design & Inspector)'
    | 'Civil / Structural Engineer'
    | 'Professional Electrical Engineer (PEE)'
    | 'Registered Electrical Engineer (REE - In-Charge)'
    | 'Master Plumber / Sanitary Engineer'
    | 'Professional Mechanical Engineer (PME)'
    | 'Geodetic Engineer'
    | 'Geotechnical Engineer'
    | 'Electronics Engineer'
    | 'Notary Public';
  name: string;
  prcNo: string;
  prcExpiry: string;
  ptrNo: string;
  ptrDate: string;
  ptrPlace: string;
  tin: string;
  iapoaNo?: string;
  iapoaValidity?: string;
  address: string;
  contact?: string;
  signatureStatus: 'Signed & Sealed' | 'Signed Only' | 'Missing Seal' | 'Pending Signature' | 'Missing / Required';
  isCompliant: boolean;
  notes?: string;
}

export interface CostValuation {
  buildingCost: number;
  electricalCost: number;
  plumbingCost: number;
  mechanicalCost: number;
  electronicsCost: number;
  otherCost: number;
  totalEstimatedCost: number;
}

export interface BuildingDetails {
  storeys: number;
  units: number;
  totalFloorArea: number; // sq. meters
  lotArea: number; // sq. meters
  proposedStart: string;
  expectedCompletion: string;
}

export interface OwnerEntity {
  enterpriseName: string;
  signatoryName: string;
  signatoryRole: string;
  agentName?: string;
  address: string;
  contactNumber: string;
  secondaryContact?: string;
  email?: string;
  ctcNumber: string;
  ctcDateIssued: string;
  ctcPlaceIssued: string;
  tin?: string;
}

export interface CadastralRecord {
  lotNo: string;
  blockNo: string;
  street: string;
  subdivisionOrSitio: string;
  barangay: string;
  city: string;
  province: string;
  tctNo: string;
  taxDeclarationNo: string;
}

export interface AuditSummary {
  overallStatus: 'Ready for Approval' | 'Action Required' | 'Under Initial Review' | 'Rejected / Suspended';
  complianceRate: number; // percentage
  totalRequirements: number;
  verifiedCount: number;
  flaggedCount: number;
  pendingCount: number;
  reviewedAt: string;
  reviewerName: string;
  reviewerOffice: string;
}

export interface PermitApplication {
  id: string;
  serialNumber: string; // e.g. "0926001141"
  referenceCode: string; // e.g. "GENTRI-BP-2026-0926001141"
  areaCode: string; // e.g. "04085"
  applicationType: ApplicationType;
  occupancyGroup: OccupancyGroup;
  characterOfOccupancy: string;
  buildingDetails: BuildingDetails;
  owner: OwnerEntity;
  cadastral: CadastralRecord;
  valuation: CostValuation;
  professionals: SignatoryProfessional[];
  requirements: RequirementItem[];
  flaggedIssues: FlaggedIssue[];
  auditSummary: AuditSummary;
  createdAt: string;
  updatedAt: string;
}
