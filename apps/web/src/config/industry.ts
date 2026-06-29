export enum IndustryEnum {
  // New ones
  TRANSPORTATION_AND_LOGISTICS = "transportation_and_logistics",
  ECOMMERCE_AND_RETAIL = "ecommerce_and_retail",
  HEALTHCARE = "healthcare",
  MANUFACTURING = "manufacturing",
  CONSTRUCTION_AND_INFRASTRUCTURE = "construction_and_infrastructure",
  UTILITIES_AND_ENERGY = "utilities_and_energy",
  GOVERNMENT_AND_PUBLIC_SECTOR = "government_and_public_sector",
  TELECOMMUNICATIONS = "telecommunications",
  FIELD_SERVICE_INDUSTRIES = "field_service_industries",
  AGRICULTURE_AND_FARMING = "agriculture_and_farming",
  AVIATION_AND_AIRPORTS = "aviation_and_airports",
  MARITIME_AND_SHIPPING = "maritime_and_shipping",
  MINING_AND_NATURAL_RESOURCES = "mining_and_natural_resources",
  EDUCATION = "education",
  HOSPITALITY_AND_TOURISM = "hospitality_and_tourism",
  SECURITY_SERVICES = "security_services",
  WASTE_MANAGEMENT = "waste_management",
  FOOD_AND_BEVERAGE = "food_and_beverage",
  AUTOMOTIVE = "automotive",
  FINANCIAL_AND_BANKING = "financial_and_banking",
  NON_PROFIT_AND_NGOS = "non_profit_and_ngos",
  TECHNOLOGY_AND_IT = "technology_and_it",
}

export const IndustryToSubIndustryMap: Record<string, string[]> = {

  [IndustryEnum.TRANSPORTATION_AND_LOGISTICS]: [
    "Last-Mile Delivery", "Courier & Parcel Services", "Freight & Trucking", 
    "Fleet Management", "Warehousing & Distribution", "Supply Chain Operations"
  ],
  [IndustryEnum.ECOMMERCE_AND_RETAIL]: [
    "Online Retailers", "Retail Chains", "Grocery Delivery", 
    "Hypermarkets & Supermarkets", "Quick Commerce Companies"
  ],
  [IndustryEnum.HEALTHCARE]: [
    "HOSPITALS", "Clinics", "Ambulance Services", "Medical Logistics", "Pharmaceutical Distribution"
  ],
  [IndustryEnum.MANUFACTURING]: [
    "Automotive Manufacturing", "Industrial Manufacturing", "Consumer Goods Manufacturing", 
    "Food & Beverage Manufacturing", "Electronics Manufacturing"
  ],
  [IndustryEnum.CONSTRUCTION_AND_INFRASTRUCTURE]: [
    "Construction Companies", "Equipment Rental Companies", "Infrastructure Projects", "Engineering Firms"
  ],
  [IndustryEnum.UTILITIES_AND_ENERGY]: [
    "Electric Utilities", "Water Utilities", "Gas Distribution", "Renewable Energy Companies", "Oil & Gas Operations"
  ],
  [IndustryEnum.GOVERNMENT_AND_PUBLIC_SECTOR]: [
    "Municipal Corporations", "Public Transport Authorities", "Government Fleet Operations", "Emergency Services"
  ],
  [IndustryEnum.TELECOMMUNICATIONS]: [
    "Telecom Service Providers", "Field Service Operations", "Network Installation Teams"
  ],
  [IndustryEnum.FIELD_SERVICE_INDUSTRIES]: [
    "HVAC Services", "Plumbing Services", "Electrical Contractors", "Maintenance Companies", "Pest Control Services"
  ],
  [IndustryEnum.AGRICULTURE_AND_FARMING]: [
    "Agricultural Logistics", "Farm Equipment Management", "Agri-Supply Distribution"
  ],
  [IndustryEnum.AVIATION_AND_AIRPORTS]: [
    "Ground Transportation", "Airport Fleet Management", "Cargo Handling Services"
  ],
  [IndustryEnum.MARITIME_AND_SHIPPING]: [
    "Shipping Companies", "Port Operations", "Marine Logistics"
  ],
  [IndustryEnum.MINING_AND_NATURAL_RESOURCES]: [
    "Mining Operations", "Heavy Equipment Management", "Resource Transportation"
  ],
  [IndustryEnum.EDUCATION]: [
    "School Transportation", "University Transportation Services"
  ],
  [IndustryEnum.HOSPITALITY_AND_TOURISM]: [
    "Hotel Transportation", "Tour Operators", "Travel Management Companies"
  ],
  [IndustryEnum.SECURITY_SERVICES]: [
    "Security Guard Companies", "Patrol Fleet Operations", "Event Security Management"
  ],
  [IndustryEnum.WASTE_MANAGEMENT]: [
    "Waste Collection Companies", "Recycling Operations", "Environmental Services"
  ],
  [IndustryEnum.FOOD_AND_BEVERAGE]: [
    "Restaurant Chains", "Food Delivery Companies", "Catering Services", "Beverage Distribution"
  ],
  [IndustryEnum.AUTOMOTIVE]: [
    "Car Rental Companies", "Vehicle Leasing Companies", "Auto Dealership Groups", "Roadside Assistance Providers"
  ],
  [IndustryEnum.FINANCIAL_AND_BANKING]: [
    "Cash-in-Transit Services", "Banking Logistics", "Asset Transportation"
  ],
  [IndustryEnum.NON_PROFIT_AND_NGOS]: [
    "Relief Distribution", "Humanitarian Logistics", "Community Transportation Programs"
  ],
  [IndustryEnum.TECHNOLOGY_AND_IT]: [
    "IT Asset Transportation", "Data Center Operations", "Field Support Teams"
  ]
};

export const formatIndustryName = (industryValue: string) => {
  return industryValue
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};
