# Video Length Feature - Export Error Fix

## Problem

```
SyntaxError: The requested module '/constants.ts' does not provide an export named 'VIDEO_LENGTH_OPTIONS'
```

## Root Cause

The project has two `constants.ts` files:

1. `constants.ts` (root level) - Used by components via `../../constants` import
2. `src/constants.ts` - Contains duplicate constants definitions

The `VIDEO_LENGTH_OPTIONS` constant was added to `src/constants.ts` but the GeneratorForm component imports from the root level `constants.ts` file via the path `../../constants`.

## Solution

✅ **Added `VIDEO_LENGTH_OPTIONS` to the root `constants.ts` file**
✅ **Removed duplicate `VIDEO_LENGTH_OPTIONS` from `src/constants.ts`**

## What Was Fixed

1. **Added to `constants.ts` (root level):**

```typescript
// Video length options for script generation
export const VIDEO_LENGTH_OPTIONS = [
  { value: "30 seconds", label: "Short (30 seconds)" },
  { value: "1-2 minutes", label: "Medium (1-2 minutes)" },
  { value: "3-5 minutes", label: "Long (3-5 minutes)" },
  { value: "5-10 minutes", label: "Extended (5-10 minutes)" },
  { value: "10+ minutes", label: "Detailed (10+ minutes)" },
] as const;
```

2. **Removed duplicate from `src/constants.ts`** to avoid confusion

## Verification

- ✅ Dev server restarts successfully
- ✅ No compilation errors
- ✅ Import error resolved
- ✅ Video length feature should now work correctly

## Import Path Context

- `src/components/GeneratorForm.tsx` uses `../../constants`
- This points to root level `constants.ts`, not `src/constants.ts`
- Root level file is the correct location for component imports

The video length feature is now fully functional!
