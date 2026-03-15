import OpenAI from "openai";

/**
 * Generate a 2-line summary for a repository's commits using the configured AI provider.
 *
 * Supports: openai, gemini, claude, groq, local (OpenAI-compatible)
 *
 * @param {Object} config - { aiProvider, aiApiKey, aiModel, aiBaseUrl }
 * @param {string} repoName - Repository name (e.g., "owner/repo")
 * @param {Array} commits - Array of { sha, message, timestamp }
 * @returns {Promise<string>} - 2-line summary
 */
export async function summarizeCommits(config, repoName, commits) {
  const commitMessages = commits.map((c) => `- ${c.message}`).join("\n");

  const prompt = `You are a concise technical writer. Summarize the following git commits for the repository "${repoName}" in exactly 2 short lines. Focus on what was accomplished overall, not individual commits. Be specific and informative.

Commits:
${commitMessages}

Respond with exactly 2 lines, nothing else.`;

  const { aiProvider, aiApiKey, aiModel, aiBaseUrl } = config;

  try {
    switch (aiProvider) {
      case "openai":
        return await callOpenAI(aiApiKey, aiModel, prompt);
      case "groq":
      case "local":
        return await callOpenAICompatible(aiApiKey, aiModel, aiBaseUrl, prompt);
      case "gemini":
        return await callGemini(aiApiKey, aiModel, prompt);
      case "claude":
        return await callClaude(aiApiKey, aiModel, prompt);
      default:
        throw new Error(`Unknown AI provider: ${aiProvider}`);
    }
  } catch (error) {
    return `⚠️  Could not generate summary: ${error.message}`;
  }
}

// ─── OpenAI ──────────────────────────────────────────────────

async function callOpenAI(apiKey, model, prompt) {
  const client = new OpenAI({ apiKey });
  const response = await client.chat.completions.create({
    model: model || "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 150,
    temperature: 0.3,
  });
  return response.choices[0].message.content.trim();
}

// ─── OpenAI-Compatible (Groq, Local/Ollama, LM Studio) ──────

async function callOpenAICompatible(apiKey, model, baseUrl, prompt) {
  const client = new OpenAI({
    apiKey: apiKey || "not-needed",
    baseURL: baseUrl,
  });
  const response = await client.chat.completions.create({
    model: model || "llama3",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 150,
    temperature: 0.3,
  });
  return response.choices[0].message.content.trim();
}

// ─── Google Gemini (direct REST) ─────────────────────────────

async function callGemini(apiKey, model, prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model || "gemini-2.0-flash"}:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: 150,
        temperature: 0.3,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API error: ${response.status} ${error}`);
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text.trim();
}

// ─── Anthropic Claude (direct REST) ──────────────────────────

async function callClaude(apiKey, model, prompt) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: model || "claude-3-5-haiku-20241022",
      max_tokens: 150,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Claude API error: ${response.status} ${error}`);
  }

  const data = await response.json();
  return data.content[0].text.trim();
}
