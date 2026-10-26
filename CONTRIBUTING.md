# Contributing to Ansible-AI-DevOps-Agent

<!-- Draft revision: this replaces the current CONTRIBUTING.md, whose setup section references a .env.example and Docker files that don't exist in the repo yet. This version describes the setup that actually works today. -->

Thanks for your interest. This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). Security issues: please follow [SECURITY.md](SECURITY.md) instead of opening a public issue.

## Run it locally

Prerequisites: Node.js 20+ (npm 8+), Ansible, Git, and an OpenAI API key.

```bash
git clone https://github.com/<your-username>/Ansible-AI-DevOps-Agent.git
cd Ansible-AI-DevOps-Agent
npm install
echo "OPENAI_API_KEY=your_actual_api_key_here" > .env
npm start            # http://localhost:3000, login admin / admin123
# development: npm run dev (nodemon)
```

Notes that will save you time:

- The server entry point is `server.js`; the UI lives in `public/` (login at `/`, chat at `public/aiagent.html`).
- Predefined (non-LLM) answers come from `public/trainingData.json`; matching logic (including the Levenshtein fuzzy matcher) is in `server.js`.
- Test playbooks directly before testing them through the UI: `ansible-playbook ansible/<name>.yml -i ansible/inventory`.
- There is **no automated test suite yet** — `npm test` is still the npm placeholder. Say in your PR how you verified your change manually (see good first issue #3).

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

1. **Write the troubleshooting guide.** `TROUBLESHOOTING_GUIDE.md` exists in the root but is 0 bytes. Seed it from real failure modes: missing `OPENAI_API_KEY`, Ansible not on PATH, port 3000 already in use (see `start_app.sh`), and login problems.
2. **Add the missing `.env.example`.** CONTRIBUTING and onboarding docs tell users to copy/setup an env file, and the README creates `.env` with an echo — but no `.env.example` exists in the repo. Add one with `OPENAI_API_KEY` (and any other variables `server.js` actually reads, verified from the code).
3. **Give the project its first automated tests.** `package.json`'s test script is `echo "Error: no test specified" && exit 1`. A minimal suite (e.g. Node's built-in test runner) hitting `/list-playbooks` and the fuzzy-matching function would replace the placeholder and give every future PR a safety net.
4. **Stop shipping `node_modules/`.** The repository tree contains a committed `node_modules/` directory despite a `.gitignore`. Remove it from version control and verify a fresh clone + `npm install` still runs, so clones stop downloading dependencies twice.
5. **Resolve the `/run-script` note in `server.js`.** The code carries the author's own comment — "Endpoint to run a shell script present at script folder — need to remove". Either harden and document the endpoint (path restrictions are partially there; one script is already block-listed in code) or remove it and update the README table. This one needs a maintainer discussion first — open an issue before coding.
