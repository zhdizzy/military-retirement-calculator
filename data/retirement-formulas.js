/**
 * Military Retirement Pay Formulas
 * Covers all four active duty systems + Reserve/Guard points system
 */

// -------------------------
// RETIREMENT SYSTEM DETECTION
// -------------------------

/**
 * Detects retirement system from DIEMS (Date of Initial Entry into Military Service).
 * Returns 'final-pay' | 'high-3' | 'redux' | 'brs'
 * Note: REDUX requires the member to have accepted the Career Status Bonus at 15 years.
 *       We detect eligibility here; the user confirms if they took it.
 */
export function detectRetirementSystem(diemsDate) {
    const diems = new Date(diemsDate);
    const cutoff1980 = new Date('1980-09-08');
    const cutoff2018 = new Date('2018-01-01');

    if (diems < cutoff1980) return 'final-pay';
    if (diems >= cutoff2018) return 'brs';
    return 'high-3'; // default for 1980–2017; user may override to 'redux' or 'brs'
}

/**
 * Returns human-readable label for the retirement system.
 */
export function systemLabel(system) {
    return {
        'final-pay': 'Final Pay (pre-1980)',
        'high-3':    'High-3 (1980–2017)',
        'redux':     'REDUX / CSB (1986–2017, with Career Status Bonus)',
        'brs':       'Blended Retirement System (BRS)'
    }[system] || system;
}

// -------------------------
// ACTIVE DUTY CALCULATIONS
// -------------------------

/**
 * Calculates monthly retirement pay for active duty retirees.
 *
 * @param {string} system - 'final-pay' | 'high-3' | 'redux' | 'brs'
 * @param {number} yos - Years of service at retirement (must be >= 20)
 * @param {number} high3 - High-3 average monthly basic pay (or final pay for Final Pay system)
 * @returns {object} { monthly, multiplier, annualCOLA, notes }
 */
export function calcActiveDutyRetirement(system, yos, high3) {
    let multiplier = 0;
    let monthly = 0;
    let notes = [];

    switch (system) {
        case 'final-pay':
            // 2.5% per year, no cap on multiplier
            multiplier = yos * 0.025;
            monthly = multiplier * high3;
            notes.push('Final Pay: uses your last month\'s basic pay, not an average.');
            break;

        case 'high-3':
            // 2.5% per year, no cap
            multiplier = yos * 0.025;
            monthly = multiplier * high3;
            notes.push('High-3: based on average of your highest 36 consecutive months of basic pay.');
            break;

        case 'redux':
            // 40% at 20 years + 3.5% per year beyond 20
            // At 30 years = 40% + (10 × 3.5%) = 75% (converges with High-3)
            if (yos <= 20) {
                multiplier = 0.40;
            } else {
                multiplier = 0.40 + (yos - 20) * 0.035;
            }
            monthly = multiplier * high3;
            notes.push('REDUX: starts at 40% at 20 years (vs. 50% for High-3). COLA is 1% below CPI annually.');
            notes.push('At age 62, REDUX pay is adjusted up to what it would have been under High-3.');
            break;

        case 'brs':
            // 2.0% per year
            multiplier = yos * 0.020;
            monthly = multiplier * high3;
            notes.push('BRS: pension is 2.0%/year (vs. 2.5% for High-3), offset by TSP government matching.');
            break;

        default:
            multiplier = yos * 0.025;
            monthly = multiplier * high3;
    }

    return {
        monthly: Math.round(monthly * 100) / 100,
        multiplier: Math.round(multiplier * 10000) / 100, // as percentage, e.g. 50.00
        annual: Math.round(monthly * 12 * 100) / 100,
        notes
    };
}

/**
 * Estimates TSP matching value for BRS members.
 * Government contributes 1% automatically + matches up to 5%.
 * Assumes member contributes at least 5% (to capture full match).
 *
 * @param {number} annualBasePay - Annual basic pay (monthly × 12)
 * @param {number} yearsOfContributions - Years of TSP matching (typically career length)
 * @param {number} annualReturnRate - Assumed annual return (default 6%)
 */
export function estimateTSPMatchingValue(annualBasePay, yearsOfContributions, annualReturnRate = 0.06) {
    // Annual government contribution = 5% of base pay (1% auto + 4% match on 5% contribution)
    const annualContrib = annualBasePay * 0.05;
    // Future value of annuity
    let fv = 0;
    for (let y = 0; y < yearsOfContributions; y++) {
        fv = (fv + annualContrib) * (1 + annualReturnRate);
    }
    return Math.round(fv);
}

// -------------------------
// RESERVE / GUARD CALCULATIONS
// -------------------------

/**
 * Calculates monthly retirement pay for Reserve/Guard retirees.
 *
 * @param {number} totalPoints - Lifetime retirement points
 * @param {number} high3 - High-3 average monthly basic pay at retirement rank
 * @returns {object} { monthly, yearsEquivalent, multiplier }
 */
export function calcReserveRetirement(totalPoints, high3, system = 'high-3') {
    // Formula: (total points ÷ 360) × multiplier% × High-3
    // BRS uses 2.0%/yr, all other systems use 2.5%/yr
    const ratePerYear = system === 'brs' ? 0.020 : 0.025;
    const yearsEquivalent = totalPoints / 360;
    const multiplier = yearsEquivalent * ratePerYear;
    const monthly = multiplier * high3;

    return {
        monthly: Math.round(monthly * 100) / 100,
        annual: Math.round(monthly * 12 * 100) / 100,
        yearsEquivalent: Math.round(yearsEquivalent * 100) / 100,
        multiplier: Math.round(multiplier * 10000) / 100 // as percentage
    };
}

/**
 * Calculates earliest retirement pay draw age for Reserve/Guard.
 * Standard age is 60; reduced by 3 months per 90 consecutive days
 * of qualifying active duty after January 28, 2008.
 * Minimum age: 50.
 *
 * @param {number} deploymentPeriods - Number of complete 90-day deployment periods
 * @returns {object} { ageYears, ageMonths, totalMonthsReduction, displayAge }
 */
export function calcReserveRetirementAge(deploymentPeriods) {
    const reductionMonths = deploymentPeriods * 3;
    const totalMonthsFrom60 = 60 * 12 - reductionMonths;
    const floorMonths = 50 * 12; // minimum age 50
    const finalMonths = Math.max(totalMonthsFrom60, floorMonths);

    const ageYears = Math.floor(finalMonths / 12);
    const ageRemainingMonths = finalMonths % 12;

    let displayAge = `${ageYears}`;
    if (ageRemainingMonths > 0) {
        displayAge += ` years, ${ageRemainingMonths} months`;
    } else {
        displayAge += ' years';
    }

    return {
        ageYears,
        ageMonths: ageRemainingMonths,
        totalMonthsReduction: reductionMonths,
        displayAge,
        atMinimum: finalMonths === floorMonths
    };
}

/**
 * Estimates Reserve retirement points for a member who hasn't tracked them.
 *
 * Traditional drill accumulation (~78 pts/year):
 *   - Drill weekends: 48 pts/year (12 per quarter × 4)
 *   - Annual Training: 15 pts
 *   - Membership points: 15 pts/year
 *
 * AGR (Active Guard Reserve) accumulation:
 *   - Full-time active orders = 365 pts/year (same as active duty)
 *
 * @param {number} qualifyingYears - Total qualifying years
 * @param {number} deploymentYears - Years deployed during traditional drill periods (adds ~287 extra pts/yr)
 * @param {number} agrYears - Years served on AGR / full-time active orders (365 pts/yr)
 * @returns {number} Estimated total points
 */
export function estimateReservePoints(qualifyingYears, deploymentYears = 0, agrYears = 0) {
    const traditionalYears = Math.max(0, qualifyingYears - agrYears);
    const drillPoints  = traditionalYears * 78;
    const agrPoints    = agrYears * 365;
    const deployPoints = deploymentYears * 287; // extra above baseline for traditional drill deployments
    return Math.round(drillPoints + agrPoints + deployPoints);
}

// -------------------------
// CHAPTER 61 (MEDICAL RETIREMENT)
// -------------------------

/**
 * Calculates Chapter 61 medical retirement pay.
 *
 * Members separated for disability with a military rating of 30%+ receive the
 * HIGHER of two formulas:
 *   A) Disability Formula:  militaryRating × High-3 monthly pay
 *   B) Longevity Formula:   YOS × 2.5% × High-3 (same as active duty retirement)
 *
 * Members rated below 30% receive severance pay only (not retirement):
 *   2 × monthly basic pay × YOS (one-time, not recurring)
 *
 * @param {number} militaryRating - DoD disability rating (0–100, multiples of 10)
 * @param {number} yos - Years of service at separation
 * @param {number} high3 - High-3 average monthly basic pay
 * @returns {object} { eligible, monthly, annual, formula, disabilityAmount, longevityAmount, severancePay, notes }
 */
export function calcChapter61Retirement(militaryRating, yos, high3) {
    const notes = [];

    if (militaryRating < 30) {
        if (yos >= 20) {
            // 20+ years overrides the <30% severance rule — member qualifies for standard longevity retirement
            const longevityAmount = yos * 0.025 * high3;
            notes.push(`With 20+ years of service, you qualify for standard longevity retirement regardless of your DoD rating (${militaryRating}%). The <30% severance rule only applies if you have fewer than 20 years.`);
            notes.push('Your DoD disability rating is separate from your VA rating. You may receive VA compensation on top of retirement pay — CRDP/CRSC rules apply.');
            return {
                eligible: true,
                monthly: Math.round(longevityAmount),
                annual: Math.round(longevityAmount * 12),
                formula: 'longevity',
                disabilityAmount: 0,
                longevityAmount: Math.round(longevityAmount),
                severancePay: 0,
                notes
            };
        }
        // Under 20 years + under 30% DoD rating = severance only
        const severancePay = 2 * high3 * yos;
        notes.push('A DoD disability rating below 30% with fewer than 20 years of service does not qualify for medical retirement — only a one-time severance payment.');
        notes.push('If your VA rating is higher than your DoD rating, you can appeal your DoD rating through the Physical Evaluation Board (PEB).');
        return {
            eligible: false,
            monthly: 0,
            annual: 0,
            formula: 'severance',
            disabilityAmount: 0,
            longevityAmount: 0,
            severancePay: Math.round(severancePay),
            notes
        };
    }

    // Disability formula capped at 75% per 10 USC § 1401
    const disabilityPct    = Math.min(militaryRating / 100, 0.75);
    const disabilityAmount = disabilityPct * high3;
    const longevityAmount  = Math.min(yos * 0.025, 0.75) * high3;
    const monthly          = Math.max(disabilityAmount, longevityAmount);
    const formula          = longevityAmount >= disabilityAmount ? 'longevity' : 'disability';

    if (formula === 'longevity') {
        notes.push(`Longevity formula wins (${yos} yrs × 2.5% × High-3 = ${(Math.min(yos * 2.5, 75)).toFixed(1)}% multiplier). This is the same formula as standard active duty retirement.`);
    } else {
        const cappedNote = militaryRating > 75 ? ` (capped from ${militaryRating}% — 75% is the statutory maximum per 10 USC § 1401)` : '';
        notes.push(`Disability formula wins (${(disabilityPct * 100).toFixed(0)}% × High-3${cappedNote}). Your DoD rating multiplier exceeds your YOS-based multiplier.`);
    }

    if (yos >= 20) {
        notes.push('With 20+ years, you qualify for both Chapter 61 and standard retirement. CRDP applies at 50%+ VA rating — full concurrent receipt.');
    } else {
        notes.push('Chapter 61 retirees with <20 years are placed on the PDRL or TDRL. IMPORTANT: CRDP does not apply to Chapter 61 retirees with under 20 years of service (10 USC § 1414). Your pension is offset by your VA comp. CRSC can recover the offset if your disabilities are combat-related.');
    }

    notes.push('Your DoD disability rating is separate from your VA rating. You may receive VA compensation on top of Chapter 61 retirement pay.');

    return {
        eligible: true,
        monthly:  Math.round(monthly * 100) / 100,
        annual:   Math.round(monthly * 12 * 100) / 100,
        formula,
        multiplier: formula === 'longevity' ? Math.round(yos * 2.5 * 100) / 100 : militaryRating,
        disabilityAmount: Math.round(disabilityAmount * 100) / 100,
        longevityAmount:  Math.round(longevityAmount * 100) / 100,
        severancePay: 0,
        notes
    };
}

// -------------------------
// SBP (SURVIVOR BENEFIT PLAN)
// -------------------------

/**
 * Calculates SBP premium and survivor benefit.
 *
 * @param {number} retirementPay - Monthly retirement pay
 * @param {number} coverageFraction - Fraction of pay to cover (0.25 to 1.0, default 1.0 = full)
 * @returns {object} { premium, survivorBenefit, baseAmount }
 */
export function calcSBP(retirementPay, coverageFraction = 1.0) {
    const baseAmount = retirementPay * coverageFraction;
    // SBP premium: 6.5% of base amount
    const premium = baseAmount * 0.065;
    // Survivor receives 55% of base amount
    const survivorBenefit = baseAmount * 0.55;

    return {
        premium: Math.round(premium * 100) / 100,
        survivorBenefit: Math.round(survivorBenefit * 100) / 100,
        baseAmount: Math.round(baseAmount * 100) / 100
    };
}

// -------------------------
// CRDP / CRSC OPTIMIZER
// -------------------------

/**
 * Compares CRDP vs. CRSC after-tax income.
 *
 * CRDP: Full DoD retirement (taxable) + Full VA compensation (tax-free)
 * CRSC: Remaining taxable DoD retirement + CRSC payment (tax-free) + Full VA comp (tax-free)
 *
 * The CRSC amount equals the VA compensation calculated at the
 * combat-related rating only, capped at the veteran's full VA comp.
 *
 * @param {number} retirementPay - Monthly DoD retirement pay
 * @param {number} vaComp - Monthly VA compensation (full rating, with dependents)
 * @param {number} crscComp - Monthly VA compensation at combat-related rating only
 * @param {number} taxRate - Federal marginal tax rate (e.g. 0.22)
 * @param {number} vaRating - Full VA rating (for eligibility check)
 * @param {boolean} hasCombatRelated - Whether any disabilities are combat-related
 * @returns {object} Comparison data
 */
export function calcCRDPvsCRSC(retirementPay, vaComp, crscComp, taxRate, vaRating, hasCombatRelated, crdpBlocked = false, ch61LongevityCap = null) {
    const crdpEligible = !crdpBlocked && vaRating >= 50;
    const crscEligible = hasCombatRelated && crscComp > 0;

    // CRDP scenario
    // Full DoD retirement restored (taxable) + full VA comp (tax-free)
    const crdpGross = retirementPay + vaComp;
    const crdpAfterTax = (retirementPay * (1 - taxRate)) + vaComp;

    // CRSC scenario
    // Per 10 USC § 1413a, CRSC cannot exceed the amount of retired pay actually withheld.
    // The VA offset (withheld amount) = min(retirementPay, vaComp) — you can't offset more than you earn.
    const vaOffset   = Math.min(retirementPay, vaComp);
    let crscPayment  = Math.min(crscComp, vaOffset);
    const taxableDoD = Math.max(0, retirementPay - vaComp);

    // Chapter 61 under 20 years: additional CRSC cap per 10 USC § 1413a(b)(3)(B)
    // CRSC + residual retired pay cannot exceed the hypothetical longevity amount (YOS × 2.5% × High-3)
    if (ch61LongevityCap !== null) {
        const maxCRSC = Math.max(0, ch61LongevityCap - taxableDoD);
        crscPayment = Math.min(crscPayment, maxCRSC);
    }

    const crscGross   = taxableDoD + vaComp + crscPayment;
    const crscAfterTax = (taxableDoD * (1 - taxRate)) + vaComp + crscPayment;

    // Annual difference (CRSC - CRDP after tax)
    const monthlyAdvantage = crscAfterTax - crdpAfterTax;
    const annualAdvantage = monthlyAdvantage * 12;

    // The advantage of CRSC equals VA comp × tax rate (when all combat-related)
    // This confirms the intuition: you're converting taxable income to tax-free
    const recommendation = crscAfterTax >= crdpAfterTax ? 'crsc' : 'crdp';

    return {
        crdpEligible,
        crscEligible,
        crdp: {
            gross: Math.round(crdpGross * 100) / 100,
            afterTax: Math.round(crdpAfterTax * 100) / 100,
            taxableAmount: Math.round(retirementPay * 100) / 100,
            taxFreeAmount: Math.round(vaComp * 100) / 100
        },
        crsc: {
            gross: Math.round(crscGross * 100) / 100,
            afterTax: Math.round(crscAfterTax * 100) / 100,
            crscPayment: Math.round(crscPayment * 100) / 100,
            taxableAmount: Math.round(taxableDoD * 100) / 100,
            taxFreeAmount: Math.round((vaComp + crscPayment) * 100) / 100
        },
        monthlyAdvantage: Math.round(monthlyAdvantage * 100) / 100,
        annualAdvantage: Math.round(annualAdvantage * 100) / 100,
        recommendation // 'crsc' | 'crdp'
    };
}

// -------------------------
// LIFETIME VALUE
// -------------------------

/**
 * Estimates lifetime retirement pay value.
 * Uses current monthly pay projected to age 85 with COLA.
 *
 * @param {number} monthly - Monthly retirement pay
 * @param {number} currentAge - Veteran's current age at retirement
 * @param {number} colaRate - Annual COLA rate (default 2.5%)
 */
export function calcLifetimeValue(monthly, currentAge, colaRate = 0.025) {
    const yearsToAge85 = Math.max(0, 85 - currentAge);
    let total = 0;
    let annualPay = monthly * 12;
    for (let y = 0; y < yearsToAge85; y++) {
        total += annualPay;
        annualPay *= (1 + colaRate);
    }
    return Math.round(total);
}
