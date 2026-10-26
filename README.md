# Ansible-AI-DevOps-Agent

**Run Ansible from a chat window.** Type what you want in plain English — "run the Ansible test playbook", "get OS details", "what playbooks are available?" — and this Node.js/Express app answers through OpenAI, executes the matching playbook or script, and streams the real output back to your browser.

<!-- TODO(author): add a screenshot of the chat UI + a playbook run before publishing. -->

> ⚠️ **Run this only on a machine you control.** By design, the app executes playbooks and scripts requested through its web UI. Keep it on localhost or a trusted network, and set a strong admin password via `.env` before exposing it anywhere.

## What it does

- **Chat-driven automation** — natural-language requests in a web UI (`public/aiagent.html`), answered via the OpenAI API with a fallback to predefined answers (`public/trainingData.json`) matched with fuzzy (Levenshtein) matching in `server.js`.
- **Real playbook execution** — ships with working playbooks in `ansible/`: `ansibletest`, `ansiblehelloworld`, `check_logs`, `check_network`, `check_packages`, `check_processes`, `check_services`, `check_system_resources`, `getosdetails`, plus an inventory.
- **Script execution** — shell scripts placed in the scripts folder can be listed and run through the same interface.
- **Simple process management** — `start_app.sh` / `stop_app.sh` helpers, or plain `npm start`.

## Quickstart

Prerequisites: Node.js 20+, Ansible, and an OpenAI API key.

```bash
git clone https://github.com/vilaswasnik/Ansible-AI-DevOps-Agent.git
cd Ansible-AI-DevOps-Agent
npm install

cp .env.example .env   # then edit .env: set OPENAI_API_KEY and ADMIN_PASSWORD

npm start
# or: ./start_app.sh   (stop with ./stop_app.sh)
```

Open **http://localhost:3000** and log in with the admin account defined in your `.env` (`ADMIN_USERNAME` / `ADMIN_PASSWORD`). The server creates that account at startup only when `ADMIN_PASSWORD` is set — there is no built-in default password.

Try:
- *"Run the Ansible test playbook"*
- *"Execute hello.sh script"*
- *"Get OS details using Ansible"*
- *"What playbooks are available?"*

## API endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/chat` | POST | AI chat interface |
| `/run-playbook` | POST | Execute an Ansible playbook |
| `/list-playbooks` | GET | List available playbooks |
| `/run-script` | POST | Execute a shell script from the scripts folder |

## Extend it

Add a playbook:

```bash
touch ansible/my-playbook.yml
ansible-playbook ansible/my-playbook.yml -i ansible/inventory   # test it directly first
```

Add a script:

```bash
touch public/scripts/shell_scripts/my-script.sh
chmod +x public/scripts/shell_scripts/my-script.sh
```

## Try it / run a POC

A sensible first evaluation is read-only: clone it on a throwaway VM, start it, and run the `check_*` playbooks (logs, network, packages, processes, services, system resources) against localhost via chat. You'll see the full loop — natural language in, Ansible out, output streamed back — without touching anything you care about. Then add one playbook of your own using the steps above and ask for it in the chat.

If you evaluate it for a team, the questions worth answering are the security ones: who can reach port 3000, what the app is allowed to execute, and how you would put your own authentication in front of it. The codebase is small (start with `server.js`) and readable in one sitting, which is deliberate.

## Tech stack

Node.js · Express · Ansible · OpenAI API

## Project layout

```text
server.js            # Express server: chat, playbook and script endpoints
public/              # web UI (login.html, aiagent.html), scripts, training data
ansible/             # playbooks + inventory
start_app.sh         # start helper
stop_app.sh          # stop helper
```

## Screenshots / demo

<!-- TODO(author): capture the chat UI answering "what playbooks are available?" and one check_* run. -->

_Planned:_ chat UI · a `check_system_resources` run end to end.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) — and note the existing [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) and [SECURITY.md](SECURITY.md). New playbooks, endpoint tests, and documentation fixes are the most useful first contributions.

## Talk to the author

Running Ansible at scale and curious about conversational front-ends for it — or already tried something similar? Open a GitHub Issue, or a Discussion if enabled. Playbook requests and honest security critiques are both welcome.

— Vilas Wasnik, Senior Linux & DevOps Engineer · GitHub [@vilaswasnik](https://github.com/vilaswasnik)

## License

MIT — see [LICENSE](LICENSE). © 2025 Vilas Wasnik.
