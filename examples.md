# RERA XML Feed Examples

This page contains comprehensive XML feed examples covering all major property types and deal scenarios. Each example includes 2-3 listings with maximum possible attributes according to the specification.

## Residential Rental Examples

### Flat Rental (rent, residential, flat)
📁 [rent_flat.xml](rent_flat.xml)

*[Add your explanation here: Why this example looks this way, what specific scenarios it covers, important attributes to note, etc.]*

---

## Residential Sale Examples

### House Sale (sale, residential, house)
📁 [sale_house.xml](sale_house.xml)

*[Add your explanation here: Different house types covered, pricing considerations, key attributes for houses vs flats, etc.]*

### Flat Sale (sale, residential, flat)
📁 [sale_flat.xml](sale_flat.xml)

*[Add your explanation here: Various flat types from studio to penthouse, VAT considerations, investment vs residence scenarios, etc.]*

### Residential Land Plot Sale (sale, residential, land_plot)
📁 [sale_residential_land_plot.xml](sale_residential_land_plot.xml)

*[Add your explanation here: Planning zones, building density, different plot types, development potential, etc.]*

---

## Commercial Examples

### Office Rental (rent, commercial, office)
📁 [rent_office.xml](rent_office.xml)

*[Add your explanation here: Office types from small business to whole floor, business center amenities, commercial lease considerations, etc.]*

### Commercial Land Plot Sale (sale, commercial, land_plot)
📁 [sale_commercial_land_plot.xml](sale_commercial_land_plot.xml)

*[Add your explanation here: Commercial zoning, development restrictions, business district locations, investment considerations, etc.]*

---

## Key Features Demonstrated

Each example demonstrates:
- ✅ **Maximum Attributes**: All relevant attributes for the property type
- ✅ **Realistic Data**: Proper coordinates within Cyprus, realistic prices, valid enum values
- ✅ **Multiple Listings**: 2-3 varied examples per file showing different scenarios
- ✅ **Proper Structure**: Correct XML hierarchy and required fields
- ✅ **Image Integration**: Multiple images including floorplans where appropriate
- ✅ **Owner Information**: Complete owner/agency details including contact information and credentials

## Usage Notes

- All coordinates are within Cyprus bounds (latitude 34.520948–35.712796, longitude 32.211971–34.608660)
- Prices reflect realistic market ranges for different property types and locations
- Energy classes, planning zones, and other enums use only valid specification values
- Each listing includes creation and update timestamps
- Image URLs follow the CDN pattern with proper large/medium/small suffix support

## Customization Guide

When adapting these examples for your feed:

1. **Update Owner Information**: Replace with your agency/owner details (name, license, contact information)
2. **Update IDs and References**: Replace example IDs and refs with your system's values
3. **Modify Coordinates**: Use exact coordinates for your properties
4. **Adjust Pricing**: Set realistic prices for your market position
5. **Update Images**: Replace with your actual CDN URLs or image hosting solution  
6. **Customize Descriptions**: Write compelling, accurate property descriptions
7. **Set Proper Timestamps**: Use actual creation and modification dates
8. **Review Attributes**: Include only relevant attributes for each specific property

**Note on External Integrations**: If your feed comes from an external system integration, the owner information can be updated and changed in RERA.CY based on the data provided by the external platform during synchronization.