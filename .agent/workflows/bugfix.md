---
description: Reproduce → isolate → fix → prevent regression
---

# Bug Fix Workflow

1. **Reproduce**
   - Identify the bug clearly.
   - Create a reproduction step or script (prefer automated test).
   - Confirm the bug exists.

2. **Isolate**
   - Trace the issue to a specific component or line of code.
   - Understand *why* it is happening.

3. **Fix**
   - Create a plan in `implementation_plan.md`.
   - Implement the fix.
   - Ensure no regressions (run existing tests).

4. **Verify**
   - Run the reproduction set confirmation.
   - Ask user to verify.
   - Document in `walkthrough.md`.
