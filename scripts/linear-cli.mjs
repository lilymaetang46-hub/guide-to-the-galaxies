import fs from "node:fs";
import path from "node:path";

const LINEAR_API_URL = "https://api.linear.app/graphql";

function loadLocalEnv() {
  const envPath = path.resolve(".env.local");
  if (!fs.existsSync(envPath)) {
    return;
  }

  const raw = fs.readFileSync(envPath, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const equalsIndex = trimmed.indexOf("=");
    if (equalsIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, equalsIndex).trim();
    let value = trimmed.slice(equalsIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

function parseArgs(argv) {
  const [, , command, ...rest] = argv;
  const options = {};

  for (let i = 0; i < rest.length; i += 1) {
    const token = rest[i];
    if (!token.startsWith("--")) {
      continue;
    }

    const key = token.slice(2);
    const next = rest[i + 1];
    if (!next || next.startsWith("--")) {
      options[key] = "true";
      continue;
    }

    options[key] = next;
    i += 1;
  }

  return { command, options };
}

function printHelp() {
  console.log(`Linear helper

Usage:
  npm run linear:teams
  npm run linear -- projects
  npm run linear -- projects-detailed
  npm run linear -- labels --team GUI
  npm run linear -- issues --team GUI
  npm run linear -- issues-detailed --team GUI
  npm run linear -- create-project --team GUI --name "Calendar Visibility"
  npm run linear -- update-project --team GUI --project "Calendar Visibility" --description "Optional details"
  npm run linear -- update-project --team GUI --project "Calendar Visibility" --content "Longer project notes"
  npm run linear:create -- --team GUI --title "Fix calendar sync"
  npm run linear -- create-issue --team GUI --title "Fix calendar sync" --description "Optional details"
  npm run linear -- update-issue --team GUI --issue GUI-123 --description "Execution plan"

Supported commands:
  teams
  projects
  projects-detailed
  labels
  issues
  issues-detailed
  create-label
  create-project
  update-project
  create-issue
  update-issue
  delete-issue
  delete-project

Options for create-issue:
  --team         Team key or team name (required)
  --title        Issue title (required)
  --description  Issue description
  --priority     0-4 (optional)
  --project      Project name (optional)
  --labels       Comma separated label names (optional)
`);
}

async function linearRequest(query, variables = {}) {
  const apiKey = process.env.LINEAR_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Missing LINEAR_API_KEY. Add it to .env.local before using this command."
    );
  }

  const response = await fetch(LINEAR_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: apiKey,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Linear API request failed (${response.status}): ${text}`);
  }

  const payload = await response.json();
  if (payload.errors?.length) {
    throw new Error(payload.errors.map((error) => error.message).join("; "));
  }

  return payload.data;
}

async function getTeams() {
  const query = `
    query {
      teams {
        nodes {
          id
          key
          name
        }
      }
    }
  `;

  const data = await linearRequest(query);
  return data.teams.nodes;
}

async function getProjects() {
  const query = `
    query {
      projects {
        nodes {
          id
          name
          url
          teams {
            nodes {
              id
              key
              name
            }
          }
        }
      }
    }
  `;

  const data = await linearRequest(query);
  return data.projects.nodes;
}

async function getProjectsDetailed() {
  const query = `
    query {
      projects {
        nodes {
          id
          name
          url
          description
          content
          teams {
            nodes {
              id
              key
              name
            }
          }
        }
      }
    }
  `;

  const data = await linearRequest(query);
  return data.projects.nodes;
}

async function getIssueLabels() {
  const rootQuery = `
    query {
      issueLabels {
        nodes {
          id
          name
          team {
            id
            key
            name
          }
        }
      }
    }
  `;

  try {
    const data = await linearRequest(rootQuery);
    if (data.issueLabels.nodes.length) {
      return data.issueLabels.nodes;
    }
  } catch {
    // Fall through to the team-scoped query below.
  }

  const fallbackQuery = `
    query {
      teams {
        nodes {
          id
          key
          name
          issueLabels {
            nodes {
              id
              name
            }
          }
        }
      }
    }
  `;

  const data = await linearRequest(fallbackQuery);
  return data.teams.nodes.flatMap((team) =>
    team.issueLabels.nodes.map((label) => ({
      ...label,
      team: {
        id: team.id,
        key: team.key,
        name: team.name,
      },
    }))
  );
}

async function resolveTeamId(teamInput) {
  const teams = await getTeams();
  const normalized = teamInput.trim().toLowerCase();
  const team = teams.find(
    (entry) =>
      entry.key.toLowerCase() === normalized ||
      entry.name.toLowerCase() === normalized
  );

  if (!team) {
    const printableTeams = teams.map((entry) => `${entry.key} (${entry.name})`).join(", ");
    throw new Error(`Could not find team "${teamInput}". Available teams: ${printableTeams}`);
  }

  return team;
}

async function listTeams() {
  const teams = await getTeams();
  if (!teams.length) {
    console.log("No teams found.");
    return;
  }

  for (const team of teams) {
    console.log(`${team.key}\t${team.name}\t${team.id}`);
  }
}

async function listProjects() {
  const projects = await getProjects();
  if (!projects.length) {
    console.log("No projects found.");
    return;
  }

  for (const project of projects) {
    const teamNames = project.teams.nodes.map((team) => team.key).join(", ");
    console.log(`${project.name}\t${teamNames}\t${project.id}`);
  }
}

async function listProjectsDetailed() {
  const projects = await getProjectsDetailed();
  if (!projects.length) {
    console.log("No projects found.");
    return;
  }

  console.log(JSON.stringify(projects, null, 2));
}

async function listLabels(options) {
  const teamInput = options.team?.trim();
  const labels = await getIssueLabels();
  let filteredLabels = labels;

  if (teamInput) {
    const team = await resolveTeamId(teamInput);
    filteredLabels = labels.filter((label) => label.team?.id === team.id);
  }

  if (!filteredLabels.length) {
    console.log("No labels found.");
    return;
  }

  for (const label of filteredLabels) {
    const teamKey = label.team?.key ?? "-";
    console.log(`${label.name}\t${teamKey}\t${label.id}`);
  }
}

async function listIssues(options) {
  const teamInput = options.team?.trim();
  const team = teamInput ? await resolveTeamId(teamInput) : null;
  const query = `
    query {
      issues {
        nodes {
          id
          identifier
          title
          url
          priority
          project {
            name
          }
          state {
            name
          }
          team {
            id
            key
            name
          }
          labels {
            nodes {
              id
              name
            }
          }
        }
      }
    }
  `;

  const data = await linearRequest(query);
  let issues = data.issues.nodes;

  if (team) {
    issues = issues.filter((issue) => issue.team?.id === team.id);
  }

  if (!issues.length) {
    console.log("No issues found.");
    return;
  }

  for (const issue of issues) {
    const labels = issue.labels.nodes.map((label) => label.name).join(", ");
    const projectName = issue.project?.name ?? "-";
    const stateName = issue.state?.name ?? "-";
    console.log(
      `${issue.identifier}\t${stateName}\t${projectName}\t${issue.title}${labels ? `\t[${labels}]` : ""}`
    );
  }
}

async function listIssuesDetailed(options) {
  const teamInput = options.team?.trim();
  const team = teamInput ? await resolveTeamId(teamInput) : null;
  const query = `
    query {
      issues {
        nodes {
          id
          identifier
          title
          url
          description
          priority
          project {
            id
            name
          }
          state {
            name
          }
          team {
            id
            key
            name
          }
          labels {
            nodes {
              id
              name
            }
          }
        }
      }
    }
  `;

  const data = await linearRequest(query);
  let issues = data.issues.nodes;

  if (team) {
    issues = issues.filter((issue) => issue.team?.id === team.id);
  }

  console.log(JSON.stringify(issues, null, 2));
}

async function resolveProjectId(projectInput, teamId = null) {
  const projects = await getProjects();
  const normalized = projectInput.trim().toLowerCase();
  const project = projects.find((entry) => {
    const matchesName = entry.name.toLowerCase() === normalized;
    if (!matchesName) {
      return false;
    }

    if (!teamId) {
      return true;
    }

    return entry.teams.nodes.some((team) => team.id === teamId);
  });

  if (!project) {
    throw new Error(`Could not find project "${projectInput}"`);
  }

  return project;
}

async function resolveIssueId(issueInput, teamId = null) {
  const query = `
    query {
      issues {
        nodes {
          id
          identifier
          title
          team {
            id
          }
        }
      }
    }
  `;

  const data = await linearRequest(query);
  const normalized = issueInput.trim().toLowerCase();
  const issue = data.issues.nodes.find((entry) => {
    const matches =
      entry.identifier.toLowerCase() === normalized ||
      entry.title.toLowerCase() === normalized;

    if (!matches) {
      return false;
    }

    if (!teamId) {
      return true;
    }

    return entry.team?.id === teamId;
  });

  if (!issue) {
    throw new Error(`Could not find issue "${issueInput}"`);
  }

  return issue;
}

async function resolveLabelIds(labelsInput, teamId) {
  const requestedNames = labelsInput
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  if (!requestedNames.length) {
    return [];
  }

  const labels = await getIssueLabels();
  const normalizedToId = new Map();

  for (const label of labels) {
    if (label.team?.id !== teamId) {
      continue;
    }

    normalizedToId.set(label.name.trim().toLowerCase(), label.id);
  }

  if (normalizedToId.size === 0) {
    const query = `
      query {
        issues {
          nodes {
            team {
              id
            }
            labels {
              nodes {
                id
                name
              }
            }
          }
        }
      }
    `;

    const data = await linearRequest(query);
    for (const issue of data.issues.nodes) {
      if (issue.team?.id !== teamId) {
        continue;
      }

      for (const label of issue.labels.nodes) {
        normalizedToId.set(label.name.trim().toLowerCase(), label.id);
      }
    }
  }

  const missing = requestedNames.filter((name) => !normalizedToId.has(name.toLowerCase()));
  if (missing.length) {
    throw new Error(`Could not find label(s): ${missing.join(", ")}`);
  }

  return requestedNames.map((name) => normalizedToId.get(name.toLowerCase()));
}

async function createProject(options) {
  const teamInput = options.team?.trim();
  const name = options.name?.trim();

  if (!teamInput || !name) {
    throw new Error("create-project requires --team and --name");
  }

  const team = await resolveTeamId(teamInput);
  const query = `
    mutation ProjectCreate($input: ProjectCreateInput!) {
      projectCreate(input: $input) {
        success
        project {
          id
          name
          url
        }
      }
    }
  `;

  const input = {
    name,
    teamIds: [team.id],
  };

  if (options.description) {
    input.description = options.description;
  }

  const data = await linearRequest(query, { input });
  const project = data.projectCreate.project;
  console.log(`Created project: ${project.name}`);
  console.log(project.url);
}

async function updateProject(options) {
  const projectInput = options.project?.trim();
  const teamInput = options.team?.trim();

  if (!projectInput) {
    throw new Error("update-project requires --project");
  }

  if (!options.description && !options.content) {
    throw new Error("update-project requires --description and/or --content");
  }

  const team = teamInput ? await resolveTeamId(teamInput) : null;
  const project = await resolveProjectId(projectInput, team?.id ?? null);
  const query = `
    mutation ProjectUpdate($id: String!, $input: ProjectUpdateInput!) {
      projectUpdate(id: $id, input: $input) {
        success
        project {
          id
          name
          url
          description
        }
      }
    }
  `;

  const input = {};

  if (options.description) {
    input.description = options.description;
  }

  if (options.content) {
    input.content = options.content;
  }

  const data = await linearRequest(query, { id: project.id, input });
  const updatedProject = data.projectUpdate.project;
  console.log(`Updated project: ${updatedProject.name}`);
  console.log(updatedProject.url);
}

async function createLabel(options) {
  const teamInput = options.team?.trim();
  const name = options.name?.trim();

  if (!teamInput || !name) {
    throw new Error("create-label requires --team and --name");
  }

  const team = await resolveTeamId(teamInput);
  const query = `
    mutation IssueLabelCreate($input: IssueLabelCreateInput!) {
      issueLabelCreate(input: $input) {
        success
        issueLabel {
          id
          name
          color
        }
      }
    }
  `;

  const input = {
    teamId: team.id,
    name,
  };

  if (options.color) {
    input.color = options.color;
  }

  const data = await linearRequest(query, { input });
  const label = data.issueLabelCreate.issueLabel;
  console.log(`Created label: ${label.name}`);
}

async function createIssue(options) {
  const title = options.title?.trim();
  const teamInput = options.team?.trim();

  if (!teamInput || !title) {
    throw new Error("create-issue requires --team and --title");
  }

  const team = await resolveTeamId(teamInput);
  const query = `
    mutation IssueCreate($input: IssueCreateInput!) {
      issueCreate(input: $input) {
        success
        issue {
          id
          identifier
          title
          url
        }
      }
    }
  `;

  const input = {
    teamId: team.id,
    title,
  };

  if (options.project) {
    const project = await resolveProjectId(options.project, team.id);
    input.projectId = project.id;
  }

  if (options.labels) {
    const labelIds = await resolveLabelIds(options.labels, team.id);
    if (labelIds.length) {
      input.labelIds = labelIds;
    }
  }

  if (options.description) {
    input.description = options.description;
  }

  if (options.priority) {
    const priority = Number(options.priority);
    if (Number.isNaN(priority) || priority < 0 || priority > 4) {
      throw new Error("--priority must be a number from 0 to 4");
    }
    input.priority = priority;
  }

  const data = await linearRequest(query, { input });
  const issue = data.issueCreate.issue;
  console.log(`Created ${issue.identifier}: ${issue.title}`);
  console.log(issue.url);
}

async function updateIssue(options) {
  const issueInput = options.issue?.trim();
  const teamInput = options.team?.trim();

  if (!issueInput) {
    throw new Error("update-issue requires --issue");
  }

  if (!options.description) {
    throw new Error("update-issue requires --description");
  }

  const team = teamInput ? await resolveTeamId(teamInput) : null;
  const issue = await resolveIssueId(issueInput, team?.id ?? null);
  const query = `
    mutation IssueUpdate($id: String!, $input: IssueUpdateInput!) {
      issueUpdate(id: $id, input: $input) {
        success
        issue {
          id
          identifier
          title
          url
          description
        }
      }
    }
  `;

  const input = {
    description: options.description,
  };

  const data = await linearRequest(query, { id: issue.id, input });
  const updatedIssue = data.issueUpdate.issue;
  console.log(`Updated ${updatedIssue.identifier}: ${updatedIssue.title}`);
  console.log(updatedIssue.url);
}

async function deleteIssue(options) {
  const issueInput = options.issue?.trim();
  const teamInput = options.team?.trim();

  if (!issueInput) {
    throw new Error("delete-issue requires --issue");
  }

  const team = teamInput ? await resolveTeamId(teamInput) : null;
  const issue = await resolveIssueId(issueInput, team?.id ?? null);
  const query = `
    mutation IssueDelete($id: String!) {
      issueDelete(id: $id) {
        success
      }
    }
  `;

  await linearRequest(query, { id: issue.id });
  console.log(`Deleted issue: ${issue.identifier}`);
}

async function deleteProject(options) {
  const projectInput = options.project?.trim();
  const teamInput = options.team?.trim();

  if (!projectInput) {
    throw new Error("delete-project requires --project");
  }

  const team = teamInput ? await resolveTeamId(teamInput) : null;
  const project = await resolveProjectId(projectInput, team?.id ?? null);
  const query = `
    mutation ProjectDelete($id: String!) {
      projectDelete(id: $id) {
        success
      }
    }
  `;

  await linearRequest(query, { id: project.id });
  console.log(`Deleted project: ${project.name}`);
}

async function main() {
  loadLocalEnv();
  const { command, options } = parseArgs(process.argv);

  if (!command || command === "help" || command === "--help") {
    printHelp();
    return;
  }

  if (command === "teams") {
    await listTeams();
    return;
  }

  if (command === "projects") {
    await listProjects();
    return;
  }

  if (command === "projects-detailed") {
    await listProjectsDetailed();
    return;
  }

  if (command === "labels") {
    await listLabels(options);
    return;
  }

  if (command === "issues") {
    await listIssues(options);
    return;
  }

  if (command === "issues-detailed") {
    await listIssuesDetailed(options);
    return;
  }

  if (command === "create-label") {
    await createLabel(options);
    return;
  }

  if (command === "create-project") {
    await createProject(options);
    return;
  }

  if (command === "update-project") {
    await updateProject(options);
    return;
  }

  if (command === "create-issue") {
    await createIssue(options);
    return;
  }

  if (command === "update-issue") {
    await updateIssue(options);
    return;
  }

  if (command === "delete-issue") {
    await deleteIssue(options);
    return;
  }

  if (command === "delete-project") {
    await deleteProject(options);
    return;
  }

  throw new Error(`Unknown command "${command}"`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
