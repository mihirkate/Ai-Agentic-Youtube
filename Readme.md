# YouTube Agent - AI-Powered YouTube Analytics Platform

## 🎯 What is YouTube Agent?

YouTube Agent is an intelligent AI-powered system that provides comprehensive YouTube channel analytics and insights. Built with the Mastra framework, it leverages advanced AI agents to analyze YouTube channels, extract meaningful data, and provide actionable insights for content creators, marketers, and analysts.

### 🚀 What Problems Does It Solve?

- **Channel Analysis Complexity**: Simplifies complex YouTube data analysis through natural language queries
- **Content Strategy Optimization**: Provides data-driven insights for content planning and optimization  
- **Engagement Metrics Understanding**: Calculates and explains key performance indicators in human-readable format
- **Competitive Analysis**: Enables easy comparison between multiple YouTube channels
- **Trend Identification**: Identifies trending topics, optimal upload frequencies, and successful content patterns
- **Time-Consuming Research**: Automates the process of gathering and analyzing YouTube channel data

## 🎥 Demo Video

[![YouTube Agent Demo](https://img.youtube.com/vi/YOUR_VIDEO_ID/0.jpg)](https://www.youtube.com/watch?v=YOUR_VIDEO_ID)

*[Upload your demo video and replace YOUR_VIDEO_ID with the actual YouTube video ID]*

## 🛠️ Tech Stack

### Core Framework
- **[Mastra](https://mastra.ai/)** - AI agent framework for building intelligent applications
- **Node.js** (>=20.9.0) - Runtime environment
- **TypeScript** - Type-safe JavaScript development

### AI & Language Models  
- **Google Gemini 2.0 Flash** - Advanced language model for intelligent responses
- **AI SDK Google** - Integration with Google's AI services

### Data & Storage
- **LibSQL** - Lightweight SQL database for data persistence
- **Zod** - TypeScript-first schema validation
- **Axios** - HTTP client for YouTube API requests

### YouTube Integration
- **YouTube Data API v3** - Official YouTube API for channel and video data
- Custom analytics engine for engagement calculations and trend analysis

### Development Tools
- **Mastra CLI** - Development, build, and deployment tools
- **Pino Logger** - Structured logging for debugging and monitoring

## 📁 Project Structure

```
youtube-agent/
├── package.json                 # Project dependencies and scripts
├── Readme.md                   # Project documentation
├── test-queries.md             # Example queries and test cases
├── Youtube-Agent - Made with Clipchamp.mp4  # Demo video
└── src/
    └── mastra/
        ├── index.ts            # Main Mastra configuration
        ├── agents/
        │   └── youtube-agent.ts    # AI agent with YouTube expertise
        ├── tools/
        │   └── youtube-tool.ts     # YouTube API integration tool
        └── workflows/
            └── youtube-workflow.ts # Structured workflow for data processing
```

### 🏗️ Architecture Overview

- **Agent Layer**: Intelligent AI agent with specialized YouTube knowledge
- **Tool Layer**: Direct integration with YouTube Data API v3  
- **Workflow Layer**: Structured data processing and analysis
- **Storage Layer**: Persistent memory and data storage
- **API Layer**: RESTful endpoints for interaction

## 📋 Installation & Setup

### Prerequisites

- **Node.js** >= 20.9.0
- **npm** or **yarn** package manager
- **YouTube Data API Key** (from Google Cloud Console)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/youtube-agent.git
cd youtube-agent
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# YouTube Data API Key (Required)
YOUTUBE_API_KEY=your_youtube_api_key_here

# Google AI API Key (Required for Gemini)
GOOGLE_API_KEY=your_google_ai_api_key_here
```

#### Getting Your API Keys:

**YouTube Data API Key:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the YouTube Data API v3
4. Create credentials (API Key)
5. Copy the API key to your `.env` file

**Google AI API Key:**
1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Create a new API key
3. Copy the API key to your `.env` file

### 4. Development Server

```bash
npm run dev
```

The development server will start on `http://localhost:3000` with hot reload enabled.

### 5. Build for Production

```bash
npm run build
```

### 6. Start Production Server

```bash
npm start
```

## 🚀 Usage Examples

### Basic Channel Analysis
```
"Tell me about MrBeast's YouTube channel."
```

### Engagement Analytics
```  
"What's the engagement rate for MKBHD's channel?"
```

### Content Strategy
```
"What are the most common tags used by Veritasium?"
```

### Comparative Analysis
```
"Compare MrBeast and PewDiePie in terms of upload frequency and engagement"
```

### Trend Analysis
```
"What type of content performs best for Ali Abdaal?"
```

## 🔧 Configuration

### Agent Configuration
The YouTube Agent is configured in `src/mastra/agents/youtube-agent.ts` with:
- Specialized instructions for YouTube analytics
- Integration with YouTube tool
- Memory storage for conversation context
- Optimized for extensive analysis (500 max steps)

### Tool Configuration  
The YouTube Tool (`src/mastra/tools/youtube-tool.ts`) provides:
- Channel discovery and search
- Video analytics and metadata extraction
- Engagement rate calculations
- Upload frequency analysis
- Content categorization

### Workflow Configuration
The YouTube Workflow orchestrates data processing through structured steps for consistent and reliable analysis.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)  
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Mastra Framework](https://mastra.ai/) for the powerful AI agent infrastructure
- [YouTube Data API](https://developers.google.com/youtube/v3) for comprehensive channel data
- [Google Gemini](https://ai.google.dev/) for advanced language model capabilities

---

**Built with ❤️ using Mastra AI Framework**