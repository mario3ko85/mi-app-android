import { GlobalConfig, JobDetails, CostBreakdown } from '../types';

export const calculateQuote = (config: GlobalConfig, job: JobDetails): CostBreakdown => {
  const monthlyHours = config.workDaysPerMonth * config.workHoursPerDay;
  
  // Prevent division by zero
  const safeMonthlyHours = monthlyHours === 0 ? 1 : monthlyHours;
  const safeSpoolWeight = config.spoolWeight === 0 ? 1 : config.spoolWeight;

  // 1. Material Cost
  const costPerGram = config.spoolCost / safeSpoolWeight;
  const materialCost = job.consumedGrams * costPerGram;

  // 2. Operational Costs per Hour (Electricity, Internet, Ads, Extras, Maintenance)
  const powerPerHour = config.monthlyPowerCost / safeMonthlyHours;
  const internetPerHour = config.monthlyInternetCost / safeMonthlyHours;
  const adsPerHour = config.monthlyAdsCost / safeMonthlyHours;
  const extrasPerHour = config.monthlyExtraCost / safeMonthlyHours;
  const maintenancePerHour = config.monthlyMaintenance / safeMonthlyHours;

  const totalOperationalHourly = powerPerHour + internetPerHour + adsPerHour + extrasPerHour + maintenancePerHour;

  // 3. Depreciation per Hour
  // If roiMonths is 0, avoid division by zero
  const safeRoiMonths = config.roiMonths === 0 ? 1 : config.roiMonths;
  const depreciationPerHour = config.printerCost / (safeRoiMonths * safeMonthlyHours);

  // 4. Labor Cost per Hour
  const laborCostPerHour = job.laborRatePerHour;

  // 5. Total Printing Hourly Rate
  const totalHourlyCost = totalOperationalHourly + depreciationPerHour + laborCostPerHour;

  // 6. Total Print Time Cost
  const printTimeCost = job.printHours * totalHourlyCost;

  // 7. Post Processing
  let postProcessCost = 0;
  if (job.useFixedPostProcessPrice) {
    postProcessCost = job.fixedPostProcessPrice;
  } else {
    postProcessCost = job.postProcessHours * job.laborRatePerHour;
  }

  // 8. Totals
  const subtotal = materialCost + printTimeCost + postProcessCost;
  const markupMultiplier = 1 + (job.markupPercentage / 100);
  const totalWithMarkup = subtotal * markupMultiplier;

  return {
    materialCost,
    operationalCostPerHour: totalOperationalHourly,
    totalOperationalHourly,
    depreciationPerHour,
    laborCostPerHour,
    totalHourlyCost,
    printTimeCost,
    postProcessCost,
    subtotal,
    totalWithMarkup,
    costPerGram,
    // Detailed breakdown
    electricityPerHour: powerPerHour,
    internetPerHour: internetPerHour,
    adsPerHour: adsPerHour,
    extrasPerHour: extrasPerHour,
    maintenancePerHour: maintenancePerHour,
  };
};

export const formatCurrency = (amount: number, currency = 'MXN') => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};
