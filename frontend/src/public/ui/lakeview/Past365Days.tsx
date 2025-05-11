import React from "react";
import AsyncContainer from "../../components/AsyncContainer.tsx";
import { usePast365Days } from "../../datahooks/useHistoricalData.ts";

const Past365Days: React.FC<{lakeId: string}> = ({lakeId}) => {

    const { loading: loadingYearData, error: yearDataError, data: yearData } = usePast365Days(lakeId);

    return (
        <>
            <h2 className="access-point-list-title">Past 365 Days</h2>
            <AsyncContainer isLoading={loadingYearData} error={yearDataError} data={yearData}>
                {() => (
                    <h1>Hey</h1>
                )}
            </AsyncContainer>
        </>
    );
}

export default Past365Days;
