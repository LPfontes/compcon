# Localization & Internationalization (i18n) Guide - COMP/CON

This document describes the architecture and processes implemented to support multiple languages in COMP/CON, with a current focus on the transition to Portuguese (Brazil).

## 1. i18n Architecture

The project uses the `vue-i18n` library to manage UI translations.

- **Locale Files**: Located in `src/locales/`.
  - `en.json`: The source of truth for keys and structure.
  - `pt-BR.json`: Brazilian Portuguese translation.
- **Configuration**: `src/i18n.ts` initializes the plugin, defines the default language, and loads messages.

### Translation Best Practices
- **No HTML in JSON**: Avoid placing HTML tags (like `<b>` or `<span>`) inside JSON files. This prevents security warnings (XSS) and simplifies maintenance.
- **Component Interpolation**: Use `<i18n-t>` in `.vue` components for messages that require specific styling or sub-components within the text.
  - *Example*:
    ```html
    <i18n-t keypath="message.key">
      <template #slot_name><b>Styled Text</b></template>
    </i18n-t>
    ```

## 2. Language Management (Switcher)

The language switching system is centralized and reactive.

- **Component**: `CCLanguageSwitcher.vue` provides the UI for the user.
- **State**: The selected language is stored in the `UserStore` (managed via Pinia).
- **Persistence**: Changing the language triggers a `localStorage` update, ensuring the user's preference is maintained across sessions.

## 3. Lancer Data Proxy

Unlike the UI, compendium data (items, frames, rules) is loaded from external packages (`@massif/lancer-data`).

- **Mechanism**: A `lancer-data-proxy.ts` acts as a middleman.
- **Workflow**: 
  - The proxy observes language changes in the i18n system.
  - When the language changes, the proxy dynamically swaps the dataset loaded in memory without requiring a page reload.
  - If an item lacks a translation in the PT-BR data package, the proxy automatically falls back to the original EN package.

## 4. Impactful Changes & Safety

Several recent modifications were made to ensure system stability:

### Decoding & Security (`Decode.ts`)
- **Problem**: The achievement system and certain decryptions depended on an environment variable (`VITE_ACHIEVEMENT_KEY`) which, if missing, crashed the application.
- **Solution**: We implemented a **fallback** (default key) and added the variable to `.env`. This ensures the application doesn't suffer a fatal crash if environment variables are incomplete.

### TypeScript Type Fixes
- **Data Components**: Refactored components like `CCDiceMenu.vue` to use strict TypeScript interfaces. This removes "never type" errors and ensures mathematical operations with modifiers (e.g., accuracy bonuses) don't fail due to type mismatches between strings and numbers.

## 5. How to Add New Translations

1. Identify the hardcoded string in the `.vue` component.
2. Add the corresponding key to `en.json` (preferably in `common` if generic, or in a feature-specific namespace).
3. Replicate the key in `pt-BR.json` with the translation.
4. Replace the text in the component with `$t('key.path')`.

---
*This guide should be updated whenever new localization infrastructure is added.*
