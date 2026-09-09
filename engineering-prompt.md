# Engineering Prompt for a RERA XML Feed Integration

Copy the prompt below into your coding agent and replace the values in angle brackets. Give the agent access to the target project's repository and development environment.

```text
You are implementing a production-ready RERA XML v2 feed in an existing software project.

Inputs
- Target project repository: <TARGET_PROJECT_REPOSITORY_URL_OR_PATH>
- RERA specification repository: https://github.com/ReraLtd/xml-feed-specification.git
- Desired public feed URL or output path: <FEED_URL_OR_OUTPUT_PATH>
- Optional project-specific constraints: <CONSTRAINTS_OR_NONE>

Primary goal
Add generation and publication of a complete RERA XML v2 feed by reusing the target project's existing entities, fields, repositories, services, media URLs, configuration, background jobs, and deployment flow. Keep the implementation native to the project's current architecture and conventions.

Non-negotiable constraints
- Do not create new domain entities, database tables, columns, migrations, relationships, seed data, or persistent records for the integration.
- Do not write to, mutate, or backfill the project's database. Feed generation must read existing data only.
- Do not change existing business behavior or listing lifecycle rules.
- Do not fabricate values for fields that the project does not contain. Report data gaps explicitly. Omit optional XML elements when the specification permits it; stop and report a blocker when a required value cannot be sourced safely.
- Do not introduce a parallel architecture or make broad refactors. Prefer the project's existing query layer, serializers/presenters, background-job system, scheduler, configuration, storage, routing, and test patterns.
- Integration-only adapters, queries, serializers, value objects, or in-memory DTOs are allowed when necessary, but they must not become new persisted domain entities.
- Preserve unrelated local changes and follow all repository instructions.

Phase 1 — Load the authoritative RERA documentation through MCP
1. Clone the RERA specification repository if it is not already available:
   git clone https://github.com/ReraLtd/xml-feed-specification.git
2. In the cloned specification repository, use the package manager and commands documented by that repository. At the time this prompt was written, the documented setup is:
   pnpm install
   pnpm mcp
3. Configure the coding agent's MCP client exactly as described in the specification repository README, using the absolute path to the clone. Use the server name `rera-xml-docs`.
4. Verify MCP access by calling `list_documentation`, then use `search_documentation` and `read_documentation` throughout the implementation. Treat `import-specification.md` as normative and examples as illustrative. If the current README differs from the commands above, follow the current README.
5. Do not rely only on remembered rules or copy a sample blindly. Look up every field, enum, nesting rule, required/optional distinction, and property-type-specific attribute that you implement.

Phase 2 — Inspect the target project before changing code
1. Read the target repository's contributor and agent instructions.
2. Identify its language/framework, architecture, domain models, database access layer, listing search/publication rules, development/project model, branches/offices, agents/users, owners/companies, media storage, translations, configuration, routes/controllers, schedulers/jobs, tests, and deployment flow.
3. Trace how active sale/rent inventory is selected today. Pay special attention to stable identifiers, availability/status, offer and property types, prices/currency, areas, location and coordinate privacy, descriptions, images, video/virtual tours, developments and units, branches, and assigned agents.
4. Find the narrowest existing extension points for a read-only export. Do not start implementation until you can explain the relevant data flow end to end.
5. Produce a concise mapping table before coding with these columns:
   - RERA XML element or attribute
   - Required or optional according to the MCP documentation
   - Existing project entity and field/source
   - Transformation or enum mapping
   - Inclusion/filter rule
   - Confidence, ambiguity, or missing data
6. Ask focused questions only when an answer would materially change the implementation or a required field has no safe source. Otherwise proceed with conservative, documented assumptions.

Phase 3 — Implement inside the existing flow
1. Add the smallest cohesive feed-generation component supported by the current architecture.
2. Read existing records through the project's normal data-access APIs. Avoid loading the full inventory into memory when the project can iterate, cursor, chunk, or stream it.
3. Generate well-formed UTF-8 XML and escape text correctly. Use stable existing IDs and public, stable media URLs.
4. Generate a complete snapshot, not paginated fragments. A missing listing in a successfully published snapshot may be interpreted as unavailable, so never publish a partial or failed result.
5. When file publication is used, write to a temporary file and replace the public artifact atomically. Reuse the project's scheduler/background-job and locking conventions to prevent overlapping runs. Do not add scheduling infrastructure if the project already has it.
6. Expose the feed through the requested path using existing routing, storage, CDN, or static-file conventions. Do not weaken authentication or expose unrelated data.
7. Include only values supported by current project data. Normalize values only where the specification requires it, and keep mapping logic explicit and testable.
8. Respect RERA v2 relationships and contact routing when the source project supports them: owner, branches, agents, developments, `development_id`, `branch_id`, and `agent_id`.
9. Follow the project's existing observability conventions for generation success, failure, duration, and record counts. Never log secrets or sensitive property/contact data unnecessarily.

Phase 4 — Verify the result
1. Add focused tests using existing factories/fixtures and the project's normal test framework. Tests must not alter real or shared data.
2. Cover at least:
   - a minimal valid listing;
   - each supported deal/property type and its enum mapping;
   - XML escaping and UTF-8 content;
   - optional-field omission;
   - stable IDs and deterministic output ordering where practical;
   - media URLs;
   - developments, branches, and agents when supported;
   - invalid or incomplete source records;
   - prevention of partial publication after generation failure.
3. Generate a small sample feed from test data, parse it with an independent XML parser, and compare its structure and values with the MCP specification and repository examples.
4. Run the relevant formatter, static checks, and tests. Then review the final diff for unintended database, entity, dependency, API, or architectural changes.

Required final report
Return all of the following:
1. A short architecture summary and the exact existing extension points used.
2. The completed RERA-to-project mapping table, including omitted fields and unresolved gaps.
3. Files changed and why.
4. Commands used to generate, publish, and test the feed.
5. The feed URL/path and a safe rollout/rollback procedure.
6. Verification results and any assumptions or limitations.
7. Explicit confirmation that no domain entities, migrations, database schema changes, or database-writing integration logic were added.
8. A final section titled `Further RERA opportunities`, prioritized as high/medium/low effort and clearly separated into:
   - available now from existing project data;
   - requiring data-quality or operational improvements;
   - requiring future product/schema changes and therefore not implemented in this task.

In `Further RERA opportunities`, assess at least: development/unit relationships and unavailable-unit history; branch and agent routing; all applicable typed property attributes; exact versus approximate map display; multilingual content; image completeness and stable CDN URLs; video and virtual tours; update frequency; atomic complete-snapshot publication; stable IDs; and monitoring/validation. Recommend only features that are actually supported by the current RERA specification, verifying each one through MCP.

Begin by reporting that MCP access works and presenting the project scan plus draft mapping. Then implement, verify, and provide the required final report. Do not stop after producing a plan unless a genuine required-data or access blocker remains.
```

