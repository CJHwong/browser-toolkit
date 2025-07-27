# 🧰 Browser Toolkit

A curated collection of independent, browser-based tools and utilities.

## 🚀 Live Demo

Visit the live deployment here: **[https://cjhwong.github.io/browser-toolkit/](https://cjhwong.github.io/browser-toolkit/)**

## 🎯 Guiding Principles

- **Browser-Based:** All tools run directly in the web browser.
- **Independent:** Each tool is self-contained and can be developed and deployed separately.
- **Static Hosting:** The entire project is deployable on static hosting services like GitHub Pages.
- **Modern & Maintainable:** We encourage the use of modern frameworks and best practices to ensure the toolkit is easy to maintain and extend.

## 📁 Repository Structure

The project uses a monorepo structure managed by npm workspaces.

```plaintext
browser-toolkit/
├── index.html              # The main landing page
├── tools/                  # Contains the source code for each individual tool
│   └── [tool-name]/
├── docs/                   # Contains the built, production-ready files for deployment
├── scripts/                # Contains build and deployment scripts
└── package.json            # Root configuration for npm workspaces
```

## 🔧 Development

### **Adding a New Tool**

1. **Create a directory** for the new tool inside the `tools/` folder.
2. **Initialize your project** (e.g., with `touch index.html`, `npm init`, `npx create-react-app`, etc.).
3. **Add a card** for the new tool to the main `index.html` landing page.

## 🎯 Tool Requirements

While the toolkit is flexible, new contributions should aim to be:

- **Client-Centric:** The core logic should run on the client-side. While some tools may require a backend service (like Firebase), they should still present a user-facing interface that runs in the browser.
- **Self-Contained:** Tools should have minimal dependencies on other tools within the repository.
- **Responsive:** All tools should be designed to work well on both desktop and mobile devices.
- **Secure:** Be mindful of security best practices, especially when handling user input or connecting to external services.

## 🚀 Deployment

The project is deployed using a script that builds each tool and places the static assets in the `docs/` directory, which is then served by GitHub Pages. A cache-busting mechanism is in place to ensure users receive the latest version on each deployment.

```bash
# 1. Build all tools for production
bash scripts/build.sh

# 2. Deploy the built files to GitHub Pages
bash scripts/deploy.sh "Your commit message"
```
