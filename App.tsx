import React, { useState } from 'react';
import { InputGroup } from './InputGroup';
import { ChartSection } from './components/ChartSection';
import { SettingsIcon, PrinterIcon, DownloadIcon } from './components/Icons';
import { calculateQuote, formatCurrency } from './utils/calculations';
import { GlobalConfig, JobDetails } from './types';

// Currency definitions
const CURRENCIES = [
  { code: 'MXN', label: 'Peso Mexicano (MXN)', symbol: '$' },
  { code: 'USD', label: 'Dólar (USD)', symbol: '$' },
  { code: 'EUR', label: 'Euro (EUR)', symbol: '€' },
  { code: 'COP', label: 'Peso Col. (COP)', symbol: '$' },
  { code: 'ARS', label: 'Peso Arg. (ARS)', symbol: '$' },
  { code: 'CLP', label: 'Peso Chi. (CLP)', symbol: '$' },
  { code: 'PEN', label: 'Sol Peru (PEN)', symbol: 'S/' },
  { code: 'BOB', label: 'Boliviano (BOB)', symbol: 'Bs' },
];

const MATERIALS = [
  { label: 'PLA', value: 'PLA' },
  { label: 'PETG', value: 'PETG' },
  { label: 'ABS', value: 'ABS' },
  { label: 'TPU', value: 'TPU' },
  { label: 'ASA', value: 'ASA' },
  { label: 'Resina', value: 'Resina' },
  { label: 'Nylon', value: 'Nylon' },
  { label: 'PC', value: 'PC' },
  { label: 'HIPS', value: 'HIPS' },
  { label: 'Otro', value: 'Otro' },
];

// Default values
const DEFAULT_CONFIG: GlobalConfig = {
  spoolCost: 600,
  spoolWeight: 1000,
  monthlyPowerCost: 200,
  monthlyInternetCost: 600,
  monthlyAdsCost: 500,
  monthlyExtraCost: 2000,
  printerCost: 22000,
  monthlyMaintenance: 400,
  roiMonths: 12,
  workDaysPerMonth: 24,
  workHoursPerDay: 8,
  currency: 'MXN'
};

const DEFAULT_JOB: JobDetails = {
  brand: 'Proyecto 1',
  material: 'PLA',
  consumedGrams: 150,
  printHours: 5,
  laborRatePerHour: 50,
  postProcessHours: 0,
  useFixedPostProcessPrice: false,
  fixedPostProcessPrice: 0,
  markupPercentage: 20
};

export default function App() {
  const [config, setConfig] = useState<GlobalConfig>(DEFAULT_CONFIG);
  const [job, setJob] = useState<JobDetails>(DEFAULT_JOB);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const results = calculateQuote(config, job);
  
  // Get current currency symbol
  const currencySymbol = CURRENCIES.find(c => c.code === config.currency)?.symbol || '$';

  const updateConfig = (key: keyof GlobalConfig, val: any) => {
    setConfig(prev => ({ ...prev, [key]: val }));
  };

  const updateJob = (key: keyof JobDetails, val: any) => {
    setJob(prev => ({ ...prev, [key]: val }));
  };

  return (
    <>
      {/* Main App Container - Hidden during print */}
      <div className="min-h-screen bg-slate-950 text-slate-100 pb-12 selection:bg-cyan-500 selection:text-white print:hidden relative isolate">
        
        {/* Background decoration & Logo */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-slate-950">
          
          {/* Large Watermark Logo */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] opacity-[0.03] select-none">
             <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full animate-pulse-slow">
                <defs>
                   <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#22d3ee" /> {/* Cyan */}
                      <stop offset="100%" stopColor="#a855f7" /> {/* Purple */}
                   </linearGradient>
                </defs>
                {/* Abstract 3D Cube / Hexagon shapes */}
                <path d="M100 20 L170 60 V140 L100 180 L30 140 V60 Z" fill="none" stroke="url(#logoGradient)" strokeWidth="1" />
                <path d="M100 20 V100 M170 60 L100 100 M30 60 L100 100" stroke="url(#logoGradient)" strokeWidth="1" />
                <path d="M100 100 V180" stroke="url(#logoGradient)" strokeWidth="1" />
                
                {/* Inner Hexagon representing infill/core */}
                <path d="M100 60 L135 80 V120 L100 140 L65 120 V80 Z" fill="url(#logoGradient)" fillOpacity="0.1" stroke="none" />
             </svg>
          </div>

          {/* Gradient Orbs */}
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px]"></div>
        </div>

        {/* Header */}
        <header className="sticky top-0 z-20 glass border-b-0 border-slate-800">
          <div className="max-w-md mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="text-cyan-400">
                 <PrinterIcon />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-white neon-text">
                Cotizador<span className="text-cyan-400">3D</span>
              </h1>
            </div>
            <button 
              onClick={() => setShowAdvanced(true)}
              className="p-2 rounded-full hover:bg-slate-800 transition-colors text-slate-400 hover:text-cyan-400"
            >
              <SettingsIcon />
            </button>
          </div>
        </header>

        <main className="max-w-md mx-auto px-6 py-6 space-y-6">
          
          {/* Section 1: Configuración Rápida */}
          <section className="glass rounded-2xl p-6 shadow-xl relative overflow-hidden">
             {/* Subtle shine effect */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/5 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none"></div>

            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2 relative z-10">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"></span> Configuración
            </h2>
            <div className="grid grid-cols-2 gap-4 relative z-10">
              <InputGroup 
                label="Costo Rollo" 
                type="number" 
                value={config.spoolCost} 
                onChange={v => updateConfig('spoolCost', v)} 
                prefix={currencySymbol}
              />
              <InputGroup 
                label="Peso (g)" 
                type="number" 
                value={config.spoolWeight} 
                onChange={v => updateConfig('spoolWeight', v)} 
                suffix="g"
              />
            </div>
            <div className="mt-2 text-xs text-center text-slate-500 relative z-10">
              Costo calculado: <span className="text-cyan-400 font-medium">{formatCurrency(results.costPerGram, config.currency)} / gramo</span>
            </div>
          </section>

          {/* Section 2: Calculadora */}
          <section className="glass rounded-2xl p-6 shadow-xl border-t-2 border-t-purple-500/20 relative overflow-hidden">
             {/* Subtle shine effect */}
             <div className="absolute top-0 left-0 w-32 h-32 bg-purple-400/5 rounded-full blur-2xl -ml-16 -mt-16 pointer-events-none"></div>

            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2 relative z-10">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]"></span> Calculadora
            </h2>
            <div className="mb-4 relative z-10">
              <InputGroup 
                label="Nombre del Proyecto" 
                type="text" 
                value={job.brand} 
                onChange={v => updateJob('brand', v)} 
              />
            </div>
            <div className="grid grid-cols-2 gap-4 relative z-10">
              <InputGroup 
                label="Peso Modelo" 
                type="number" 
                value={job.consumedGrams} 
                onChange={v => updateJob('consumedGrams', v)} 
                suffix="g"
              />
              <InputGroup 
                label="Tiempo" 
                type="number" 
                value={job.printHours} 
                onChange={v => updateJob('printHours', v)} 
                suffix="h"
              />
              <div className="col-span-2">
                <InputGroup 
                  label="Margen de Ganancia (%)" 
                  type="number" 
                  value={job.markupPercentage} 
                  onChange={v => updateJob('markupPercentage', v)} 
                  suffix="%"
                />
              </div>
            </div>
          </section>

          {/* Section 3: Resultados */}
          <section className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl blur opacity-20 transform translate-y-2 pointer-events-none"></div>
            <div className="relative glass bg-slate-900/80 rounded-3xl p-6 shadow-2xl border border-slate-700/50">
              <h2 className="text-center text-slate-400 text-sm font-medium uppercase tracking-widest mb-2">Costo Total Estimado</h2>
              <div className="flex items-center justify-center gap-1 mb-6">
                <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 filter drop-shadow-[0_0_10px_rgba(34,211,238,0.2)]">
                  {formatCurrency(results.totalWithMarkup, config.currency)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                 <div className="bg-slate-800/50 rounded-xl p-3 text-center border border-slate-700">
                    <span className="block text-xs text-slate-500 uppercase">Costo Base</span>
                    <span className="block text-lg font-semibold text-slate-200">{formatCurrency(results.subtotal, config.currency)}</span>
                 </div>
                 <div className="bg-slate-800/50 rounded-xl p-3 text-center border border-slate-700">
                    <span className="block text-xs text-slate-500 uppercase">Ganancia</span>
                    <span className="block text-lg font-semibold text-green-400">
                      {formatCurrency(results.totalWithMarkup - results.subtotal, config.currency)}
                    </span>
                 </div>
              </div>

              <div className="h-48 w-full -ml-2 mb-4">
                <ChartSection breakdown={results} currency={config.currency} />
              </div>

              {/* Detailed Breakdown Toggle */}
              <div className="border-t border-slate-700/50 pt-4 mb-4">
                <button 
                  onClick={() => setShowDetails(!showDetails)}
                  className="w-full flex items-center justify-between text-sm font-medium text-slate-400 hover:text-cyan-400 transition-colors p-2 rounded-lg hover:bg-slate-800/50 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">Desglose detallado por hora</span>
                  <svg 
                    className={`w-4 h-4 transition-transform duration-300 ${showDetails ? 'rotate-180' : ''}`} 
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showDetails && (
                  <div className="mt-3 space-y-2 px-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex justify-between text-sm text-slate-400">
                      <span>Electricidad</span>
                      <span className="text-slate-200 font-mono">{formatCurrency(results.electricityPerHour, config.currency)}/h</span>
                    </div>
                    <div className="flex justify-between text-sm text-slate-400">
                      <span>Internet</span>
                      <span className="text-slate-200 font-mono">{formatCurrency(results.internetPerHour, config.currency)}/h</span>
                    </div>
                    <div className="flex justify-between text-sm text-slate-400">
                      <span>Publicidad</span>
                      <span className="text-slate-200 font-mono">{formatCurrency(results.adsPerHour, config.currency)}/h</span>
                    </div>
                    <div className="flex justify-between text-sm text-slate-400">
                      <span>Mantenimiento</span>
                      <span className="text-slate-200 font-mono">{formatCurrency(results.maintenancePerHour, config.currency)}/h</span>
                    </div>
                    <div className="flex justify-between text-sm text-slate-400">
                      <span>Extras</span>
                      <span className="text-slate-200 font-mono">{formatCurrency(results.extrasPerHour, config.currency)}/h</span>
                    </div>
                    <div className="h-px bg-slate-800 my-2"></div>
                    <div className="flex justify-between text-sm text-purple-400">
                      <span>Depreciación Impresora</span>
                      <span className="font-mono">{formatCurrency(results.depreciationPerHour, config.currency)}/h</span>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Download PDF Button */}
              <div className="flex justify-center pt-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-xl transition-all border border-slate-700 hover:border-cyan-500/50 shadow-lg group"
                >
                  <DownloadIcon />
                  <span className="group-hover:text-cyan-300">Descargar Cotización (PDF)</span>
                </button>
              </div>

            </div>
          </section>

        </main>

        {/* Advanced Settings Modal */}
        {showAdvanced && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAdvanced(false)}></div>
            <div className="relative bg-slate-900 w-full max-w-lg h-[85vh] sm:h-auto sm:max-h-[85vh] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300 border border-slate-800">
              
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/90 backdrop-blur sticky top-0 z-10">
                <h3 className="text-lg font-bold text-white">Configuración Avanzada</h3>
                <button onClick={() => setShowAdvanced(false)} className="text-slate-400 hover:text-white p-2">
                  ✕
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto space-y-8">

                {/* General Settings (Currency & Material) */}
                <div>
                   <h4 className="text-sm font-semibold text-slate-100 uppercase tracking-wider mb-4">General</h4>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <InputGroup 
                        label="Moneda" 
                        type="select" 
                        value={config.currency} 
                        onChange={v => updateConfig('currency', v)} 
                        options={CURRENCIES.map(c => ({ label: c.label, value: c.code }))}
                     />
                     <InputGroup 
                        label="Material" 
                        type="select" 
                        value={job.material} 
                        onChange={v => updateJob('material', v)} 
                        options={MATERIALS}
                     />
                   </div>
                </div>
                
                {/* Costos Operativos */}
                <div>
                  <h4 className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-4">Costos Operativos (Mensual)</h4>
                  <div className="grid grid-cols-2 gap-4">
                     <InputGroup label="Electricidad" type="number" value={config.monthlyPowerCost} onChange={v => updateConfig('monthlyPowerCost', v)} prefix={currencySymbol} />
                     <InputGroup label="Internet" type="number" value={config.monthlyInternetCost} onChange={v => updateConfig('monthlyInternetCost', v)} prefix={currencySymbol} />
                     <InputGroup label="Publicidad" type="number" value={config.monthlyAdsCost} onChange={v => updateConfig('monthlyAdsCost', v)} prefix={currencySymbol} />
                     <InputGroup label="Mantenimiento" type="number" value={config.monthlyMaintenance} onChange={v => updateConfig('monthlyMaintenance', v)} prefix={currencySymbol} />
                     <InputGroup label="Extras" type="number" value={config.monthlyExtraCost} onChange={v => updateConfig('monthlyExtraCost', v)} prefix={currencySymbol} />
                  </div>
                </div>

                {/* Mano de Obra y Post-Proceso */}
                <div>
                  <h4 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-4">Mano de Obra</h4>
                  <div className="space-y-4">
                     <InputGroup label="Tarifa por Hora" type="number" value={job.laborRatePerHour} onChange={v => updateJob('laborRatePerHour', v)} prefix={currencySymbol} suffix="/h" />
                     
                     <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                        <div className="flex items-center justify-between mb-4">
                          <label className="text-sm text-slate-300">Precio fijo Post-proceso</label>
                          <input 
                              type="checkbox" 
                              className="w-5 h-5 rounded border-slate-600 text-cyan-500 focus:ring-cyan-500 bg-slate-700"
                              checked={job.useFixedPostProcessPrice}
                              onChange={(e) => updateJob('useFixedPostProcessPrice', e.target.checked)}
                          />
                        </div>
                        {job.useFixedPostProcessPrice ? (
                          <InputGroup label="Precio Fijo" type="number" value={job.fixedPostProcessPrice} onChange={v => updateJob('fixedPostProcessPrice', v)} prefix={currencySymbol} className="mb-0" />
                        ) : (
                          <InputGroup label="Horas Post-Proceso" type="number" value={job.postProcessHours} onChange={v => updateJob('postProcessHours', v)} suffix="h" className="mb-0" />
                        )}
                     </div>
                  </div>
                </div>

                {/* Amortización */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Amortización Equipo</h4>
                  <div className="grid grid-cols-2 gap-4">
                     <InputGroup label="Costo Impresora" type="number" value={config.printerCost} onChange={v => updateConfig('printerCost', v)} prefix={currencySymbol} />
                     <InputGroup label="Retorno (Meses)" type="number" value={config.roiMonths} onChange={v => updateConfig('roiMonths', v)} suffix="mes" />
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>

      {/* Printable Invoice View - Visible only when printing */}
      <div className="hidden print:block fixed inset-0 bg-white text-slate-900 p-8 z-[2000] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-start mb-8 border-b-2 border-slate-900 pb-6">
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">COTIZACIÓN</h1>
            <p className="text-sm text-slate-500 mt-1 uppercase tracking-wide">Servicios de Impresión 3D</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-lg">Fecha: {new Date().toLocaleDateString()}</p>
            <p className="text-sm text-slate-500">ID: {Date.now().toString().slice(-8)}</p>
          </div>
        </div>

        {/* Project Details */}
        <div className="mb-10">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-4 text-slate-400 border-b border-slate-200 pb-2">Detalles del Proyecto</h2>
            <div className="grid grid-cols-2 gap-x-12 gap-y-4">
               <div>
                 <p className="text-xs text-slate-500 uppercase">Proyecto / Cliente</p>
                 <p className="font-semibold text-lg">{job.brand || 'Sin nombre'}</p>
               </div>
               <div>
                 <p className="text-xs text-slate-500 uppercase">Material</p>
                 <p className="font-semibold text-lg">{job.material} <span className="text-sm font-normal text-slate-500">({job.consumedGrams}g)</span></p>
               </div>
               <div>
                 <p className="text-xs text-slate-500 uppercase">Tiempo Estimado</p>
                 <p className="font-semibold text-lg">{job.printHours} horas</p>
               </div>
            </div>
        </div>

        {/* Financial Breakdown Table */}
        <div className="mb-8">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-4 text-slate-400 border-b border-slate-200 pb-2">Desglose Económico</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase text-xs">
                <th className="text-left py-3 px-4 rounded-l-lg">Concepto</th>
                <th className="text-right py-3 px-4 rounded-r-lg">Importe</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-4 px-4">
                  <span className="font-semibold block text-slate-800">Material de Impresión</span>
                  <span className="text-xs text-slate-500">Filamento {job.material} ({formatCurrency(results.costPerGram, config.currency)}/g)</span>
                </td>
                <td className="text-right py-4 px-4 font-mono text-slate-700">{formatCurrency(results.materialCost, config.currency)}</td>
              </tr>
              <tr>
                <td className="py-4 px-4">
                  <span className="font-semibold block text-slate-800">Tiempo de Máquina & Operación</span>
                  <span className="text-xs text-slate-500">{job.printHours} horas x {formatCurrency(results.totalHourlyCost, config.currency)}/h</span>
                </td>
                <td className="text-right py-4 px-4 font-mono text-slate-700">{formatCurrency(results.printTimeCost, config.currency)}</td>
              </tr>
              <tr>
                <td className="py-4 px-4">
                  <span className="font-semibold block text-slate-800">Post-Proceso y Acabado</span>
                </td>
                <td className="text-right py-4 px-4 font-mono text-slate-700">{formatCurrency(results.postProcessCost, config.currency)}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-900">
                <td className="py-4 px-4 text-right font-bold uppercase text-slate-600">Subtotal</td>
                <td className="py-4 px-4 text-right font-mono font-bold text-slate-800">{formatCurrency(results.subtotal, config.currency)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end mt-4">
           <div className="w-1/2">
              <div className="flex justify-between items-center py-2 px-4 border-b border-slate-200">
                 <span className="text-sm text-slate-500">Margen Comercial / Ganancia</span>
                 <span className="font-mono text-slate-600">{formatCurrency(results.totalWithMarkup - results.subtotal, config.currency)}</span>
              </div>
              <div className="flex justify-between items-center bg-slate-900 text-white p-6 rounded-lg shadow-sm mt-4">
                <span className="text-xl font-bold uppercase tracking-wider">Total</span>
                <span className="text-3xl font-bold font-mono">{formatCurrency(results.totalWithMarkup, config.currency)}</span>
              </div>
           </div>
        </div>

        {/* Footer */}
        <div className="fixed bottom-12 left-8 right-8 text-center border-t border-slate-200 pt-8">
          <p className="text-xs text-slate-400">Este documento es una estimación de costos basada en los parámetros proporcionados.</p>
          <p className="text-sm font-semibold text-slate-900 mt-2">Gracias por su preferencia</p>
        </div>
      </div>
    </>
  );
}
