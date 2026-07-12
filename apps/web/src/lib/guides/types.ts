export type GuideStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export type Guide = {
  id: string;
  status: GuideStatus;
  display_name: string;
  headline: string;
  bio: string;
  years_experience: number;
  languages: string[];
  service_region_slugs: string[];
  specialties: string[];
  priority_score: number;
  contact_email: string;
  cover_url?: string | null;
  created_at: string;
  reject_reason?: string | null;
};

export type GuideInquiry = {
  id: string;
  guide_id: string;
  region_slug?: string;
  message: string;
  contact_email: string;
  contact_name?: string;
  status: 'new' | 'contacted' | 'closed';
  created_at: string;
};

export type GuideApplication = {
  id: string;
  guide_id: string;
  created_at: string;
  payload: Record<string, unknown>;
};

export type GuidesStore = {
  updated_at: string;
  guides: Guide[];
  applications: GuideApplication[];
  inquiries: GuideInquiry[];
};