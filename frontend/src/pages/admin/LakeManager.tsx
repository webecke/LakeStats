import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { dataService, LakeSystemStatus } from '../../services/data';

export default function LakeManager() {
    const { lakeId } = useParams();
    const [lake, setLake] = useState<LakeSystemStatus | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadLake() {
            if (!lakeId) {
                setError('No lake ID provided');
                setIsLoading(false);
                return;
            }

            try {
                const fetchedLake = await dataService.getLake(lakeId);
                if (fetchedLake) {
                    setLake(fetchedLake);
                } else {
                    setError(`No lake found with ID: ${lakeId}`);
                }
            } catch (err) {
                setError('Error loading lake data');
                console.error('Error loading lake:', err);
            } finally {
                setIsLoading(false);
            }
        }

        loadLake();
    }, [lakeId]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!lake) {
        return <div>Lake not found</div>;
    }

    return (
        <div className="lake-manager">
            <h1>Managing {lake.lakeName}</h1>
            <pre>{JSON.stringify(lake, null, 2)}</pre>
        </div>
    );
}
