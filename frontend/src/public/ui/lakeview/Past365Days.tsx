import React, { useEffect, useRef } from "react";
import { Chart } from 'chart.js/auto';
import AsyncContainer from "../../components/AsyncContainer.tsx";
import { usePast365Days } from "../../datahooks/useHistoricalData.ts";
import { getFeetAndInchesWithFraction } from "../dataRenderTools.ts";
import { LakeSystemFeatures, LakeSystemSettings } from "../../../shared/services/data";

const Past365Days: React.FC<{lakeSettings: LakeSystemSettings, todayLevel: number}> = ({lakeSettings, todayLevel}) => {
    const graphEnabled = lakeSettings.features.includes(LakeSystemFeatures.PREVIOUS_YEAR_GRAPH); // or however your settings work

    const { loading: loadingYearData, error: yearDataError, data: yearData } = graphEnabled
        ? usePast365Days(lakeSettings.lakeId)
        : { loading: false, error: null, data: null };

    if (!graphEnabled) {
        return null;
    }

    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstanceRef = useRef<Chart | null>(null);

    return (
        <>
            <div className="feature-header">
                <h2 className="feature-title">Past 365 Days</h2>
            </div>
            <AsyncContainer isLoading={loadingYearData} error={yearDataError} data={yearData}>
                {(data) => {
                    // Cleanup previous chart if it exists
                    useEffect(() => {
                        if (chartInstanceRef.current) {
                            chartInstanceRef.current.destroy();
                        }

                        chartInstanceRef.current = new Chart(chartRef.current!, {
                            type: 'line',
                            data: {
                                datasets: [{
                                    label: 'Water Level',
                                    data: data.data.map(item => ({ x: item.date, y: item.value })),
                                    borderColor: 'rgb(75, 192, 192)',
                                    pointRadius: 0,
                                    pointHitRadius: 50,
                                    borderWidth: 3,
                                }]
                            },
                            options: {
                                plugins: {
                                    legend: {
                                        display: false
                                    },
                                    tooltip: {
                                        callbacks: {
                                            title: function(context) {
                                                const dataPoint = context[0].raw as { x: string, y: number };
                                                const date = new Date(dataPoint.x);

                                                return date.toLocaleDateString('en', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                });
                                            },
                                            label: function(context) {
                                                const highlightedValue = context.parsed.y;
                                                const {feet: highlightedFeet, inches: highlightedInches} = getFeetAndInchesWithFraction(highlightedValue);
                                                const difference = highlightedValue - todayLevel;
                                                const { feet: diffFeet, inches: diffInches, fraction: diffFraction } = getFeetAndInchesWithFraction(difference);
                                                const diffText = (difference >= 0 ? "+":"-") +
                                                    (diffFeet > 0 ? `${diffFeet}ft ${diffInches}in`
                                                        : `${diffInches} ${diffFraction}in`)

                                                return [
                                                    `Level: ${highlightedFeet}ft ${highlightedInches}in`,
                                                    `vs Today: ${diffText}`,
                                                ];
                                            }
                                        }
                                    }
                                },
                                scales: {
                                    x: {
                                        ticks: {
                                            callback: function(value) {
                                                if (typeof value === 'number') {
                                                    return new Date(this.getLabelForValue(value)).toLocaleDateString('en', {
                                                        month: 'short',
                                                        day: 'numeric'
                                                    });
                                                }
                                                return value;
                                            }
                                        }
                                    }
                                }
                            }
                        }) as unknown as Chart;

                        return () => {
                            if (chartInstanceRef.current) {
                                chartInstanceRef.current.destroy();
                            }
                        };
                    }, [data]);

                    return <canvas ref={chartRef}></canvas>;
                }}
            </AsyncContainer>
        </>
    );
}

export default Past365Days;
