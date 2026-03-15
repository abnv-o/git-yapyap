import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";
import { Octokit } from "octokit";
import { setConfig } from "./config.js";

const PROVIDER_DEFAULTS = {
  openai: { model: "gpt-4o-mini", baseUrl: "" },
  gemini: { model: "gemini-2.0-flash", baseUrl: "" },
  claude: { model: "claude-3-5-haiku-20241022", baseUrl: "" },
  groq: {
    model: "llama-3.3-70b-versatile",
    baseUrl: "https://api.groq.com/openai/v1",
  },
  local: { model: "llama3", baseUrl: "http://localhost:11434/v1" },
};

export async function runSetup() {
  console.log(chalk.bold.cyan("\n🔧 Git YapYap Setup\n"));
  console.log(chalk.dim("Configure your GitHub and AI credentials.\n"));

  // Step 1: GitHub Token
  const { githubToken } = await inquirer.prompt([
    {
      type: "password",
      name: "githubToken",
      message: "GitHub Personal Access Token:",
      mask: "*",
      validate: (input) => input.length > 0 || "Token is required",
    },
  ]);

  // Validate GitHub token
  const spinner = ora("Validating GitHub token...").start();
  try {
    const octokit = new Octokit({ auth: githubToken });
    const { data } = await octokit.rest.users.getAuthenticated();
    spinner.succeed(chalk.green(`Authenticated as ${chalk.bold(data.login)}`));
  } catch (error) {
    spinner.fail(
      chalk.red("Invalid GitHub token. Please check and try again."),
    );
    return;
  }

  // Step 2: AI Provider
  const { aiProvider } = await inquirer.prompt([
    {
      type: "list",
      name: "aiProvider",
      message: "Choose your AI provider:",
      choices: [
        { name: "OpenAI", value: "openai" },
        { name: "Google Gemini", value: "gemini" },
        { name: "Anthropic Claude", value: "claude" },
        { name: "Groq", value: "groq" },
        { name: "Local / Custom (Ollama, LM Studio, etc.)", value: "local" },
      ],
    },
  ]);

  // Step 3: API Key
  let aiApiKey = "";
  if (aiProvider !== "local") {
    const response = await inquirer.prompt([
      {
        type: "password",
        name: "aiApiKey",
        message: `${aiProvider.charAt(0).toUpperCase() + aiProvider.slice(1)} API Key:`,
        mask: "*",
        validate: (input) => input.length > 0 || "API key is required",
      },
    ]);
    aiApiKey = response.aiApiKey;
  } else {
    const response = await inquirer.prompt([
      {
        type: "password",
        name: "aiApiKey",
        message: "API Key (leave empty if not needed):",
        mask: "*",
      },
    ]);
    aiApiKey = response.aiApiKey || "";
  }

  // Step 4: Model
  const defaults = PROVIDER_DEFAULTS[aiProvider];
  const { aiModel } = await inquirer.prompt([
    {
      type: "input",
      name: "aiModel",
      message: "Model name:",
      default: defaults.model,
    },
  ]);

  // Step 5: Base URL (for Groq / Local)
  let aiBaseUrl = defaults.baseUrl;
  if (aiProvider === "groq" || aiProvider === "local") {
    const response = await inquirer.prompt([
      {
        type: "input",
        name: "aiBaseUrl",
        message: "API Base URL:",
        default: defaults.baseUrl,
      },
    ]);
    aiBaseUrl = response.aiBaseUrl;
  }

  // Save everything
  setConfig("githubToken", githubToken);
  setConfig("aiProvider", aiProvider);
  setConfig("aiApiKey", aiApiKey);
  setConfig("aiModel", aiModel);
  setConfig("aiBaseUrl", aiBaseUrl);

  console.log(chalk.bold.green("\n✅ Setup complete! You're ready to go.\n"));
  console.log(
    chalk.dim("Try running: ") +
      chalk.cyan("yap yap") +
      chalk.dim(" to see today's activity.\n"),
  );
}
