export const getFeetAndInches = (value: number): { feet: number, inches: number } => {
    value = Math.abs(value);
    const feet = Math.floor(value);
    let inches = Math.round((value - feet) * 12);


    if (inches === 12) {
        return { feet: feet + 1, inches: 0 };
    }

    return { feet: feet, inches: Math.floor(inches) };
}
