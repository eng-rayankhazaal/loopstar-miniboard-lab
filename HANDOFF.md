# Handoff
- Base: verify current `main` SHA and clean Git status; seed has no accepted developer cycle yet.
- Cycle 1: task add/edit/complete/remove, accessible keyboard UI, localStorage persistence, unit plus browser tests where available.
- Cycle 2: search/filters/priorities/change history, must start from verified Cycle 1 commit, with regression and restart evidence.
- On interruption: inspect original LoopStar per-project run/step/chat receipts and current Git SHA. Never replay an unknown action. Preserve source and exact rollback base.
- Rollback: revert only the scoped verified commit/patch after reviewing owner changes; never reset/clean or force push.
