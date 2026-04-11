/**
 * 2026 U.S. Military Basic Pay Tables
 * Effective January 1, 2026 (3.8% pay raise)
 * Source: DFAS / navycs.com official 2026 pay chart
 *
 * Keys represent "years of service" breakpoints:
 *   0  = under 2 years
 *   2  = over 2 years
 *   3  = over 3 years
 *   4  = over 4 years
 *   6  = over 6 years
 *   8  = over 8 years
 *   10 = over 10 years
 *   ... etc.
 *
 * Values are monthly basic pay in USD.
 * Ranks without data at a given YOS (e.g. E-9 at <10 yrs) are omitted —
 * the lookup function will return null and the UI will flag it as unrealistic.
 *
 * O-6 cap: Level V Executive Schedule (~$15,258/mo)
 * O-7 through O-10 cap: Level II Executive Schedule (~$18,808/mo)
 * Values above cap reflect published table figures (cap applied by DFAS).
 */

// --- LOOKUP FUNCTION ---
// Returns monthly basic pay for a given rank and years of service.
export function getBasePay(rank, yos) {
    const table = PAY_TABLES_2026[rank];
    if (!table) return null;
    const brackets = Object.keys(table).map(Number).sort((a, b) => b - a);
    for (const b of brackets) {
        if (yos >= b) return table[b];
    }
    return null;
}

// Maps each rank to the rank below it (for TIG blending).
const RANK_PREV = {
    'E-2': 'E-1', 'E-3': 'E-2', 'E-4': 'E-3', 'E-5': 'E-4',
    'E-6': 'E-5', 'E-7': 'E-6', 'E-8': 'E-7', 'E-9': 'E-8',
    'W-2': 'W-1', 'W-3': 'W-2', 'W-4': 'W-3', 'W-5': 'W-4',
    'O-1E': 'O-1', 'O-2': 'O-1', 'O-2E': 'O-2',
    'O-3': 'O-2', 'O-3E': 'O-3', 'O-4': 'O-3',
    'O-5': 'O-4', 'O-6': 'O-5', 'O-7': 'O-6',
    'O-8': 'O-7', 'O-9': 'O-8', 'O-10': 'O-9'
};

// Returns the rank one grade below the given rank.
export function getPreviousRank(rank) {
    return RANK_PREV[rank] || rank; // returns same rank if already at minimum
}

// Returns the High-3 average for a given rank and years at retirement.
// When tig (time in current grade, in years) is < 3, blends in the previous rank's pay
// for the months before the promotion — matching how DFAS actually calculates High-3.
export function estimateHigh3(rank, retirementYOS, tig = 3) {
    const t = Math.min(Math.max(Math.round(tig), 1), 3); // clamp to 1–3
    if (t >= 3) {
        // All 3 years at retirement rank (default behavior)
        const y0 = getBasePay(rank, retirementYOS);
        const y1 = getBasePay(rank, Math.max(0, retirementYOS - 1));
        const y2 = getBasePay(rank, Math.max(0, retirementYOS - 2));
        const values = [y0, y1, y2].filter(v => v !== null);
        if (values.length === 0) return null;
        return values.reduce((a, b) => a + b, 0) / values.length;
    }

    // TIG years at retirement rank, (3-TIG) years at previous rank
    const prevRank = getPreviousRank(rank);
    let total = 0, count = 0;
    for (let i = 0; i < 3; i++) {
        const r   = i < t ? rank : prevRank;
        const pay = getBasePay(r, Math.max(0, retirementYOS - i));
        if (pay !== null) { total += pay; count++; }
    }
    return count > 0 ? total / count : null;
}

// --- PAY TABLES ---
export const PAY_TABLES_2026 = {

    // ===================== ENLISTED =====================

    'E-1': {
        0: 2407, 2: 2407, 3: 2407, 4: 2407, 6: 2407,
        8: 2407, 10: 2407, 12: 2407, 14: 2407, 16: 2407,
        18: 2407, 20: 2407, 22: 2407, 24: 2407, 26: 2407,
        28: 2407, 30: 2407, 32: 2407, 34: 2407, 36: 2407, 38: 2407, 40: 2407
    },

    'E-2': {
        0: 2698, 2: 2698, 3: 2698, 4: 2698, 6: 2698,
        8: 2698, 10: 2698, 12: 2698, 14: 2698, 16: 2698,
        18: 2698, 20: 2698, 22: 2698, 24: 2698, 26: 2698,
        28: 2698, 30: 2698, 32: 2698, 34: 2698, 36: 2698, 38: 2698, 40: 2698
    },

    'E-3': {
        0: 2837, 2: 3015, 3: 3198, 4: 3198, 6: 3198,
        8: 3198, 10: 3198, 12: 3198, 14: 3198, 16: 3198,
        18: 3198, 20: 3198, 22: 3198, 24: 3198, 26: 3198,
        28: 3198, 30: 3198, 32: 3198, 34: 3198, 36: 3198, 38: 3198, 40: 3198
    },

    'E-4': {
        0: 3142, 2: 3303, 3: 3482, 4: 3659, 6: 3815,
        8: 3815, 10: 3815, 12: 3815, 14: 3815, 16: 3815,
        18: 3815, 20: 3815, 22: 3815, 24: 3815, 26: 3815,
        28: 3815, 30: 3815, 32: 3815, 34: 3815, 36: 3815, 38: 3815, 40: 3815
    },

    'E-5': {
        0: 3343, 2: 3598, 3: 3776, 4: 3947, 6: 4110,
        8: 4300, 10: 4395, 12: 4422, 14: 4422, 16: 4422,
        18: 4422, 20: 4422, 22: 4422, 24: 4422, 26: 4422,
        28: 4422, 30: 4422, 32: 4422, 34: 4422, 36: 4422, 38: 4422, 40: 4422
    },

    'E-6': {
        0: 3401, 2: 3743, 3: 3908, 4: 4068, 6: 4236,
        8: 4612, 10: 4760, 12: 5044, 14: 5131, 16: 5194,
        18: 5268, 20: 5268, 22: 5268, 24: 5268, 26: 5268,
        28: 5268, 30: 5268, 32: 5268, 34: 5268, 36: 5268, 38: 5268, 40: 5268
    },

    'E-7': {
        0: 3932, 2: 4291, 3: 4456, 4: 4673, 6: 4844,
        8: 5135, 10: 5300, 12: 5592, 14: 5835, 16: 6001,
        18: 6177, 20: 6245, 22: 6475, 24: 6598, 26: 7067,
        28: 7067, 30: 7067, 32: 7067, 34: 7067, 36: 7067, 38: 7067, 40: 7067
    },

    'E-8': {
        // E-8 typically not achievable before ~8 years
        8: 5657, 10: 5907, 12: 6062, 14: 6247, 16: 6448,
        18: 6811, 20: 6995, 22: 7308, 24: 7482, 26: 7909,
        28: 7989, 30: 8068, 32: 8068, 34: 8068, 36: 8068, 38: 8068, 40: 8068
    },

    'E-9': {
        // E-9 typically not achievable before ~10 years
        10: 6910, 12: 7067, 14: 7264, 16: 7496,
        18: 7731, 20: 8105, 22: 8423, 24: 8756, 26: 9268,
        28: 9499, 30: 9730, 32: 9974, 34: 10217, 36: 10473, 38: 10729, 40: 10729
    },

    // ===================== WARRANT OFFICERS =====================

    'W-1': {
        0: 4057, 2: 4494, 3: 4611, 4: 4859, 6: 5152,
        8: 5585, 10: 5786, 12: 6069, 14: 6346, 16: 6565,
        18: 6766, 20: 7010, 22: 7010, 24: 7010, 26: 7010,
        28: 7010, 30: 7010, 32: 7010, 34: 7010, 36: 7010, 38: 7010, 40: 7010
    },

    'W-2': {
        0: 4622, 2: 5059, 3: 5194, 4: 5286, 6: 5586,
        8: 6052, 10: 6282, 12: 6509, 14: 6787, 16: 7005,
        18: 7201, 20: 7437, 22: 7592, 24: 7714, 26: 7714,
        28: 7714, 30: 7714, 32: 7714, 34: 7714, 36: 7714, 38: 7714, 40: 7714
    },

    'W-3': {
        0: 5223, 2: 5441, 3: 5664, 4: 5738, 6: 5971,
        8: 6431, 10: 6910, 12: 7136, 14: 7398, 16: 7666,
        18: 8150, 20: 8477, 22: 8672, 24: 8879, 26: 9162,
        28: 9162, 30: 9162, 32: 9162, 34: 9162, 36: 9162, 38: 9162, 40: 9162
    },

    'W-4': {
        0: 5720, 2: 6152, 3: 6329, 4: 6503, 6: 6802,
        8: 7098, 10: 7398, 12: 7848, 14: 8244, 16: 8620,
        18: 8928, 20: 9228, 22: 9669, 24: 10032, 26: 10445,
        28: 10550, 30: 10654, 32: 10654, 34: 10654, 36: 10654, 38: 10654, 40: 10654
    },

    'W-5': {
        // W-5 typically not achievable before ~20 years
        20: 10170, 22: 10686, 24: 11070, 26: 11495,
        28: 11783, 30: 12071, 32: 12372, 34: 12673, 36: 12991, 38: 13308, 40: 13308
    },

    // ===================== OFFICERS =====================

    'O-1': {
        0: 4150, 2: 4320, 3: 5222, 4: 5222, 6: 5222,
        8: 5222, 10: 5222, 12: 5222, 14: 5222, 16: 5222,
        18: 5222, 20: 5222, 22: 5222, 24: 5222, 26: 5222,
        28: 5222, 30: 5222, 32: 5222, 34: 5222, 36: 5222, 38: 5222, 40: 5222
    },

    // O-1E: Officer with 4+ years prior enlisted/warrant service
    'O-1E': {
        2: 4320, 3: 5222, 4: 5577, 6: 5577,
        8: 5783, 10: 5994, 12: 6201, 14: 6484, 16: 6484,
        18: 6484, 20: 6484, 22: 6484, 24: 6484, 26: 6484,
        28: 6484, 30: 6484, 32: 6484, 34: 6484, 36: 6484, 38: 6484, 40: 6484
    },

    'O-2': {
        0: 4782, 2: 5446, 3: 6272, 4: 6484, 6: 6618,
        8: 6618, 10: 6618, 12: 6618, 14: 6618, 16: 6618,
        18: 6618, 20: 6618, 22: 6618, 24: 6618, 26: 6618,
        28: 6618, 30: 6618, 32: 6618, 34: 6618, 36: 6618, 38: 6618, 40: 6618
    },

    // O-2E: Officer with 4+ years prior enlisted/warrant service
    'O-2E': {
        2: 6484, 3: 6618, 4: 6618, 6: 6618,
        8: 6828, 10: 7184, 12: 7459, 14: 7664, 16: 7664,
        18: 7664, 20: 7664, 22: 7664, 24: 7664, 26: 7664,
        28: 7664, 30: 7664, 32: 7664, 34: 7664, 36: 7664, 38: 7664, 40: 7664
    },

    'O-3': {
        0: 5535, 2: 6273, 3: 6771, 4: 7383, 6: 7737,
        8: 8125, 10: 8376, 12: 8788, 14: 9004, 16: 9004,
        18: 9004, 20: 9004, 22: 9004, 24: 9004, 26: 9004,
        28: 9004, 30: 9004, 32: 9004, 34: 9004, 36: 9004, 38: 9004, 40: 9004
    },

    // O-3E: Officer with 4+ years prior enlisted/warrant service
    'O-3E': {
        2: 7383, 3: 7737, 4: 7737, 6: 7737,
        8: 8125, 10: 8376, 12: 8788, 14: 9137, 16: 9337,
        18: 9609, 20: 9609, 22: 9609, 24: 9609, 26: 9609,
        28: 9609, 30: 9609, 32: 9609, 34: 9609, 36: 9609, 38: 9609, 40: 9609
    },

    'O-4': {
        0: 6294, 2: 7286, 3: 7773, 4: 7881, 6: 8332,
        8: 8816, 10: 9419, 12: 9888, 14: 10214, 16: 10402,
        18: 10510, 20: 10510, 22: 10510, 24: 10510, 26: 10510,
        28: 10510, 30: 10510, 32: 10510, 34: 10510, 36: 10510, 38: 10510, 40: 10510
    },

    'O-5': {
        0: 7295, 2: 8219, 3: 8787, 4: 8894, 6: 9250,
        8: 9462, 10: 9929, 12: 10272, 14: 10714, 16: 11392,
        18: 11714, 20: 12033, 22: 12394, 24: 12394, 26: 12394,
        28: 12394, 30: 12394, 32: 12394, 34: 12394, 36: 12394, 38: 12394, 40: 12394
    },

    'O-6': {
        // Capped at Level V Executive Schedule (~$15,258/mo)
        0: 8751, 2: 9614, 3: 10245, 4: 10245, 6: 10284,
        8: 10725, 10: 10784, 12: 10784, 14: 11396, 16: 12480,
        18: 12480, 20: 13115, 22: 13751, 24: 14113, 26: 14479,
        28: 14869, 30: 15258, 32: 15376, 34: 15493, 36: 15493, 38: 15493, 40: 15493
    },

    'O-7': {
        // Capped at Level II Executive Schedule (~$18,808/mo)
        0: 11540, 2: 12076, 3: 12325, 4: 12522, 6: 12879,
        8: 13232, 10: 13639, 12: 14046, 14: 14454, 16: 15736,
        18: 16277, 20: 16818, 22: 16818, 24: 16818, 26: 16904,
        28: 17073, 30: 17242, 32: 17242, 34: 17242, 36: 17242, 38: 17242, 40: 17242
    },

    'O-8': {
        // Capped at Level II Executive Schedule (~$18,808/mo)
        0: 13888, 2: 14344, 3: 14645, 4: 14730, 6: 15107,
        8: 15736, 10: 15882, 12: 16480, 14: 16652, 16: 17166,
        18: 17882, 20: 18598, 22: 18598, 24: 18999, 26: 18999,
        28: 18999, 30: 18999, 32: 18999, 34: 18999, 36: 18999, 38: 18999, 40: 18999
    },

    'O-9': {
        // Capped at Level II — typically 22+ years
        22: 18999, 24: 18999, 26: 18999, 28: 18999,
        30: 18999, 32: 18999, 34: 18999, 36: 18999, 38: 18999, 40: 18999
    },

    'O-10': {
        // Capped at Level II — typically 26+ years
        26: 18999, 28: 18999, 30: 18999, 32: 18999,
        34: 18999, 36: 18999, 38: 18999, 40: 18999
    }
};

// Rank display labels
export const RANK_LABELS = {
    enlisted: [
        { value: 'E-1', label: 'E-1' },
        { value: 'E-2', label: 'E-2' },
        { value: 'E-3', label: 'E-3' },
        { value: 'E-4', label: 'E-4' },
        { value: 'E-5', label: 'E-5' },
        { value: 'E-6', label: 'E-6' },
        { value: 'E-7', label: 'E-7' },
        { value: 'E-8', label: 'E-8' },
        { value: 'E-9', label: 'E-9 (SGM/CSM/MCPON/SgtMaj/CMSAF)' }
    ],
    warrant: [
        { value: 'W-1', label: 'W-1' },
        { value: 'W-2', label: 'W-2' },
        { value: 'W-3', label: 'W-3' },
        { value: 'W-4', label: 'W-4' },
        { value: 'W-5', label: 'W-5' }
    ],
    officer: [
        { value: 'O-1',  label: 'O-1' },
        { value: 'O-1E', label: 'O-1E (4+ yrs prior enlisted)' },
        { value: 'O-2',  label: 'O-2' },
        { value: 'O-2E', label: 'O-2E (4+ yrs prior enlisted)' },
        { value: 'O-3',  label: 'O-3' },
        { value: 'O-3E', label: 'O-3E (4+ yrs prior enlisted)' },
        { value: 'O-4',  label: 'O-4' },
        { value: 'O-5',  label: 'O-5' },
        { value: 'O-6',  label: 'O-6' },
        { value: 'O-7',  label: 'O-7' },
        { value: 'O-8',  label: 'O-8' },
        { value: 'O-9',  label: 'O-9' },
        { value: 'O-10', label: 'O-10' }
    ]
};
