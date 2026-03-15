import { Octokit } from "octokit";

/**
 * Fetch all commits by the authenticated user for a given date range,
 * grouped by repository.
 *
 * Uses the GitHub Events API (GET /users/{username}/events) to fetch
 * PushEvent entries, then filters by date and extracts commits.
 *
 * @param {string} token - GitHub Personal Access Token
 * @param {string} since - ISO timestamp (start of day)
 * @param {string} until - ISO timestamp (end of day)
 * @returns {Promise<Object>} - { "owner/repo": [{ sha, message, timestamp, url }] }
 */
export async function fetchCommits(token, since, until) {
  const octokit = new Octokit({ auth: token });

  // Get authenticated user's login
  const { data: user } = await octokit.rest.users.getAuthenticated();
  const username = user.login;

  const commitsByRepo = {};
  let page = 1;
  const perPage = 100;
  let keepGoing = true;

  // The since/until variables are already full ISO strings like "2026-03-13T18:30:00.000Z"
  // Format them for the search query, replacing the ".000Z" with "Z" if necessary, though it works fine.
  const query = `author:${username} author-date:${since}..${until}`;

  while (keepGoing && page <= 5) {
    // max 500 commits per day is plenty
    const { data } = await octokit.rest.search.commits({
      q: query,
      per_page: perPage,
      page,
    });

    if (!data.items || data.items.length === 0) {
      break;
    }

    for (const item of data.items) {
      const repoName = item.repository.full_name;
      if (!commitsByRepo[repoName]) {
        commitsByRepo[repoName] = [];
      }

      // Deduplicate by SHA just in case
      const shortSha = item.sha.substring(0, 7);
      const alreadyAdded = commitsByRepo[repoName].some(
        (c) => c.sha === shortSha,
      );

      if (!alreadyAdded) {
        commitsByRepo[repoName].push({
          sha: shortSha,
          message: item.commit.message.split("\n")[0], // First line only
          timestamp: item.commit.author.date,
          url: item.html_url,
        });
      }
    }

    if (data.items.length < perPage) {
      keepGoing = false;
    } else {
      page++;
    }
  }

  // Remove empty repos (though search API shouldn't yield empty bins)
  for (const repo of Object.keys(commitsByRepo)) {
    if (commitsByRepo[repo].length === 0) {
      delete commitsByRepo[repo];
    }
  }

  return commitsByRepo;
}
