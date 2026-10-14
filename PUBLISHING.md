# Publish on GitHub

1. Review `CREDITS.md`, verify the upstream licenses, and add the applicable license files and notices before public distribution.
2. Test the included CSS in Discord. Add a preview screenshot with private conversations and account details removed.
3. Create a GitHub repository named `MVSCord-YoRHa` under your account.
4. Upload the contents of this folder to the repository root, or use Git:

```bash
git init
git add .
git commit -m "Initial MVSCord YoRHa theme"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/MVSCord-YoRHa.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username. After testing and licensing review, create a release tagged `v1.2.5` and attach `MVSCord-YoRHa.theme.css`.

Do not commit personal Discord screenshots, account tokens, or unrelated files. This package contains no user screenshots.
