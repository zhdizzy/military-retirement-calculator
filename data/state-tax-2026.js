/**
 * State Income Tax Treatment of Military Retirement Pay — 2026
 * Sourced from State Benefits Stacker normalized-data.js
 *
 * treatment: 'exempt' | 'partial' | 'taxable' | 'none' (no state income tax)
 * partialExempt: annual dollar exemption (null if not applicable)
 * rate: effective state income tax rate (0 if none/exempt)
 */
export const STATE_TAX = {
    AL: { name: 'Alabama',              treatment: 'exempt',  partialExempt: null,  rate: 0.050 },
    AK: { name: 'Alaska',               treatment: 'none',    partialExempt: null,  rate: 0 },
    AZ: { name: 'Arizona',              treatment: 'taxable', partialExempt: null,  rate: 0.025 },
    AR: { name: 'Arkansas',             treatment: 'exempt',  partialExempt: null,  rate: 0.049 },
    CA: { name: 'California',           treatment: 'partial', partialExempt: 20000, rate: 0.085 },
    CO: { name: 'Colorado',             treatment: 'partial', partialExempt: null,  rate: 0.044 },
    CT: { name: 'Connecticut',          treatment: 'partial', partialExempt: null,  rate: 0.050 },
    DE: { name: 'Delaware',             treatment: 'partial', partialExempt: 12500, rate: 0.066 },
    FL: { name: 'Florida',              treatment: 'none',    partialExempt: null,  rate: 0 },
    GA: { name: 'Georgia',              treatment: 'exempt',  partialExempt: null,  rate: 0.055 },
    HI: { name: 'Hawaii',               treatment: 'exempt',  partialExempt: null,  rate: 0.079 },
    ID: { name: 'Idaho',                treatment: 'taxable', partialExempt: null,  rate: 0.058 },
    IL: { name: 'Illinois',             treatment: 'exempt',  partialExempt: null,  rate: 0.049 },
    IN: { name: 'Indiana',              treatment: 'partial', partialExempt: null,  rate: 0.030 },
    IA: { name: 'Iowa',                 treatment: 'exempt',  partialExempt: null,  rate: 0.060 },
    KS: { name: 'Kansas',               treatment: 'exempt',  partialExempt: null,  rate: 0.057 },
    KY: { name: 'Kentucky',             treatment: 'exempt',  partialExempt: null,  rate: 0.040 },
    LA: { name: 'Louisiana',            treatment: 'exempt',  partialExempt: null,  rate: 0.042 },
    ME: { name: 'Maine',                treatment: 'partial', partialExempt: 10000, rate: 0.070 },
    MD: { name: 'Maryland',             treatment: 'partial', partialExempt: null,  rate: 0.050 },
    MA: { name: 'Massachusetts',        treatment: 'exempt',  partialExempt: null,  rate: 0.050 },
    MI: { name: 'Michigan',             treatment: 'exempt',  partialExempt: null,  rate: 0.042 },
    MN: { name: 'Minnesota',            treatment: 'taxable', partialExempt: null,  rate: 0.070 },
    MS: { name: 'Mississippi',          treatment: 'exempt',  partialExempt: null,  rate: 0.047 },
    MO: { name: 'Missouri',             treatment: 'exempt',  partialExempt: null,  rate: 0.048 },
    MT: { name: 'Montana',              treatment: 'partial', partialExempt: null,  rate: 0.069 },
    NE: { name: 'Nebraska',             treatment: 'exempt',  partialExempt: null,  rate: 0.064 },
    NV: { name: 'Nevada',               treatment: 'none',    partialExempt: null,  rate: 0 },
    NH: { name: 'New Hampshire',        treatment: 'none',    partialExempt: null,  rate: 0 },
    NJ: { name: 'New Jersey',           treatment: 'exempt',  partialExempt: null,  rate: 0.055 },
    NM: { name: 'New Mexico',           treatment: 'partial', partialExempt: 30000, rate: 0.059 },
    NY: { name: 'New York',             treatment: 'partial', partialExempt: null,  rate: 0.060 },
    NC: { name: 'North Carolina',       treatment: 'exempt',  partialExempt: null,  rate: 0.045 },
    ND: { name: 'North Dakota',         treatment: 'exempt',  partialExempt: null,  rate: 0.020 },
    OH: { name: 'Ohio',                 treatment: 'exempt',  partialExempt: null,  rate: 0.039 },
    OK: { name: 'Oklahoma',             treatment: 'exempt',  partialExempt: null,  rate: 0.050 },
    OR: { name: 'Oregon',               treatment: 'partial', partialExempt: 6250,  rate: 0.090 },
    PA: { name: 'Pennsylvania',         treatment: 'exempt',  partialExempt: null,  rate: 0.031 },
    RI: { name: 'Rhode Island',         treatment: 'exempt',  partialExempt: null,  rate: 0.060 },
    SC: { name: 'South Carolina',       treatment: 'exempt',  partialExempt: null,  rate: 0.063 },
    SD: { name: 'South Dakota',         treatment: 'none',    partialExempt: null,  rate: 0 },
    TN: { name: 'Tennessee',            treatment: 'none',    partialExempt: null,  rate: 0 },
    TX: { name: 'Texas',                treatment: 'none',    partialExempt: null,  rate: 0 },
    UT: { name: 'Utah',                 treatment: 'partial', partialExempt: null,  rate: 0.046 },
    VT: { name: 'Vermont',              treatment: 'taxable', partialExempt: null,  rate: 0.066 },
    VA: { name: 'Virginia',             treatment: 'partial', partialExempt: null,  rate: 0.057 },
    WA: { name: 'Washington',           treatment: 'none',    partialExempt: null,  rate: 0 },
    WV: { name: 'West Virginia',        treatment: 'exempt',  partialExempt: null,  rate: 0.040 },
    WI: { name: 'Wisconsin',            treatment: 'taxable', partialExempt: null,  rate: 0.053 },
    WY: { name: 'Wyoming',              treatment: 'none',    partialExempt: null,  rate: 0 },
    DC: { name: 'Washington D.C.',      treatment: 'taxable', partialExempt: null,  rate: 0.085 },
    // U.S. Territories
    PR: { name: 'Puerto Rico',          treatment: 'partial', partialExempt: null,  rate: 0.033 },
    GU: { name: 'Guam',                 treatment: 'exempt',  partialExempt: null,  rate: 0 },
    VI: { name: 'U.S. Virgin Islands',  treatment: 'exempt',  partialExempt: null,  rate: 0 },
    AS: { name: 'American Samoa',       treatment: 'none',    partialExempt: null,  rate: 0 },
    MP: { name: 'Northern Mariana Islands', treatment: 'none', partialExempt: null,  rate: 0 },
};

/**
 * Returns the estimated annual state tax on military retirement pay.
 * @param {string} stateCode - Two-letter state code
 * @param {number} annualPension - Annual military retirement pay (gross)
 * @returns {{ stateTax, savings, treatment, label, note }}
 */
export function calcStateTax(stateCode, annualPension) {
    const s = STATE_TAX[stateCode];
    if (!s) return null;

    let taxableAmount = annualPension;
    let stateTax = 0;
    let savings = 0;
    let label = '';
    let note = '';

    if (s.treatment === 'none') {
        stateTax = 0;
        savings = annualPension * s.rate; // counterfactual (rate is 0 anyway)
        label = 'No State Income Tax';
        note = `${s.name} has no state income tax — your entire pension is state-tax-free.`;
    } else if (s.treatment === 'exempt') {
        stateTax = 0;
        // Savings = what you'd pay if fully taxable
        savings = annualPension * s.rate;
        label = 'Military Pay: Fully Exempt';
        note = `${s.name} fully exempts military retirement pay from state income tax. You save ${fmt(savings)}/yr vs. a state that fully taxes it.`;
    } else if (s.treatment === 'partial' && s.partialExempt !== null) {
        taxableAmount = Math.max(0, annualPension - s.partialExempt);
        stateTax = taxableAmount * s.rate;
        savings = annualPension * s.rate - stateTax;
        label = `Military Pay: $${s.partialExempt.toLocaleString()} Exempt`;
        note = `${s.name} exempts the first $${s.partialExempt.toLocaleString()} of military retirement pay. The remaining ${fmt(taxableAmount)} is taxed at ~${(s.rate * 100).toFixed(1)}%.`;
    } else if (s.treatment === 'partial') {
        // Partial but no fixed dollar amount in data — show estimated tax at full rate with a note
        stateTax = annualPension * s.rate * 0.5; // rough: partial ≈ ~50% of income taxed
        savings = annualPension * s.rate - stateTax;
        label = 'Military Pay: Partially Exempt';
        note = `${s.name} provides a partial exemption on military retirement pay. Exact rules vary — confirm with your state tax authority.`;
    } else {
        // Taxable
        stateTax = annualPension * s.rate;
        savings = 0;
        label = 'Military Pay: Fully Taxable';
        note = `${s.name} taxes military retirement pay at ~${(s.rate * 100).toFixed(1)}%. Moving to an exempt state could save you ${fmt(annualPension * s.rate)}/yr.`;
    }

    return {
        stateTax:  Math.round(stateTax),
        savings:   Math.round(savings),
        treatment: s.treatment,
        label,
        note,
        rate: s.rate
    };
}

function fmt(n) {
    return '$' + Math.round(n).toLocaleString();
}
