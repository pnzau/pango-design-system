---
name: pango-design
description: Use this skill to generate well-branded interfaces and assets on the Pango design system — a near-monochrome system for dense operational software (dashboards, schedules, consoles, inventory, back-office finance) in any industry, with light and dark themes. Contains design guidelines, tokens, fonts, assets, and UI kit components for prototyping or production.
user-invocable: true
---

Read the readme.md file within this skill, and explore the other available files.
The system is industry-neutral: statuses are tones, categorical colour is eight hues you
assign, currency is a setting, and the tile-grid pattern describes any fixed inventory.
Set `data-theme="light"` or `"dark"` on `<html>`; read tokens, never hardcode a hex.
If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.
If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.
