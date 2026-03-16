
# Power Pages Q&A (StackOverflow‑style) Starter

A starter pack to build a StackOverflow-like Q&A site on **Microsoft Power Pages**. It
includes Liquid templates (list, detail, layout), CSS/JS assets, and Dataverse
schema guidance. Import this into a Power Pages site using the Power Platform CLI
(`pac pages upload`) after creating the Dataverse tables and permissions.

---
## What you get
- `templates/layout.liquid` — site layout (Bootstrap 5 CDN, header/footer)
- `templates/question_list.liquid` — list of questions with search, tag, and paging
- `templates/question_detail.liquid` — question page with answers
- `templates/ask_question_placeholder.liquid` — placeholder for the *Ask Question* form
- `assets/css/site.css` — minimal styling
- `assets/js/site.js` — small helpers (copy link, vote stub)
- `dataverse/schema.json` — suggested Dataverse tables & columns
- `dataverse/schema.md` — step‑by‑step to create tables, basic forms & lists
- `dataverse/sample-data/*.csv` — seed sample rows (optional)

> **Heads‑up**: The Liquid templates query Dataverse tables by **logical names**
> defined in `dataverse/schema.json`. Make sure your tables/columns use the same
> logical names, or update the templates accordingly.

---
## Prerequisites
1. A Power Pages site connected to Dataverse.
2. **Power Platform CLI** installed (`pac`), version 1.27+ (supports `pac powerpages`/
   `pac pages`, formerly `paportal`).
3. A user with permissions to create tables and upload site content.

**Docs**
- Power Platform CLI *pages* commands: https://learn.microsoft.com/power-platform/developer/cli/reference/pages
- Power Pages Liquid template tags (FetchXML): https://learn.microsoft.com/power-pages/configure/liquid/template-tags
- Table permissions: https://learn.microsoft.com/power-pages/security/table-permissions

---
## Create Dataverse tables
Use **Maker Portal** > **Tables** to create the following tables (or import via solution).
The JSON file `dataverse/schema.json` contains the full logical schema.

### Tables
- **pp_question**
  - `pp_title` (Text, required)
  - `pp_body` (Multiline text)
  - `pp_tags` (Text) — comma separated tags
  - `pp_vote` (Whole Number, default 0)
  - `pp_author` (Lookup Contact)
- **pp_answer**
  - `pp_body` (Multiline text)
  - `pp_vote` (Whole Number, default 0)
  - `pp_questionid` (Lookup to **pp_question**)
  - `pp_author` (Lookup Contact)
- **pp_qtag** *(optional normalized tags)*
  - `pp_name` (Text, primary)
- **pp_question_pp_qtag** *(N:N between question and tag)*

> Keep the **logical names** exactly as shown (table and columns). Update Liquid if you
> change them.

### Table Permissions (Security)
Create web roles (e.g., **Authenticated Users**, **Moderators**), then grant table
permissions:
- **pp_question**: Read (Global for moderators, *Contact* for authors), Create (Contact), Write (Contact), Append/AppendTo as needed.
- **pp_answer**: Read (Parent via Question), Create (Contact), Write (Contact).

Attach these permissions to your web roles. Finally, enable table permissions on
any Lists/Forms you add.

---
## Add pages in Power Pages
You can either create pages in Design Studio and paste the Liquid from `/templates`,
or use the CLI to manage source.

### Option A — Paste Liquid into Web Templates
1. In **Portal Management**, create **Web Templates**: `Layout`, `QuestionsList`, `QuestionDetail`, `AskQuestion`.
2. Paste the contents of each `*.liquid` file.
3. Create **Page Templates** (use `Layout` web template).
4. Create **Web Pages** and associate the page template:
   - `/` → Home → use `QuestionsList`
   - `/questions` → `QuestionsList`
   - `/questions/{id}` → `QuestionDetail` (enable URL parameter `id`)
   - `/ask` → `AskQuestion`
5. Add CSS/JS as Web Files (`/assets/...`) or reference from CDN.

### Option B — Use the CLI (recommended for ALM)
1. Authenticate: `pac auth create --url https://<your-org>.crm.dynamics.com`
2. Select env: `pac org select --environment <env-guid-or-url>`
3. Upload site content from this folder (after you copy files under a website folder):
   `pac pages upload --path <path-to-your-website-folder>`

> See Microsoft docs for `pac pages download/upload` examples and manifest versions.

---
## Wire up the Ask Question form
`templates/ask_question_placeholder.liquid` shows a placeholder. Create a **Basic Form**
for **pp_question** (Insert form on the `/ask` page), then optionally replace the
placeholder with an Entity Form Liquid include or keep the component.

---
## Notes
- Voting buttons are front‑end only in this starter. Wire them to Power Pages Web API
  or Power Automate for real votes.
- Search and tag filters use querystring: `?q=search+terms&tag=javascript`.
- Pagination uses FetchXML paging cookies.

Enjoy! – M365 Copilot
