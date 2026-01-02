export interface GlobalConfig {
  spoolCost: number;
  spoolWeight: number; // in grams
  monthlyPowerCost: number;
  monthlyInternetCost: number;
  monthlyAdsCost: number;
  monthlyExtraCost: number;
  printerCost: number;
  monthlyMaintenance: number;
  roiMonths: number;
  workDaysPerMonth: number;
  workHoursPerDay: number;
  currency: string;
}

export interface JobDetails {
  brand: string;
  material: string;
  consumedGrams: number;
  printHours: number;
  laborRatePerHour: number;
  postProcessHours: number;
  useFixedPostProcessPrice: boolean;
  fixedPostProcessPrice: number;
  markupPercentage: number; // Profit margin
}

export interface CostBreakdown {
  materialCost: number;
  operationalCostPerHour: number;
  depreciationPerHour: number;
  laborCostPerHour: number;
  totalHourlyCost: number;
  printTimeCost: number;
  postProcessCost: number;
  subtotal: number;
  totalWithMarkup: number;
  costPerGram: number;
  totalOperationalHourly: number; // Sum of utilities, rent, etc.
  // Detailed breakdown
  electricityPerHour: number;
  internetPerHour: number;
  adsPerHour: number;
  extrasPerHour: number;
  maintenancePerHour: number;
}
