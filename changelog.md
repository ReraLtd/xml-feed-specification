# Changelog

## [2.0.0] - 2026-09-09

### v2.0.0 (Draft)

### Added

- Optional `<branches>` collection for offices, brands, or operational units owned by the feed owner.
- Required `id` and `name` fields for each declared branch.
- Optional branch logo, WhatsApp number, call phone number, and email.
- Optional free-form branch verification string for company registration, licence, and similar information.
- Optional listing-level `<branch_id>` referencing the branch responsible for a listing.
- Optional `<agents>` collection with agent ID, name, photo, contact details, and free-form verification information.
- Optional listing-level `<agent_id>` referencing the agent responsible for a listing.
- Optional owner-level `<show_approximate_location>` setting controlling exact versus approximate public location display.
- Optional owner-level `<agent_flow_enabled>` setting controlling whether an assigned agent and their contacts are displayed alongside the agency.
- Optional `<developments>` collection for shared new-development metadata.
- Optional listing-level `<development_id>` linking a sellable unit to its development.
- A simple block model: each block is represented as a separate development with the block identified in `id`, `name`, or both.

### Compatibility

- The `<owner>` block remains the owner of the feed and its branches; version 2 adds two optional feed-wide display settings.
- The `<branches>` block is optional. A listing without `<branch_id>` belongs to `<owner>`, even when other listings in the feed reference branches.
- Branch IDs accept any non-empty string representation, including bigint values, hashes, and slugs, and are used only to determine listing ownership.
- The `<agents>` block is optional. A listing without `<agent_id>` has no specifically assigned agent, even when other listings in the feed reference agents.
- Agent IDs accept any non-empty string representation, including bigint values, hashes, and slugs, and are used only to determine the agent assigned to a listing.
- Public contact priority is assigned agent when agent flow is enabled, then referenced branch, then owner.
- Version 1 feeds remain supported when they declare `<feed_version>1</feed_version>`.
- Branch-, agent-, and development-related elements are available only in feeds declaring `<feed_version>2</feed_version>`.

### Changed

- `<created_at>` and `<updated_at>` are optional. RERA detects changes by comparing stored fingerprints for listing data, attributes, photos, and text content.
- Large XML feeds are consumed as complete snapshots with streaming parsing and queued worker batches of 50 listings; pagination is not required.
- Feed publishers should regenerate their XML in a background job every hour or more frequently and publish updates atomically.

### Planned Follow-ups

- Additional listing attributes.

These planned items do not introduce XML elements or validation rules yet.

## [1.0.0] - 2025-10-17

### v1.0.0

### Overview
First stable release of RERA XML Feed Specification - the most comprehensive real estate data specification for Cyprus and European markets. This specification enables automated property listing synchronization between real estate systems and the RERA.CY platform.

### Core Features

#### Property Coverage
- **Residential Properties**: Apartments, flats, houses, villas, townhouses, shared accommodations
- **Commercial Properties**: Offices, coworking spaces, retail, warehouses, production facilities, HORECA
- **Land Plots**: Both residential and commercial development sites
- **Deal Types**: Sale and rent with complete pricing structures

#### Feed Structure
- **Owner Information Block**: Complete agency/owner details with 7 optional fields
  - `logo_url` - Agency logo URL
  - `name` - Owner or agency name
  - `license` - Real estate license number
  - `reg_number` - Registration number
  - `whatsapp_number` - WhatsApp contact
  - `phone_number` - Primary phone contact
  - `email` - Contact email address
  
- **Listing Core Fields**: 36 base fields covering all essential property information
  - Unique identifiers (id, ref)
  - Deal parameters (deal_type, offer_type, price, currency and more...)
  - Property metrics (full_area, living_area, kitchen_area, plot_area and more...)
  - Location data (city, GPS coordinates, formatted address)
  - Media content (images with thumbnails and tag, virtual tours, videos)
  - Timestamps (created_at, updated_at)

#### Attribute System (100+ Attributes)

**Common Attributes** (both residential & commercial):
- Window views (sea, mountains, street, courtyard, park, lake, river)
- Heating systems (electric, gas, heat pump, fireplace, central, underfloor)
- Building features (balconies, loggias, elevators, building class)
- Energy efficiency (classes A-G, in_progress)
- Security systems (8 types including biometric access)
- Amenities (AC, internet, phone, accessibility)
- Location features (distance to transport, zero floor)
- Pricing options (VAT handling, negotiable pricing)

**Residential-Specific** (39 attributes):
- Property types (flat, house, shared_room, bunk_room, land_plot)
- Flat subtypes (studio, apartment, loft, penthouse, maisonette, duplex, condo)
- House subtypes (detached, semi-detached, villa, cottage, townhouse, chalet)
- Bedrooms and bathrooms configuration
- Storage options (6 types)
- Parking types (9 options including EV charging)
- Renovation levels (unrepaired, cosmetic, euro, design)
- Pet policies (dogs, cats, small pets)
- Common areas (spa, gym, pool, garden, kindergarten)
- Appliances and furnishing (10+ specific items)
- Smart home features
- Planning zones (KA3-KA10 for land plots)

**Commercial-Specific** (16 attributes):
- Commercial types (office, coworking, building, trading_area, warehouse, production, horeca, land_plot, other)
- Office subtypes (ground, top floor, whole floor, entire building)
- Design features (modern, traditional, high ceilings, glass walls)
- Layout types (open, flexible, closed)
- Common areas (13 types including server room, rooftop)
- Legal status (6 types including freehold, leasehold, mortgaged)
- Advertising permissions
- Parking spaces (8 types)
- Foot traffic levels
- Planning zones (EB1-EB6 for commercial land)

#### Deal-Specific Features

**For Rentals**:
- Deposit amounts
- Availability status and dates
- Rental type (long-term, short-term)
- Furnished/unfurnished with detailed inventory

**For Sales**:
- Old price tracking (price history)
- Construction stages (resale, new_build, under_construction, off_plan)
- Estimated completion dates
- VAT handling
- Part-exchange options

**For Land Plots**:
- Plot area measurements
- Building density coefficients
- Planning zones (residential KA3-KA10, commercial EB1-EB6)
- Plot types (detached house, apartment complex, subdivided plot, office building, shop)
- Shared plot indicators

#### Multi-language Support
- **Supported Languages**: English, Greek, Russian
- **Auto-translation**: Write descriptions in one language, automatically translated to others
- **UTF-8 Encoding**: Full support for Greek and Cyrillic characters

#### Media Integration
- **Images**: Multiple images per listing with floorplan tagging
- **CDN Support**: Image URL templates with size variants (large, medium, small)
- **Virtual Tours**: Matterport and other 3D tour integration
- **Videos**: YouTube and direct video link support

#### Geographic Features
- **Cyprus-Specific Validation**: GPS coordinates within Cyprus boundaries
  - Latitude: 34.520948 to 35.712796
  - Longitude: 32.211971 to 34.608660
- **Major Cities**: Nicosia, Limassol, Larnaca, Paphos, Famagusta, Ayia Napa, Paralimni
- **Formatted Addresses**: Flexible address formatting with optional country/city

#### Data Quality & Validation
- **Required vs Optional Fields**: Clear field requirements by property type
- **Enum Validation**: Strict value lists for all categorical fields
- **Data Types**: Proper typing (string, number, boolean, date, datetime, URL)
- **Realistic Ranges**: Market-appropriate validation for prices and areas

### Documentation

#### Comprehensive Guides
- **Getting Started Guide**: Quick start checklist, integration process (7 steps), time estimates
- **Detailed Specification**: Complete field reference with types, requirements, and descriptions
- **Testing Guidelines**: Structure validation, character encoding tests, integration testing
- **Best Practices**: Content guidelines, image requirements, attribute usage, common mistakes to avoid

#### Examples Library
- 7 complete XML examples covering all major property types:
  - `full.xml` - Complete template with all possible fields and conditions
  - `rent_flat.xml` - 3 apartment rentals (studio to penthouse)
  - `sale_flat.xml` - 3 apartment sales with varying features
  - `sale_house.xml` - 3 house sales (detached, villa, semi-detached)
  - `rent_office.xml` - 3 office rentals (small business to whole floor)
  - `sale_commercial_land_plot.xml` - 3 commercial development plots
  - `sale_residential_land_plot.xml` - 3 residential land plots
  - `residentional_land_sale.xml` - Additional land sale examples

#### Technical Documentation
- Character encoding guide (UTF-8 requirements)
- XML structure validation tools and methods
- Cyprus-specific geographic validation
- External system integration notes
- Error handling and troubleshooting

### Technical Specifications

#### Format & Standards
- **Format**: XML 1.0 with UTF-8 encoding
- **Structure**: Hierarchical with strict nesting rules
- **Root Element**: `<root>` containing `<rera>`, `<owner>`, and multiple `<listing>` elements
- **Feed Version**: Version 1 (`<feed_version>1</feed_version>`)

#### Integration Support
- **External System Sync**: Owner information can be updated from external platforms
- **Automatic Processing**: Regular feed imports with configurable frequency
- **Image Processing**: Automatic resizing and optimization
- **Validation Feedback**: Detailed error reporting for failed imports

#### Performance
- **Feed Size Recommendations**: Individual feeds under 50MB for optimal processing
- **Batch Updates**: Group related changes for efficiency
- **Image Optimization**: CDN integration with caching support

### Use Cases

This specification supports:
- Real estate agency property management systems
- Developer off-plan project feeds
- Property portal aggregation
- Multi-listing service (MLS) integration
- International property platform connections
- CRM system synchronization

### Migration & Compatibility

- **Version**: 1.0.0 (initial release)
- **Breaking Changes**: N/A (first version)
- **Deprecations**: None
- **Future Compatibility**: Extensible design ready for future enhancements

### Support Resources

- **Documentation URL**: https://xml.rera.cy/import-specification
- **Examples URL**: https://xml.rera.cy/examples
- **Technical Support**: it@rera.cy
- **Response Time**: 12-48 hours

### Known Limitations

- Currently supports only EUR currency
- GPS coordinates must be within Cyprus boundaries
- Maximum 7 cities supported (major Cyprus municipalities)
- Image URLs must be publicly accessible

### Future Roadmap

Planned for future versions:
- Online feed validator tool
- Additional currency support
- Webhook notifications for import status
- API-first approach alongside XML
- Extended European market support

---

**Note**: This is the initial stable release. All features are production-ready and fully supported. For implementation guidance, refer to the comprehensive documentation and examples provided.

