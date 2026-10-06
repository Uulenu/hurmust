export type LegalRuleType = 'RIGHT' | 'DUTY' | 'PROHIBITION' | 'PROCEDURE' | 'AUTHORITY_POWER' | 'REMEDY' | 'RESPONSIBILITY';
export type LawStatus = 'ACTIVE' | 'AMENDED' | 'REPEALED' | 'UNVERIFIED';
export type ConfidenceLevel = 'high' | 'medium' | 'low';

export interface LegalProvision {
  id: string;
  lawId: string;
  lawName: string;
  article: string;
  paragraph?: string;
  subparagraph?: string;
  referenceLabel: string;
  title?: string;
  ruleType: LegalRuleType;
  officialTextShort?: string;
  plainLanguageSummary: string;
  whatItMeansForUser?: string;
  whoHasTheRight?: string[];
  whoHasTheDuty?: string[];
  prohibitedActions?: string[];
  relatedTopics: string[];
  relatedIncidentCategories: string[];
  sourceName: 'Legalinfo.mn';
  sourceUrl: string;
  status: LawStatus;
  verifiedAt?: string;
  keywords: string[];
  contexts?: string[];
  childOnly?: boolean;
}

export interface Organization {
  id: string;
  name: string;
  type: string;
  phone?: string;
  email?: string;
  address?: string;
  website?: string;
  services: string[];
  emergency: boolean;
  verified: boolean;
  lastVerified?: string;
  source?: string;
}

export interface IncidentScenario {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  relatedProvisionIds: string[];
  steps: string[];
  organizationIds: string[];
}

export interface MatchResult {
  provisions: LegalProvision[];
  duties: LegalProvision[];
  nextSteps: string[];
  organizations: Organization[];
  isEmergency: boolean;
  confidence: ConfidenceLevel;
  disclaimer: string;
}

export interface SavedPlan {
  id: string;
  title: string;
  createdAt: string;
  scenarioId?: string;
  notes: string;
  provisionIds: string[];
  organizationIds: string[];
}

export interface Bookmark {
  id: string;
  type: 'law' | 'provision';
  itemId: string;
  createdAt: string;
}
