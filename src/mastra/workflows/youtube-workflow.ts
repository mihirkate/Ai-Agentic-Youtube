// src/workflows/youtube-workflow.ts
import { createStep, createWorkflow } from '@mastra/core/workflows';
import { z } from 'zod';

const inputSchema = z.object({
    channel: z.string(),
});

const outputSchema = z.object({
    name: z.string(),
    channelId: z.string(),
    subscribers: z.number(),
    totalVideos: z.number(),
    summary: z.string(),
    genre: z.string(),
    latestVideos: z.array(
        z.object({
            title: z.string(),
            views: z.number(),
            tags: z.array(z.string()),
        })
    ),
    topVideo: z.object({
        title: z.string(),
        views: z.number(),
        tags: z.array(z.string()),
    }),
});

const getChannelInfo = createStep({
    id: 'get-channel-info',
    description: 'Fetches YouTube channel details like summary, genre, subscribers, and videos.',
    inputSchema: inputSchema,
    outputSchema: outputSchema,
    execute: async ({ inputData }) => {
        const { channel } = inputData;

        // Replace this mock with actual API logic
        const mockResponse = {
            name: 'Veritasium',
            channelId: 'UC-ImLFXGIe2FC4Wo5hOodnw',
            subscribers: 2100,
            totalVideos: 1,
            summary: 'Veritasium is an educational science channel by Derek Muller, focusing on physics, engineering, and science concepts.',
            genre: 'Science & Education',
            latestVideos: [
                {
                    title: 'The Science of Light',
                    views: 500000,
                    tags: ['science', 'physics', 'light'],
                },
            ],
            topVideo: {
                title: 'The Science of Light',
                views: 500000,
                tags: ['science', 'physics', 'light'],
            },
        };

        return mockResponse;
    },
});

export const youtubeWorkflow = createWorkflow({
    id: 'youtubeWorkflow',
    description: 'Fetches YouTube channel details like summary, genre, subscribers, and videos.',
    inputSchema: inputSchema,
    outputSchema: outputSchema,
})
    .then(getChannelInfo);

youtubeWorkflow.commit();
