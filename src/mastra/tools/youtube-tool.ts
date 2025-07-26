// src/tools/youtube-tool.ts
import { Tool } from '@mastra/core/tools';
import { z } from 'zod';
import axios from 'axios';

const inputSchema = z.object({
    channel: z.string(),
});

const outputSchema = z.object({
    name: z.string(),
    channelId: z.string(),
    customUrl: z.string().optional(),
    subscribers: z.number(),
    totalVideos: z.number(),
    totalViews: z.number(),
    summary: z.string(),
    genre: z.string(),
    createdAt: z.string(),
    country: z.string().optional(),
    uploadFrequency: z.string(),
    avgViewsPerVideo: z.number(),
    engagementRate: z.number(),
    latestVideos: z.array(
        z.object({
            title: z.string(),
            views: z.number(),
            likes: z.number(),
            comments: z.number(),
            duration: z.string(),
            publishedAt: z.string(),
            tags: z.array(z.string()),
            thumbnailUrl: z.string(),
            description: z.string(),
        })
    ),
    topVideos: z.array(
        z.object({
            title: z.string(),
            views: z.number(),
            likes: z.number(),
            comments: z.number(),
            duration: z.string(),
            publishedAt: z.string(),
            tags: z.array(z.string()),
            thumbnailUrl: z.string(),
        })
    ),
    recentUploadDates: z.array(z.string()),
    commonTags: z.array(z.string()),
    avgVideoLength: z.string(),
});

export const youtubeTool = new Tool({
    id: 'youtubeTool',
    description: 'Fetches comprehensive data about a YouTube channel including stats, videos, engagement metrics, and analysis.',
    inputSchema: inputSchema,
    outputSchema: outputSchema,
    execute: async ({ context }) => {
        const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

        if (!YOUTUBE_API_KEY) {
            throw new Error('YOUTUBE_API_KEY environment variable is required');
        }

        const channelQuery = context.channel;

        try {
            // Search for channel
            let channelId: string;
            let channelTitle: string;
            let channelDescription: string;

            // Try different search methods for better channel discovery
            if (channelQuery.startsWith('@')) {
                // Handle @username format
                const handleQuery = channelQuery.substring(1);
                const searchRes = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
                    params: {
                        q: handleQuery,
                        type: 'channel',
                        key: YOUTUBE_API_KEY,
                        part: 'snippet',
                        maxResults: 5,
                    },
                });

                if (!searchRes.data.items || searchRes.data.items.length === 0) {
                    throw new Error(`Channel not found: ${channelQuery}`);
                }

                // Find exact match or best match
                const exactMatch = searchRes.data.items.find((item: any) =>
                    item.snippet.title.toLowerCase().includes(handleQuery.toLowerCase()) ||
                    item.snippet.customUrl?.toLowerCase().includes(handleQuery.toLowerCase())
                );

                const channelData = exactMatch || searchRes.data.items[0];
                channelId = channelData.snippet.channelId;
                channelTitle = channelData.snippet.title;
                channelDescription = channelData.snippet.description;
            } else {
                // Regular search
                const searchRes = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
                    params: {
                        q: channelQuery,
                        type: 'channel',
                        key: YOUTUBE_API_KEY,
                        part: 'snippet',
                        maxResults: 1,
                    },
                });

                if (!searchRes.data.items || searchRes.data.items.length === 0) {
                    throw new Error(`Channel not found: ${channelQuery}`);
                }

                channelId = searchRes.data.items[0].snippet.channelId;
                channelTitle = searchRes.data.items[0].snippet.title;
                channelDescription = searchRes.data.items[0].snippet.description;
            }

            // Get detailed channel stats
            const statsRes = await axios.get(`https://www.googleapis.com/youtube/v3/channels`, {
                params: {
                    id: channelId,
                    key: YOUTUBE_API_KEY,
                    part: 'statistics,snippet,brandingSettings',
                },
            });

            if (!statsRes.data.items || statsRes.data.items.length === 0) {
                throw new Error(`Channel details not found: ${channelId}`);
            }

            const channelData = statsRes.data.items[0];
            const stats = channelData.statistics;
            const snippet = channelData.snippet;

            const totalVideos = parseInt(stats.videoCount || '0');
            const subscribers = parseInt(stats.subscriberCount || '0');
            const totalViews = parseInt(stats.viewCount || '0');

            // Get recent videos (last 10)
            const recentRes = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
                params: {
                    key: YOUTUBE_API_KEY,
                    channelId,
                    part: 'snippet',
                    order: 'date',
                    maxResults: 10,
                    type: 'video',
                },
            });

            // Get popular videos
            const popularRes = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
                params: {
                    key: YOUTUBE_API_KEY,
                    channelId,
                    part: 'snippet',
                    order: 'viewCount',
                    maxResults: 5,
                    type: 'video',
                },
            });

            // Get video IDs for detailed stats
            const recentVideoIds = recentRes.data.items?.map((item: any) => item.id.videoId).join(',') || '';
            const popularVideoIds = popularRes.data.items?.map((item: any) => item.id.videoId).join(',') || '';
            const allVideoIds = [...new Set([...recentVideoIds.split(','), ...popularVideoIds.split(',')])].join(',');

            let videoDetails: any[] = [];
            if (allVideoIds) {
                const videoStatsRes = await axios.get(`https://www.googleapis.com/youtube/v3/videos`, {
                    params: {
                        key: YOUTUBE_API_KEY,
                        id: allVideoIds,
                        part: 'statistics,snippet,contentDetails',
                    },
                });
                videoDetails = videoStatsRes.data.items || [];
            }

            // Process recent videos
            const latestVideos = recentRes.data.items?.slice(0, 10).map((item: any) => {
                const videoDetail = videoDetails.find((detail: any) => detail.id === item.id.videoId);
                return {
                    title: item.snippet.title,
                    views: parseInt(videoDetail?.statistics?.viewCount || '0'),
                    likes: parseInt(videoDetail?.statistics?.likeCount || '0'),
                    comments: parseInt(videoDetail?.statistics?.commentCount || '0'),
                    duration: videoDetail?.contentDetails?.duration || 'Unknown',
                    publishedAt: item.snippet.publishedAt,
                    tags: videoDetail?.snippet?.tags || [],
                    thumbnailUrl: item.snippet.thumbnails?.high?.url || '',
                    description: videoDetail?.snippet?.description || '',
                };
            }) || [];

            // Process top videos
            const topVideos = popularRes.data.items?.slice(0, 5).map((item: any) => {
                const videoDetail = videoDetails.find((detail: any) => detail.id === item.id.videoId);
                return {
                    title: item.snippet.title,
                    views: parseInt(videoDetail?.statistics?.viewCount || '0'),
                    likes: parseInt(videoDetail?.statistics?.likeCount || '0'),
                    comments: parseInt(videoDetail?.statistics?.commentCount || '0'),
                    duration: videoDetail?.contentDetails?.duration || 'Unknown',
                    publishedAt: item.snippet.publishedAt,
                    tags: videoDetail?.snippet?.tags || [],
                    thumbnailUrl: item.snippet.thumbnails?.high?.url || '',
                };
            }) || [];

            // Calculate metrics
            const avgViewsPerVideo = totalVideos > 0 ? Math.round(totalViews / totalVideos) : 0;

            // Calculate engagement rate (likes + comments / views * 100)
            const totalEngagement = latestVideos.reduce((sum, video) => sum + video.likes + video.comments, 0);
            const totalRecentViews = latestVideos.reduce((sum, video) => sum + video.views, 0);
            const engagementRate = totalRecentViews > 0 ? Number(((totalEngagement / totalRecentViews) * 100).toFixed(2)) : 0;

            // Analyze upload frequency
            const uploadDates = latestVideos.map(video => new Date(video.publishedAt));
            const uploadFrequency = analyzeUploadFrequency(uploadDates);

            // Extract common tags
            const allTags = latestVideos.flatMap(video => video.tags);
            const commonTags = getCommonTags(allTags);

            // Calculate average video length
            const avgVideoLength = calculateAverageLength(latestVideos);

            // Determine genre
            let genre = 'General';
            const description = channelDescription.toLowerCase();
            if (description.includes('gaming') || description.includes('game')) genre = 'Gaming';
            else if (description.includes('tech') || description.includes('technology')) genre = 'Technology';
            else if (description.includes('science') || description.includes('education')) genre = 'Science & Education';
            else if (description.includes('entertainment') || description.includes('comedy')) genre = 'Entertainment';
            else if (description.includes('music')) genre = 'Music';
            else if (description.includes('vlog') || description.includes('lifestyle')) genre = 'Lifestyle';
            else if (description.includes('news')) genre = 'News & Politics';
            else if (description.includes('business') || description.includes('finance')) genre = 'Business & Finance';

            return {
                name: channelTitle,
                channelId,
                customUrl: snippet.customUrl || undefined,
                subscribers,
                totalVideos,
                totalViews,
                summary: channelDescription,
                genre,
                createdAt: snippet.publishedAt,
                country: snippet.country || undefined,
                uploadFrequency,
                avgViewsPerVideo,
                engagementRate,
                latestVideos,
                topVideos,
                recentUploadDates: uploadDates.map(date => date.toISOString()),
                commonTags,
                avgVideoLength,
            };

        } catch (error: any) {
            if (error.message.includes('Channel not found')) {
                throw error;
            }
            throw new Error(`Failed to fetch channel data: ${error.message}`);
        }
    },
});

// Helper functions
function analyzeUploadFrequency(dates: Date[]): string {
    if (dates.length < 2) return 'Insufficient data';

    const sortedDates = dates.sort((a, b) => b.getTime() - a.getTime());
    const daysBetween = sortedDates.map((date, index) => {
        if (index === sortedDates.length - 1) return 0;
        return Math.abs((date.getTime() - sortedDates[index + 1].getTime()) / (1000 * 60 * 60 * 24));
    }).filter(days => days > 0);

    if (daysBetween.length === 0) return 'Irregular';

    const avgDays = daysBetween.reduce((sum, days) => sum + days, 0) / daysBetween.length;

    if (avgDays <= 1) return 'Daily';
    else if (avgDays <= 3) return '2-3 times per week';
    else if (avgDays <= 7) return 'Weekly';
    else if (avgDays <= 14) return 'Bi-weekly';
    else if (avgDays <= 30) return 'Monthly';
    else return 'Irregular';
}

function getCommonTags(tags: string[]): string[] {
    const tagCount = tags.reduce((acc: Record<string, number>, tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
    }, {});

    return Object.entries(tagCount)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([tag]) => tag);
}

function calculateAverageLength(videos: any[]): string {
    const durations = videos
        .map(video => parseDuration(video.duration))
        .filter(duration => duration > 0);

    if (durations.length === 0) return 'Unknown';

    const avgSeconds = durations.reduce((sum, duration) => sum + duration, 0) / durations.length;
    const minutes = Math.floor(avgSeconds / 60);
    const seconds = Math.floor(avgSeconds % 60);

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function parseDuration(duration: string): number {
    if (!duration || duration === 'Unknown') return 0;

    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return 0;

    const hours = parseInt(match[1] || '0');
    const minutes = parseInt(match[2] || '0');
    const seconds = parseInt(match[3] || '0');

    return hours * 3600 + minutes * 60 + seconds;
}
