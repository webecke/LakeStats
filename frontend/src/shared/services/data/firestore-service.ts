import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    collection,
    query,
    where,
    getDocs,
    orderBy,
    limit,
    writeBatch,
} from "firebase/firestore";
import {
    DataService,
    LakeMetaData,
    LakeStatus,
    LakeSystemSettings,
    DataType,
    CurrentConditions,
    AccessPoint,
} from "./types.ts";
import { getFirestoreDb } from "../../../firebase/config.ts";

export class FirestoreService implements DataService {
    private db = getFirestoreDb();
    private systemCollection = "system";

    /////////////////////////
    // PUBLIC READ METHODS //
    /////////////////////////

    // Get all lakes
    async getAllLakes(): Promise<LakeSystemSettings[]> {
        const querySnapshot = await getDocs(
            query(collection(this.db, this.systemCollection), orderBy("sortOrder", "asc"))
        );
        return querySnapshot.docs.map((doc) => doc.data() as LakeSystemSettings);
    }

    // Get a single lake
    async getLakeSystemSetting(lakeId: string): Promise<LakeSystemSettings | null> {
        const docRef = doc(this.db, this.systemCollection, lakeId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return null;
        }

        return docSnap.data() as LakeSystemSettings;
    }

    // Get all lakes with a specific status
    async getLakesByStatus(status: LakeStatus): Promise<LakeSystemSettings[]> {
        const q = query(
            collection(this.db, this.systemCollection),
            where("status", "==", status),
            orderBy("sortOrder", "asc")
        );

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map((doc) => doc.data() as LakeSystemSettings);
    }

    async getLakeInfo(lakeId: string): Promise<LakeMetaData | null> {
        const docRef = doc(this.db, lakeId, "lake-info");
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return null;
        }

        const data = docSnap.data();

        return {
            ...data,
            dataSources: this.convertObjectToMap(data.dataSources || {}),
        } as LakeMetaData;
    }

    async getCurrentConditions(lakeId: string): Promise<CurrentConditions | null> {
        const docRef = doc(this.db, lakeId, "current_conditions");
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) return null;

        const data = docSnap.data();

        return {
            lakeId: data.lakeId,
            measurementSiteName: data.measurementSiteName,
            timeConditionsCalculated: this.parseTimestamp(data.timeConditionsCalculated),
            currentReadingTimestamp: this.parseTimestamp(data.currentReadingTimestamp),
            levelToday: data.levelToday,
            level24HoursAgo: data.level24HoursAgo,
            levelTwoWeeksAgo: data.levelTwoWeeksAgo,
            levelOneYearAgo: data.levelOneYearAgo,
            levelTenYearAverage: data.levelTenYearAverage
        } as CurrentConditions;
    }

    //////////////////////////////
    // ADMIN MANAGEMENT METHODS //
    //////////////////////////////

    // In firestore-service.ts or similar
    async updateLakeRegionAccessPoints(
        lakeId: string,
        regionId: string,
        accessPoints: AccessPoint[]
    ): Promise<void> {
        const regionRef = doc(this.db, lakeId, "lake-info");

        try {
            // Get current data
            const lakeDoc = await getDoc(regionRef);
            if (!lakeDoc.exists()) {
                throw new Error(`Lake info not found for ${lakeId}`);
            }

            const lakeData = lakeDoc.data();
            const regions = { ...lakeData.regions };

            // Update the region's access points array directly
            if (regions[regionId]) {
                regions[regionId] = {
                    ...regions[regionId],
                    accessPoints: accessPoints, // Store the array in the correct order
                };

                // Update the document
                await updateDoc(regionRef, { regions });
                console.log("Access points updated successfully");
            } else {
                throw new Error(`Region ${regionId} not found`);
            }
        } catch (error) {
            console.error("Error updating access points:", error);
            throw error;
        }
    }

    // Add a new lake (defaults to DISABLED)
    async addNewLake(
        lake: Omit<LakeSystemSettings, "status" | "features" | "sortOrder">
    ): Promise<void> {
        // Get current max order for disabled lakes
        const q = query(
            collection(this.db, this.systemCollection),
            where("status", "==", "DISABLED"),
            orderBy("sortOrder", "desc"),
            limit(1)
        );

        const snapshot = await getDocs(q);
        const maxOrder = snapshot.empty ? 0 : snapshot.docs[0].data().sortOrder || 0;

        const docRef = doc(this.db, this.systemCollection, lake.lakeId);
        await setDoc(docRef, {
            ...lake,
            features: [],
            status: "DISABLED" as LakeStatus,
            sortOrder: maxOrder + 1,
        });
    }

    // Update lake status
    async updateLakeStatus(lakeId: string, newStatus: LakeStatus): Promise<void> {
        // Get max order for new status group
        const q = query(
            collection(this.db, this.systemCollection),
            where("status", "==", newStatus),
            orderBy("sortOrder", "desc"),
            limit(1)
        );

        const snapshot = await getDocs(q);
        const maxOrder = snapshot.empty ? 0 : snapshot.docs[0].data().sortOrder || 0;

        const docRef = doc(this.db, this.systemCollection, lakeId);
        await updateDoc(docRef, {
            status: newStatus,
            sortOrder: maxOrder + 1,
        });
    }

    // Update lake order
    async updateLakeOrder(lakeId: string, newOrder: number): Promise<void> {
        // Get the lake and its status
        const lakeRef = doc(this.db, this.systemCollection, lakeId);
        const lakeSnap = await getDoc(lakeRef);
        if (!lakeSnap.exists()) return;

        const status = lakeSnap.data().status;

        // Get all lakes in this status group
        const statusLakes = await getDocs(
            query(
                collection(this.db, this.systemCollection),
                where("status", "==", status),
                orderBy("sortOrder")
            )
        );

        const batch = writeBatch(this.db);

        // Update sort orders - increment everything at or after the new position
        statusLakes.docs.forEach((doc) => {
            const currentOrder = doc.data().sortOrder;
            if (doc.id === lakeId) {
                batch.update(doc.ref, { sortOrder: newOrder });
            } else if (currentOrder >= newOrder) {
                batch.update(doc.ref, { sortOrder: currentOrder + 1 });
            }
        });

        await batch.commit();
    }

    // Reorder multiple lakes at once
    async reorderLakes(lakes: { lakeId: string; sortOrder: number }[]): Promise<void> {
        // Handle lakes one at a time using our existing updateLakeOrder function
        // Process them in order of their desired sortOrder to avoid conflicts
        const sortedLakes = [...lakes].sort((a, b) => a.sortOrder - b.sortOrder);

        for (const lake of sortedLakes) {
            await this.updateLakeOrder(lake.lakeId, lake.sortOrder);
        }
    }

    async updateLake(
        lakeId: string,
        updates: {
            system?: Omit<LakeSystemSettings, "lakeId">;
            info?: Omit<LakeMetaData, "id">;
        }
    ): Promise<void> {
        const batch = writeBatch(this.db);

        if (updates.system) {
            const systemRef = doc(this.db, this.systemCollection, lakeId);
            const systemDoc = await getDoc(systemRef);

            const systemData = {
                ...updates.system,
                lakeId: lakeId,
            };

            if (!systemDoc.exists()) {
                batch.set(systemRef, systemData);
            } else {
                batch.update(systemRef, systemData);
            }
        }

        if (updates.info) {
            const infoRef = doc(this.db, lakeId, "lake-info");
            const infoDoc = await getDoc(infoRef);

            const infoData = {
                ...updates.info,
                id: lakeId,
                // fillDate is already a string, no conversion needed
                dataSources: this.convertMapToObject(updates.info.dataSources),
            };

            if (!infoDoc.exists()) {
                batch.set(infoRef, infoData);
            } else {
                batch.update(infoRef, infoData);
            }
        }

        await batch.commit();
    }

    ////////////////////
    // HELPER METHODS //
    ////////////////////
    private convertMapToObject(map: Map<DataType, string>): Record<string, string> {
        const obj: Record<string, string> = {};
        map.forEach((value, key) => {
            obj[key] = value;
        });
        return obj;
    }

    private convertObjectToMap(obj: Record<string, string>): Map<DataType, string> {
        const map = new Map<DataType, string>();
        Object.entries(obj).forEach(([key, value]) => {
            map.set(key as DataType, value);
        });
        return map;
    }

    /**
     * Parses an ISO timestamp string into a Date object
     *
     * @param timestamp - Timestamp string (ISO 8601 format) or undefined
     * @returns Date object representing the timestamp
     */
    private parseTimestamp(timestamp: string | undefined | null): Date {
        if (!timestamp) {
            return new Date();
        }

        try {
            return new Date(timestamp);
        } catch (error) {
            console.warn("Failed to parse timestamp:", timestamp);
            return new Date();
        }
    }
}
