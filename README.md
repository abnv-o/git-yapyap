# 🗣️ Git YapYap

> AI-powered GitHub activity summarizer — see what you shipped, instantly.

Git YapYap fetches your GitHub commits for any date, groups them by repository, and generates incredibly concise AI-powered summaries of your daily work. Perfect for standups, daily logs, tracking what you actually accomplished, or just reflecting on your productivity.

## ✨ Features
- **Fetch Past Commits**: Search any specific date (yesterday, today, or months ago).
- **Multi-Provider AI**: Use OpenAI, Google Gemini, Anthropic Claude, Groq, or Local LLMs to generate your summaries. The power is in your hands.
- **Private Repository Support**: With the right token scope, seamlessly summarize your private work without any fuss!
- **Fast & Interactive Setup**: 30-second interactive CLI configuration wizard.
- **Zero Configuration Daily Use**: Just type `yap yap` anywhere in your terminal.

---

## 🚀 Installation & Distribution

Git YapYap is designed to be installed globally on your machine using Node.js.

### Option A: Install direct from source (Local)
1. Clone this repository or download the source code wrapper.
2. Inside the project directory, install the dependencies and link it globally:
   ```bash
   npm install -g .
   ```

### Option B: Publishing to NPM (For worldwide release)
If you decide to release this to the world, log in to your NPM account and publish!
```bash
npm login
npm publish
```
Then, anyone can install your tool directly via NPM with:
```bash
npm install -g git-yap
```

---

## ⚙️ How to Setup (One-Time)

Once you install `git-yap`, you only need to run the setup wizard **once**.

```bash
yap setup
```

You will need two things to complete setup:
### 1. GitHub Personal Access Token (PAT)
Git YapYap needs a GitHub token to securely fetch your commits.
1. Go to your [GitHub Personal Access Tokens settings area](https://github.com/settings/tokens).
2. Click **Generate new token (classic)**.
3. In the Scopes section, **check the `repo` box**. *(This is required if you want it to summarize private repositories!)*
4. Keep the token safe and paste it into the CLI wizard when asked.

### 2. AI Platform Setup (API Key)
Pick your favorite LLM provider and grab a free API key:
- **Groq**: Free and blazingly fast `llama3` models. Get an API key at [console.groq.com](https://console.groq.com/keys).
- **Google Gemini**: Highly-capable `gemini-2.0-flash`. Get an API key at [aistudio.google.com](https://aistudio.google.com/app/apikey).
- **OpenAI**: The standard `gpt-4o-mini`. Get an API key at [platform.openai.com](https://platform.openai.com/api-keys).
- **Anthropic / Local**: Supported too!

---

## 📖 Usage

Using Git YapYap is as simple as it gets. You don't need to specify formats, just tell it when to yap.

```bash
# Today's activity
yap yap

# Yesterday's activity
yap yesterday

# A specific date (DDMMYYYY, DD-MM-YYYY, or DD/MM/YYYY)
yap 16032026
yap 16-03-2026
yap 16/03/2026
```

### Example Summary Output:

```text
📅 Activity for Sunday, March 14, 2026
─────────────────────────────────────────────
✔ Fetched GitHub activity
✔ Generated summaries

📦 abnv-o/Hypnohands (1 commit)
   The Hypnohands repository received an update to include a meta pixel.
   This addition enhances tracking capabilities for the project.

─────────────────────────────────────────────
✨ 1 repository · 1 commit
```

---

## 🏗️ Version 1.0.0
This tool is robust, clean, and tested. Future versions may add local summary caching, output to markdown, and extra email filters.

**License**: MIT
