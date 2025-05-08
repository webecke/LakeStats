export const getFeetAndInchesWithFraction = (
    value: number
): { feet: number; inches: number; fraction: string } => {
    const absValue = Math.abs(value);
    const feet = Math.floor(absValue);

    const rawInches = (absValue - feet) * 12;
    const inches = Math.floor(rawInches);

    const fractionalInches = rawInches - inches;
    let fraction = "";

    // Convert to 8ths
    const eighths = Math.round(fractionalInches * 8);

    if (eighths > 0 && eighths < 8) {
        // Simplify fraction
        switch (eighths) {
            case 1:
                fraction = "⅛";
                break;
            case 2:
                fraction = "¼";
                break;
            case 3:
                fraction = "⅜";
                break;
            case 4:
                fraction = "½";
                break;
            case 5:
                fraction = "⅝";
                break;
            case 6:
                fraction = "¾";
                break;
            case 7:
                fraction = "⅞";
                break;
        }
    }

    // Handle overflow when rounding up
    if (rawInches >= 12) {
        return { feet: feet + 1, inches: 0, fraction: "" };
    }

    return { feet, inches, fraction };
};
