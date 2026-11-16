# Product Context: Divani Fabric Roll Inventory

Short brief for AI agents. Full docs (PRD, DB design, ADR, wireframes) are in the Obsidian vault: `Divani/Internal tools development/Inventory management`. Visual design system: `design-system/design.md`.

## What it is
Internal QR-code tool for Divani (curtains/blinds). Sales reserve fabric when they quote, the factory logs what it cuts, and the app calculates balances so fabric is never oversold. v1 is a pilot with 10+ existing fabrics, metres only (no cost, no reorder alerts).

## Why
Fabric ships from China (~2 months). It is stored at the factory, while sales sit in Penang and can't see the shelf. Several salespeople quote the same fabric, so it gets oversold and restocked too late.

## Users (about 10)
- **Sales:** personal logins. Check stock, reserve, confirm into worksheets.
- **Factory:** one shared login, picks "who is cutting" by name. Uses own phone, no app install.
- Mobile-first PWA. Staff scan a QR, one per fabric, to open its stock card.

## Core model
- **Fabric (item)** has many **batches**. One batch = one roll, code `YYMM-letter` (e.g. `2611-A`), system-assigned, letters I/O skipped, never merged.
- **Reservation:** quotation-stage estimate, queued first come first served, cancellable by its owner. Affects the reserve balance only.
- **Worksheet:** confirmed order, itemised by room, may mix fabrics. Each line holds **confirmed metres** (sales) and **actual metres** (factory). Both are kept, and the factory's figure wins.
- **Movement:** insert-only ledger (receive / cut / adjust). On hand is derived, never typed over.

## Job stages
Consultation (not tracked) → Quotation (reservation) → Confirmed → Worksheet created → Sewing in progress → Sewing completed.
Side state: **Waiting for stock**. Confirmed, but the fabric isn't here yet. It is hidden from the factory and auto-promoted when the whole line fits.
(The stage split is a proposal; the PRD still has 5 stages.)

## Balances (stock card)
- **Actual balance** = on hand − unfinished worksheet metres. Source of truth, **never negative**. Over-cuts are blocked.
- **Reserve balance** = actual − waiting − reservations. **May go negative** (shown red). It tells sales how much to buy.
- Roll status (Active / Remnant / Used up) is proposed. Remnants would not count in the actual balance.

## UX principles
- The fabric SKU is the primary view. Rolls are secondary (factory use).
- Every action is a scan plus one or two fields. Adoption is the main risk.
- Show waiting lines separately from reservations, with a clear label.

## Components and layout
- Follow the **atomic design** framework: atoms → molecules → organisms → templates → pages. Build small parts first and compose upward.
- Mobile-first web app. Mobile has a bottom navigation bar; desktop layout differs slightly.
- Rules for design tokens and Storybook are in `AGENTS.md`.

## Stack
Next.js (App Router, TS), Supabase Postgres (Singapore) with business rules and constraints in the DB, Vercel, PWA. Repo: `Yi-Xuen/DVN-Inventory-Management`. The current prototype uses sample data in localStorage only.

## Open items
Worksheet numbering format (`1001-1` vs `0714 1A`), the pilot fabric list, factory user names, and the stage 4 name.
