import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, orderBy, limit, writeBatch } from 'firebase/firestore';
import {DataService, Lake, LakeStatus, LakeSystemStatus, DataType} from "./types.ts";
import { getFirestoreDb } from "../../firebase/config.ts";

export class FirestoreService implements DataService {
    private db = getFirestoreDb();
    private systemCollection = 'system';

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

    // Add a new lake (defaults to DISABLED)
    async addNewLake(lake: Omit<LakeSystemStatus, 'status' | 'features' | 'sortOrder'>): Promise<void> {
        // Get current max order for disabled lakes
        const q = query(
            collection(this.db, this.systemCollection),
            where('status', '==', 'DISABLED'),
            orderBy('sortOrder', 'desc'),
            limit(1)
        );

        const snapshot = await getDocs(q);
        const maxOrder = snapshot.empty ? 0 : (snapshot.docs[0].data().sortOrder || 0);

        const docRef = doc(this.db, this.systemCollection, lake.lakeId);
        await setDoc(docRef, {
            ...lake,
            features: [],
            status: 'DISABLED' as LakeStatus,
            sortOrder: maxOrder + 1
        });
    }

    // Update lake status
    async updateLakeStatus(lakeId: string, newStatus: LakeStatus): Promise<void> {
        // Get max order for new status group
        const q = query(
            collection(this.db, this.systemCollection),
            where('status', '==', newStatus),
            orderBy('sortOrder', 'desc'),
            limit(1)
        );

        const snapshot = await getDocs(q);
        const maxOrder = snapshot.empty ? 0 : (snapshot.docs[0].data().sortOrder || 0);

        const docRef = doc(this.db, this.systemCollection, lakeId);
        await updateDoc(docRef, {
            status: newStatus,
            sortOrder: maxOrder + 1
        });
    }

    // Get all lakes with a specific status
    async getLakesByStatus(status: LakeStatus): Promise<LakeSystemStatus[]> {
        const q = query(
            collection(this.db, this.systemCollection),
            where('status', '==', status),
            orderBy('sortOrder', 'asc')
        );

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => doc.data() as LakeSystemStatus);
    }

    // Get all lakes
    async getAllLakes(): Promise<LakeSystemStatus[]> {
        const querySnapshot = await getDocs(
            query(
                collection(this.db, this.systemCollection),
                orderBy('sortOrder', 'asc')
            )
        );
        return querySnapshot.docs.map(doc => doc.data() as LakeSystemStatus);
    }

    // Get a single lake
    async getLakeSystem(lakeId: string): Promise<LakeSystemStatus | null> {
        const docRef = doc(this.db, this.systemCollection, lakeId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return null;
        }

        return docSnap.data() as LakeSystemStatus;
    }

    // Update lake order
    async updateLakeOrder(lakeId: string, newOrder: number): Promise<void> {
        const docRef = doc(this.db, this.systemCollection, lakeId);
        await updateDoc(docRef, { sortOrder: newOrder });
    }

    // Reorder multiple lakes at once
    async reorderLakes(lakes: { lakeId: string; sortOrder: number }[]): Promise<void> {
        const batch = writeBatch(this.db);

        lakes.forEach(({ lakeId, sortOrder }) => {
            const docRef = doc(this.db, this.systemCollection, lakeId);
            batch.update(docRef, { sortOrder });
        });

        await batch.commit();
    }

    async getLakeInfo(lakeId: string): Promise<Lake | null> {
        const docRef = doc(this.db, lakeId, 'lake-data');
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return null;
        }

        const data = docSnap.data();

        return {
            ...data,
            dataSources: this.convertObjectToMap(data.dataSources || {})
        } as Lake;
    }

    async updateLakeInfo(lakeId: string, lakeInfo: Omit<Lake, 'id'>): Promise<void> {
        const docRef = doc(this.db, lakeId, 'lake-data');
        await updateDoc(docRef, {
            ...lakeInfo,
            id: lakeId,
            dataSources: this.convertMapToObject(lakeInfo.dataSources)
        });
    }

    async updateLakeSystem(lakeId: string, systemConfig: Omit<LakeSystemStatus, 'lakeId'>): Promise<void> {
        const docRef = doc(this.db, this.systemCollection, lakeId);
        await updateDoc(docRef, {
            ...systemConfig,
            lakeId: lakeId
        });
    }

    async updateLake(lakeId: string, updates: {
        system?: Omit<LakeSystemStatus, 'lakeId'>,
        info?: Omit<Lake, 'id'>
    }): Promise<void> {
        const batch = writeBatch(this.db);

        if (updates.system) {
            const systemRef = doc(this.db, this.systemCollection, lakeId);
            const systemDoc = await getDoc(systemRef);

            const systemData = {
                ...updates.system,
                lakeId: lakeId
            };

            if (!systemDoc.exists()) {
                batch.set(systemRef, systemData);
            } else {
                batch.update(systemRef, systemData);
            }
        }

        if (updates.info) {
            const infoRef = doc(this.db, lakeId, 'lake-data');
            const infoDoc = await getDoc(infoRef);

            const infoData = {
                ...updates.info,
                id: lakeId,
                // fillDate is already a string, no conversion needed
                dataSources: this.convertMapToObject(updates.info.dataSources)
            };

            if (!infoDoc.exists()) {
                batch.set(infoRef, infoData);
            } else {
                batch.update(infoRef, infoData);
            }
        }

        await batch.commit();
    }
}
