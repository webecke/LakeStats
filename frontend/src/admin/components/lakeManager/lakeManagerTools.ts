/**
 * Validates a USGS site number and retrieves site information
 * @param siteNumber The USGS site number to validate
 * @returns Promise with validation result and site information
 */
export async function validateUsgsSiteNumber(siteNumber: string): Promise<{
    isValid: boolean;
    siteName?: string;
    siteDescription?: string;
}> {
    if (!siteNumber || !siteNumber.trim()) {
        return { isValid: false };
    }

    // Clean the input
    const cleanedSiteNumber = siteNumber.trim();

    try {
        // Fetch site information
        const response = await fetch(
            `https://waterservices.usgs.gov/nwis/iv/?format=json&sites=${cleanedSiteNumber}&period=P1D`
        );

        if (!response.ok) {
            return { isValid: false };
        }

        const data = await response.json();

        // Check if there are time series data returned for this site
        if (data?.value?.timeSeries && data.value.timeSeries.length > 0) {
            // Extract site information from the first time series
            const siteInfo = data.value.timeSeries[0]?.sourceInfo;

            return {
                isValid: true,
                siteName: siteInfo?.siteName || undefined,
                siteDescription: siteInfo?.siteDescription || undefined
            };
        }

        return { isValid: false };
    } catch (error) {
        console.error("Error validating USGS site number:", error);
        return { isValid: false };
    }
}
