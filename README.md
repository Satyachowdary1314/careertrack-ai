# BenchTrack CRM

BenchTrack CRM is a responsive, browser-based prototype for C2C bench sales and IT staffing marketing teams. It replaces scattered tracking sheets with linked consultant, recruiter/vendor, submission, call, interview and follow-up records. It uses plain HTML, CSS and JavaScript and requires no paid service, build step or API key.

## Features

- Dashboard metrics for submissions, incoming/outgoing/missed calls, vendors, active consultants, follow-ups, interviews, placements and conversion rates.
- Date-range filtering for submission and call activity; employee-wise activity visualization.
- CRUD screens for consultants, vendor/recruiter contacts, submissions, calls, interviews and follow-ups, with search, status filtering and sorting.
- Unique generated record and submission IDs, timestamps, consultant/vendor/submission relationships, duplicate contact warning and duplicate submission warning.
- Click-to-call and click-to-email links; interview schedule and follow-up reminders.
- CSV export for modules and activity, employee and conversion reports; CSV import for all record types.
- Portable JSON backup and restore, responsive layout, and persistent light/dark mode.
- Fictional sample records only. Seeded email addresses use the reserved `example.test` domain and phone numbers use fictional 555 ranges.

## Run locally

1. Download or clone this repository.
2. Open `index.html` in a current desktop or mobile browser. Optionally use VS Code Live Server for automatic refresh.
3. All records are stored in browser `localStorage` under `benchtrack-crm-v1`. Data remains on this browser/device and does not sync to another user or device. Use **Reports → Download backup** regularly.

No npm install, server, paid service, credentials, or API keys are needed.

## CSV import format

Choose **Reports → Import CSV**, select a record type and upload a UTF-8 CSV. Headers should match the field keys used in the form, such as `name`, `technology`, `company`, `recruiter`, `position`, `jobId`, `status`, `direction`, `dateTime`, `dueDate`, `employee`, and `notes`. Unknown columns are ignored. Relationship fields should contain the corresponding internal record ID; import consultants/vendors first, then link records by editing them. CSV import is additive and does not automatically deduplicate entries. Export the current JSON backup before importing substantial data.

## Data model and future backend

Each entity has a unique `id`, `createdAt` and `updatedAt`; submissions also get a display-facing `submissionId`. Foreign-key style ID fields connect submissions, calls, interviews and follow-ups to related records. `loadDB()` and `persist()` isolate the storage adapter from the interface, so they can be replaced by API calls to a Supabase/PostgreSQL service.

This prototype deliberately has no authentication, authorization, server-side validation, encryption, or multi-user synchronization. Browser localStorage is not a secure data store. Before production use, implement a backend with row-level access policies, authenticated employee accounts and administrator roles, server-enforced relationships, audit logging, backups, and appropriate handling of consultant contact and work-authorization data. Do not use this demo with real sensitive personal information.

## Replace project files and push to your existing GitHub repository

The existing repository is `https://github.com/Satyachowdary1314/careertrack-ai`. Replace the root `index.html`, `styles.css`, `app.js`, `README.md`, and `.gitignore` with the versions in this project. Keep the filenames and root-level locations unchanged. The `.gitignore` below is suitable for the static prototype.

### Using Git on Windows PowerShell

1. Install Git if needed and open PowerShell in your existing local project folder.
2. Make a backup copy of the current folder before replacing files. Copy the updated five files into the folder and overwrite the old versions.
3. Run:

   ```powershell
   git status
   git add index.html styles.css app.js README.md .gitignore
   git commit -m "Replace CareerTrack AI with BenchTrack CRM"
   git push origin main
   ```

4. If your local checkout has no `origin`, add it once with `git remote add origin https://github.com/Satyachowdary1314/careertrack-ai.git`. If your current branch is not `main`, push your current branch or open a pull request instead of forcing a push.

### Using GitHub in a browser

Open the existing repository, select each of the five files, choose **Edit this file**, replace its full contents, and commit the changes. You can also use **Add file → Upload files** to upload all five replacements together. Review the diff before committing. Do not create a new repository for this update.

## Optional GitHub Pages

This is a static website. In the repository **Settings → Pages**, deploy from the desired branch and root folder. After publication, open the Pages URL. GitHub Pages hosts the interface but does not centralize localStorage records across users.

## Project structure

```text
careertrack-ai/
├── index.html    # BenchTrack CRM page structure
├── styles.css    # Responsive enterprise interface and themes
├── app.js        # Data model, browser storage, reports and interactions
├── README.md     # Setup, data, privacy and Git instructions
└── .gitignore
```
