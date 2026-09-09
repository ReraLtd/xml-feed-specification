# RERA XML Feed Specification v2

RERA XML v2 is an open, reusable specification for exchanging listings together with the real estate business context around them: developments, units, owners, branches, and agents.

It is built for production-scale synchronization rather than simple one-off listing exports.

## What Makes Version 2 Different

- **First-class developments** — connect detailed sellable units to projects through `development_id`.
- **Persistent unit lifecycle** — archive unavailable units from active search while retaining them inside their development as unavailable.
- **Multi-branch organizations** — declare reusable branch identities, verification, logos, and contacts.
- **Agent assignments** — link agents to listings and developments without repeating their contact data.
- **Predictable contact routing** — assigned agent when enabled, then referenced branch, then feed owner.
- **Location privacy** — provide accurate coordinates while choosing exact or approximate public display.
- **Large feeds without pagination** — use complete snapshots, streaming XML parsing, and queued worker batches.
- **Fingerprint-based synchronization** — detect changes in listing data, attributes, photos, and text without requiring timestamps.
- **More than 60 active typed attributes** — residential and commercial details, amenities, zoning, accessibility, and more.

## A Complete but Simple Data Model

Each sellable or rentable property remains a standalone `<listing>`. Optional references connect it to the wider model:

```xml
<listing>
  <development_id>sunset-residences-block-a</development_id>
  <branch_id>limassol-main</branch_id>
  <agent_id>agent-42</agent_id>
  <!-- Complete property data -->
</listing>
```

Projects with multiple blocks do not require another hierarchy. Represent each block as its own development and include the block in its `id`, `name`, or both.

## Designed for High-Volume Synchronization

Publishers expose a complete XML snapshot at a stable URL and regenerate it in a background job every hour or more frequently. Consumers download it to temporary storage, stream individual listing elements, process bounded batches, and compare deterministic fingerprints.

This design handles large inventories without protocol-level pagination or loading the full XML document into memory.

## Coverage

- Residential and commercial properties.
- Sale and rent workflows.
- Developments, active units, and archived unavailable units.
- Owners, branches, agents, and contact priority.
- English, Greek, and Russian content.
- Images, floor plans, video, and virtual tours.
- Backward compatibility for version 1 feeds.

## Documentation

- [Complete specification](https://xml.rera.cy/import-specification)
- [XML examples](https://xml.rera.cy/examples)
- Technical support: `it@rera.cy`

## MCP access for agents

This repository includes a local [Model Context Protocol](https://modelcontextprotocol.io/) server so coding agents can list, read, and search the specification without scraping the rendered website.

After cloning the repository, install dependencies and start the server over stdio:

```bash
pnpm install
pnpm mcp
```

Point an MCP client at the repository with its absolute path:

```json
{
  "mcpServers": {
    "rera-xml-docs": {
      "command": "pnpm",
      "args": ["--dir", "/absolute/path/to/xml-feed-specification", "mcp"]
    }
  }
}
```

The server exposes every documentation page as a Markdown resource and provides `list_documentation`, `read_documentation`, and `search_documentation` tools. The search tool returns ranked excerpts with source filenames and line numbers.
