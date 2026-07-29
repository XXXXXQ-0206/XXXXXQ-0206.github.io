# Theme Toggle Design

## Scope

Add an explicit light/dark theme toggle to the existing bilingual Research Notebook site at `XXXXXQ-0206/XXXXXQ-0206.github.io`.

The change is isolated to that Pages repository. The existing profile README repository remains untouched. The alternate `xxxxxq.github.io` URL is out of scope because it belongs to a different GitHub account and will not be configured.

## User-Visible Design

The header keeps the current language switch and gains a neighboring theme button with the same compact rectangular shape, border, spacing, and monospace label treatment. The theme button uses a familiar sun/moon icon, an accessible name, keyboard focus styling, and a tooltip/title. It shows the next action: a sun in dark mode and a moon in light mode.

The page remains a graph-paper Research Notebook. Light mode uses the existing warm white paper, dark ink, and muted gray grid. Dark mode uses near-black paper, light ink, and a low-contrast light grid. Coral, blue, green, and violet accents remain unchanged so the code note, research cards, and handwritten annotations retain their color coding in both themes.

The language and theme controls are independent. Switching language does not change theme; switching theme does not change language. The existing mobile header layout remains intact, with the controls staying reachable without horizontal overflow.

## Behavior And State

1. On first load, the page follows `prefers-color-scheme` when no user choice exists.
2. A click switches directly between light and dark mode.
3. The selected value is stored under `xq-site-theme` in `localStorage`.
4. On reload, a stored choice wins over the operating-system preference.
5. If storage is unavailable, the page remains fully usable for the current session.
6. The root element receives `data-theme="light"` or `data-theme="dark"`; CSS owns all visual changes.
7. The document `color-scheme` and `theme-color` metadata track the active theme.

## Implementation Boundaries

- `index.html`: add a compact control group beside the language button and a pre-paint theme bootstrap so a stored choice does not flash the wrong palette.
- `styles.css`: move the existing dark-mode variables into explicit `[data-theme="dark"]` and `[data-theme="light"]` rules, retaining system preference only as the no-choice fallback. Add icon sizing and button-state styles without changing page geometry.
- `script.js`: add theme state, persistence, icon/label updates, and a language-aware accessible label. Keep the current translation flow and storage behavior intact.
- No framework, dependency, route, asset, or content changes are required.

## Accessibility And Safety

- Use a real `<button type="button">` with `aria-pressed`, a localized `aria-label`, and a `title`.
- Use inline Lucide-compatible sun/moon SVG markup with `aria-hidden="true"`; do not rely on color alone to communicate state.
- Preserve `:focus-visible`, reduced-motion behavior, semantic headings, and skip navigation.
- Do not read or modify browser cookies, credentials, or unrelated local storage keys.

## Verification

- Confirm the page identity and meaningful content at `https://XXXXXQ-0206.github.io/`.
- In light mode, click the theme control and verify dark paper, light ink, and a visible low-contrast grid.
- Click again and verify the light palette returns; reload and confirm the choice persists.
- Toggle language in both themes and confirm content changes without theme changes.
- Check keyboard focus and accessible label/state for both header controls.
- Check desktop and mobile widths for clipped controls or horizontal overflow.
- Confirm no console errors and confirm the profile repository URL remains unchanged.
