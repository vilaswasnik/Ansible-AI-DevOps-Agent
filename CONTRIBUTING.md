# Contributing to Ansible-AI-DevOps-Agent

Thanks for your interest. This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). Security issues: please follow [SECURITY.md](SECURITY.md) instead of opening a public issue.

## Run it locally

Prerequisites: Node.js 20+ (npm 8+), Ansible, Git, and an OpenAI API key.

```bash
git clone https://github.com/<your-username>/Ansible-AI-DevOps-Agent.git
cd Ansible-AI-DevOps-Agent
npm install
cp .env.example .env   # edit .env: set OPENAI_API_KEY and ADMIN_PASSWORD
npm start            # http://localhost:3000 — log in with the .env admin credentials
# development: npm run dev (nodemon)
```

Notes that will save you time:

- The server entry point is `server.js`; the UI lives in `public/` (login at `/`, chat at `public/aiagent.html`).
- Predefined (non-LLM) answers come from `public/trainingData.json`; matching logic (including the Levenshtein fuzzy matcher) is in `server.js`.
- Test playbooks directly before testing them through the UI: `ansible-playbook ansible/<name>.yml -i ansible/inventory`.
- There is **no automated test suite yet** — `npm test` is still the npm placeholder. Say in your PR how you verified your change manually (see good first issue #1).

## Filing an issue

Use the templates in `.github/ISSUE_TEMPLATE`. A useful report includes: what you asked the chat (exact text), which endpoint/playbook ran, the output you saw vs. expected, and your Node and Ansible versions. For execution/safety concerns (something ran that shouldn't have), lead with that in the title.

## PR process

1. Fork, branch from `main`, keep the change to one concern.
2. For new playbooks: put them in `ansible/`, name them for what they check/do (`check_*` for read-only checks), and make read-only checks the default posture — a playbook that changes state should say so in its name and in the PR description.
3. For server changes: don't add new execution paths lightly. Every endpoint that can run something is a security decision; explain the guardrails in the PR.
4. Update the README endpoint table / playbook list if your change adds or renames either.
5. Maintainer review merges. Expect questions on anything touching `/run-playbook`, `/run-script`, or authentication.

## Good first issues

Concrete starting points, each tied to evidence in the repo:

1. **Give the project its first automated tests.** `package.json`'s test script is `echo "Error: no test specified" && exit 1`. A minimal suite (e.g. Node's built-in test runner) hitting `/list-playbooks` and the fuzzy-matching function would replace the placeholder and give every future PR a safety net.
2. **Stop shipping `node_modules/`.** The repository tree contains a committed `node_modules/` directory despite a `.gitignore`. Remove it from version control and verify a fresh clone + `npm install` still runs, so clones stop downloading dependencies twice.
3. **Resolve the `/run-script` note in `server.js`.** The code carries the author's own comment — "Endpoint to run a shell script present at script folder — need to remove". Either harden and document the endpoint (path restrictions are partially there; one script is already block-listed in code) or remove it and update the README table. This one needs a maintainer discussion first — open an issue before coding.
