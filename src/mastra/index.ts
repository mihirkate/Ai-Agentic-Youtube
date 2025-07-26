import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';
import { youtubeAgent } from './agents/youtube-agent';
import { youtubeWorkflow } from './workflows/youtube-workflow';
export const mastra = new Mastra({
  workflows: {
    youtubeWorkflow,
  },
  agents: {
    youtubeAgent,
  },
  storage: new LibSQLStore({
    url: ':memory:',
  }),
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
  // maxSteps: 500, // Removed because it's not a valid property
});

