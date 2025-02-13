import { FirestoreService } from './firestore-service.ts';
import { DataService } from './types.ts';

export * from './types.ts';

export const dataService: DataService = new FirestoreService();
