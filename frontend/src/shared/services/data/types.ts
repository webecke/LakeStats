export interface LakeMetaData {
    id: string;
    description: string;
    fillDate: string;
    googleMapsLinkToDam: string;
    fullPoolElevation: number;
    minPowerPoolElevation: number;
    deadPoolElevation: number;
    dataSources: Map<DataType, string>;
    regions: Record<string, LakeRegion>;
}

export type LakeStatus = "ENABLED" | "DISABLED" | "TESTING";

export interface LakeSystemSettings {
    lakeId: string;
    lakeName: string;
    brandedName: string;
    status: LakeStatus;
    features: LakeSystemFeatures[];
    sortOrder: number;
    accentColor: string;
}

export enum DataType {
    ELEVATION = "ELEVATION",
    INFLOW = "INFLOW",
    TOTAL_RELEASE = "TOTAL_RELEASE",
    SPILLWAY_RELEASE = "SPILLWAY_RELEASE",
    BYPASS_RELEASE = "BYPASS_RELEASE",
    POWER_RELEASE = "POWER_RELEASE",
    EVAPORATION = "EVAPORATION",
    ACTIVE_STORAGE = "ACTIVE_STORAGE",
    BANK_STORAGE = "BANK_STORAGE",
    DELTA_STORAGE = "DELTA_STORAGE",
}

export enum LakeSystemFeatures {
    REGIONS = "REGIONS",
    ACCESS_POINTS = "ACCESS_POINTS",
    PREVIOUS_YEAR_GRAPH = "PREVIOUS_YEAR_GRAPH",
}

export interface LakeRegion {
    id: string;
    name: string;
    description: string;
    sortOrder: number;
    accessPoints: AccessPoint[];
}

export interface AccessPoint {
    id: string;
    name: string;
    type: "BOAT_RAMP" | "PRIMITIVE_LAUNCH" | "CHANNEL" | "MARINA";
    minSafeElevation: number;
    minUsableElevation: number;
    googleMapsLink: string;
}

export interface CurrentConditions {
    lakeId: string;
    timeOfCollection: Date;
    date: Date;
    levelToday: number;
    levelYesterday: number;
    levelTwoWeeksAgo: number;
    levelOneYearAgo: number;
    levelTenYearAverage: number;
}

export interface SystemError {
    timestamp: Date;
    message: string;
    errorType: string | null;
    errorMessage: string | null;
    stackTrace: string | null;
    lakeId: string;
}

export type PeriodType = "CALENDAR_YEAR" | "ROLLING_YEAR" | "CUSTOM";

export interface HistoricalPeriodData {
    lakeId: string;
    startDate: Date;
    endDate: Date;
    type: PeriodType;
    dataType: DataType;
    data: {
        value: number;
        date: Date;
    }[];
}

export interface DataService {
    updateLakeRegionAccessPoints(
        lakeId: string,
        regionId: string,
        accessPoints: AccessPoint[]
    ): Promise<void>;
    addNewLake(lake: Omit<LakeSystemSettings, "status" | "features" | "sortOrder">): Promise<void>;
    updateLakeStatus(lakeId: string, newStatus: LakeStatus): Promise<void>;
    getLakesByStatus(status: LakeStatus): Promise<LakeSystemSettings[]>;
    getAllLakes(): Promise<LakeSystemSettings[]>;
    getLakeSystemSetting(lakeId: string): Promise<LakeSystemSettings | null>;
    updateLakeOrder(lakeId: string, newOrder: number): Promise<void>;
    reorderLakes(lakes: { lakeId: string; sortOrder: number }[]): Promise<void>;
    getLakeInfo(lakeId: string): Promise<LakeMetaData | null>;
    updateLake(
        lakeId: string,
        updates: {
            system?: Omit<LakeSystemSettings, "lakeId">;
            info?: Omit<LakeMetaData, "id">;
        }
    ): Promise<void>;
    getCurrentConditions(lakeId: string): Promise<CurrentConditions | null>;
    getPast365Days(lakeId: string): Promise<HistoricalPeriodData | null>;
}
