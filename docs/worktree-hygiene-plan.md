# Worktree Hygiene Plan

This doc is our shared routine for keeping Git clean while we build.

## What "dirty worktree" means

A dirty worktree means the files in the repo do not exactly match the last Git commit.

That usually includes:

- Modified files: existing files changed but not committed yet.
- Untracked files: new files Git can see but is not tracking yet.
- Sometimes staged files: changes selected for the next commit, but not committed yet.

This is normal during active work. The goal is not "never dirty." The goal is "never confusing."

## Main rule

After every major feature, fix, or refactor, pause and decide what should happen next before starting the next big change.

## End-of-task checklist

At the end of every major addition, bug fix, or meaningful code change, we should do this:

1. Run `git status --short`.
2. Review whether the changed files match the work we intended to do.
3. Decide which bucket each change belongs in:
   - keep and commit now
   - keep, but save for later
   - discard because it was accidental or experimental
4. If the work is worth keeping, create a small clear commit or a small set of commits.
5. If the work is not ready, stash it or leave it intentionally uncommitted with a short note in the chat.
6. Before starting the next major task, make sure we both know whether the tree is clean or intentionally dirty.

## Prompt I should use with you

At the end of major work, I should explicitly ask:

"Do you want me to clean up the tree before we move on?"

If helpful, I should also offer one of these next steps:

- commit the finished work
- stash unfinished work
- review the diff together
- leave it as-is for now, but note that the tree is still dirty

## Safe workflow for this repo

When a task is large, use this order:

1. Finish the code change.
2. Run the most relevant verification available, such as build or targeted tests.
3. Check `git status --short`.
4. Group files by purpose.
5. Commit related changes together.
6. Confirm whether anything is intentionally left out.

## Commit grouping guide

Prefer small commits that answer one clear question each.

Good examples:

- "Add tracker calendar page"
- "Add Supabase migration for appointments"
- "Update tracker charts UI"
- "Add visual regression test for galaxy cards"

Avoid giant mixed commits that combine unrelated UI, database, docs, and test changes unless they truly must ship together.

## When not to force a clean tree

It is okay to leave the tree dirty when:

- we are in the middle of a risky change and need a checkpoint first
- the user wants to keep exploring before deciding what to keep
- multiple related files are still being shaped together

In those cases, the important thing is to say so clearly.

## Good closing message template

When I finish a substantial task, I should close with something like:

"The change is in place and verified. The tree is still dirty because of X, Y, and Z. Do you want me to commit this now, stash it, or keep going?"

## Recovery options

If the tree gets messy, use this order of operations:

1. Inspect with `git status` and `git diff --stat`.
2. Create a safety checkpoint before cleanup.
3. Split changes into logical groups.
4. Commit what is ready.
5. Stash what is not ready.
6. Remove only files we are sure we do not want.

## Default agreement for future work

Unless you tell me otherwise, after each major task I should:

1. Tell you whether the worktree is clean or dirty.
2. Summarize what files are involved if it is dirty.
3. Ask whether you want me to commit, stash, review, or leave it alone.

That gives us a repeatable habit and makes Git feel a lot less mysterious.
