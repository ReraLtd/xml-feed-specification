# XML Import Specification

## Getting Started

Welcome to the RERA XML Import Specification! This document provides everything you need to create compliant property listing feeds for the Cyprus Real Estate system.

### Quick Start Checklist

Before you begin, ensure you have:

- **Access credentials** - Your [RERA account](https://rera.cy) with import permissions
- **Technical contact** - Developer or IT person familiar with XML
- **Property database** - Your current property management system
- **Image hosting** - CDN or image hosting solution for property photos
- **Testing environment** - Safe space to validate feeds before going live

### Integration Process

1. **Read the specification** - Understand required vs optional fields
2. **Review examples** - Check our [comprehensive examples](./examples.md) 
3. **Map your data** - Align your system fields with RERA requirements
4. **Create test feed** - Start with 2-3 sample properties
5. **Validate structure** - Use our testing tools (see Testing sections below)
6. **Submit for review** - Send test feed for RERA approval
7. **Go live** - Begin regular feed submissions

### What You'll Learn

- XML feed structure and required elements
- Property types and their specific attributes 
- Image handling and CDN integration
- Validation and testing procedures
- Common integration issues and solutions

### Time Estimate

- **Simple integration**: 2-3 days for basic property types
- **Complex integration**: 1-2 weeks for full attribute coverage
- **Testing & validation**: 2-3 business days for RERA review

## Overview

The RERA XML Import Specification enables real estate agencies, developers, and property management companies to automatically synchronize their property listings with [RERA.CY](https://rera.cy) platform.

### Core Concept

Your system generates XML feeds containing property data, which RERA processes to create, update, or remove listings on the platform. This eliminates manual data entry and ensures your listings stay current across all channels.

### Supported Property Types

The specification covers all major property categories in Cyprus:

**Residential Properties:**
- Apartments & flats (studio to penthouse)
- Houses (detached, semi-detached, villas, townhouses)
- Land plots for residential development
- Shared accommodations (rooms, bunk beds)

**Commercial Properties:**
- Offices (individual units to whole buildings)
- Retail spaces and trading areas
- Warehouses and production facilities
- HORECA (hotels, restaurants, cafes)
- Commercial land plots and development sites

### Deal Types

- **Sale**: Permanent ownership transfer with full pricing details
- **Rent**: Temporary occupancy with rental terms, deposits, and availability dates

### Key Features

**Comprehensive Attribute System**: Over 100+ attributes covering everything from basic details (price, area, location) to specific amenities (smart home features, pet policies, parking types).

**Flexible Structure**: Required core fields ensure data integrity, while extensive optional attributes let you showcase unique property features.

**Multi-language Support**: Descriptions in English, Greek, or Russian with automatic translation to other languages.

**Rich Media Integration**: Support for multiple property images, virtual tours, and video content.

**Geographic Precision**: GPS coordinates with Cyprus-specific validation and formatted addresses.

### Feed Processing

1. **Automatic Import**: Your XML feed is processed regularly (frequency determined by your subscription)
2. **Data Validation**: Each listing is checked against specification requirements
3. **Image Processing**: Photos are automatically resized and optimized
4. **Publication**: Validated listings appear on RERA platform and partner sites
5. **Sync Status**: Receive feedback on successful imports and any validation errors

### Benefits

- **Time Savings**: Eliminate manual listing creation and updates
- **Accuracy**: Reduce human errors with automated data transfer
- **Consistency**: Maintain uniform property presentation across all channels
- **Scalability**: Handle hundreds or thousands of properties efficiently
- **Real-time Updates**: Keep listings current with automated synchronization

## Guidelines & Conventions

Follow these best practices to ensure successful feed processing and optimal listing presentation.

### XML Structure Rules

**Well-formed XML**: Your feed must be valid XML with proper opening/closing tags, escaped special characters, and correct nesting.

**UTF-8 Encoding**: Always use UTF-8 character encoding for international character support.

**Root Element**: Every feed must start with `<root>` and contain the required `<rera>` version block.

### Data Quality Standards

**Required Fields**: Never omit required fields. Missing required data will cause listing rejection.

**Consistent Units**: Use metric system (m² for areas, EUR for prices, meters for distances).

**Valid Coordinates**: GPS coordinates must fall within Cyprus boundaries (see Pin Map section).

**Realistic Values**: Prices, areas, and other numeric values should be realistic for Cyprus property market.

### Content Guidelines

**Language**: Write descriptions in one language only (English, Greek, or Russian). Our system will auto-translate to other languages.

**No HTML**: Use plain text for all descriptions and titles. HTML tags will be stripped.

**Professional Tone**: Write descriptions for potential buyers/renters, not internal notes.

**Accurate Information**: Ensure all data matches the actual property. Inaccurate listings may be suspended.

### Image Requirements

**Format**: JPEG or PNG images only
**Size**: Minimum 800x600px, recommended 1200x800px or larger
**Quality**: High-resolution photos that showcase property features
**CDN**: Use reliable image hosting with fast global delivery
**Naming**: Use descriptive, consistent naming patterns

### Attribute Best Practices

**Completeness**: Include as many relevant attributes as possible - more data means better search matching.

**Accuracy**: Only include attributes that apply. Don't use default values for non-existent features.

**Consistency**: Use the same attribute patterns across similar properties.

**Updates**: Keep attributes current - remove seasonal items, update renovation status, etc.

### Common Mistakes to Avoid

❌ **Mixed Languages**: Don't mix English and Greek in the same description  
❌ **HTML Content**: No `<p>`, `<br>`, or other HTML tags in text fields  
❌ **Invalid Enums**: Only use specified values for enum fields  
❌ **Wrong Coordinates**: Double-check GPS coordinates are in Cyprus  
❌ **Missing Images**: Include at least 3-5 quality property photos  
❌ **Inconsistent Pricing**: Ensure price matches currency and market expectations  

## Processing Large XML Feeds

The XML feed is designed to work as a complete snapshot, including for large inventories. Do not add pagination or require consumers to load the whole document into memory. Large feeds should be handled with streaming XML parsing.

### How RERA Processes Large XML Feeds

RERA uses the following reference pipeline. Companies reusing this standard can use the same architecture:

1. A scheduled import downloads the complete XML file to temporary storage. The response is written directly to disk rather than buffered entirely in memory.
2. Feed metadata is read once, then `<listing>` elements are collected incrementally with a streaming XML reader.
3. Listings are grouped into batches of 50 and placed on a processing queue.
4. Queue workers validate, normalize, and process each batch independently.
5. Temporary files are removed after the feed has been read, and the import run is completed only after its queued work finishes.

This keeps memory usage bounded by the streaming parser and batch size instead of the total feed size. The value of 50 is RERA's reference worker batch size, not a required part of the XML format; another consumer may tune it for its own infrastructure.

### Change Detection

RERA does not rely on `<created_at>` or `<updated_at>` to detect changes. It stores and compares deterministic fingerprints for each listing. These fingerprints cover:

- Core listing data and attributes.
- Photo URLs.
- Text content (`title` and `description`).

This allows a consumer to identify what changed and avoid repeating unaffected work. Timestamps are therefore optional metadata. Consumers should not reject a listing because either timestamp is absent, and should not use timestamps as their only change-detection mechanism.

### Minimal Consumer Skeleton

The following pseudocode intentionally shows only the XML processing model:

```text
function importXmlFeed(feedUrl):
    temporaryFile = downloadToTemporaryFile(feedUrl)

    try:
        metadata = readFeedMetadata(temporaryFile)
        batch = []

        for listing in streamElements(temporaryFile, "listing"):
            batch.append({ metadata, listing })

            if batch.size == 50:
                enqueueListingBatch(batch)
                batch = []

        if batch is not empty:
            enqueueListingBatch(batch)
    finally:
        deleteTemporaryFile(temporaryFile)

function processListingBatch(batch):
    for item in batch:
        listing = validateAndNormalize(item)
        fingerprints = buildFingerprints(
            listingData = listing.coreData,
            attributes = listing.attributes,
            photos = listing.imageUrls,
            text = [listing.title, listing.description]
        )

        changes = compareWithStoredFingerprints(listing.id, fingerprints)

        if changes.any:
            updateChangedParts(listing, changes)
            storeFingerprints(listing.id, fingerprints)
```

### Feed Publisher Recommendations

- Generate the feed in a background job every hour or more frequently when fresher listings are required.
- Publish a complete snapshot at a stable URL. Pagination is not needed or recommended for this XML format.
- Write the new feed to a temporary file and replace the published file atomically, so consumers never download a partially generated document.
- Prevent overlapping generator runs, especially when generation can take longer than its schedule interval.
- Keep image binaries outside the XML and provide stable public image URLs. Optimize and cache those images independently.
- Keep listing IDs stable between runs so consumers can compare records reliably.

## Testing Recommendations

1. **Start Small**: Test with 2-3 properties before full integration
2. **Validate Structure**: Use XML validation tools before submission
3. **Check Examples**: Compare your output with provided examples
4. **Monitor Feedback**: Review import logs for warnings or errors
5. **Regular Audits**: Periodically verify your live listings match your database

## Outline of Feed Structure

### Root Structure

```xml
<root>
  <rera>
    <feed_version>2</feed_version>
  </rera>
  <owner>
    <logo_url></logo_url>
    <name></name>
    <license></license>
    <reg_number></reg_number>
    <whatsapp_number></whatsapp_number>
    <phone_number></phone_number>
    <email></email>
    <show_approximate_location></show_approximate_location>
    <agent_flow_enabled></agent_flow_enabled>
  </owner>
  <branches>
    <branch>
      <id></id>
      <name></name>
      <logo_url></logo_url>
      <whatsapp_number></whatsapp_number>
      <phone_number></phone_number>
      <email></email>
      <verification></verification>
    </branch>
  </branches>
  <agents>
    <agent>
      <id></id>
      <name></name>
      <photo_url></photo_url>
      <whatsapp_number></whatsapp_number>
      <phone_number></phone_number>
      <email></email>
      <verification></verification>
    </agent>
  </agents>
  <developments>
    <development>
      <id></id>
      <name></name>
      <branch_id></branch_id>
      <agent_id></agent_id>
      <description></description>
      <construction_stage></construction_stage>
      <estimated_completion_at></estimated_completion_at>
      <city></city>
      <pin_map>
        <latitude></latitude>
        <longitude></longitude>
        <formatted_address></formatted_address>
      </pin_map>
      <images>
        <image>
          <url></url>
        </image>
      </images>
    </development>
  </developments>
  <listing>
    <development_id></development_id>
    <branch_id></branch_id>
    <agent_id></agent_id>
    <!-- Listing fields -->
  </listing>
</root>
```

### Feed Version

Version 2 adds branch-level ownership, agent information, new developments, and feed-wide owner settings. Version 1 feeds remain valid when submitted with `<feed_version>1</feed_version>` and must not use the v2-only owner settings, `<branches>`, `<agents>`, `<developments>`, `<branch_id>`, `<agent_id>`, or `<development_id>` elements.

### Owner Information

The `<owner>` block contains information about the organization that owns the feed and its branches. Version 2 retains the version 1 identity and contact fields and adds two optional feed-wide settings. All fields are optional.

**Important**: If owner information is provided from external systems during integration, this data can be updated and changed in the RERA.CY system. When syncing from external platforms, the owner details may be modified in RERA based on the latest information from the integrated system.

#### logo_url
- Type: url
- Required: `false`
- Description: URL to the owner's or agency's logo image.

#### name
- Type: string
- Required: `false`
- Description: Owner or agency name.

#### license
- Type: string
- Required: `false`
- Description: License number (for licensed real estate professionals).

#### reg_number
- Type: string
- Required: `false`
- Description: Registration number.

#### whatsapp_number
- Type: string
- Required: `false`
- Description: WhatsApp contact number (include country code, e.g., +357).

#### phone_number
- Type: string
- Required: `false`
- Description: Primary contact phone number (include country code, e.g., +357).

#### email
- Type: string
- Required: `false`
- Description: Contact email address.

#### show_approximate_location
- Type: boolean (`1`/`0`)
- Required: `false`
- Default: `0`
- Description: Controls public location display for every listing in the feed. Set to `1` to show users an approximate location instead of the exact location, or `0` to show the exact location. Exact coordinates are still required in each listing's `<pin_map>`; this setting changes presentation only.

#### agent_flow_enabled
- Type: boolean (`1`/`0`)
- Required: `false`
- Default: `0`
- Description: Controls whether listings may display both the agency and an assigned agent. Set to `1` to use valid listing `<agent_id>` references and make agent contacts primary. Set to `0` to display only the agency; any `<agent_id>` values are then ignored for public display.

### Branch Information (version 2)

The `<branches>` block is optional and contains the offices, brands, or operational units managed by the feed owner. Each `<branch>` must have an `id` and a `name`. A feed may define any number of branches.

Branches only determine listing ownership. If `<branches>` is omitted, or if a listing does not contain `<branch_id>`, the `<owner>` is considered the owner of that listing. This also applies when branches are declared but only some listings reference them.

```xml
<branches>
  <branch>
    <id>limassol-main</id>
    <name>RERA Limassol</name>
    <logo_url>https://cdn.example.com/branches/limassol.png</logo_url>
    <whatsapp_number>+35799123456</whatsapp_number>
    <phone_number>+35725123456</phone_number>
    <email>limassol@example.com</email>
    <verification>Reg. no HE123456, Lic. No 1234-567E</verification>
  </branch>
</branches>
```

#### branch.id
- Type: string
- Required: `true`
- Description: Stable branch identifier from the feed provider's system, used only to determine which branch owns a listing. Any non-empty string is accepted, including a bigint serialized as text, a hash, or a slug. It must be unique within the feed and must not be reused for a different branch.

#### branch.name
- Type: string
- Required: `true`
- Description: Public branch name.

#### branch.logo_url
- Type: url
- Required: `false`
- Description: Public URL of the branch logo. When omitted, the owner logo may be used.

#### branch.whatsapp_number
- Type: string
- Required: `false`
- Description: Branch WhatsApp number, including the country code (for example, `+357`).

#### branch.phone_number
- Type: string
- Required: `false`
- Description: Branch phone number for calls, including the country code (for example, `+357`).

#### branch.email
- Type: string
- Required: `false`
- Description: Branch contact email address.

#### branch.verification
- Type: string
- Required: `false`
- Description: Free-form branch verification information, such as a company registration number, real estate licence, or both. Example: `Reg. no HE123456, Lic. No 1234-567E`.

### Agent Information (version 2)

The `<agents>` block is optional and contains agents that may be assigned to listings. Each `<agent>` must have an `id` and a `name`. A feed may define any number of agents.

If `<agents>` is omitted, or if a listing does not contain `<agent_id>`, no specific agent is assigned to that listing. This also applies when agents are declared but only some listings reference them.

```xml
<agents>
  <agent>
    <id>agent-42</id>
    <name>Alex Morgan</name>
    <photo_url>https://cdn.example.com/agents/alex-morgan.jpg</photo_url>
    <whatsapp_number>+35799111222</whatsapp_number>
    <phone_number>+35725111222</phone_number>
    <email>alex.morgan@example.com</email>
    <verification>Lic. No 1234-567E</verification>
  </agent>
</agents>
```

#### agent.id
- Type: string
- Required: `true`
- Description: Stable agent identifier from the feed provider's system, used only to determine which agent is assigned to a listing. Any non-empty string is accepted, including a bigint serialized as text, a hash, or a slug. It must be unique within the feed and must not be reused for a different agent.

#### agent.name
- Type: string
- Required: `true`
- Description: Public agent name.

#### agent.photo_url
- Type: url
- Required: `false`
- Description: Public URL of the agent's profile photo.

#### agent.whatsapp_number
- Type: string
- Required: `false`
- Description: Agent WhatsApp number, including the country code (for example, `+357`).

#### agent.phone_number
- Type: string
- Required: `false`
- Description: Agent phone number for calls, including the country code (for example, `+357`).

#### agent.email
- Type: string
- Required: `false`
- Description: Agent contact email address.

#### agent.verification
- Type: string
- Required: `false`
- Description: Free-form agent verification information, such as a real estate licence or registration number. Example: `Lic. No 1234-567E`.

### New Development Information (version 2)

The `<developments>` block is optional and contains new-build projects referenced by listings. Each `<development>` must have an `id` and a `name`. A feed may define any number of developments.

Each sellable property remains a separate `<listing>`. Common project information belongs to `<development>`, while price, area, floor, bedrooms, availability, contacts, and other unit-specific data remain on the listing. Listing values are authoritative and are not implicitly inherited from the development.

```xml
<developments>
  <development>
    <id>sunset-residences-block-a</id>
    <name>Sunset Residences — Block A</name>
    <branch_id>limassol-main</branch_id>
    <agent_id>agent-42</agent_id>
    <description>New residential development in Limassol.</description>
    <construction_stage>under_construction</construction_stage>
    <estimated_completion_at>2027-06-30</estimated_completion_at>
    <city>Limassol</city>
    <pin_map>
      <latitude>34.700000</latitude>
      <longitude>33.050000</longitude>
      <formatted_address>Limassol, Cyprus</formatted_address>
    </pin_map>
    <images>
      <image>
        <url>https://cdn.example.com/developments/sunset-a.jpg</url>
      </image>
    </images>
  </development>
</developments>
```

#### development.id
- Type: string
- Required: `true`
- Description: Stable development identifier from the feed provider's system. Any non-empty string is accepted, including a bigint serialized as text, a hash, or a slug. It must be unique within the feed and must not be reused for a different development.

#### development.name
- Type: string
- Required: `true`
- Description: Public development name. Include the block name here when the project contains independently represented blocks.

#### development.branch_id
- Type: string
- Required: `false`
- Description: ID of the branch that owns the development. When present, it must exactly match a `<branches><branch><id>` value in the same feed. If omitted, `<owner>` is the development's agency.

#### development.agent_id
- Type: string
- Required: `false`
- Description: ID of the agent assigned to the development. When present, it must exactly match an `<agents><agent><id>` value in the same feed. It is used for public display only when the owner-level `<agent_flow_enabled>` setting is `1`.

#### development.description
- Type: string
- Required: `false`
- Description: Plain-text development description without HTML. English, Greek, and Russian are accepted; use only one language in a single value.

#### development.construction_stage
- Type: enum
- Required: `false`
- Values: `off_plan`, `under_construction`, `new_build`
- Description: Current stage of the development.

#### development.estimated_completion_at
- Type: date (YYYY-MM-DD)
- Required: `false` (`true` when `construction_stage` is `off_plan` or `under_construction`)
- Description: Estimated completion date for the development.

#### development.city
- Type: enum
- Required: `false`
- Description: Development municipality. Uses the same allowed values as listing `<city>`.

#### development.pin_map
- Type: object
- Required: `false`
- Description: Development latitude, longitude, and formatted address. Uses the same structure and coordinate rules as listing `<pin_map>`.

#### development.images
- Type: collection
- Required: `false`
- Description: Public development image URLs. Uses the same `<images><image><url>` structure and image requirements as listing images.

#### Representing Blocks

Version 2 does not define separate `<blocks>` or `<buildings>` elements. If a project contains multiple blocks that need to be distinguished, represent each block as a separate `<development>` and include the block in its `id`, its `name`, or both. Listings then reference the appropriate block through `<development_id>`.

#### Development Contact Priority

Development contacts use the same priority as listing contacts:

1. If `<agent_flow_enabled>` is `1` and the development has a valid `<agent_id>`, the agent's contacts are primary. The selected agency is also displayed.
2. Otherwise, if the development has a valid `<branch_id>`, the branch contacts are used.
3. Otherwise, the owner contacts are used.

If both references are omitted, `<owner>` is the development's main contact. Development-level `branch_id` and `agent_id` apply only to the development itself. Linked listings do not inherit them and continue to use their own contact references.

### Listing Contact Priority

The agency displayed for a listing is its referenced branch when `<branch_id>` is present and valid; otherwise it is `<owner>`. Public contact details are selected in this order:

1. If `<agent_flow_enabled>` is `1` and the listing has a valid `<agent_id>`, the agent's contacts are primary. The selected agency (branch or owner) is also displayed.
2. Otherwise, if the listing has a valid `<branch_id>`, the branch contacts are used.
3. Otherwise, the owner contacts are used.

When `<agent_flow_enabled>` is `0`, the first rule is skipped even if the listing contains `<agent_id>`.

### Listing Fields

#### development_id
- Type: string
- Required: `false`
- Description: ID of the new development containing the listing. When present, it must exactly match a `<developments><development><id>` value in the same feed. If omitted, the listing is treated as a standalone property. This field does not affect listing ownership or contact priority.

#### branch_id
- Type: string
- Required: `false`
- Description: ID of the branch that owns the listing. It is used only to determine listing ownership and must exactly match a `<branches><branch><id>` value in the same feed. If omitted, the `<owner>` owns the listing, including when the feed declares other branches.

#### agent_id
- Type: string
- Required: `false`
- Description: ID of the agent assigned to the listing. It is used only to identify the responsible agent and must exactly match an `<agents><agent><id>` value in the same feed. If omitted, no specific agent is assigned, including when the feed declares other agents.

#### id
- Type: number
- Required: `true`
- Description: Unique listing identifier from your system.

#### ref
- Type: string
- Required: `true`
- Description: Your external reference/code shown to customers.

#### status
- Type: string
- Required: `true`
- Description: Listing status. Use `active` for publishable items.

#### deal_type
- Type: enum
- Required: `true`
- Description: Transaction type: `sale` or `rent`.

#### offer_type
- Type: enum
- Required: `true`
- Description: Domain of the listing: `residential` or `commercial`.

#### price
- Type: number
- Required: `true`
- Description: Asking price in `currency`.

#### old_price
- Type: number
- Required: `false`
- Description: Previous asking price (if applicable).

#### deposit
- Type: number
- Required: `false`
- Description: Deposit amount (only for rentals).

#### currency
- Type: enum
- Required: `true`
- Description: Currency code. Currently `EUR`.

#### link_to_virtual_tour
- Type: url
- Required: `false`
- Description: Public link to a 3D/VR tour (e.g., Matterport).

#### link_to_video
- Type: url
- Required: `false`
- Description: Public video link (e.g., YouTube).

#### full_area
- Type: number
- Required: `true`
- Description: Total area of the property (m²).

#### living_area
- Type: number
- Required: `false`
- Description: Net living space (m²).

#### kitchen_area
- Type: number
- Required: `false`
- Description: Kitchen area (m²).

#### floor
- Type: number
- Required: `false`
- Description: Floor number of the unit.

#### floor_total
- Type: number
- Required: `false`
- Description: Total number of floors in the building.

#### is_available
- Type: boolean (1/0)
- Required: `false` (for rentals)
- Description: Availability flag; `1` means available.

#### become_available_at
- Type: date (YYYY-MM-DD)
- Required: `false` (for rentals, `true` if is_available = `1`)
- Description: Expected date the flat/house becomes available.

#### plot_area
- Type: number
- Required: `false` (`true` for land/plot listings)
- Description: Land/plot area (m²) if applicable.

#### building_density
- Type: string
- Required: `false` (`true` for land/plot listings)
- Description: Zoning/building density information (optional).

#### construction_year
- Type: integer (YYYY)
- Required: `false`
- Description: Year the building or unit was constructed.

#### estimated_completion_at
- Type: date (YYYY-MM-DD)
- Required: `false` (`true` for projects under construction or off-plan)
- Description: Estimated completion date for projects under construction or off-plan.

#### created_at
- Type: datetime (YYYY-MM-DD HH:MM:SS)
- Required: `false`
- Description: Original creation timestamp from the source system, when available. It is informational and is not required for change detection.

#### updated_at
- Type: datetime (YYYY-MM-DD HH:MM:SS)
- Required: `false`
- Description: Last update timestamp from the source system, when available. It is informational and is not required for change detection.

#### title
- Type: string
- Required: `false`
- Description: Short human-readable headline for XL-promotion listings (avoid HTML). English, Greek, and Russian are accepted. Write in only one language, and our system will automatically translate your text into the other languages.

#### description
- Type: string
- Required: `true`
- Description: Detailed, plain-text description (avoid HTML). English, Greek, and Russian are accepted. Write in only one language, and our system will automatically translate your text into the other languages.

#### city
- Type: enum
- Required: `true`
- Description: Municipality name. Allowed: `Nicosia`, `Limassol`, `Larnaca`, `Paphos`, `Famagusta`, `Ayia Napa`, `Paralimni`.

### Pin Map
- Required: `true`

```xml
<pin_map>
  <latitude>34.520948</latitude>
  <longitude>34.608660</longitude>
  <formatted_address>Agias Filaxeos 157, Lemesos 3083, Cyprus</formatted_address>
</pin_map>
```

Coordinates must be within Cyprus: latitude `34.520948`–`35.712796`, longitude `32.211971`–`34.608660`.

#### formatted_address
- Type: string
- Required: `true`
- Description: full address or just the street name; country and city are optional here.

### Images

Images support thumbnails. To get different sizes, replace "large" in the filename with `small` or `medium`.

```text
Large: http://cdn.rera.cy/12811577_large.jpg
Medium: http://cdn.rera.cy/12811577_medium.jpg
Small: http://cdn.rera.cy/12811577_small.jpg
```

```xml
<images>
  <image>
    <url>http://cdn.rera.cy/12811577_large.jpg</url>
  </image>
  <image>
    <tags>
      <tag>floorplan</tag>
    </tags>
    <url>http://cdn.rera.cy/12811578_large.jpg</url>
  </image>
  <image>
    <url>http://cdn.rera.cy/12811579_large.jpg</url>
  </image>
</images>
```

## Attributes

Rules differ by offer_type. Use the sections below. General rules:

- **multiple**: comma-separated values
- **single**: one value only
- **boolean**: 1 or 0

### Common Attributes (residential and commercial)

#### window_views
- Type: multiple
- Required: `false`
- Values: sea, mountains, street, courtyard, park, lake, river
- Description: Visible views from the unit.

#### heating_types
- Type: multiple
- Required: `false`
- Values: electric, gas, heat_pump, fireplace, central, underfloor_heating
- Description: Available heating systems.

#### loggias
- Type: single
- Required: `false`
- Values: 1, 2, 3, 4, 5+
- Description: Count of loggias.

#### balconies
- Type: single
- Required: `false`
- Values: 1, 2, 3, 4, 5+
- Description: Count of balconies.

#### elevator_count
- Type: single
- Required: `false`
- Values: 1, 2, 3, 4, 5+
- Description: Number of elevators in the building.

#### with_freight_elevator
- Type: boolean
- Required: `false`
- Description: Freight/service elevator present.

#### building_class
- Type: single
- Required: `false`
- Values: A, B, C
- Description: Building quality/class rating.

#### energy_class
- Type: single
- Required: `true`
- Values: A, B, C, D, E, F, G, in_progress
- Description: Energy efficiency certificate class.

#### construction_stage
- Type: single
- Required: `false`
- Values: resale, new_build, under_construction, off_plan
- Description: Development stage of the property.

#### rental_type
- Type: single
- Required: `false`
- Values: long_term, short_term
- Description: Rental term category.

#### security_systems
- Type: multiple
- Required: `false`
- Values: video_surveillance, access_control, alarm_system, on_site_security, fire_safety_system, intercom, security_patrol, biometric_access
- Description: Installed security measures.

#### furnished
- Type: boolean
- Required: `false`
- Description: Unit offered furnished.

#### with_conditioner
- Type: boolean
- Required: `false`
- Description: Air conditioning present.

#### with_internet
- Type: boolean
- Required: `false`
- Description: Internet connectivity available.

#### with_phone
- Type: boolean
- Required: `false`
- Description: Landline/telephony available.

#### is_accessible
- Type: boolean
- Required: `false`
- Description: Accessible for people with reduced mobility.

#### distance_to_bus_stops
- Type: single
- Required: `false`
- Values: walkable, short_walk, moderate_distance, far
- Description: Proximity to public transport.

#### is_zero_floor
- Type: boolean
- Required: `false`
- Description: Ground/zero floor unit.

#### plus_vat
- Type: boolean
- Required: `false`
- Description: Price excludes VAT (VAT applicable separately).

#### cooling_type
- Type: single
- Required: `false`
- Values: autonomous_cooling_system, central_cooling
- Description: Cooling system type.

#### negotiable_price
- Type: boolean
- Required: `false`
- Description: Price is negotiable.

#### sharing_plot
- Type: boolean
- Required: `false`
- Description: Sale involves a share of a larger plot.

### Residential Attributes (offer_type = `residential`)

#### residential_type
- Type: single
- Required: `true`
- Values: flat, house, shared_room, bunk_room, land_plot
- Description: Main residential category.

#### bedroom_type
- Type: single
- Required: `false`
- Values: 1, 2, 3, 4, 5, 6+
- Description: Number of bedrooms.

#### house_type
- Type: single
- Required: `false`
- Values: detached, semi-detached, villa, cottage, townhouse, chalet
- Description: House subtype for non-apartment residential.

#### flat_type
- Type: single
- Required: `false`
- Values: studio, apartment, loft, penthouse, maisonette, duplex, condo
- Description: Apartment subtype.

#### storage_types
- Type: multiple
- Required: `false`
- Values: closet, storage_room, garage_storage, basement, utility_room, additional_space
- Description: Available storage options.

#### parking_types
- Type: multiple
- Required: `false`
- Values: street, garage, covered, underground, open, secure, multilevel, guest, ev_charging
- Description: Parking availability/types.

#### combined_bathrooms
- Type: single
- Required: `false`
- Values: 1, 2, 3, 4, 5, 6+
- Description: Number of combined bath/WC rooms.

#### separate_bathrooms
- Type: single
- Required: `false`
- Values: 1, 2, 3, 4, 5, 6+
- Description: Number of bathrooms separate from WC.

#### with_bath
- Type: boolean
- Required: `false`
- Description: Bathtub present.

#### shower_cubicle
- Type: boolean
- Required: `false`
- Description: Shower cubicle present.

#### repair_type
- Type: single
- Required: `false`
- Values: unrepaired, cosmetic, euro, design
- Description: Renovation/finish level.

#### pets
- Type: multiple
- Required: `false`
- Values: dogs_allowed, cats_allowed, small_pets_allowed
- Description: Pet policy.

#### residential_common_areas
- Type: multiple
- Required: `false`
- Values: spa, gym, swimming_pool, bathhouse, playroom, garden, lounge_area, kindergarten
- Description: Shared amenities in the residential complex.

#### kitchen_furnished
- Type: boolean
- Required: `false`
- Description: Kitchen is furnished/equipped.

#### furnished_rooms
- Type: boolean
- Required: `false`
- Description: Rooms are furnished.

#### with_tv
- Type: boolean
- Required: `false`
- Description: TV provided.

#### with_fridge
- Type: boolean
- Required: `false`
- Description: Fridge provided.

#### with_washing_machine
- Type: boolean
- Required: `false`
- Description: Washing machine provided.

#### with_tumble_dryer
- Type: boolean
- Required: `false`
- Description: Tumble dryer provided.

#### with_dishwasher
- Type: boolean
- Required: `false`
- Description: Dishwasher provided.

#### with_interactive_tv
- Type: boolean
- Required: `false`
- Description: Interactive/Smart TV service provided.

#### smoking_allowed
- Type: boolean
- Required: `false`
- Description: Smoking allowed inside the unit.

#### jacuzzi
- Type: boolean
- Required: `false`
- Description: Jacuzzi/hot tub available.

#### smart_home_features
- Type: boolean
- Required: `false`
- Description: Smart home devices/features installed.

#### selling_and_looking_to_buy
- Type: boolean
- Required: `false`
- Description: Seller is open to a swap/part-exchange.

#### residential_planning_zone
- Type: single
- Required: `false`
- Values: ka3, ka4, ka5, ka6, ka7, ka8, ka9, ka10
- Description: Residential planning zone code (only for land_plots).

#### residential_plot_type
- Type: single
- Values: detached_house, apartment_complex, subdivided_plot
- Description: Plot type for residential properties (only for land_plots).

### Commercial Attributes (offer_type = `commercial`)

#### commercial_type
- Type: single
- Required: `true`
- Values: office, coworking, building, trading_area, warehouse, production_facility, horeca, land_plot, other
- Description: Commercial property category.

#### office_type
- Type: single
- Required: `false`
- Values: ground, top_floor, whole_floor, entire_building, standard_office
- Description: Office subtype.

#### design_features
- Type: multiple
- Required: `false`
- Values: modern_design, traditional_design, high_ceiling, glass_walls, spacious_rooms
- Description: Fit-out/finish features.

#### layout_type
- Type: single
- Required: `false`
- Values: open_layout, flexible_layout, closed_layout
- Description: Space layout.

#### common_areas
- Type: multiple
- Required: `false`
- Values: conference_rooms, lounges, kitchens, restrooms, reception_area, cafeteria, gym, rooftop, outdoor_spaces, common_meeting_rooms, storage_areas, server_room, kindergarten
- Description: Shared amenities in the business center/building.

#### legal_status
- Type: single
- Required: `false`
- Values: freehold, leasehold, rental, with_right_of_first_refusal, co_ownership, mortgaged
- Description: Ownership/lease status.

#### advertising_installation_allowed
- Type: single
- Required: `false`
- Values: yes, no, restricted
- Description: External/internal advertising signage allowed.

#### equipped
- Type: boolean
- Required: `false`
- Description: Space is equipped for immediate use.

#### available_parking_spaces
- Type: multiple
- Required: `false`
- Values: one_parking_space, multiple_parking_spaces, reserved_parking, shared_parking, paid_parking, free_parking, guest_parking, ev_charging
- Description: Parking availability/features.

#### additional_details
- Type: multiple
- Required: `false`
- Values: full_access, daily_cleaning, pet_friendly
- Description: Additional commercial details.

#### foot_traffic
- Type: single
- Required: `false`
- Values: low, medium, high
- Description: Typical pedestrian traffic level around the property.

#### commercial_planning_zone
- Type: single
- Required: `false`
- Values: eb1, eb2, eb3, eb4, eb5, eb6
- Description: Planning zone code for commercial usage.

#### commercial_plot_type
- Type: single
- Required: `false`
- Values: office_building, shop
- Description: Plot type for commercial property.

## About Character Encoding

Proper character encoding ensures your property descriptions, addresses, and other text content display correctly across all platforms and languages.

### Required Encoding: UTF-8

**All XML feeds must use UTF-8 encoding.** This encoding supports:
- English alphabet and numbers
- Greek characters (Α, Β, Γ, Δ, etc.)  
- Cyrillic characters (А, Б, В, Г, etc.)
- Common symbols (€, ², ³, °, etc.)
- Special punctuation and diacritical marks

### XML Declaration

Always start your XML files with the UTF-8 declaration:

```xml
<?xml version="1.0" encoding="utf-8" standalone="yes"?>
<root>
  <!-- Your feed content -->
</root>
```

### Special Characters in XML

Certain characters have special meaning in XML and must be escaped:

| Character | Escaped Form | When to Use |
|-----------|-------------|-------------|
| `<`       | `&lt;`      | In text content |
| `>`       | `&gt;`      | In text content |
| `&`       | `&amp;`     | In text content |
| `"`       | `&quot;`    | Inside attributes |
| `'`       | `&apos;`    | Inside attributes |

### Examples

**Correct encoding of Greek description:**
```xml
<description>Διαμέρισμα 85 m² με θέα στη θάλασσα</description>
```

**Correct encoding with special characters:**
```xml
<description>Luxury apartment &amp; penthouse with 180° sea view</description>
<formatted_address>Anexartisias 123 "Marina Bay", Limassol</formatted_address>
```

### Common Issues & Solutions

**Issue**: Greek or Russian text appears as question marks (???)  
**Solution**: Ensure your XML file is saved with UTF-8 encoding, not ASCII or Latin-1

**Issue**: Ampersand characters break XML parsing  
**Solution**: Replace `&` with `&amp;` in all text content

**Issue**: Addresses with quotes cause parsing errors  
**Solution**: Use `&quot;` for quotes inside attribute values

### Testing Character Encoding

1. **Save Check**: Verify your XML file is saved with UTF-8 encoding
2. **Visual Check**: Open the XML in a browser - all characters should display correctly  
3. **Validation Check**: Use an [XML validator](https://jsonformatter.org/xml-validator) to ensure proper structure
4. **End-to-End Check**: Submit a test feed and verify text appears correctly on RERA platform

### Development Tips

**Text Editors**: Use editors that support UTF-8 (VS Code, Sublime Text,Web Storm)  
**Programming**: Ensure your code specifies UTF-8 when reading/writing XML files  
**Database**: Configure your database to store and retrieve UTF-8 text properly  
**Web Requests**: Set content-type headers to include charset=utf-8

## Testing the Structure

Before submitting your feed to RERA, thoroughly test its structure to ensure compliance and prevent import errors.

### XML Validation Tools

**Online Validators** (Quick testing):
- [XML Validator](https://jsonformatter.org/xml-validator) - Free online XML structure checker
- [W3Schools XML Validator](https://www.w3schools.com/xml/xml_validator.asp) - Simple validation tool
- [XMLLint Online](https://xmllint.com/) - Advanced XML linting with error details

**Command Line Tools** (Development workflow):
```bash
# Using xmllint (Linux/Mac)
xmllint --noout your-feed.xml

# Using xmlstarlet (Cross-platform)
xmlstarlet val your-feed.xml
```

**Programming Libraries**:
- **PHP**: `DOMDocument` with `validateOnParse`
- **Python**: `xml.etree.ElementTree` or `lxml`  
- **JavaScript/Node.js**: `fast-xml-parser` or `libxmljs`
- **.NET**: `XmlDocument` with schema validation

### Structure Checklist

**✅ Required Elements Present:**
- [ ] XML declaration with UTF-8 encoding
- [ ] Root `<root>` element containing all content
- [ ] RERA version block: `<rera><feed_version>2</feed_version></rera>`
- [ ] Owner information block `<owner>` (all fields optional)
- [ ] Optional owner settings use boolean `1` or `0`
- [ ] Optional `<branches>` block uses unique, non-empty branch IDs
- [ ] Optional `<agents>` block uses unique, non-empty agent IDs
- [ ] Optional `<developments>` block uses unique, non-empty development IDs
- [ ] At least one `<listing>` element

**✅ Every Development Contains:**
- [ ] Unique non-empty `<id>` and a public `<name>`
- [ ] Optional `<branch_id>` and `<agent_id>` match entries declared in the same feed

**✅ Every Listing Contains:**
- [ ] Optional `<branch_id>` matches a branch declared in the same feed; when omitted, the listing belongs to `<owner>`
- [ ] Optional `<agent_id>` matches an agent declared in the same feed
- [ ] Optional `<development_id>` matches a development declared in the same feed
- [ ] Unique numeric `<id>`
- [ ] String `<ref>` (your reference code)
- [ ] Valid `<status>` (typically "active")
- [ ] Enum `<deal_type>` (sale/rent)
- [ ] Enum `<offer_type>` (residential/commercial)
- [ ] Numeric `<price>` and `<currency>`
- [ ] Numeric `<full_area>`
- [ ] Text `<description>`
- [ ] Enum `<city>` (valid Cyprus municipality)
- [ ] Pin map with latitude, longitude, formatted_address
- [ ] Required `<energy_class>` attribute
- [ ] Required type attribute (`residential_type` or `commercial_type`)

**✅ Data Format Validation:**
- [ ] Dates in YYYY-MM-DD format
- [ ] Optional datetimes, when supplied, use YYYY-MM-DD HH:MM:SS format
- [ ] Numbers are valid (not text, not empty)
- [ ] GPS coordinates within Cyprus bounds
- [ ] Currency is "EUR"
- [ ] All enum values match specification exactly

## Version 2 Roadmap

Additional listing attributes are planned for a follow-up v2 revision but are not part of the current XML contract yet.

No placeholder XML elements are reserved for this work. The fields and validation rules will be added in a follow-up revision before they are accepted in production feeds.

### Common Structure Errors

**❌ Invalid XML Syntax:**
```xml
<!-- WRONG: Unclosed tag -->
<listing>
  <id>123</id>
  <ref>PROP_001
</listing>

<!-- CORRECT: Properly closed tags -->
<listing>
  <id>123</id>
  <ref>PROP_001</ref>
</listing>
```

**❌ Missing Required Elements:**
```xml
<!-- WRONG: Missing required fields -->
<listing>
  <id>123</id>
  <price>250000</price>
</listing>

<!-- CORRECT: All required fields present -->
<listing>
  <id>123</id>
  <ref>PROP_001</ref>
  <status>active</status>
  <deal_type>sale</deal_type>
  <offer_type>residential</offer_type>
  <price>250000</price>
  <currency>EUR</currency>
  <!-- ... other required fields ... -->
</listing>
```

**❌ Invalid Nesting:**
```xml
<!-- WRONG: Attributes outside attributes block -->
<listing>
  <id>123</id>
  <residential_type>flat</residential_type>
  <attributes>
    <energy_class>B</energy_class>
  </attributes>
</listing>

<!-- CORRECT: All attributes inside attributes block -->
<listing>
  <id>123</id>
  <attributes>
    <residential_type>flat</residential_type>
    <energy_class>B</energy_class>
  </attributes>
</listing>
```

### Integration Testing

After structural validation, test with actual RERA import:

1. **Submit test feed** with 1-3 sample properties
2. **Monitor import logs** for detailed error messages  
3. **Check live listings** to ensure data appears correctly
4. **Verify images load** and display properly
5. **Test search functionality** with your property attributes

## Testing Character Encoding

Character encoding issues can cause property descriptions and addresses to display incorrectly. Follow these tests to ensure your multilingual content works properly.

### Quick Visual Test

**Step 1**: Open your XML file in different applications:
- **Text Editor**: Should display Greek (Ελληνικά) and Cyrillic (Русский) characters correctly
- **Web Browser**: Drag XML file to browser - all text should render properly
- **XML Viewer**: Use online XML viewers to check character display

**Step 2**: Look for these warning signs:
- ❌ Question marks: `Διαμέρισμα ?????? θάλασσα` 
- ❌ Squares or boxes: `Apartment ☐☐☐ sea view`
- ❌ Garbled text: `ÎÎ¹Î±Î¼Î­ÏÎ¹ÏÎ¼Î±`

### Automated Encoding Tests

**Command Line Testing:**
```bash
# Check file encoding (Linux/Mac)
file -i your-feed.xml
# Should output: text/xml; charset=utf-8

# Test XML with special characters  
xmllint --encode UTF-8 your-feed.xml | head -20

# Verify specific character ranges are preserved
grep -P "[\x{0370}-\x{03FF}]" your-feed.xml  # Greek
grep -P "[\x{0400}-\x{04FF}]" your-feed.xml  # Cyrillic
```

### Final Validation Checklist

- [ ] XML file saved with UTF-8 encoding
- [ ] XML declaration specifies UTF-8
- [ ] Greek characters display correctly in browser
- [ ] Russian characters display correctly in browser  
- [ ] Euro symbols (€) appear properly
- [ ] Special characters (&, <, >, ", ') are escaped
- [ ] No question marks or boxes in text content
- [ ] Automated encoding tests pass
- [ ] Test feed imports successfully with multilingual content

## Getting Help

When you encounter issues during XML feed integration, multiple support channels are available to assist you.

### Quick Self-Help Resources

**📚 Documentation:**
- **[Examples Collection](./examples.md)**: Complete XML samples for all property types
- **Specification Reference**: This document with all field definitions
- **FAQ Section**: Common questions and solutions (check RERA portal)

**🔧 Self-Service Tools:**
- **Online Validator**: Real-time XML structure checking
- **Character Encoding Tester**: Verify multilingual content
- **Coordinate Validator**: Check GPS boundaries for Cyprus
- **Image URL Checker**: Validate image accessibility

### Technical Support Channels

**📧 Email Support**
- Address: `it@rera.cy`
- Response time: 12-48 hours
- Include: Company name, XML sample, error details
- Best for: Complex technical issues, specification clarifications
