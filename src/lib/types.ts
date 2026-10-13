export type PlatformId = 'instagram' | 'youtube' | 'tiktok' | 'threads' | 'facebook';

export interface PlatformConfig {
  id: PlatformId;
  name: string;
  badge: string;
  color: string;
  iconName: string;
  maxChars: number;
  supportsVideo: boolean;
  supportsImage: boolean;
  algorithmTip: string;
}

export interface SocialAccount {
  platformId: PlatformId;
  connected: boolean;
  handle: string;
  avatarUrl?: string;
  followerCount?: string;
  lastPostedAt?: string;
}

export interface Identity {
  id: string;
  name: string;
  slug: string;
  badgeColor: string;
  dailyPostCount: number;
  maxRecommendedPosts: number;
  accounts: Record<PlatformId, SocialAccount>;
}

export interface StaggeredItem {
  platformId: PlatformId;
  scheduledTime: string; // ISO string
  offsetMinutes: number;
  adaptedCaption: string;
  status: 'pending' | 'published' | 'failed';
}

export interface PostSubmission {
  id: string;
  identityId: string;
  baseCaption: string;
  title?: string;
  mediaUrl?: string;
  mediaName?: string;
  mediaType?: 'video' | 'image';
  targetPlatforms: PlatformId[];
  requestedDate: string; // ISO string
  enableAntiShadowban: boolean;
  staggeredSchedule: StaggeredItem[];
  createdAt: string;
}
