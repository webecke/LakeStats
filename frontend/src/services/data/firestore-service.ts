import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import {DataService, LakeStatus, LakeSystemStatus} from "./types.ts";
import {getFirestoreDb} from "../../firebase/config.ts";

export class FirestoreService implements DataService {
    private db = getFirestoreDb();
    private systemCollection = 'system';

    // Add a new lake (defaults to DISABLED)
    async addNewLake(lake: Omit<LakeSystemStatus, 'status' | 'features'>): Promise<void> {
        const docRef = doc(this.db, this.systemCollection, lake.lakeId);
        await setDoc(docRef, {
            ...lake,
            features: [],
            status: 'DISABLED' as LakeStatus
        });
    }

    // Update lake status
    async updateLakeStatus(lakeId: string, newStatus: LakeStatus): Promise<void> {
        const docRef = doc(this.db, this.systemCollection, lakeId);
        await updateDoc(docRef, {
            status: newStatus
        });
    }

    // Get all lakes with a specific status
    async getLakesByStatus(status: LakeStatus): Promise<LakeSystemStatus[]> {
        const q = query(
            collection(this.db, this.systemCollection),
            where('status', '==', status)
        );

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => doc.data() as LakeSystemStatus);
    }

    // Get all lakes
    async getAllLakes(): Promise<LakeSystemStatus[]> {
        const querySnapshot = await getDocs(collection(this.db, this.systemCollection));
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
}
