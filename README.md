# 🗣️ Git YapYap

> AI-powered GitHub activity summarizer — see what you shipped, instantly.

Git YapYap fetches your GitHub commits for any date, groups them by repository, and generates incredibly concise AI-powered summaries of your daily work. Perfect for standups, daily logs, tracking what you actually accomplished, or just reflecting on your productivity.

## ✨ Features

---

## 🚀 Installation & Distribution

Git YapYap is designed to be installed globally on your machine using Node.js.

### Install direct from source (Local)
1. Clone this repository or download the source code wrapper.
2. Inside the project directory, install the dependencies and link it globally:
   ```bash
   npm install -g .
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
Pick your favorite LLM provider and grab an API key:

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


---

## 🏗️ Version 1.0.0

**License**: MIT
