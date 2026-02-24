# Theme Update Guide - Find & Replace Patterns

Use your IDE's find-and-replace feature (Cmd/Ctrl + Shift + H in VS Code) to batch update components.

## 🔍 Find & Replace Patterns

### 1. Card/Container Backgrounds

**Pattern 1: Basic cards**
```
Find:    className="bg-white/5 border border-white/10
Replace: className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm
```

**Pattern 2: Cards with rounded corners**
```
Find:    bg-white/5 border  border-gray-200 dark:border-white/10 rounded
Replace: bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm rounded
```

### 2. Text Colors

**Pattern 1: Primary text (headings, values)**
```
Find:    text-white
Replace: text-gray-900 dark:text-white
```

**Pattern 2: Secondary text (labels)**
```
Find:    text-white/60
Replace: text-gray-600 dark:text-white/60
```

**Pattern 3: Muted text (descriptions)**
```
Find:    text-white/40
Replace: text-gray-500 dark:text-white/40
```

**Pattern 4: Very muted text (placeholders)**
```
Find:    text-white/20
Replace: text-gray-300 dark:text-white/20
```

### 3. Borders

```
Find:    border-white/10
Replace: border-gray-200 dark:border-white/10
```

```
Find:    border-white/20
Replace: border-gray-300 dark:border-white/20
```

### 4. Input Fields

**Select/Input backgrounds**
```
Find:    bg-white/10 border border-white/20
Replace: bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-white/20
```

**Input text color**
```
Find:    text-gray-900 dark:text-white text-sm
Replace: text-gray-900 dark:text-white text-sm
```

**Placeholder text**
```
Find:    placeholder-white/40
Replace: placeholder-gray-500 dark:placeholder-white/40
```

### 5. Hover States

```
Find:    hover:bg-white/10
Replace: hover:bg-gray-100 dark:hover:bg-white/10
```

```
Find:    hover:bg-white/5
Replace: hover:bg-gray-50 dark:hover:bg-white/5
```

```
Find:    active:bg-white/15
Replace: active:bg-gray-100 dark:active:bg-white/15
```

### 6. Backdrop/Overlay Elements

```
Find:    backdrop-blur-xl
Replace: backdrop-blur-xl shadow-sm
```

## 📝 Manual Review Needed

Some patterns require manual review and cannot be auto-replaced:

### 1. Icon Colors
- Icons should use `text-gray-600 dark:text-white/60` for normal state
- Icons should use `text-gray-900 dark:text-white` for active state

### 2. Badge/Chip Components
```tsx
// Before:
className="bg-blue-500/20 text-blue-300"

// After:
className="bg-blue-500/20 text-blue-600 dark:text-blue-300"
```

### 3. Modal/Dialog Backgrounds
```tsx
// Before:
className="bg-black/90"

// After:
className="bg-white/95 dark:bg-black/90"
```

## 🎯 Priority Files to Update

Based on visibility and user interaction, update these first:

### High Priority (User-facing)
1. `src/components/Task/TaskCard.tsx`
2. `src/components/Task/Kanban.tsx`
3. `src/components/Project/ProjectCardComponent.tsx`
4. `src/components/finance/TransactionCard.tsx`
5. `src/components/finance/TransactionList.tsx`

### Medium Priority (Forms & Inputs)
6. `src/components/Fields/InputField.tsx`
7. `src/components/Fields/FormField.tsx`
8. `src/components/Task/TaskModel.tsx`
9. `src/components/Project/ProjectModelComponent.tsx`

### Lower Priority (Less frequent)
10. `src/components/Task/TagManagement.tsx`
11. `src/components/Task/CalenderView.tsx`
12. `src/components/finance/TransactionFilters.tsx`

## ⚠️ Important Notes

1. **Test After Each File**: Save and check the UI after updating each file
2. **Use Regex if Needed**: Some IDEs support regex in find-replace for more complex patterns
3. **Don't Auto-Replace All**: Review matches before replacing to avoid breaking working code
4. **Marketing Components**: Skip files in `src/components/Marketing/` - they're intentionally dark
5. **Chart Components**: Already updated! ✅

## 🔧 VS Code Specific Tips

1. Open Find & Replace: `Cmd/Ctrl + Shift + H`
2. Enable "Use Regular Expression" (icon: `.*`)
3. Set "files to include": `src/components/**/*.tsx`
4. Set "files to exclude": `src/components/Marketing/**/*.tsx,src/components/Charts/**/*.tsx`
5. Use "Replace All" cautiously - prefer "Replace" one at a time

## ✅ Verification Checklist

After updating, verify:
- [ ] Cards have white backgrounds in light mode
- [ ] Text is dark gray/black in light mode
- [ ] Borders are visible but subtle in light mode
- [ ] Hover states work in both themes
- [ ] No hydration warnings in console
- [ ] Icons are visible in both themes

## 🚀 Quick Test Script

After updates, test both themes:
1. Switch to Light Mode → Check dashboard
2. Switch to Dark Mode → Check dashboard
3. Test form inputs in both modes
4. Check modals/tooltips in both modes
5. Verify charts render correctly in both modes
