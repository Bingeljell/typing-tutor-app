# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Project Structure & Deployment Checklist

✅ Project files are in repo root (src/, public/, package.json, vite.config.js).  
✅ No nested project folders (avoid typing-tutor-app/typing-tutor-app).  
✅ src/ folder only contains source files → no node_modules/dist here.

✅ .gitignore excludes dist/ and node_modules/ (build artifacts).  
✅ All source files (components, utils, data) are committed (check with `git status` and `git ls-files`).

✅ File names are **consistent and lowercase** where possible (avoid case mismatches).  
✅ Imports match file names exactly → case matters on Netlify (Linux servers).

✅ Netlify build settings:
- Build command → `npm run build`
- Publish directory → `dist`

✅ Netlify deploy log shows:
- Build succeeded
- Site URL working → test it!

✅ Before each push:
- Run `git status` to confirm clean
- Run `npm run dev` to confirm local works
- Push to GitHub → Netlify auto-deploys
