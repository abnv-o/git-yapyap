# Git YapYap CLI

A command-line tool that fetches your GitHub commits for a specific date and uses AI to generate a summary of your activity.

## Installation

Install the package globally via npm:

```bash
npm install -g git-yapyap-cli
```

## Setup

Before using the tool, you must configure it with a GitHub Personal Access Token and an API key for your preferred AI provider (OpenAI, Anthropic, Gemini, etc).

Run the setup command:

```bash
yap setup
```

You will need:
1. **GitHub PAT**: Generate a classic token at `https://github.com/settings/tokens`. If you want to summarize private repositories, check the `repo` scope.
2. **AI API Key**: Obtain an API key from your chosen supported provider.

## Usage

Run the tool in your terminal to fetch and summarize commits.

```bash
# Summarize today's commits
yap yap

# Summarize yesterday's commits
yap yesterday

# Summarize a specific date (Format: DDMMYYYY, DD-MM-YYYY, or DD/MM/YYYY)
yap 16032026
```

## License

MIT
