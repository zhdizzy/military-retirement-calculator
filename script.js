import { getBasePay, estimateHigh3, RANK_LABELS } from './data/pay-tables-2026.js';
import { STATE_TAX, calcStateTax } from './data/state-tax-2026.js';
import { getVACompensation } from './data/va-rates-2026.js';
import {
    detectRetirementSystem, systemLabel,
    calcActiveDutyRetirement, estimateTSPMatchingValue,
    calcReserveRetirement, calcReserveRetirementAge, estimateReservePoints,
    calcChapter61Retirement,
    calcSBP, calcCRDPvsCRSC, calcLifetimeValue
} from './data/retirement-formulas.js';

// -------------------------
// DOM REFS
// -------------------------
const componentSel       = document.getElementById('component'); // hidden input
const compActiveBtn      = document.getElementById('comp-active-btn');
const compReserveBtn     = document.getElementById('comp-reserve-btn');
const compChapter61Btn   = document.getElementById('comp-chapter61-btn');
const currentYosInp   = document.getElementById('current-yos');
const diemsInp        = document.getElementById('diems');
const systemSel       = document.getElementById('retirement-system');
const detectedBadge   = document.getElementById('detected-system-badge');

const retirementRankSel = document.getElementById('retirement-rank');
const retirementYosInp  = document.getElementById('retirement-yos');
const currentAgeInp     = document.getElementById('current-age');

const retirementRankCatSel = document.getElementById('retirement-rank-category');
const tigInp               = document.getElementById('tig');
const stateSelectEl      = document.getElementById('state-select');
const ssToggleBtn        = document.getElementById('ss-toggle-btn');
const ssSection          = document.getElementById('ss-section');
const ssFraBenefitInp    = document.getElementById('ss-fra-benefit');
const ssResult           = document.getElementById('ss-result');
const scenarioToggleBtn  = document.getElementById('scenario-toggle-btn');
const scenarioSection    = document.getElementById('scenario-section');
const scenarioYosInp     = document.getElementById('scenario-yos');
const scenarioResult     = document.getElementById('scenario-result');
const high3AutoValue    = document.getElementById('high3-auto-value');
const high3OverrideChk  = document.getElementById('high3-override-check');
const high3OverrideInp  = document.getElementById('high3-override-input');
const high3Manual       = document.getElementById('high3-manual');

const chapter61Section  = document.getElementById('chapter61-section');
const dodRatingSel      = document.getElementById('dod-rating');
const ch61CombatChk     = document.getElementById('ch61-combat-related');
const reserveSection    = document.getElementById('reserve-section');
const totalPointsInp    = document.getElementById('total-points');
const qualifyingYrsInp  = document.getElementById('qualifying-years');
const deploymentYrsInp  = document.getElementById('deployment-years');
const estimatePointsBtn = document.getElementById('estimate-points-btn');
const pointsEstResult   = document.getElementById('points-estimate-result');
const deploymentPeriods = document.getElementById('deployment-periods');
const reserveTypeInp    = document.getElementById('reserve-type');
const resTraditionalBtn = document.getElementById('res-traditional-btn');
const resAGRBtn         = document.getElementById('res-agr-btn');
const agrYearsInp       = document.getElementById('agr-years');
const agrYearsRow       = document.getElementById('agr-years-row');
const deploymentYrsRow  = document.getElementById('deployment-years-row');
const agrTafmsRow       = document.getElementById('agr-tafms-row');
const agrTafmsChk       = document.getElementById('agr-tafms');

const vaRatingSel       = document.getElementById('va-rating');
const combatRelatedSel  = document.getElementById('combat-related');
const partialCombatRow  = document.getElementById('partial-combat-row');
const combatRatingSel   = document.getElementById('combat-rating');
const taxBracketSel     = document.getElementById('tax-bracket');
const vaMarriedSel      = document.getElementById('va-married');
const vaChildrenU18     = document.getElementById('va-children-under18');
const vaChildrenO18     = document.getElementById('va-children-over18');
const vaDepParents      = document.getElementById('va-dep-parents');
const spouseAaRow       = document.getElementById('spouse-aa-row-va');
const vaSpouseAa        = document.getElementById('va-spouse-aa');
const vaSmcK            = document.getElementById('va-smc-k');
const vaSmcKCount       = document.getElementById('va-smc-k-count');

const sbpYesBtn         = document.getElementById('sbp-yes-btn');
const sbpNoBtn          = document.getElementById('sbp-no-btn');
const sbpCoverageRow    = document.getElementById('sbp-coverage-row');
const sbpCoverageSel    = document.getElementById('sbp-coverage');

const heroDom           = document.getElementById('hero-card');
const crdpCrscResult    = document.getElementById('crdp-crsc-result');
const sbpResult         = document.getElementById('sbp-result');
const summarySection    = document.getElementById('summary-section');
const summaryContent    = document.getElementById('summary-content');
const divorceToggle     = document.getElementById('divorce-toggle');
const divorceSection    = document.getElementById('divorce-section');
const divorceYearsInp   = document.getElementById('divorce-years-married');
const divorcePercentSel = document.getElementById('divorce-percent');
const divorceResult     = document.getElementById('divorce-result');

const printBtn          = document.getElementById('print-btn');
const shareBtn          = document.getElementById('share-btn');
const emailForm         = document.getElementById('email-results-form');
const emailInput        = document.getElementById('email-input');
const emailStatus       = document.getElementById('email-status');

// -------------------------
// STATE
// -------------------------
let sbpElected = true;

// -------------------------
// FORMATTING
// -------------------------
const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
const fmtDec = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
const pct = (n) => `${(n).toFixed(1)}%`;

// -------------------------
// RANK DROPDOWN POPULATION
// -------------------------
function populateRankDropdown(sel, category) {
    const options = RANK_LABELS[category] || [];
    sel.innerHTML = options.map(o => `<option value="${o.value}">${o.label}</option>`).join('');
}


function syncRetirementRankDropdown() {
    // Retirement rank follows retirement rank category (independent)
    populateRankDropdown(retirementRankSel, retirementRankCatSel.value);
    updateHigh3Estimate();
    recalculate();
}

// -------------------------
// HIGH-3 AUTO-ESTIMATE
// -------------------------
function updateHigh3Estimate() {
    const rank = retirementRankSel.value;
    const yos  = parseInt(retirementYosInp.value) || 20;
    const tig  = parseInt(tigInp.value) || 3;
    const est  = estimateHigh3(rank, yos, tig);
    if (est) {
        high3AutoValue.textContent = fmtDec(est);
    } else {
        high3AutoValue.textContent = '—';
    }
}

function getHigh3() {
    if (high3OverrideChk.checked) {
        return parseFloat(high3Manual.value) || null;
    }
    const rank = retirementRankSel.value;
    const yos  = parseInt(retirementYosInp.value) || 20;
    const tig  = parseInt(tigInp.value) || 3;
    return estimateHigh3(rank, yos, tig);
}

// -------------------------
// DIEMS → RETIREMENT SYSTEM DETECTION
// -------------------------
function onDiemsChange() {
    const val = diemsInp.value;
    if (!val) {
        detectedBadge.style.display = 'none';
        return;
    }
    const sys = detectRetirementSystem(val);
    systemSel.value = sys;
    detectedBadge.style.display = 'block';

    let note = '';
    if (sys === 'brs') {
        note = 'BRS detected — you joined on/after Jan 1, 2018.';
    } else if (sys === 'high-3') {
        note = 'High-3 detected — you joined Sept 1980–Dec 2017. If you opted into BRS during the 2018 window, select BRS below.';
    } else if (sys === 'final-pay') {
        note = 'Final Pay detected — you joined before Sept 8, 1980.';
    }
    detectedBadge.textContent = note;
    recalculate();
}

// -------------------------
// COMPONENT TOGGLE (Active / Reserve)
// -------------------------
function setComponent(val) {
    componentSel.value = val;
    [compActiveBtn, compReserveBtn, compChapter61Btn].forEach(b => b.classList.remove('active'));
    if (val === 'active')     compActiveBtn.classList.add('active');
    if (val === 'reserve')    compReserveBtn.classList.add('active');
    if (val === 'chapter61')  compChapter61Btn.classList.add('active');
    onComponentChange();
}

function onComponentChange() {
    const val = componentSel.value;
    reserveSection.style.display   = val === 'reserve'   ? 'block' : 'none';
    chapter61Section.style.display = val === 'chapter61' ? 'block' : 'none';

    const yosLabel = document.getElementById('retirement-yos-label');
    if (val === 'chapter61') {
        yosLabel.textContent = 'Years of Service at Medical Separation:';
        retirementYosInp.min = '1';
        retirementYosInp.placeholder = 'e.g. 12';
        if (parseInt(retirementYosInp.value) >= 20) retirementYosInp.value = '';
    } else {
        yosLabel.textContent = 'Years of Service at Retirement:';
        retirementYosInp.min = '20';
        retirementYosInp.placeholder = 'e.g. 20';
        if (!retirementYosInp.value || parseInt(retirementYosInp.value) < 20) retirementYosInp.value = '20';
    }
    recalculate();
}

// -------------------------
// SBP TOGGLE
// -------------------------
function setSBP(elected) {
    sbpElected = elected;
    sbpYesBtn.classList.toggle('active', elected);
    sbpNoBtn.classList.toggle('active', !elected);
    sbpCoverageRow.style.display = elected ? 'flex' : 'none';
    recalculate();
}

// -------------------------
// COMBAT RELATED TOGGLE
// -------------------------
function onCombatRelatedChange() {
    partialCombatRow.style.display = combatRelatedSel.value === 'partial' ? 'block' : 'none';
    recalculate();
}

// -------------------------
// SPOUSE A&A TOGGLE
// -------------------------
function onMarriedChange() {
    spouseAaRow.style.display = vaMarriedSel.value === 'yes' ? 'flex' : 'none';
    recalculate();
}

// -------------------------
// RESERVE TYPE TOGGLE (Traditional vs AGR)
// -------------------------
function setReserveType(val) {
    reserveTypeInp.value = val;
    resTraditionalBtn.classList.toggle('active', val === 'traditional');
    resAGRBtn.classList.toggle('active', val === 'agr');
    agrYearsRow.style.display      = val === 'agr' ? 'block' : 'none';
    agrTafmsRow.style.display      = val === 'agr' ? 'block' : 'none';
    deploymentYrsRow.style.display = val === 'traditional' ? 'flex' : 'none';
    pointsEstResult.textContent = '';
}

resTraditionalBtn.addEventListener('click', () => { setReserveType('traditional'); recalculate(); });
resAGRBtn.addEventListener('click',         () => { setReserveType('agr');         recalculate(); });
agrTafmsChk.addEventListener('change', recalculate);

// -------------------------
// POINTS ESTIMATOR
// -------------------------
function estimatePoints() {
    const qyrs   = parseInt(qualifyingYrsInp.value) || 0;
    const isAGR  = reserveTypeInp.value === 'agr';
    const agrYrs = isAGR ? (parseInt(agrYearsInp.value) || qyrs) : 0;
    const dyrs   = isAGR ? 0 : (parseInt(deploymentYrsInp.value) || 0);
    if (qyrs < 20) {
        pointsEstResult.textContent = 'Enter at least 20 qualifying years.';
        return;
    }
    const est = estimateReservePoints(qyrs, dyrs, agrYrs);
    const breakdown = isAGR
        ? `${agrYrs} AGR yrs × 365 pts + ${Math.max(0, qyrs - agrYrs)} traditional yrs × 78 pts`
        : `typical drill + ${dyrs} deployment year${dyrs !== 1 ? 's' : ''}`;
    pointsEstResult.textContent = `Estimated points: ~${est.toLocaleString()} (${breakdown})`;
    totalPointsInp.value = est;
    recalculate();
}

// -------------------------
// MAIN CALCULATION
// -------------------------
function recalculate() {
    const component    = componentSel.value;
    const isReserve    = component === 'reserve';
    const isChapter61  = component === 'chapter61';
    const system       = systemSel.value;
    const retYos       = parseInt(retirementYosInp.value) || (isChapter61 ? 8 : 20);
    const currentAge   = parseInt(currentAgeInp.value) || 40;
    const high3        = getHigh3();
    const retirementRank = retirementRankSel.value;
    const vaRating     = parseInt(vaRatingSel.value) || 0;
    // Chapter 61 combat-related retirement pay is tax-free per 26 USC § 104(a)(4)
    const ch61TaxFree  = isChapter61 && ch61CombatChk.checked;
    const taxRate      = ch61TaxFree ? 0 : (parseFloat(taxBracketSel.value) || 0.22);
    const combatType   = combatRelatedSel.value;
    const coverageFrac = parseFloat(sbpCoverageSel.value) || 1.0;

    if (!high3 || (!isChapter61 && retYos < 20)) {
        renderHeroPlaceholder();
        crdpCrscResult.innerHTML = '';
        sbpResult.innerHTML = '';
        summarySection.style.display = 'none';
        return;
    }

    // --- Retirement Pay ---
    let retResult;
    let reserveAgeResult = null;
    let chapter61Result  = null;

    if (isReserve) {
        const isAGR      = reserveTypeInp.value === 'agr';
        const hasTAFMS   = isAGR && agrTafmsChk.checked;

        if (hasTAFMS) {
            // AGR with 20+ years TAFMS — qualifies for active duty retirement (immediate pay)
            retResult = calcActiveDutyRetirement(system, retYos, high3);
            retResult.notes = retResult.notes || [];
            retResult.notes.unshift('AGR with 20+ years TAFMS: qualifies for active duty retirement. Pay begins immediately at retirement — not at age 60.');
            reserveAgeResult = null; // pay is immediate, not deferred
        } else {
            const totalPts = parseInt(totalPointsInp.value) || 0;
            if (totalPts < 50) {
                renderHeroPlaceholder('Enter your total retirement points to see your Reserve pay estimate.');
                return;
            }
            retResult = calcReserveRetirement(totalPts, high3, system);
            const periods = parseInt(deploymentPeriods.value) || 0;
            reserveAgeResult = calcReserveRetirementAge(periods);
        }
    } else if (isChapter61) {
        const dodRating = parseInt(dodRatingSel.value) || 0;
        chapter61Result = calcChapter61Retirement(dodRating, retYos, high3);
        if (!chapter61Result.eligible) {
            // Severance only — show a special placeholder
            renderHeroPlaceholder(`At a ${dodRating}% DoD rating, you receive severance pay only — not retirement. One-time payment: $${chapter61Result.severancePay.toLocaleString()}.`);
            crdpCrscResult.innerHTML = '';
            sbpResult.innerHTML = '';
            summarySection.style.display = 'none';
            return;
        }
        retResult = chapter61Result;
    } else {
        retResult = calcActiveDutyRetirement(system, retYos, high3);
    }

    const monthlyPension = retResult.monthly;
    const retirementAge  = currentAge + Math.max(0, (isReserve ? 20 : retYos) - (parseInt(currentYosInp.value) || retYos));

    // --- VA Compensation ---
    const smcKCount = vaSmcK.checked ? (parseInt(vaSmcKCount.value) || 1) : 0;
    const smcKAmount = smcKCount * 139.87;

    const dependents = {
        married:          vaMarriedSel.value === 'yes',
        childrenUnder18:  parseInt(vaChildrenU18.value) || 0,
        childrenOver18:   parseInt(vaChildrenO18.value) || 0,
        dependentParents: parseInt(vaDepParents.value) || 0,
        spouseAA:         vaSpouseAa.checked
    };
    const vaCompBase = getVACompensation(vaRating, dependents);
    const vaComp = vaCompBase + smcKAmount;

    // --- CRDP / CRSC ---
    let crscComp = 0;
    const hasCombat = combatType !== 'none';
    if (hasCombat && vaRating > 0) {
        if (combatType === 'all') {
            crscComp = vaComp;
        } else {
            const combatRating = parseInt(combatRatingSel.value) || 0;
            crscComp = getVACompensation(combatRating, dependents) + smcKAmount;
        }
    }

    const crdpCrsc = calcCRDPvsCRSC(monthlyPension, vaComp, crscComp, taxRate, vaRating, hasCombat);

    // --- SBP ---
    const sbpData = calcSBP(monthlyPension, coverageFrac);

    // --- Lifetime Value ---
    const ageAtRetirement = isReserve && reserveAgeResult
        ? reserveAgeResult.ageYears
        : retirementAge;
    const lifetimeVal = calcLifetimeValue(monthlyPension, ageAtRetirement);

    // --- BRS TSP Estimate ---
    let tspValue = null;
    if (system === 'brs') {
        const annualPay = high3 * 12;
        tspValue = estimateTSPMatchingValue(annualPay, retYos);
    }

    // ---- RENDER ----
    renderHero(monthlyPension, retResult, system, isReserve, high3, retYos, lifetimeVal, tspValue, retirementRank, reserveAgeResult, vaComp, taxRate, isChapter61, chapter61Result);
    renderCRDPvsCRSC(crdpCrsc, vaComp, vaRating, hasCombat, monthlyPension, taxRate);
    renderSBP(sbpData, monthlyPension);
    renderSummary(monthlyPension, vaComp, sbpData, crdpCrsc, lifetimeVal, isReserve, reserveAgeResult, system, tspValue, dependents, ageAtRetirement, isChapter61, chapter61Result);
    renderScenarioComparison();
    renderSSEstimate();
}

// -------------------------
// RENDER: HERO CARD
// -------------------------
function renderHeroPlaceholder(msg) {
    heroDom.className = 'hero-card-placeholder';
    heroDom.innerHTML = `<p class="hero-placeholder-text">${msg || 'Fill in your service profile below to see your estimated retirement pay.'}</p>`;
}

function renderHero(monthly, retResult, system, isReserve, high3, retYos, lifetime, tspValue, rank, reserveAge, vaComp, taxRate, isChapter61 = false, chapter61Result = null) {
    const sysLabel     = isChapter61
        ? `Chapter 61 · ${chapter61Result?.formula === 'longevity' ? 'Longevity Formula' : 'Disability Formula'}`
        : systemLabel(system);
    const pensionAfterTax = monthly * (1 - taxRate);
    const totalMonthly = monthly + vaComp;
    const hasVA        = vaComp > 0;

    const heroAmount   = hasVA ? totalMonthly : monthly;
    const heroLabel    = hasVA ? 'Estimated Monthly Income (Pension + VA)' : 'Estimated Monthly Retirement Pay (Gross)';

    let subCards = `
        <div class="hero-sub-card">
            <p class="hero-sub-label">Pension (gross)</p>
            <p class="hero-sub-value">${fmtDec(monthly)}</p>
        </div>
        <div class="hero-sub-card">
            <p class="hero-sub-label">${hasVA ? 'VA Comp (tax-free)' : 'Multiplier'}</p>
            <p class="hero-sub-value">${hasVA ? fmtDec(vaComp) : pct(retResult.multiplier)}</p>
        </div>
        <div class="hero-sub-card">
            <p class="hero-sub-label">Lifetime Pension (to 85)</p>
            <p class="hero-sub-value">${fmt(lifetime)}</p>
        </div>
    `;

    if (isReserve && reserveAge) {
        subCards = `
            <div class="hero-sub-card">
                <p class="hero-sub-label">Pension (after tax)</p>
                <p class="hero-sub-value">${fmtDec(pensionAfterTax)}</p>
            </div>
            <div class="hero-sub-card">
                <p class="hero-sub-label">Pay Starts At</p>
                <p class="hero-sub-value">Age ${reserveAge.displayAge}</p>
            </div>
            <div class="hero-sub-card">
                <p class="hero-sub-label">Lifetime Pension (to 85)</p>
                <p class="hero-sub-value">${fmt(lifetime)}</p>
            </div>
        `;
    }

    let tspNote = '';
    if (tspValue) {
        tspNote = `<p class="hero-detail" style="margin-top:6px;">+ <strong>${fmt(tspValue)}</strong> estimated TSP matching value (BRS)</p>`;
    }

    const pensionNote = hasVA
        ? `<p class="hero-detail"><strong>${rank}</strong> &middot; Pension: <strong>${fmtDec(monthly)}</strong> gross &middot; VA: <strong>${fmtDec(vaComp)}</strong> tax-free</p>`
        : `<p class="hero-detail"><strong>${rank}</strong> &middot; High-3: <strong>${fmtDec(high3)}</strong> &middot; ${isReserve ? 'Reserve/Guard' : `${retYos} yrs`}</p>`;

    heroDom.className = 'hero-result';
    heroDom.innerHTML = `
        <p class="hero-label">${heroLabel}</p>
        <p class="hero-amount">${fmtDec(heroAmount)}</p>
        ${pensionNote}
        ${tspNote}
        <span class="hero-system-badge">${sysLabel}</span>
        <div class="hero-sub-cards">${subCards}</div>
    `;
}

// -------------------------
// RENDER: CRDP vs CRSC
// -------------------------
function renderCRDPvsCRSC(data, vaComp, vaRating, hasCombat, pension, taxRate) {
    if (vaRating === 0) {
        crdpCrscResult.innerHTML = `<p class="input-hint" style="text-align:center; margin-top:8px;">Select your VA rating above to see your CRDP vs. CRSC comparison.</p>`;
        return;
    }

    // Helper: build a line-by-line breakdown table for a card
    function buildBreakdown(rows) {
        return `<div class="comp-breakdown">${rows.map(r =>
            `<div class="row ${r.cls || ''}"><span>${r.label}</span><span class="val">${r.val}</span></div>`
        ).join('')}</div>`;
    }

    let html = `
        <div class="crdp-crsc-explainer">
            <div class="explainer-card">
                <p class="explainer-title">What is CRDP?</p>
                <p class="explainer-body"><strong>Concurrent Retirement and Disability Pay</strong> restores your full military pension on top of your VA compensation. It's automatic if you're rated 50%+. Your pension is taxable income — but you receive both in full.</p>
            </div>
            <div class="explainer-card">
                <p class="explainer-title">What is CRSC?</p>
                <p class="explainer-body"><strong>Combat-Related Special Compensation</strong> replaces the taxable portion of your pension with a tax-free payment — but only for your combat-related disabilities. You must apply to your branch. It wins when your combat-related rating is high enough that the tax savings outweigh the difference.</p>
            </div>
        </div>
    `;

    // Eligibility warning
    if (!data.crdpEligible) {
        html += `<div class="eligibility-note">⚠️ <strong>CRDP requires a VA rating of 50% or higher.</strong> At your current rating (${vaRating}%), your DoD retirement pay is offset dollar-for-dollar by your VA compensation. CRSC (if combat-related) can eliminate that offset.</div>`;
    }

    if (!hasCombat) {
        // No combat — only CRDP applies, show clean single card
        const pensionAfterTax = pension * (1 - taxRate);
        const totalAfterTax   = pensionAfterTax + vaComp;
        html += `
            <div class="comp-card crdp winner" style="max-width:480px; margin:0 auto;">
                <p class="comp-card-label">CRDP — Concurrent Receipt (Automatic)</p>
                <p class="comp-card-amount">${fmtDec(totalAfterTax)}/mo total take-home</p>
                ${buildBreakdown([
                    { label: 'Military pension (gross)', val: fmtDec(pension) + '/mo', cls: 'taxable' },
                    { label: `Federal tax (${(taxRate*100).toFixed(0)}%)`, val: '−' + fmtDec(pension * taxRate) + '/mo', cls: 'deduction' },
                    { label: 'Pension after tax', val: fmtDec(pensionAfterTax) + '/mo' },
                    { label: 'VA compensation (always tax-free)', val: '+' + fmtDec(vaComp) + '/mo', cls: 'tax-free' },
                    { label: 'Total monthly take-home', val: fmtDec(totalAfterTax) + '/mo', cls: 'total' }
                ])}
                <p style="font-size:0.75em; color:var(--text-secondary); margin-top:10px; font-style:italic;">CRSC not available — no combat-related disabilities indicated.</p>
            </div>`;
        crdpCrscResult.innerHTML = html;
        return;
    }

    // Side-by-side comparison — show what changes between CRDP and CRSC
    const rec = data.recommendation;

    // CRDP numbers
    const crdpPensionAfterTax = pension * (1 - taxRate);
    const crdpTotal           = crdpPensionAfterTax + vaComp;

    // CRSC numbers
    const crscTaxablePension  = data.crsc.taxableAmount;
    const crscTaxablePaid     = crscTaxablePension * taxRate;
    const crscPensionAfterTax = crscTaxablePension * (1 - taxRate);
    const crscPayment         = data.crsc.crscPayment;
    const crscTotal           = crscPensionAfterTax + vaComp + crscPayment;

    html += `<div class="crdp-crsc-comparison">`;

    // CRDP card
    html += `
        <div class="comp-card crdp ${rec === 'crdp' ? 'winner' : ''}">
            <p class="comp-card-label">CRDP${data.crdpEligible ? ' — Automatic' : ' — Not Eligible'}</p>
            <p class="comp-card-amount">${fmtDec(crdpTotal)}/mo take-home</p>
            ${buildBreakdown([
                { label: 'Pension (gross, taxable)', val: fmtDec(pension) + '/mo', cls: 'taxable' },
                { label: `Federal tax (${(taxRate*100).toFixed(0)}%)`, val: '−' + fmtDec(pension * taxRate) + '/mo', cls: 'deduction' },
                { label: 'VA compensation (tax-free)', val: '+' + fmtDec(vaComp) + '/mo', cls: 'tax-free' },
                { label: 'Total monthly take-home', val: fmtDec(crdpTotal) + '/mo', cls: 'total' }
            ])}
            ${rec === 'crdp' ? '<span class="comp-card-winner-badge">Recommended</span>' : ''}
        </div>`;

    // CRSC card
    html += `
        <div class="comp-card crsc ${rec === 'crsc' ? 'winner' : ''}">
            <p class="comp-card-label">CRSC — Requires Branch Application</p>
            <p class="comp-card-amount">${fmtDec(crscTotal)}/mo take-home</p>
            ${buildBreakdown([
                { label: 'Taxable pension portion', val: fmtDec(crscTaxablePension) + '/mo', cls: 'taxable' },
                { label: `Federal tax (${(taxRate*100).toFixed(0)}%)`, val: crscTaxablePension > 0 ? '−' + fmtDec(crscTaxablePaid) + '/mo' : '$0', cls: 'deduction' },
                { label: 'VA compensation (tax-free)', val: '+' + fmtDec(vaComp) + '/mo', cls: 'tax-free' },
                { label: 'CRSC payment (tax-free)', val: '+' + fmtDec(crscPayment) + '/mo', cls: 'tax-free' },
                { label: 'Total monthly take-home', val: fmtDec(crscTotal) + '/mo', cls: 'total' }
            ])}
            ${rec === 'crsc' ? '<span class="comp-card-winner-badge">Recommended</span>' : ''}
        </div>`;

    html += `</div>`;

    // Verdict
    const advantage = Math.abs(data.annualAdvantage);
    // Explain the gap: CRSC only wins when combat rating ≈ full VA rating
    const combatRatingVal  = parseInt(combatRatingSel?.value || vaRating);
    const combatCoverageRatio = combatRatingVal / vaRating; // 0–1
    let crscWinCondition = '';
    if (rec === 'crdp' && hasCombat) {
        if (combatCoverageRatio < 0.75) {
            crscWinCondition = ` Your combat-related rating (${combatRatingVal}%) covers only ${Math.round(combatCoverageRatio * 100)}% of your total VA rating — so the CRSC payment is too small to offset losing the taxable pension restoration. CRSC typically wins when your combat-related rating is close to or equal to your full VA rating.`;
        } else {
            crscWinCondition = ` Even with a high combat-related rating, the tax savings from CRSC don't outweigh the fully restored pension under CRDP at your current tax bracket.`;
        }
    }

    if (rec === 'crsc') {
        html += `
            <div class="crdp-crsc-verdict">
                <p class="verdict-line">CRSC puts more money in your pocket. Your combat-related rating is high enough that converting your pension offset to a tax-free CRSC payment outweighs the cost of the reduced taxable pension.</p>
                <p class="verdict-advantage">${fmt(advantage)}/year more than CRDP after taxes</p>
            </div>`;
    } else {
        html += `
            <div class="crdp-crsc-verdict favor-crdp">
                <p class="verdict-line">CRDP puts more money in your pocket.${crscWinCondition}</p>
                <p class="verdict-advantage">${fmt(advantage)}/year more than CRSC after taxes</p>
            </div>`;
    }

    html += `
        <div class="crdp-crsc-footnote">
            <p><strong>How to read this:</strong> Both options pay your full VA compensation — that never changes. The difference is what happens to your military pension. <strong>CRDP</strong> restores your full pension (taxable income). <strong>CRSC</strong> replaces the offset portion with a tax-free payment based only on your combat-related disabilities. CRSC wins when that tax-free payment is large enough to beat a fully restored but taxable pension — typically when your combat-related rating is high and you're in a higher tax bracket.</p>
            <p style="margin-top:8px;">You can switch between the two once per year during DFAS's open season (elections due by January 31). CRSC requires a one-time application to your branch — it is never automatic.</p>
        </div>
    `;

    crdpCrscResult.innerHTML = html;
}

// -------------------------
// RENDER: SBP
// -------------------------
function renderSBP(sbpData, monthlyPension) {
    const isMarried = vaMarriedSel.value === 'yes';
    const hasChildren = (parseInt(vaChildrenU18.value) || 0) + (parseInt(vaChildrenO18.value) || 0) > 0;
    const beneficiaryLabel = isMarried ? 'Spouse Survivor Annuity'
        : hasChildren ? 'Child Survivor Annuity'
        : 'Survivor Annuity';
    const noElectLabel = isMarried
        ? 'SBP not elected. Your spouse will not receive a survivor annuity from your military retirement.'
        : hasChildren
        ? 'SBP not elected. Your children will not receive a survivor annuity from your military retirement.'
        : 'SBP not elected. No survivor annuity will be paid from your military retirement.';

    if (!sbpElected) {
        sbpResult.innerHTML = `<p class="input-hint" style="text-align:center;">${noElectLabel}</p>`;
        return;
    }

    const takeHome = monthlyPension - sbpData.premium;
    sbpResult.innerHTML = `
        <div class="sbp-result-card">
            <div class="sbp-stat deduction">
                <p class="sbp-stat-label">Monthly Premium</p>
                <p class="sbp-stat-value">−${fmtDec(sbpData.premium)}</p>
            </div>
            <div class="sbp-stat">
                <p class="sbp-stat-label">Take-Home After SBP</p>
                <p class="sbp-stat-value">${fmtDec(takeHome)}</p>
            </div>
            <div class="sbp-stat survivor">
                <p class="sbp-stat-label">${beneficiaryLabel}</p>
                <p class="sbp-stat-value">${fmtDec(sbpData.survivorBenefit)}/mo</p>
            </div>
        </div>`;
}

// -------------------------
// RENDER: FULL SUMMARY
// -------------------------
function renderSummary(pension, vaComp, sbpData, crdpCrsc, lifetime, isReserve, reserveAge, system, tspValue, dependents = {}, ageAtRetirement = null, isChapter61 = false, chapter61Result = null) {
    const sbpPremium   = sbpElected ? sbpData.premium : 0;
    const netPension   = pension - sbpPremium;
    const ch61TaxFree  = isChapter61 && ch61CombatChk.checked;
    const taxRate      = ch61TaxFree ? 0 : (parseFloat(taxBracketSel.value) || 0.22);
    const vaRating     = parseInt(vaRatingSel.value) || 0;
    const hasCombat    = combatRelatedSel.value !== 'none';
    const rec          = crdpCrsc.recommendation;

    // Determine best total take-home
    let totalMonthly = 0;
    let incomeRows   = '';

    // Pension (net of SBP)
    const taxablePension = rec === 'crsc' ? crdpCrsc.crsc.taxableAmount : pension;
    const netTaxablePension = taxablePension * (1 - taxRate);

    if (vaRating === 0) {
        // No VA — just pension
        totalMonthly = netPension * (1 - taxRate);
        incomeRows = `
            <div class="summary-row"><span class="summary-row-label">Military Retirement (taxable)</span><span class="summary-row-value">${fmtDec(pension)}/mo gross</span></div>
            <div class="summary-row"><span class="summary-row-label">After federal tax (${(taxRate*100).toFixed(0)}% bracket)</span><span class="summary-row-value">${fmtDec(pension * (1-taxRate))}/mo</span></div>
        `;
        if (sbpElected) {
            totalMonthly -= sbpPremium;
            incomeRows += `<div class="summary-row"><span class="summary-row-label">SBP Premium (deducted)</span><span class="summary-row-value negative">−${fmtDec(sbpPremium)}/mo</span></div>`;
        }
    } else if (rec === 'crsc' && hasCombat && crdpCrsc.crscEligible) {
        totalMonthly = netTaxablePension + vaComp + crdpCrsc.crsc.crscPayment - sbpPremium;
        incomeRows = `
            <div class="summary-row"><span class="summary-row-label">Taxable DoD Retirement</span><span class="summary-row-value">${fmtDec(crdpCrsc.crsc.taxableAmount)}/mo gross → ${fmtDec(crdpCrsc.crsc.taxableAmount*(1-taxRate))}/mo after tax</span></div>
            <div class="summary-row"><span class="summary-row-label">VA Compensation (tax-free)</span><span class="summary-row-value positive">${fmtDec(vaComp)}/mo</span></div>
            <div class="summary-row"><span class="summary-row-label">CRSC Payment (tax-free)</span><span class="summary-row-value positive">${fmtDec(crdpCrsc.crsc.crscPayment)}/mo</span></div>
        `;
        if (sbpElected) {
            incomeRows += `<div class="summary-row"><span class="summary-row-label">SBP Premium</span><span class="summary-row-value negative">−${fmtDec(sbpPremium)}/mo</span></div>`;
        }
    } else {
        // CRDP scenario
        totalMonthly = pension * (1 - taxRate) + vaComp - sbpPremium;
        incomeRows = `
            <div class="summary-row"><span class="summary-row-label">Military Retirement (taxable)</span><span class="summary-row-value">${fmtDec(pension)}/mo gross → ${fmtDec(pension*(1-taxRate))}/mo after tax</span></div>
            <div class="summary-row"><span class="summary-row-label">VA Compensation (tax-free)</span><span class="summary-row-value positive">${fmtDec(vaComp)}/mo</span></div>
        `;
        if (sbpElected) {
            incomeRows += `<div class="summary-row"><span class="summary-row-label">SBP Premium</span><span class="summary-row-value negative">−${fmtDec(sbpPremium)}/mo</span></div>`;
        }
    }

    const reserveAgeNote = isReserve && reserveAge
        ? `<div class="summary-row"><span class="summary-row-label">Pay Begins At</span><span class="summary-row-value">Age ${reserveAge.displayAge}${reserveAge.atMinimum ? ' (minimum age)' : ''}</span></div>`
        : '';

    const tspRow = tspValue
        ? `<div class="summary-row"><span class="summary-row-label">Estimated TSP Matching Value (BRS)</span><span class="summary-row-value positive">${fmt(tspValue)} lump sum</span></div>`
        : '';

    // TRICARE value vs. comparable civilian coverage
    // 2026 TRICARE Prime retiree enrollment: $648/yr individual, $1,296/yr family
    // Comparable civilian marketplace coverage (KFF 2024 benchmark, pre-subsidy):
    //   ~$7,500/yr individual, ~$21,000/yr family
    const hasFamily = dependents.married || (dependents.childrenUnder18 + dependents.childrenOver18) > 0;
    const tricarePremium  = hasFamily ? 1296  : 648;
    const civilianCost    = hasFamily ? 21000 : 7500;
    const tricareAnnual   = civilianCost - tricarePremium;
    const tricareMonthly  = Math.round(tricareAnnual / 12);
    const tricareRow = `<div class="summary-row">
        <span class="summary-row-label">TRICARE ${hasFamily ? 'Family' : 'Individual'} — Annual Value vs. Civilian Coverage</span>
        <span class="summary-row-value positive">${fmt(tricareAnnual)}/yr (~${fmtDec(tricareMonthly)}/mo saved)</span>
    </div>`;

    // State tax
    const stateCode = stateSelectEl.value;
    const annualPension = pension * 12;
    let stateTaxRow = '';
    if (stateCode) {
        const st = calcStateTax(stateCode, annualPension);
        if (st) {
            const stateValClass = st.treatment === 'taxable' ? 'negative' : 'positive';
            const stateVal = st.treatment === 'none' || st.treatment === 'exempt'
                ? `${fmt(st.savings)}/yr saved`
                : st.treatment === 'partial'
                    ? `${fmt(st.stateTax)}/yr owed (${fmt(st.savings)}/yr saved vs. fully taxable)`
                    : `${fmt(st.stateTax)}/yr`;
            stateTaxRow = `
                <div class="summary-row">
                    <span class="summary-row-label">State Tax — ${STATE_TAX[stateCode].name} (${st.label})</span>
                    <span class="summary-row-value ${stateValClass}">${stateVal}</span>
                </div>
                <div class="summary-row" style="font-size:0.82em; color:var(--text-secondary);">
                    <span>${st.note}</span>
                </div>`;
        }
    }

    const lifetimeRow = `<div class="summary-row"><span class="summary-row-label">Lifetime Pension Value (to age 85, 2.5% COLA)</span><span class="summary-row-value positive">${fmt(lifetime)}</span></div>`;

    // --- Divorce / Former Spouse Division ---
    let divorceRow = '';
    let divorceDeduction = 0;
    if (divorceToggle.checked) {
        const divorceYears = parseInt(divorceYearsInp.value) || 0;
        const divorcePct   = parseFloat(divorcePercentSel.value) || 0.50;
        const retYos       = parseInt(retirementYosInp.value) || 20;

        if (divorceYears > 0) {
            // Disposable retired pay = pension minus VA waiver (VA comp offset)
            // CRDP restores the pension, making it divisible again. CRSC is NOT divisible.
            const hasCRDP = vaRating >= 50;
            const vaWaiver = hasCRDP ? 0 : Math.min(pension, vaComp); // CRDP eliminates waiver
            const disposable = pension - vaWaiver;
            const coverture = Math.min(divorceYears / retYos, 1.0);
            divorceDeduction = disposable * coverture * divorcePct;

            const coverturePct = (coverture * 100).toFixed(1);
            const awardPct = (divorcePct * 100).toFixed(0);

            divorceRow = `
                <div class="summary-row">
                    <span class="summary-row-label">Former Spouse Share (${divorceYears}/${retYos} yrs × ${awardPct}% = ${(coverture * divorcePct * 100).toFixed(1)}% of disposable pay)</span>
                    <span class="summary-row-value negative">−${fmtDec(divorceDeduction)}/mo</span>
                </div>
                <div class="summary-row">
                    <span class="summary-row-label">Your Take-Home After Division</span>
                    <span class="summary-row-value">${fmtDec(totalMonthly - divorceDeduction)}/mo</span>
                </div>`;

            // Render the divorce section card
            divorceResult.innerHTML = `
                <div class="dic-sbp-notice" style="border-color: var(--primary-light); background: rgba(43,108,176,0.05); margin-top: 12px;">
                    <p style="margin:0 0 4px; font-weight:600;">Estimated Former Spouse Share: ${fmtDec(divorceDeduction)}/mo (${fmt(divorceDeduction * 12)}/yr)</p>
                    <p style="margin:0; font-size:0.88em; color:var(--text-secondary);">Coverture fraction: ${divorceYears} yrs married ÷ ${retYos} yrs service = ${coverturePct}%. Court award: ${awardPct}%. Calculated on disposable retired pay of ${fmtDec(disposable)}/mo${hasCRDP ? ' (includes CRDP — CRDP is divisible)' : ''}. VA disability and CRSC are not divisible.</p>
                </div>`;
        } else {
            divorceResult.innerHTML = '';
        }
    } else {
        divorceResult.innerHTML = '';
    }

    const retAge       = ageAtRetirement || (parseInt(currentAgeInp.value) || 38);
    const yearsToAge85 = Math.max(0, 85 - retAge);
    const vaLabel       = vaRating > 0 ? ' + VA compensation' : '';

    summaryContent.innerHTML = `
        <div class="summary-grid">
            <div class="summary-stat highlight">
                <p class="summary-stat-label">Gross Monthly Income</p>
                <p class="summary-stat-value">${fmtDec(totalMonthly)}</p>
                <p class="summary-stat-sub">pension${vaLabel}</p>
            </div>
            <div class="summary-stat">
                <p class="summary-stat-label">Annual Gross Income</p>
                <p class="summary-stat-value">${fmt(totalMonthly * 12)}</p>
                <p class="summary-stat-sub">pension${vaLabel}</p>
            </div>
            <div class="summary-stat">
                <p class="summary-stat-label">Lifetime Pension (to 85)</p>
                <p class="summary-stat-value">${fmt(lifetime)}</p>
                <p class="summary-stat-sub">${yearsToAge85} yrs · 2.5% COLA · gross pension only</p>
            </div>
        </div>
        <div class="summary-breakdown">
            ${incomeRows}
            <div class="summary-row total-row">
                <span class="summary-row-label">Total Gross Monthly Income</span>
                <span class="summary-row-value">${fmtDec(totalMonthly)}/mo</span>
            </div>
            ${divorceRow}
            ${reserveAgeNote}
            ${tspRow}
            ${tricareRow}
            ${stateTaxRow}
            ${lifetimeRow}
        </div>
        ${isChapter61 && chapter61Result ? `<div class="chapter61-notes">${chapter61Result.notes.map(n => `<p>• ${n}</p>`).join('')}</div>` : ''}
        <p class="tax-note">Estimates based on 2026 pay tables and VA compensation rates. All income figures shown are gross (pre-federal-tax). VA compensation and CRSC are always tax-free. Lifetime pension assumes ${yearsToAge85} years of payments (retirement age ${retAge} → 85) compounded at 2.5% COLA annually — actual COLA adjusts with CPI each December. TRICARE value based on 2026 TRICARE Prime retiree enrollment fees vs. KFF 2024 benchmark marketplace silver plan premiums; actual civilian coverage costs vary by state, age, and plan.</p>
    `;

    summarySection.style.display = 'block';
}

// -------------------------
// SHARE URL
// -------------------------
function buildShareUrl() {
    const params = new URLSearchParams();
    params.set('comp', componentSel.value);
    params.set('cyos', currentYosInp.value);
    params.set('sys', systemSel.value);
    params.set('rcat', retirementRankCatSel.value);
    params.set('rrank', retirementRankSel.value);
    params.set('ryos', retirementYosInp.value);
    params.set('age', currentAgeInp.value);
    if (tigInp.value) params.set('tig', tigInp.value);
    if (high3OverrideChk.checked && high3Manual.value) params.set('h3', high3Manual.value);
    if (componentSel.value === 'reserve') {
        if (totalPointsInp.value) params.set('pts', totalPointsInp.value);
        if (deploymentPeriods.value) params.set('dp', deploymentPeriods.value);
    }
    params.set('va', vaRatingSel.value);
    params.set('cr', combatRelatedSel.value);
    if (combatRelatedSel.value === 'partial') params.set('crat', combatRatingSel.value);
    params.set('tax', taxBracketSel.value);
    params.set('mar', vaMarriedSel.value);
    if (vaChildrenU18.value !== '0') params.set('cu18', vaChildrenU18.value);
    if (vaChildrenO18.value !== '0') params.set('co18', vaChildrenO18.value);
    params.set('dep', vaDepParents.value);
    if (vaSmcK.checked) { params.set('smck', vaSmcKCount.value); }
    if (stateSelectEl.value) params.set('st', stateSelectEl.value);
    if (scenarioSection.style.display === 'block' && scenarioYosInp.value) params.set('sc', scenarioYosInp.value);
    params.set('sbp', sbpElected ? '1' : '0');
    if (sbpElected) params.set('sbpc', sbpCoverageSel.value);
    return window.location.origin + window.location.pathname + '?' + params.toString();
}

function loadFromUrl() {
    const p = new URLSearchParams(window.location.search);
    if (p.size === 0) return;

    if (p.has('comp'))  setComponent(p.get('comp'));
    if (p.has('rcat'))  { retirementRankCatSel.value = p.get('rcat'); populateRankDropdown(retirementRankSel, p.get('rcat')); }
    if (p.has('rrank')) retirementRankSel.value = p.get('rrank');
    if (p.has('cyos'))  currentYosInp.value = p.get('cyos');
    if (p.has('sys'))   systemSel.value = p.get('sys');
    if (p.has('ryos'))  retirementYosInp.value = p.get('ryos');
    if (p.has('age'))   currentAgeInp.value = p.get('age');
    if (p.has('tig'))   tigInp.value = p.get('tig');
    if (p.has('h3')) {
        high3OverrideChk.checked = true;
        high3OverrideInp.style.display = 'block';
        high3Manual.value = p.get('h3');
    }
    if (p.has('pts'))  totalPointsInp.value = p.get('pts');
    if (p.has('dp'))   deploymentPeriods.value = p.get('dp');
    if (p.has('va'))   vaRatingSel.value = p.get('va');
    if (p.has('cr'))   combatRelatedSel.value = p.get('cr');
    if (p.has('crat')) combatRatingSel.value = p.get('crat');
    if (p.has('tax'))  taxBracketSel.value = p.get('tax');
    if (p.has('mar'))  vaMarriedSel.value = p.get('mar');
    if (p.has('cu18')) vaChildrenU18.value = p.get('cu18');
    if (p.has('co18')) vaChildrenO18.value = p.get('co18');
    if (p.has('dep'))  vaDepParents.value = p.get('dep');

    const sbp = p.get('sbp');
    if (sbp !== null) setSBP(sbp === '1');
    if (p.has('sbpc')) sbpCoverageSel.value = p.get('sbpc');
    if (p.has('smck')) {
        vaSmcK.checked = true;
        vaSmcKCount.disabled = false;
        vaSmcKCount.value = p.get('smck');
    }

    if (p.has('st')) stateSelectEl.value = p.get('st');
    if (p.has('sc')) {
        scenarioYosInp.value = p.get('sc');
        scenarioSection.style.display = 'block';
        scenarioToggleBtn.textContent = '− Close comparison';
    }

    onComponentChange();
    onCombatRelatedChange();
    onMarriedChange();
    updateHigh3Estimate();
    recalculate();
}

// -------------------------
// EMAIL CAPTURE
// -------------------------
async function handleEmailSubmit(e) {
    e.preventDefault();
    const email = emailInput.value.trim();
    if (!email) return;

    const submitBtn = document.getElementById('email-submit-btn');
    submitBtn.disabled = true;
    emailStatus.textContent = 'Sending...';

    try {
        const shareUrl = buildShareUrl();
        const resp = await fetch('/api/email-results', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, resultsUrl: shareUrl, source: 'military-retirement' })
        });
        if (resp.ok) {
            emailStatus.textContent = '✓ Check your inbox — your results link is on its way.';
            emailStatus.style.color = 'var(--green)';
        } else {
            emailStatus.textContent = 'Something went wrong. Try again.';
            emailStatus.style.color = 'var(--accent)';
        }
    } catch {
        emailStatus.textContent = 'Something went wrong. Try again.';
        emailStatus.style.color = 'var(--accent)';
    } finally {
        submitBtn.disabled = false;
    }
}

// -------------------------
// EVENT LISTENERS
// -------------------------
function attachListeners() {
    retirementRankCatSel.addEventListener('change', syncRetirementRankDropdown);
    retirementRankSel.addEventListener('change', () => { updateHigh3Estimate(); recalculate(); });
    compActiveBtn.addEventListener('click',    () => setComponent('active'));
    compReserveBtn.addEventListener('click',   () => setComponent('reserve'));
    compChapter61Btn.addEventListener('click', () => setComponent('chapter61'));
    diemsInp.addEventListener('change', onDiemsChange);
    systemSel.addEventListener('change', recalculate);
    currentYosInp.addEventListener('input', recalculate);
    retirementYosInp.addEventListener('input', () => { updateHigh3Estimate(); recalculate(); });
    tigInp.addEventListener('input', () => { updateHigh3Estimate(); recalculate(); });
    currentAgeInp.addEventListener('input', recalculate);

    high3OverrideChk.addEventListener('change', () => {
        high3OverrideInp.style.display = high3OverrideChk.checked ? 'block' : 'none';
        recalculate();
    });
    high3Manual.addEventListener('input', recalculate);

    totalPointsInp.addEventListener('input', recalculate);
    deploymentPeriods.addEventListener('input', recalculate);
    agrYearsInp.addEventListener('input', recalculate);
    estimatePointsBtn.addEventListener('click', estimatePoints);

    vaRatingSel.addEventListener('change', recalculate);
    combatRelatedSel.addEventListener('change', onCombatRelatedChange);
    combatRatingSel.addEventListener('change', recalculate);
    taxBracketSel.addEventListener('change', recalculate);
    vaMarriedSel.addEventListener('change', onMarriedChange);
    vaChildrenU18.addEventListener('input', recalculate);
    vaChildrenO18.addEventListener('input', recalculate);
    vaDepParents.addEventListener('change', recalculate);
    vaSpouseAa.addEventListener('change', recalculate);
    vaSmcK.addEventListener('change', () => {
        vaSmcKCount.disabled = !vaSmcK.checked;
        recalculate();
    });
    vaSmcKCount.addEventListener('change', recalculate);

    sbpYesBtn.addEventListener('click', () => setSBP(true));
    sbpNoBtn.addEventListener('click', () => setSBP(false));
    sbpCoverageSel.addEventListener('change', recalculate);

    divorceToggle.addEventListener('change', () => {
        divorceSection.style.display = divorceToggle.checked ? 'block' : 'none';
        recalculate();
    });
    divorceYearsInp.addEventListener('input', recalculate);
    divorcePercentSel.addEventListener('change', recalculate);

    printBtn.addEventListener('click', () => window.print());
    shareBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(buildShareUrl()).then(() => {
            shareBtn.textContent = 'Link Copied!';
            setTimeout(() => { shareBtn.textContent = 'Copy Link to Share'; }, 2000);
        });
    });

    emailForm.addEventListener('submit', handleEmailSubmit);

    stateSelectEl.addEventListener('change', recalculate);

    scenarioToggleBtn.addEventListener('click', () => {
        const open = scenarioSection.style.display === 'block';
        scenarioSection.style.display = open ? 'none' : 'block';
        scenarioToggleBtn.textContent = open ? '+ Compare a second retirement scenario' : '− Close comparison';
    });
    scenarioYosInp.addEventListener('input', renderScenarioComparison);

    ssToggleBtn.addEventListener('click', () => {
        const open = ssSection.style.display === 'block';
        ssSection.style.display = open ? 'none' : 'block';
        ssToggleBtn.textContent = open ? '+ Add Social Security Estimate' : '− Close Social Security';
    });
    ssFraBenefitInp.addEventListener('input', renderSSEstimate);

    dodRatingSel.addEventListener('change', recalculate);
    ch61CombatChk.addEventListener('change', recalculate);
}

// -------------------------
// INIT
// -------------------------
function populateStateDropdown() {
    const sorted = Object.entries(STATE_TAX).sort((a, b) => a[1].name.localeCompare(b[1].name));
    for (const [code, s] of sorted) {
        const opt = document.createElement('option');
        opt.value = code;
        opt.textContent = s.name;
        stateSelectEl.appendChild(opt);
    }
}

// -------------------------
// RENDER: SCENARIO COMPARISON
// -------------------------
function renderScenarioComparison() {
    const scenYos = parseInt(scenarioYosInp.value);
    if (!scenYos || scenYos < 20 || scenYos > 45) {
        scenarioResult.innerHTML = '';
        return;
    }

    const rank      = retirementRankSel.value;
    const tig       = parseInt(tigInp.value) || 3;
    const system    = systemSel.value;
    const baseYos   = parseInt(retirementYosInp.value) || 20;
    const age       = parseInt(currentAgeInp.value) || 38;
    const ch61Free  = componentSel.value === 'chapter61' && ch61CombatChk.checked;
    const taxRate   = ch61Free ? 0 : (parseFloat(taxBracketSel.value) || 0.22);

    const high3A = getHigh3();
    const high3B = estimateHigh3(rank, scenYos, tig);

    if (!high3A || !high3B) { scenarioResult.innerHTML = ''; return; }

    const retA = calcActiveDutyRetirement(system, baseYos, high3A);
    const retB = calcActiveDutyRetirement(system, scenYos, high3B);

    const lifetimeA = calcLifetimeValue(retA.monthly, age);
    const lifetimeB = calcLifetimeValue(retB.monthly, age + Math.max(0, scenYos - baseYos));

    const monthlyDiff  = retB.monthly - retA.monthly;
    const annualDiff   = monthlyDiff * 12;
    const lifetimeDiff = lifetimeB - lifetimeA;

    // Break-even: how many extra years of service to earn back the pension you gave up by waiting
    // Each extra year costs ~12 months of the lower pension; you gain annualDiff/yr thereafter
    const extraYears   = scenYos - baseYos;
    const foregone     = retA.monthly * 12 * extraYears; // pension missed while serving longer
    const breakevenYrs = annualDiff > 0 ? Math.ceil(foregone / annualDiff) : null;

    const sign = n => n >= 0 ? '+' : '';

    scenarioResult.innerHTML = `
        <div class="scenario-comparison">
            <div class="scenario-col">
                <p class="scenario-col-label">Retire at ${baseYos} years</p>
                <p class="scenario-col-value">${fmtDec(retA.monthly)}/mo</p>
                <p class="scenario-col-sub">${retA.multiplier.toFixed(1)}% multiplier · ${fmt(lifetimeA)} lifetime</p>
            </div>
            <div class="scenario-vs">vs</div>
            <div class="scenario-col">
                <p class="scenario-col-label">Retire at ${scenYos} years</p>
                <p class="scenario-col-value">${fmtDec(retB.monthly)}/mo</p>
                <p class="scenario-col-sub">${retB.multiplier.toFixed(1)}% multiplier · ${fmt(lifetimeB)} lifetime</p>
            </div>
        </div>
        <div class="scenario-verdict">
            <span class="${monthlyDiff >= 0 ? 'positive' : 'negative'}">${sign(monthlyDiff)}${fmtDec(Math.abs(monthlyDiff))}/mo</span> &middot;
            <span class="${annualDiff >= 0 ? 'positive' : 'negative'}">${sign(annualDiff)}${fmt(Math.abs(annualDiff))}/yr</span>
            ${breakevenYrs !== null
                ? `· Break-even: <strong>${breakevenYrs} years</strong> after retirement`
                : monthlyDiff < 0 ? '· Retiring earlier pays more' : ''}
        </div>
        <p class="input-hint" style="margin-top:6px;">Break-even accounts for the pension you forgo while serving the extra ${extraYears} year${extraYears !== 1 ? 's' : ''}.</p>
    `;
}

// -------------------------
// RENDER: SOCIAL SECURITY ESTIMATE
// -------------------------
function renderSSEstimate() {
    if (ssSection.style.display !== 'block') return;
    const fra = parseFloat(ssFraBenefitInp.value) || 0;
    if (!fra) { ssResult.innerHTML = ''; return; }

    // SSA reduction/increase factors (2026 rules)
    const age62 = Math.round(fra * 0.70);  // ~30% reduction for claiming at 62 (40 months early)
    const age67 = Math.round(fra);          // full retirement age
    const age70 = Math.round(fra * 1.24);  // +8%/yr for 3 years of delayed credits

    ssResult.innerHTML = `
        <div class="ss-comparison">
            <div class="ss-col">
                <p class="ss-col-label">Claim at 62</p>
                <p class="ss-col-value">${fmtDec(age62)}/mo</p>
                <p class="ss-col-sub">Reduced — permanent 30% cut</p>
            </div>
            <div class="ss-col">
                <p class="ss-col-label">Claim at 67 (FRA)</p>
                <p class="ss-col-value">${fmtDec(age67)}/mo</p>
                <p class="ss-col-sub">Full benefit</p>
            </div>
            <div class="ss-col">
                <p class="ss-col-label">Claim at 70</p>
                <p class="ss-col-value">${fmtDec(age70)}/mo</p>
                <p class="ss-col-sub">Maximum — +24% over FRA</p>
            </div>
        </div>
        <p class="input-hint" style="margin-top:8px;">Military service counts toward Social Security credits. SS income is separate from your pension and VA comp — all three stack. SS is partially taxable depending on total income.</p>
    `;
}

function init() {
    populateRankDropdown(retirementRankSel, 'enlisted');
    populateStateDropdown();
    attachListeners();
    loadFromUrl();
    updateHigh3Estimate();
    recalculate();
}

init();
