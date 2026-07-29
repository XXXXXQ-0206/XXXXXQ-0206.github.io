# Explicit Theme Toggle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an accessible, persisted light/dark theme toggle beside the existing bilingual control without changing the site content, URL, or profile repository.

**Architecture:** A pre-paint bootstrap in `index.html` restores the stored theme before CSS renders. `styles.css` maps the existing palette to system, explicit light, and explicit dark states, while `script.js` owns interaction, persistence, icon state, localized labels, and metadata updates. The existing PowerShell audit becomes the regression gate.

**Tech Stack:** Static HTML, CSS custom properties, vanilla JavaScript, PowerShell audit, GitHub Pages, GitHub Actions.

---

## File Structure

- Modify `index.html`: pre-paint bootstrap, theme metadata id, header control group, and theme button markup.
- Modify `styles.css`: explicit palette selectors plus shared header-control and icon styles.
- Modify `script.js`: theme state, persistence, accessible labels, and independent language/theme interactions.
- Modify `scripts/check-site.ps1`: static regression checks for the new contract.
- Preserve all other site files and content.

### Task 1: Extend The Static Audit Contract

**Files:**
- Modify: `scripts/check-site.ps1`

- [ ] **Step 1: Add failing theme-contract checks**

In the HTML checks, require `id="theme-toggle"`, `class="header-controls"`, `id="theme-color"`, `xq-site-theme`, and both Lucide-compatible icon markers `data-theme-icon="sun"` and `data-theme-icon="moon"`.

In the CSS checks, require `:root[data-theme="light"]`, `:root[data-theme="dark"]`, `.theme-toggle`, and `.header-controls`.

In the JavaScript checks, require `themeStorageKey`, `applyTheme`, `updateThemeControl`, `window.matchMedia`, and `root.dataset.theme`.

- [ ] **Step 2: Run the audit and verify it fails for the unimplemented feature**

Run:

```powershell
pwsh -NoProfile -File .\scripts\check-site.ps1 -RepositoryRoot .
```

Expected: exit `1` with theme-contract failures while all existing language, content, and privacy checks remain clean.

- [ ] **Step 3: Commit the failing gate**

```powershell
git add scripts/check-site.ps1
git commit -m 'test: define explicit theme toggle contract'
```

### Task 2: Add Theme Bootstrap And Header Control Markup

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Make the theme metadata addressable**

Change the theme metadata to:

```html
<meta id="theme-color" name="theme-color" content="#f9f8f4">
```

- [ ] **Step 2: Restore a valid saved theme before the stylesheet paints**

Insert this script before the stylesheet link:

```html
<script>
  (() => {
    try {
      const savedTheme = window.localStorage.getItem('xq-site-theme');
      if (savedTheme === 'light' || savedTheme === 'dark') {
        document.documentElement.dataset.theme = savedTheme;
      }
    } catch {
      // Storage may be unavailable; CSS still follows the system preference.
    }
  })();
</script>
```

- [ ] **Step 3: Group the two header utilities and add the theme button**

Replace the standalone language button with this control group:

```html
<div class="header-controls">
  <button class="theme-toggle" id="theme-toggle" type="button" aria-pressed="false" aria-label="Switch to dark mode" title="Switch to dark mode">
    <svg data-theme-icon="moon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
    </svg>
    <svg data-theme-icon="sun" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" hidden>
      <circle cx="12" cy="12" r="4"></circle>
      <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path>
    </svg>
  </button>
  <button class="language-toggle" id="language-toggle" type="button" aria-pressed="false" aria-label="Switch to Chinese">中</button>
</div>
```

Expected: the moon denotes the next action in light mode; the sun denotes the next action in dark mode.

### Task 3: Add Explicit Theme Palettes And Control Styling

**Files:**
- Modify: `styles.css`

- [ ] **Step 1: Preserve automatic system fallback and add explicit palette selectors**

Keep the current light variables as the base. Change the dark media selector to `:root:not([data-theme])`, add `:root[data-theme="light"] { color-scheme: light; }`, and add `:root[data-theme="dark"]` with the existing dark variable values and `color-scheme: dark`.

The existing dark palette remains:

```css
--paper: #090a0b;
--ink: #f1efe8;
--muted: #a6a59f;
--grid: rgba(240, 238, 230, .12);
--line: rgba(240, 238, 230, .26);
--coral: #ff806d;
--blue: #70a5ff;
--green: #5bc5a3;
--violet: #b39aff;
```

- [ ] **Step 2: Share button geometry and add icon styling**

Use one rule for `.language-toggle, .theme-toggle` so both controls have the same 42px minimum width, border, padding, background, hover, font, and pointer behavior. Add:

```css
.header-controls { justify-self: end; display: flex; gap: 8px; }
.theme-toggle { display: inline-grid; place-items: center; }
.theme-toggle svg { width: 15px; height: 15px; }
.theme-toggle svg[hidden] { display: none; }
```

- [ ] **Step 3: Preserve responsive placement**

In the `max-width: 860px` media query, assign `.header-controls` to grid column 2 and row 1. Remove the old placement rule that targets only `.language-toggle`.

Expected: the two controls remain side by side above the mobile navigation with no horizontal overflow.

### Task 4: Implement Theme State And Accessible Interaction

**Files:**
- Modify: `script.js`

- [ ] **Step 1: Add theme nodes, key, and initial resolution**

Define `themeToggle`, both icon nodes, `themeColor`, `themeStorageKey = 'xq-site-theme'`, and a `theme` value resolved from `root.dataset.theme` or `window.matchMedia('(prefers-color-scheme: dark)').matches`.

- [ ] **Step 2: Add `updateThemeControl`**

The function must:

- set `aria-pressed` to `true` only for dark mode;
- show the sun icon only in dark mode and the moon icon only in light mode;
- localize the action label using the current `language` value;
- set both `aria-label` and `title` to that action;
- update `#theme-color` to `#090a0b` or `#f9f8f4`.

English labels are `Switch to light mode` and `Switch to dark mode`. Chinese labels are `切换到白天模式` and `切换到暗黑模式`.

- [ ] **Step 3: Add `applyTheme` with defensive persistence**

`applyTheme(nextTheme, persist = true)` normalizes to `light` or `dark`, writes `root.dataset.theme`, calls `updateThemeControl`, and stores the value only when persistence is requested. Storage failures are ignored without changing the current visual state.

- [ ] **Step 4: Keep language and theme state independent**

Call `updateThemeControl()` at the end of `applyLanguage()` so the theme action label follows the active language. Add a theme click listener that calls `applyTheme(theme === 'dark' ? 'light' : 'dark')`. Initialize by calling `applyLanguage(language)` and `applyTheme(theme, false)`.

### Task 5: Run Static And Browser Verification

**Files:**
- Verify: `index.html`, `styles.css`, `script.js`, `scripts/check-site.ps1`

- [ ] **Step 1: Run the static audit and whitespace checks**

```powershell
pwsh -NoProfile -File .\scripts\check-site.ps1 -RepositoryRoot .
git diff --check
```

Expected: `Site audit passed.` and both commands exit `0`.

- [ ] **Step 2: Serve the feature branch locally**

Run a static HTTP server from the repository root on `127.0.0.1:4173`. Record the exact command and process id outside the repository, then open `http://127.0.0.1:4173/` with the Browser plugin.

- [ ] **Step 3: Verify the interaction flow**

The flow under test is: site loads -> click theme button -> palette, icon, metadata, and accessible state switch -> reload -> selected theme persists -> language toggles without changing theme.

Verify page identity, meaningful DOM content, no framework overlay, console warnings/errors, and screenshots at desktop and a mobile viewport. Check keyboard focus, the two button labels, graph grid visibility, horizontal overflow, and color contrast.

- [ ] **Step 4: Commit the implementation**

```powershell
git add index.html styles.css script.js scripts/check-site.ps1
git commit -m 'feat: add persisted theme toggle'
```

### Task 6: Pull Request, Pages Deployment, And Isolation Verification

**Files:**
- Remote: `XXXXXQ-0206/XXXXXQ-0206.github.io`

- [ ] **Step 1: Push the feature branch and create a PR**

Create `feat/theme-toggle -> main` with a body that records the audit and browser interaction results. Confirm only the design/plan documents and the four intended implementation files are changed.

- [ ] **Step 2: Wait for repository checks**

Wait for the existing Quality workflow and any Pages-related PR checks to finish successfully. Do not merge queued, skipped, cancelled, neutral, or failing required checks.

- [ ] **Step 3: Squash merge and verify Pages deployment**

Squash merge the PR, delete the feature branch, and wait for the Pages workflow on the merged `main` commit to finish successfully.

- [ ] **Step 4: Verify production and repository isolation**

At `https://XXXXXQ-0206.github.io/`, repeat the desktop/mobile light-dark-language interaction flow and confirm console health. Read back the Pages deployment commit. Separately verify that `XXXXXQ-0206/XXXXXQ-0206` still targets commit `5507d4f9511df349e8ad81be73d7d6d141b6ddc0` and has no new PR or commit from this task.

Do not create or configure `xxxxxq.github.io`, a custom domain, a tag, or a GitHub Release.
