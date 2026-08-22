# Agent Instructions

> **ℹ️ Updated read order.** Start at [[As Built Overview]] and [[Regression Traps Index]] before touching code. See [[Claude Code Query Guide]].

## Before Any Implementation

1. Read [[00_Index]].
2. Read [[Global Rules]].
3. Read [[17_Forbidden_Things]].
4. Read the relevant page/screen note.
5. Read linked flow notes.
6. Read linked data/content/database/API notes.
7. Check [[15_Open_Questions]].
8. Check [[16_Conflicts]].
9. Only then propose or edit files.

## Claude Code Executor Note

Claude Code is the expected implementation executor. Keep prompts precise and point Claude Code to the exact vault notes it must read.

## Stack Note

The original architecture uses Framer Motion. The user has explicitly approved Three.js, GSAP ScrollTrigger, and Lenis.js. Use them only where they serve premium immersive or scroll-driven experience.

## Implementation Behavior

* Do not invent requirements.
* If an open question blocks implementation, stop and report it.
* Keep changes scoped to the requested feature.
* Prefer small, reviewable changes.
* Update relevant vault notes when implementation decisions are made.
* End every coding task with changed files, tests run, and remaining risks.

## Source Trace

Source files: `11-rules.md`, `12-dontdo.md`, `13-master-context.md`, `14-project-bootstrap.md`, user instruction on 2026-06-10.
