# Task Manager — Design Handoff (Dir A)

Drop the files from this folder into your `mobile-task-manager` project.

---

## File map

| This file | Replaces / goes into |
|---|---|
| `App.js` | `App.js` (root) |
| `src/utils/theme.js` | `src/utils/theme.js` (new) |
| `src/components/Header.js` | `src/components/Header.js` |
| `src/components/FABGroup.js` | `src/components/FABGroup.js` (new) |
| `src/components/TimelineGrid.js` | `src/components/TimelineGrid.js` |
| `src/components/AlarmPopup.js` | `src/components/AlarmPopup.js` |
| `src/modals/AddTaskModal.js` | `src/modals/AddTaskModal.js` |
| `src/modals/AddMemberModal.js` | `src/modals/AddMemberModal.js` |

Keep unchanged:
- `src/TaskContext.js`
- `src/i18n/`
- `src/utils/colors.js` (still used by TaskContext)

---

## 1. Install new dependency

```bash
npm install @gorhom/bottom-sheet @gorhom/portal \
  react-native-gesture-handler react-native-reanimated
```

For iOS:
```bash
cd ios && pod install
```

Add to `babel.config.js`:
```js
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: ['react-native-reanimated/plugin'], // ← add this
};
```

---

## 2. Add Space Mono font (optional but recommended)

Download from [Google Fonts](https://fonts.google.com/specimen/Space+Mono) and add the `.ttf` files to `assets/fonts/`. Then in `react-native.config.js`:

```js
module.exports = {
  assets: ['./assets/fonts/'],
};
```

Run `npx react-native-asset` to link.

If you skip this, replace `'SpaceMono-Regular'` / `'SpaceMono-Bold'` with `'Courier New'` in `theme.js`.

---

## 3. Update i18n (add missing key)

In `src/i18n/locales/en-US.js` add:
```js
addMemberModal: {
  title: 'New Member',
}
```

---

## Design tokens at a glance

| Token | Value | Used for |
|---|---|---|
| `C.sky` | `#38bdf8` | Task FAB, primary CTA |
| `C.violet` | `#a78bfa` | Member FAB, member CTA |
| `C.emerald` | `#34d399` | Auto 3rd member color |
| `C.red` | `#f87171` | Now-line, alarm |
| `C.bg0` | `#0f172a` | App background |
| `C.bg1` | `#1e293b` | Surfaces/header |
| `C.bg2` | `#334155` | Borders |
