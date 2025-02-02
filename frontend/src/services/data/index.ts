import { FirestoreService } from './firestore-service';
import { DataService } from './types';

export * from './types';

export const dataService: DataService = new FirestoreService();
