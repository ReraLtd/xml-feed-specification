---
layout: "home"

hero:
  name: "RERA XML v2"
  text: "More than a property feed"
  tagline: "An open XML specification for listings, developments, branches, agents, and high-volume synchronization"
  actions:
    - theme: "brand"
      text: "Start integrating"
      link: "/import-specification#getting-started"
    - theme: "alt"
      text: "Explore the full example"
      link: "/examples"

features:
  - icon:
      src: home.svg
    title: "Developments with real unit lifecycle"
    details: "Connect detailed listings to projects. Unavailable units remain visible inside the development instead of disappearing without context."
  - icon:
      src: plan.svg
    title: "Owner, branch, and agent routing"
    details: "Model multi-branch organizations and agents directly in the feed, with predictable per-listing and per-development contact priority."
  - icon:
      src: magic.svg
    title: "Large feeds without pagination"
    details: "Complete XML snapshots are designed for streaming ingestion, bounded-memory parsing, and parallel worker batches."
  - icon:
      src: lang.svg
    title: "Deterministic change detection"
    details: "Content fingerprints detect changes across listing data, attributes, photos, and text without depending on timestamps."
  - icon:
      src: home.svg
    title: "Privacy-aware locations"
    details: "Provide accurate source coordinates while choosing whether users see an exact or approximate public location."
  - icon:
      src: plan.svg
    title: "60+ active property attributes"
    details: "Typed residential and commercial attributes cover property details, amenities, planning zones, accessibility, and more."
---

&nbsp;

# A Real Estate Feed That Models the Business Behind the Listing

RERA XML v2 turns a flat property export into a reusable real estate data model. It carries not only listings, but also the developments they belong to, the organizations that own them, the branches responsible for them, and the agents who represent them.

The specification is designed for real operational problems that are often left to private integration code: large inventories, contact routing, unit availability, location privacy, and reliable change detection.

## First-Class Developments and Units

A development is a reusable project entity. Every sellable property remains a detailed listing and links to its project through `development_id`.

When a unit is no longer available, it is archived from active search while remaining publicly visible inside the development as unavailable. Projects retain useful inventory context instead of showing only the units that happen to be on sale today.

Projects with multiple blocks stay simple: each block is represented as its own development, identified in its `id`, `name`, or both.

## Contacts That Follow the Listing

Version 2 models owners, branches, and agents without duplicating their contact data across every listing. The public contact priority is explicit:

1. The assigned agent, when agent flow is enabled.
2. The referenced branch.
3. The feed owner.

The same model works for both individual listings and developments, while each keeps independent contact assignments.

## Complete Snapshots, Built to Scale

Pagination is not required. Consumers can download a complete XML snapshot to temporary storage, stream listings with bounded memory, create worker batches, and compare deterministic fingerprints before processing changes.

Publishers can regenerate one stable feed URL in a background job every hour or more frequently. Atomic publication prevents consumers from ever reading a partially generated feed.

## An Open Specification for Reuse

The data model and processing guidance are documented together so portals, CRMs, agencies, developers, and other companies can implement the same contract without reproducing RERA's internal systems.

- Residential and commercial property support.
- Sale and rent workflows.
- More than 60 active typed attributes.
- English, Greek, and Russian content.
- Images, video, virtual tours, and floor plans.
- Backward compatibility for version 1 feeds.

**Ready to build?** Read the [complete specification](/import-specification) or start from the [full XML example](/examples).

**Need help?** Contact the RERA technical team at `it@rera.cy`.
