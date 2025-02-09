import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, orderBy, limit, writeBatch } from 'firebase/firestore';
import { DataService, LakeStatus, LakeSystemStatus } from "./types.ts";
import { getFirestoreDb } from "../../firebase/config.ts";

export class FirestoreService implements DataService {
    private db = getFirestoreDb();
    private systemCollection = 'system';

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
    async getLake(lakeId: string): Promise<LakeSystemStatus | null> {
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
}
