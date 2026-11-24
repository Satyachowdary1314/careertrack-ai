# CareerTrack AI

A beginner-friendly job application tracker built with plain HTML, CSS, and JavaScript. No server, API key, installation, or paid service is required.

## Features

- Responsive dashboard with light and dark themes
- Add, edit, and delete applications
- Store company, role, salary, recruiter, application date, status, interview date, job link, and notes
- Search by company, role, recruiter, or salary
- Filter applications by status
- Application status analytics
- Monthly interview calendar
- Export application data as CSV
- Save applications and theme preference in browser local storage

## Run the project on Windows

1. Download and install **Visual Studio Code** from [code.visualstudio.com](https://code.visualstudio.com/).
2. Create a folder on your computer named `careertrack-ai`.
3. In Visual Studio Code, choose **File → Open Folder...**, then select `careertrack-ai`.
4. Create the files shown in the project structure:
   - `index.html`
   - `styles.css`
   - `app.js`
   - `README.md`
   - `.gitignore`
5. Copy the contents for each file into the matching file and save with **Ctrl+S**.
6. Open the project folder in File Explorer and double-click `index.html`. The website will open in your default browser.

You can also install the **Live Server** extension in VS Code. After installing it, right-click `index.html` and select **Open with Live Server**. This refreshes the browser when you save code changes.

## Where your data is saved

Applications and theme preference are stored in the browser's local storage on your device. They are not uploaded to a server and do not automatically sync between browsers or devices. Clearing the browser's site data may delete them. Export a CSV backup periodically if you want to keep a separate copy.

## Create a GitHub repository and upload the project

1. Create a GitHub account at [github.com](https://github.com/) if you do not already have one.
2. Sign in, select the **+** button in the upper-right corner, then choose **New repository**.
3. Enter a repository name, such as `careertrack-ai`.
4. Choose **Public** if you want to use GitHub Pages for free.
5. Leave **Add a README file** unchecked if you already created the README locally.
6. Select **Create repository**.
7. On the new repository page, choose **uploading an existing file**.
8. Open your `careertrack-ai` folder in File Explorer. Drag `index.html`, `styles.css`, `app.js`, `README.md`, and `.gitignore` into the GitHub upload area.
9. Enter a commit message such as `Add CareerTrack AI website`.
10. Select **Commit changes**.

### Upload with Git (optional)

If Git is installed, you can upload from PowerShell:

1. On the repository page, select **Code**, copy the HTTPS URL, and replace the example URL below with it.
2. Open PowerShell and change directory to your project folder. For example:

   ```powershell
   cd $HOME\Desktop\careertrack-ai
   ```

3. Run these commands:

   ```powershell
   git init
   git add .
   git commit -m "Add CareerTrack AI website"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/careertrack-ai.git
   git push -u origin main
   ```

4. If Git asks you to sign in, follow the browser sign-in prompt.

## Deploy with GitHub Pages

1. Open your repository on GitHub.
2. Select **Settings**.
3. In the left sidebar, select **Pages** (usually under **Code and automation**).
4. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
5. Choose the `main` branch and the `/(root)` folder.
6. Select **Save**.
7. Wait a few minutes, then refresh the Pages settings. GitHub will show your website URL, usually:
   `https://YOUR-USERNAME.github.io/careertrack-ai/`
8. Open that URL to see your deployed site.

After making changes, upload/commit them to the same branch. GitHub Pages will publish the updated site automatically.

## Project structure

```text
careertrack-ai/
├── index.html    # Page structure and form
├── styles.css    # Layout, colors, and responsive styles
├── app.js        # Application logic and local storage
├── README.md     # Project and setup instructions
└── .gitignore    # Files Git should ignore
```

## Troubleshooting

- If the page looks unstyled, check that `styles.css` is in the same folder as `index.html` and the file name is spelled exactly right.
- If buttons do not work, check that `app.js` is in the same folder and spelled exactly right.
- If GitHub Pages shows a 404, confirm the repository has an `index.html` in its root and that Pages is configured to deploy from the correct branch and `/(root)` folder.
- If your changes are not visible after deployment, wait a few minutes and refresh the page. A hard refresh on Windows is **Ctrl+F5**.