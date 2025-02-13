export interface Lake {
    id: string;
    description: string;
    fillDate: Date;
    googleMapsLinkToDam: string;
    fullPoolElevation: number;
    minPowerPoolElevation: number;
    deadPoolElevation: number;
    dataSources: Map<DataType, string>
    regions: Record<string, LakeRegion>;
}

export type LakeStatus = 'ENABLED' | 'DISABLED' | 'TESTING';

export interface LakeSystemStatus {
    lakeId: string;
    lakeName: string;
    brandedName: string;
    status: LakeStatus;
    features: LakeSystemFeatures[];
    sortOrder: number;  // New field
}

export enum DataType {
    ELEVATION = 'ELEVATION',
    INFLOW = 'INFLOW',
    TOTAL_RELEASE = 'TOTAL_RELEASE',
    SPILLWAY_RELEASE = 'SPILLWAY_RELEASE',
    BYPASS_RELEASE = 'BYPASS_RELEASE',
    POWER_RELEASE = 'POWER_RELEASE',
    EVAPORATION = 'EVAPORATION',
    ACTIVE_STORAGE = 'ACTIVE_STORAGE',
    BANK_STORAGE = 'BANK_STORAGE',
    DELTA_STORAGE = 'DELTA_STORAGE',
}

export enum LakeSystemFeatures {
    CURRENT_CONDITIONS = 'CURRENT_CONDITIONS',
}

export interface LakeRegion {
    id: string;
    name: string;
    description: string;
    accessPoints: AccessPoint[];
}

export interface AccessPoint {
    id: string;
    name: string;
    type: 'BOAT_RAMP' | 'PRIMITIVE_LAUNCH' | 'CHANNEL' | 'MARINA';
    minSafeElevation: number;
    minUsableElevation: number;
    googleMapsLink: string;
}

export interface CurrentConditions {
    lakeId: string;
    timeOfCollection: Date;
    date: Date;
    currentLevel: number;
    oneDayChange: number;
    twoWeekChange: number;
    oneYearChange: number;
    differenceFromTenYearAverage: number;
    debugInfo: string;
}

export interface SystemError {
    timestamp: Date;
    message: string;
    errorType: string | null;
    errorMessage: string | null;
    stackTrace: string | null;
    lakeId: string;
}

export interface DataService {
    addNewLake(lake: Omit<LakeSystemStatus, 'status' | 'features' | 'sortOrder'>): Promise<void>
    updateLakeStatus(lakeId: string, newStatus: LakeStatus): Promise<void>
    getLakesByStatus(status: LakeStatus): Promise<LakeSystemStatus[]>
    getAllLakes(): Promise<LakeSystemStatus[]>
    getLakeSystem(lakeId: string): Promise<LakeSystemStatus | null>
    updateLakeOrder(lakeId: string, newOrder: number): Promise<void>
    reorderLakes(lakes: { lakeId: string; sortOrder: number }[]): Promise<void>
    getLakeInfo(lakeId: string): Promise<Lake | null>
    updateLake(lakeId: string, updates: {
        system?: Omit<LakeSystemStatus, 'lakeId'>,
        info?: Omit<Lake, 'id'>
    }): Promise<void>
}
