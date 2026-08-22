# Technical Architecture Overview

> **⚠️ Partly superseded.** For what actually runs, see [[As Built Overview]], [[Codebase Map]] and [[Data Access Layer]].

## Purpose

Defines frontend structure, backend structure, database integration, deployment strategy, and infrastructure decisions.

## Principles

Prioritize:

* Simplicity.
* Maintainability.
* Performance.
* Scalability.
* Low operational overhead.

Support future growth without introducing unnecessary V1 complexity.

## High-Level Architecture

Client -> Next.js Application -> API Layer -> Prisma ORM -> PostgreSQL Database -> Cloudinary Asset Storage.

## Core Stack

* Next.js 15.
* App Router.
* TypeScript.
* Tailwind CSS.
* shadcn/ui.
* Framer Motion.
* Next.js Route Handlers.
* Prisma.
* PostgreSQL.
* Cloudinary.
* Auth.js for admin.
* GA4.
* Vercel.

## User-Approved Stack Extension

The user explicitly approved:

* Three.js.
* GSAP with ScrollTrigger.
* Lenis.js.

See [[User Approved Stack Extension - Three GSAP Lenis]].

## Linked Notes

* [[Frontend Stack]]
* [[Backend Stack]]
* [[Database ORM]]
* [[Asset Management]]
* [[Authentication]]
* [[Deployment]]
* [[Performance SEO Security]]

## Source Trace

Source files: `10-techincal-architecture.md`, `13-master-context.md`, user instruction on 2026-06-10.
