import React from 'react';

interface InputGroupProps {
  label: string;
  value: number | string;
  onChange: (value: any) => void;
  type?: 'text' | 'number' | 'select';
  step?: string;
  prefix?: string;
  suffix?: string;
  className?: string;
  options?: { label: string; value: string | number }[];
}

export const InputGroup: React.FC<InputGroupProps> = ({
  label,
  value,
  onChange,
  type = 'text',
  step = 'any',
  prefix,
  suffix,
  className = '',
  options = [],
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      <label className="block text-xs font-medium text-cyan-400/80 uppercase tracking-wider mb-2">
        {label}
      </label>
      <div className="relative rounded-xl shadow-sm neon-border transition-all duration-300">
        {type === 'select' ? (
          <div className="relative">
            <select
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className={`block w-full appearance-none rounded-xl border-slate-700/50 bg-slate-900/50 py-3 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 sm:text-sm border transition-colors pl-4 pr-10`}
            >
              {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        ) : (
          <>
            {prefix && (
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-slate-400 sm:text-sm">{prefix}</span>
              </div>
            )}
            <input
              type={type}
              step={step}
              className={`block w-full rounded-xl border-slate-700/50 bg-slate-900/50 py-3 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 sm:text-sm border transition-colors ${
                prefix ? 'pl-8' : 'pl-4'
              } ${suffix ? 'pr-12' : 'pr-4'}`}
              value={value}
              onChange={(e) => {
                if (type === 'number') {
                  // Prevent NaN if user clears input
                  const val = e.target.value;
                  onChange(val === '' ? 0 : Number(val));
                } else {
                  onChange(e.target.value);
                }
              }}
            />
            {suffix && (
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-slate-400 sm:text-sm font-medium">{suffix}</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
