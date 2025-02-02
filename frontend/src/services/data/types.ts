export interface Lake {
    id: string;
    name: string;
    description: string;
    fillDate: Date;
    googleMapsLinkToDam: string;
    fullPoolElevation: number;
    minPowerPoolElevation: number;
    deadPoolElevation: number;
    regions: Record<string, LakeRegion>;
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
    // Lake methods
    getLake(lakeId: string): Promise<Lake | null>;
    getAllLakes(): Promise<Lake[]>;
    updateLake(lakeId: string, data: Partial<Lake>): Promise<void>;

    // Current conditions methods
    getCurrentConditions(lakeId: string): Promise<CurrentConditions | null>;
    updateCurrentConditions(lakeId: string, data: CurrentConditions): Promise<void>;

    // System errors methods
    getRecentErrors(lakeId?: string): Promise<SystemError[]>;
    addSystemError(error: SystemError): Promise<void>;
}
