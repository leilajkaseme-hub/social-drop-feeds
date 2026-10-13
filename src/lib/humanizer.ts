import { PlatformId, StaggeredItem } from './types';
import { addMinutes } from 'date-fns';

/**
 * Platform specific caption optimizer
 * Prevents "duplicate cross-posting penalty" by tailoring layout and hashtag densities
 */
export function adaptCaptionForPlatform(platformId: PlatformId, baseCaption: string, title?: string): string {
  const cleanText = baseCaption.trim();

  // Extract any hashtags in the base caption
  const hashtagRegex = /#[a-zA-Z0-9_]+/g;
  const existingTags = cleanText.match(hashtagRegex) || [];
  const textWithoutTags = cleanText.replace(hashtagRegex, '').trim();

  switch (platformId) {
    case 'tiktok': {
      // TikTok algorithm prefers a strong first-line hook and max 3-5 hyper-relevant tags
      const topTags = existingTags.slice(0, 4);
      if (!topTags.includes('#fyp')) topTags.push('#fyp');
      return `${textWithoutTags}\n\n${topTags.join(' ')}`;
    }

    case 'youtube': {
      // YouTube Shorts prefers video title + description + #shorts tag
      const displayTitle = title || (textWithoutTags.slice(0, 60) || 'New Video');
      const shortsTag = !cleanText.toLowerCase().includes('#shorts') ? ' #shorts' : '';
      return `${displayTitle}${shortsTag}\n\n${cleanText}`;
    }

    case 'instagram': {
      // Instagram Reels favors clean caption text with hashtags separated by a spacer
      const tagsString = existingTags.length > 0 ? `\n.\n.\n${existingTags.join(' ')}` : '';
      return `${textWithoutTags}${tagsString}`;
    }

    case 'threads': {
      // Threads favors conversational text with 1 or zero hashtags
      const minimalTags = existingTags.slice(0, 2).join(' ');
      return `${textWithoutTags}${minimalTags ? ` ${minimalTags}` : ''}`;
    }

    case 'facebook': {
      // Facebook prefers natural conversational paragraphs without hashtag overload
      return textWithoutTags;
    }

    default:
      return baseCaption;
  }
}

/**
 * Staggered Delivery Scheduler
 * Solves the "Exact-Second Blast" bot trigger by inserting human-like delays
 */
export function calculateStaggeredTimeline(
  baseDate: Date,
  selectedPlatforms: PlatformId[],
  baseCaption: string,
  title?: string,
  enableStagger = true
): StaggeredItem[] {
  // Optimal platform sequence based on algorithmic peak ingestion patterns
  const platformOrder: PlatformId[] = ['youtube', 'tiktok', 'instagram', 'threads', 'facebook'];
  
  // Base delay spacing (in minutes) between consecutive platforms
  const baseDelays: Record<PlatformId, number> = {
    youtube: 0,
    tiktok: 14,
    instagram: 32,
    threads: 48,
    facebook: 62,
  };

  let cumulativeOffset = 0;

  return selectedPlatforms.map((platformId, index) => {
    let offsetMinutes = 0;

    if (enableStagger) {
      // Add standard platform gap + 2 to 7 minutes of random human jitter
      const jitter = Math.floor(Math.random() * 6) + 2;
      offsetMinutes = (baseDelays[platformId] ?? (index * 15)) + jitter;
    }

    const scheduledDate = addMinutes(baseDate, offsetMinutes);
    const adaptedCaption = adaptCaptionForPlatform(platformId, baseCaption, title);

    return {
      platformId,
      scheduledTime: scheduledDate.toISOString(),
      offsetMinutes,
      adaptedCaption,
      status: 'pending',
    };
  });
}

/**
 * Account Velocity Guard
 * Returns algorithmic safety tier based on 24-hour publishing frequency
 */
export function getVelocitySafety(dailyCount: number) {
  if (dailyCount <= 2) {
    return {
      level: 'safe' as const,
      label: 'Optimal Human Reach',
      color: 'emerald',
      description: 'Your frequency mimics genuine creator behavior. Zero spam risk.',
    };
  } else if (dailyCount === 3) {
    return {
      level: 'moderate' as const,
      label: 'Moderate Velocity',
      color: 'amber',
      description: 'Acceptable limit for active creators. Keep posts spaced by at least 3 hours.',
    };
  } else {
    return {
      level: 'warning' as const,
      label: 'High Velocity (Risk)',
      color: 'rose',
      description: '4+ posts/day on a single identity can trigger algorithmic dampening. Consider scheduling for tomorrow.',
    };
  }
}
