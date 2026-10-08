export type OrganType = 'Kidney' | 'Liver' | 'Heart' | 'Lungs' | 'Pancreas';

export type BloodGroup = 'O-' | 'O+' | 'A-' | 'A+' | 'B-' | 'B+' | 'AB-' | 'AB+';

export type UrgencyLevel = 
  | 'Status 1A (Critical)' 
  | 'Status 1B (Urgent)' 
  | 'Status 2 (Moderate)' 
  | 'Status 3 (Stable)';

export type OrganStatus = 'Available' | 'Reserved' | 'In Transit' | 'Transplanted' | 'Expired';

export type RecipientStatus = 'Waiting' | 'Matched' | 'Transplanted' | 'Inactive';

export interface HLAMarkers {
  hlaA: string;
  hlaB: string;
  hlaDR: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface DonorOrgan {
  id: string;
  donorName?: string;
  donorAge: number;
  donorGender: 'Male' | 'Female' | 'Other';
  organType: OrganType;
  bloodGroup: BloodGroup;
  hlaMarkers: HLAMarkers;
  hospital: string;
  city: string;
  coordinates: Coordinates;
  donationTime: string; // ISO 8601 string
  maxShelfLifeHours: number; // e.g. Heart: 4-6, Lungs: 6-8, Liver: 12, Kidney: 24-36
  status: OrganStatus;
  medicalNotes?: string;
}

export interface Recipient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  organNeeded: OrganType;
  bloodGroup: BloodGroup;
  urgency: UrgencyLevel;
  registrationDate: string; // ISO 8601 string
  hlaMarkers: HLAMarkers;
  praScore: number; // Panel Reactive Antibodies percentage (0-100)
  hospital: string;
  city: string;
  coordinates: Coordinates;
  status: RecipientStatus;
  medicalNotes?: string;
}

export interface ScoreBreakdown {
  bloodScore: number;      // 0 or 20 (Mandatory compatibility base)
  hlaScore: number;        // 0 to 25 (allelic matching bonus)
  urgencyScore: number;    // 5 to 30 (Status 1A = 30, 1B = 20, 2 = 10, 3 = 5)
  shelfLifeScore: number;  // 0 to 15 (exponential boost as ischemia window shrinks)
  waitTimeScore: number;   // 0 to 10 (log-scaled days on waitlist)
  distanceScore: number;   // 0 to 10 (closer hospitals reduce ischemic transport risk)
  ageMatchScore: number;   // 0 to 5 (pediatric/geriatric age bracket suitability)
}

export interface MatchResult {
  id: string;
  organId: string;
  recipientId: string;
  organ: DonorOrgan;
  recipient: Recipient;
  compatibilityScore: number; // 0 to 100
  scoreBreakdown: ScoreBreakdown;
  distanceKm: number;
  shelfLifeRemainingHours: number;
  reasons: string[];
  rank: number;
  status: 'Proposed' | 'Accepted' | 'Rejected' | 'In Transport' | 'Transplanted';
  createdAt: string;
}

export type TransportStage = 
  | 'Match Accepted' 
  | 'Transport Scheduled' 
  | 'In Transit' 
  | 'Transplant Ready' 
  | 'Completed';

export interface TransportLog {
  timestamp: string;
  message: string;
  stage: TransportStage;
}

export interface TransportQueueItem {
  id: string;
  matchId: string;
  organId: string;
  recipientId: string;
  organType: OrganType;
  bloodGroup: BloodGroup;
  sourceHospital: string;
  sourceCity: string;
  destinationHospital: string;
  destinationCity: string;
  distanceKm: number;
  stage: TransportStage;
  estimatedArrival: string;
  courierType: 'Emergency Air Ambulance' | 'Medical Jet' | 'High-Speed Ground Unit' | 'Autonomous Drone';
  priorityLevel: 'Tier 1 Critical' | 'Tier 2 Urgent' | 'Tier 3 Standard';
  enqueuedAt: string;
  logs: TransportLog[];
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'organ' | 'recipient';
  organType: OrganType;
  bloodGroup: BloodGroup;
  urgencyOrShelfLife: string;
  hospital: string;
  data: DonorOrgan | Recipient;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  weight: number; // compatibility score 0 - 100
  isOptimalMatch: boolean;
  scoreBreakdown: ScoreBreakdown;
}

export interface BipartiteGraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}
