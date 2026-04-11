/**
 * 2026 VA Disability Compensation Rates
 * Effective December 1, 2025 (2.5% COLA — applies to 2026 payments)
 * Source: VA.gov 2026 Compensation Rate Tables
 *
 * Rates at 10–20%: no dependent adjustment
 * Rates at 30–100%: adjusted by marital status, children, dependent parents
 */

// -------------------------
// BASE RATES (no dependents or 10-20%)
// -------------------------
export const VA_BASE_RATES = {
    10: 175.51,
    20: 346.95,
    30: { veteran_alone: 552.47 },
    40: { veteran_alone: 795.58 },
    50: { veteran_alone: 1132.52 },
    60: { veteran_alone: 1433.29 },
    70: { veteran_alone: 1806.97 },
    80: { veteran_alone: 2099.29 },
    90: { veteran_alone: 2362.30 },
    100: { veteran_alone: 3938.58 }
};

// -------------------------
// FULL DEPENDENT RATES (30–100%)
// -------------------------
export const VA_RATES = {
    30: {
        veteran_alone:               552.47,
        with_spouse:                 617.47,
        with_spouse_1parent:         661.47,
        with_spouse_2parents:        705.47,
        with_1parent:                596.47,
        with_2parents:               640.47,
        with_1child:                 584.47,
        with_1child_spouse:          649.47,
        with_1child_spouse_1parent:  693.47,
        with_1child_spouse_2parents: 737.47,
        with_1child_1parent:         628.47,
        with_1child_2parents:        672.47
    },
    40: {
        veteran_alone:               795.58,
        with_spouse:                 873.58,
        with_spouse_1parent:         928.58,
        with_spouse_2parents:        983.58,
        with_1parent:                850.58,
        with_2parents:               905.58,
        with_1child:                 838.58,
        with_1child_spouse:          916.58,
        with_1child_spouse_1parent:  971.58,
        with_1child_spouse_2parents: 1026.58,
        with_1child_1parent:         893.58,
        with_1child_2parents:        948.58
    },
    50: {
        veteran_alone:               1132.52,
        with_spouse:                 1223.52,
        with_spouse_1parent:         1289.52,
        with_spouse_2parents:        1355.52,
        with_1parent:                1198.52,
        with_2parents:               1264.52,
        with_1child:                 1186.52,
        with_1child_spouse:          1277.52,
        with_1child_spouse_1parent:  1343.52,
        with_1child_spouse_2parents: 1409.52,
        with_1child_1parent:         1252.52,
        with_1child_2parents:        1318.52
    },
    60: {
        veteran_alone:               1433.29,
        with_spouse:                 1537.29,
        with_spouse_1parent:         1614.29,
        with_spouse_2parents:        1691.29,
        with_1parent:                1510.29,
        with_2parents:               1587.29,
        with_1child:                 1498.29,
        with_1child_spouse:          1602.29,
        with_1child_spouse_1parent:  1679.29,
        with_1child_spouse_2parents: 1756.29,
        with_1child_1parent:         1575.29,
        with_1child_2parents:        1652.29
    },
    70: {
        veteran_alone:               1806.97,
        with_spouse:                 1924.97,
        with_spouse_1parent:         2012.97,
        with_spouse_2parents:        2100.97,
        with_1parent:                1894.97,
        with_2parents:               1982.97,
        with_1child:                 1882.97,
        with_1child_spouse:          2000.97,
        with_1child_spouse_1parent:  2088.97,
        with_1child_spouse_2parents: 2176.97,
        with_1child_1parent:         1970.97,
        with_1child_2parents:        2058.97
    },
    80: {
        veteran_alone:               2099.29,
        with_spouse:                 2230.29,
        with_spouse_1parent:         2329.29,
        with_spouse_2parents:        2428.29,
        with_1parent:                2198.29,
        with_2parents:               2297.29,
        with_1child:                 2186.29,
        with_1child_spouse:          2317.29,
        with_1child_spouse_1parent:  2416.29,
        with_1child_spouse_2parents: 2515.29,
        with_1child_1parent:         2285.29,
        with_1child_2parents:        2384.29
    },
    90: {
        veteran_alone:               2362.30,
        with_spouse:                 2559.30,
        with_spouse_1parent:         2717.30,
        with_spouse_2parents:        2875.30,
        with_1parent:                2520.30,
        with_2parents:               2678.30,
        with_1child:                 2494.30,
        with_1child_spouse:          2704.30,
        with_1child_spouse_1parent:  2862.30,
        with_1child_spouse_2parents: 3020.30,
        with_1child_1parent:         2652.30,
        with_1child_2parents:        2810.30
    },
    100: {
        veteran_alone:               3938.58,
        with_spouse:                 4160.99,
        with_spouse_1parent:         4331.89,
        with_spouse_2parents:        4502.79,
        with_1parent:                4109.48,
        with_2parents:               4280.38,
        with_1child:                 4072.58,
        with_1child_spouse:          4308.81,
        with_1child_spouse_1parent:  4479.71,
        with_1child_spouse_2parents: 4650.61,
        with_1child_1parent:         4243.48,
        with_1child_2parents:        4414.38
    }
};

// Additional amounts per child (applied on top of base with-child rates)
export const ADDITIONAL_CHILD_UNDER_18 = {
    30: 32.00, 40: 43.00, 50: 54.00, 60: 65.00,
    70: 76.00, 80: 87.00, 90: 98.00, 100: 109.11
};

export const ADDITIONAL_CHILD_OVER_18_SCHOOL = {
    30: 105.00, 40: 140.00, 50: 176.00, 60: 211.00,
    70: 246.00, 80: 281.00, 90: 317.00, 100: 352.45
};

// Spouse Aid & Attendance additional amount
export const SPOUSE_AID_ATTENDANCE = {
    30: 58.00, 40: 58.00, 50: 58.00, 60: 58.00,
    70: 58.00, 80: 58.00, 90: 58.00, 100: 158.11
};

// -------------------------
// LOOKUP FUNCTION
// Returns monthly VA compensation based on rating and dependent inputs.
// -------------------------
export function getVACompensation(rating, dependents = {}) {
    if (rating === 0) return 0;
    if (rating < 30) {
        // 10% and 20% — flat rate, no dependent adjustment
        return VA_BASE_RATES[rating] || 0;
    }

    // Round to nearest 10 for table lookup (VA rounds combined rating down to nearest 10)
    const r = Math.floor(rating / 10) * 10;
    if (!VA_RATES[r]) return 0;

    const {
        married = false,
        childrenUnder18 = 0,
        childrenOver18 = 0,
        dependentParents = 0,
        spouseAA = false
    } = dependents;

    // Determine base key
    let key = 'veteran_alone';
    const hasSpouse = married;
    const hasChild = (childrenUnder18 + childrenOver18) > 0;

    if (hasSpouse && !hasChild) {
        if (dependentParents === 0) key = 'with_spouse';
        else if (dependentParents === 1) key = 'with_spouse_1parent';
        else key = 'with_spouse_2parents';
    } else if (hasSpouse && hasChild) {
        if (dependentParents === 0) key = 'with_1child_spouse';
        else if (dependentParents === 1) key = 'with_1child_spouse_1parent';
        else key = 'with_1child_spouse_2parents';
    } else if (!hasSpouse && hasChild) {
        if (dependentParents === 0) key = 'with_1child';
        else if (dependentParents === 1) key = 'with_1child_1parent';
        else key = 'with_1child_2parents';
    } else {
        // veteran alone
        if (dependentParents === 1) key = 'with_1parent';
        else if (dependentParents === 2) key = 'with_2parents';
    }

    let total = VA_RATES[r][key] || VA_RATES[r]['veteran_alone'];

    // Additional children under 18 (beyond the first, which is included in base)
    const extraChildrenUnder18 = Math.max(0, childrenUnder18 - 1);
    if (extraChildrenUnder18 > 0 && ADDITIONAL_CHILD_UNDER_18[r]) {
        total += extraChildrenUnder18 * ADDITIONAL_CHILD_UNDER_18[r];
    }

    // Additional children over 18 in school (beyond the first)
    const extraChildrenOver18 = Math.max(0, childrenOver18 - 1);
    if (extraChildrenOver18 > 0 && ADDITIONAL_CHILD_OVER_18_SCHOOL[r]) {
        total += extraChildrenOver18 * ADDITIONAL_CHILD_OVER_18_SCHOOL[r];
    }

    // Spouse Aid & Attendance
    if (spouseAA && hasSpouse && SPOUSE_AID_ATTENDANCE[r]) {
        total += SPOUSE_AID_ATTENDANCE[r];
    }

    return total;
}
