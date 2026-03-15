#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import { getConfig, isConfigured } from "../src/config.js";
import { runSetup } from "../src/setup.js";
import { parseDate } from "../src/dateParser.js";
import { fetchCommits } from "../src/github.js";
import { summarizeCommits } from "../src/summarizer.js";

const program = new Command();

program
  .name("yap")
  .description("🗣️  Git YapYap — AI-powered GitHub activity summarizer")
  .version("1.0.0");

// ─── Setup Command ─────────────────────────────────────────

program
  .command("setup")
  .description("Configure GitHub and AI credentials")
  .action(async () => {
    await runSetup();
  });

// ─── Default Command (fetch & summarize) ────────────────────

program
  .argument(
    "[date]",
    "Date to fetch commits for (yap, yesterday, DDMMYYYY, DD-MM-YYYY, DD/MM/YYYY)",
  )
  .action(async (dateArg) => {
    // Check if configured
    if (!isConfigured()) {
      console.log(chalk.yellow("\n⚠️  Git YapYap is not configured yet.\n"));
      console.log(
        chalk.dim("Run ") +
          chalk.cyan("yap setup") +
          chalk.dim(" to get started.\n"),
      );
      process.exit(1);
    }

    const config = getConfig();

    // Parse the date
    let dateRange;
    try {
      dateRange = parseDate(dateArg);
    } catch (error) {
      console.log(chalk.red(`\n❌ ${error.message}\n`));
      process.exit(1);
    }

    // Header
    console.log(chalk.bold.cyan(`\n📅 Activity for ${dateRange.displayDate}`));
    console.log(chalk.dim("─".repeat(45)));

    // Fetch commits
    const fetchSpinner = ora("Fetching GitHub activity...").start();
    let commitsByRepo;
    try {
      commitsByRepo = await fetchCommits(
        config.githubToken,
        dateRange.since,
        dateRange.until,
      );
      fetchSpinner.succeed(chalk.dim("Fetched GitHub activity"));
    } catch (error) {
      fetchSpinner.fail(chalk.red("Failed to fetch GitHub activity"));
      console.log(chalk.red(`\n${error.message}\n`));
      process.exit(1);
    }

    // Check if any commits found
    const repoNames = Object.keys(commitsByRepo);
    if (repoNames.length === 0) {
      console.log(chalk.yellow("\n😴 No commits found for this date.\n"));
      console.log(
        chalk.dim(
          "Either you took a day off (nice!) or try a different date.\n",
        ),
      );
      process.exit(0);
    }

    // Count total commits
    const totalCommits = repoNames.reduce(
      (sum, repo) => sum + commitsByRepo[repo].length,
      0,
    );

    // Summarize each repo
    const summarySpinner = ora("Generating AI summaries...").start();
    const summaries = {};

    for (const repo of repoNames) {
      summarySpinner.text = `Summarizing ${chalk.cyan(repo)}...`;
      summaries[repo] = await summarizeCommits(
        config,
        repo,
        commitsByRepo[repo],
      );
    }
    summarySpinner.succeed(chalk.dim("Generated summaries"));

    // Output
    console.log("");
    for (const repo of repoNames) {
      const commitCount = commitsByRepo[repo].length;
      const commitWord = commitCount === 1 ? "commit" : "commits";
      console.log(
        chalk.bold(`📦 ${repo}`) + chalk.dim(` (${commitCount} ${commitWord})`),
      );

      // Print raw commit messages
      for (const commit of commitsByRepo[repo]) {
        console.log(chalk.dim(`   • ${commit.message}`));
      }
      console.log(""); // blank line between commits and summary

      // Print AI summary
      const summaryLines = summaries[repo].split("\n").filter((l) => l.trim());
      for (const line of summaryLines) {
        console.log(chalk.white(`   ${line.trim()}`));
      }
      console.log("");
    }

    // Footer
    console.log(chalk.dim("─".repeat(45)));
    const repoWord = repoNames.length === 1 ? "repository" : "repositories";
    const commitWord = totalCommits === 1 ? "commit" : "commits";
    console.log(
      chalk.green(
        `✨ ${repoNames.length} ${repoWord} · ${totalCommits} ${commitWord}\n`,
      ),
    );
  });

program.parse();
