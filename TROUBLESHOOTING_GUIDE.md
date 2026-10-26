# Troubleshooting Guide — Ansible-AI-DevOps-Agent

<!-- DRAFT prepared 2026-10-24 for Vilas's review. The repo's current TROUBLESHOOTING_GUIDE.md is 0 bytes (per the 2026-10-24 flagship audit). Content below is built only from failure modes documented in the audit, README and CONTRIBUTING drafts — it has NOT been tested against a live run of server.js, so commands/paths should be sanity-checked before publishing. -->

Run this only on a machine you control (localhost or a trusted network) — the app executes playbooks and scripts requested through its web UI.

## 1. App won't start / crashes immediately

**Missing OpenAI API key**
- Symptom: startup error or chat answers fail while the UI loads.
- Fix: create `.env` in the repo root (copy `.env.example`) and set a real key:
  ```bash
  cp .env.example .env
  # edit .env: OPENAI_API_KEY=your_openai_api_key_here
  ```
  Never commit a real `.env`. Note: with no key, predefined answers from `public/trainingData.json` may still respond — that is the fallback working, not the LLM.

**Port 3000 already in use**
- Symptom: `EADDRINUSE` / address already in use on `npm start`.
- Fix: stop the earlier instance first (`./stop_app.sh`), or find and stop whatever else is listening on port 3000, then start again with `npm start` or `./start_app.sh`.

**Ansible not found / playbooks fail to run**
- Symptom: playbook requests error out even though the chat responds.
- Check: `ansible --version` and `ansible-playbook --version` work in the same shell/environment the server runs in (Ansible must be on PATH).
- Test a playbook directly before testing it through the UI:
  ```bash
  ansible-playbook ansible/<name>.yml -i ansible/inventory
  ```
  If it fails here, fix the playbook/inventory first — the web UI adds nothing to that failure.

## 2. Login problems

- The seeded login documented in the README is `admin` / `admin123`. If it does not work, confirm you are on a fresh checkout (credentials may have been changed locally) and that you are opening the login page at `/`, not the chat page directly.
- Change the default login before any non-local use.

## 3. Chat answers, but nothing executes

- Confirm the request matches a shipped playbook name in `ansible/` (`ansibletest`, `ansiblehelloworld`, `check_logs`, `check_network`, `check_packages`, `check_processes`, `check_services`, `check_system_resources`, `getosdetails`) or use the UI's list first — `GET /list-playbooks` shows what the server can actually run.
- Vague requests may match a predefined answer in `public/trainingData.json` (fuzzy matching in `server.js`) instead of triggering execution. Rephrase with the exact playbook name, e.g. "Run the Ansible test playbook".

## 4. A playbook runs in terminal but fails through the UI

- Compare the working directory: the server runs playbooks relative to the repo layout (`ansible/` + `ansible/inventory`). Start the server from the repo root.
- Check the streamed output in the browser — the UI returns the real Ansible output, so the first error line there is usually the actual cause (host unreachable in inventory, missing become/sudo rights, or a package task failing on the target).

## 5. Script execution (`/run-script`)

- Scripts must live in the scripts folder the server serves (`public/scripts/shell_scripts/` per the README's extension steps) and be executable (`chmod +x`).
- This endpoint is the highest-risk surface in the app (the codebase itself carries a maintainer note about it). Keep the app local/trusted-network only, and do not expose it while troubleshooting.

## Still stuck?

Open an issue using the templates in `.github/ISSUE_TEMPLATE` and include: the exact chat text you sent, which endpoint/playbook ran, the output you saw vs. expected, and your Node.js and Ansible versions. For anything security-related, follow `SECURITY.md` instead of opening a public issue.
