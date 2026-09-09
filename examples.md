# RERA XML Feed Examples

This page contains comprehensive XML feed examples covering all major property types and deal scenarios. Each example includes 2-3 listings with maximum possible attributes according to the specification.

## Full Example
📁 [full.xml](full.xml)

```xml
<?xml version="1.0" encoding="utf-8" standalone="yes"?>
<root>
  <rera>
    <feed_version>2</feed_version>
  </rera>
  <owner>
    <logo_url/>
    <name/>
    <license/>
    <reg_number/>
    <whatsapp_number/>
    <phone_number/>
    <email/>
  </owner>
  <branches>
    <branch>
      <id>limassol-main</id>
      <name>RERA Limassol</name>
      <logo_url>https://cdn.example.com/branches/limassol.png</logo_url>
      <whatsapp_number>+35799123456</whatsapp_number>
      <phone_number>+35725123456</phone_number>
      <email>limassol@example.com</email>
      <verification>
        <item>
          <type>company_registration_number</type>
          <value>HE 123456</value>
        </item>
        <item>
          <type>real_estate_license</type>
          <value>AA 987</value>
        </item>
      </verification>
    </branch>
  </branches>
  <listing>
    <!-- Default -->
    <branch_id/>
    <id/>
    <ref/>
    <status/>
    <deal_type/>
    <offer_type/>
    <price/>
    <currency/>
    <link_to_virtual_tour/>
    <link_to_video/>
    <full_area/>
    <floor/>
    <floor_total/>
    <created_at/>
    <updated_at/>
    <title/>
    <description/>
    <construction_year/>
    <city/>
    <pin_map>
      <latitude/>
      <longitude/>
      <formatted_address/>
    </pin_map>
    <images>
      <image>
        <url/>
      </image>
      <image>
        <tags>
          <tag>floorplan</tag>
        </tags>
        <url/>
      </image>
      <image>
        <url/>
      </image>
    </images>

    <!-- Only for deal_type = rent -->
    <deposit/>
    <is_available/>
    <become_available_at/>

    <!-- Only for offer_type = residential -->
    <living_area/>
    <kitchen_area/>

    <attributes>
      <!-- Only for offer_type = residential -->
      <residential_type/>
      <bedroom_type/>
      <flat_type/>
      <house_type/>
      <pets/>
      <with_tv/>
      <with_fridge/>
      <with_washing_machine/>
      <with_dishwasher/>
      <with_interactive_tv/>
      <smoking_allowed/>
      <jacuzzi/>
      <smart_home_features/>
      <selling_and_looking_to_buy/>
      <parking_types/>
      <combined_bathrooms/>
      <separate_bathrooms/>
      <with_bath/>
      <shower_cubicle/>
      <repair_type/>
      <residential_common_areas/>
      <storage_types/>
      <kitchen_furnished/>
      <furnished_rooms/>

      <!-- resdential_type = land_plot -->
      <residential_planning_zone/>
      <residential_plot_type/>

      <!-- Only for offer_type = commercial -->
      <commercial_type/>
      <office_type/>
      <design_features/>
      <layout_type/>
      <common_areas/>
      <legal_status/>
      <advertising_installation_allowed/>
      <equipped/>
      <available_parking_spaces/>
      <additional_details/>
      <foot_traffic/>

      <!-- commercial_type = land_plot -->
      <commercial_planning_zone/>
      <commercial_plot_type/>

      <!-- Common Attributes (residential and commercial) -->
      <window_views/>
      <heating_types/>
      <balconies/>
      <loggias/>
      <elevator_count/>
      <building_class/>
      <energy_class/>
      <security_systems/>
      <furnished/>
      <with_conditioner/>
      <with_internet/>
      <with_phone/>
      <distance_to_bus_stops/>
      <cooling_type/>
      <is_accessible/>
      <is_zero_floor/>
      <negotiable_price/>

      <!-- Only for deal_type = sale -->
      <construction_stage/>
      <plus_vat/>

      <!-- Only for deal_type = rent -->
      <rental_type/>

      <!-- residential or commercial land sale -->
      <sharing_plot/>
    </attributes>
  </listing>
  <!-- Next listings... -->
</root>
```

## Residential Rental Examples

### Flat Rental (rent, residential, flat)
📁 [rent_flat.xml](rent_flat.xml)

---

## Residential Sale Examples

### House Sale (sale, residential, house)
📁 [sale_house.xml](sale_house.xml)

### Flat Sale (sale, residential, flat)
📁 [sale_flat.xml](sale_flat.xml)

### Residential Land Plot Sale (sale, residential, land_plot)
📁 [sale_residential_land_plot.xml](sale_residential_land_plot.xml)

---

## Commercial Examples

### Office Rental (rent, commercial, office)
📁 [rent_office.xml](rent_office.xml)

### Commercial Land Plot Sale (sale, commercial, land_plot)
📁 [sale_commercial_land_plot.xml](sale_commercial_land_plot.xml)

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
