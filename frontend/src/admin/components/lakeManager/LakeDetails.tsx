import React from "react";
import "./LakeDetails.css";
import { LakeMetaData } from "../../../shared/services/data";

interface LakeDetailsProps {
    lake: LakeMetaData;
    setLake: (
        value: ((prevState: LakeMetaData | null) => LakeMetaData | null) | LakeMetaData | null
    ) => void;
}

export default function LakeDetails({ lake, setLake }: LakeDetailsProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setLake((prev) => {
            if (!prev) return prev;

            if (type === "number") {
                return {
                    ...prev,
                    [name]: parseFloat(value),
                };
            }

            if (type === "date") {
                // The value is already in YYYY-MM-DD format from the input
                return {
                    ...prev,
                    [name]: value,
                };
            }

            return {
                ...prev,
                [name]: value,
            };
        });
    };

    return (
        <div className="lake-form">
            <div className="lake-form__grid">
                <h3>Lake Details</h3>

                <div className="lake-form__field">
                    <label className="lake-form__label" htmlFor="description">
                        Description
                    </label>
                    <input
                        className="lake-form__input"
                        id="description"
                        name="description"
                        value={lake.description}
                        onChange={handleChange}
                    />
                </div>

                <div className="lake-form__field">
                    <label className="lake-form__label" htmlFor="fillDate">
                        Fill Date
                    </label>
                    <input
                        className="lake-form__input"
                        type="date"
                        id="fillDate"
                        name="fillDate"
                        value={lake.fillDate}
                        onChange={handleChange}
                    />
                </div>

                <div className="lake-form__field">
                    <label className="lake-form__label" htmlFor="googleMapsLinkToDam">
                        Google Maps Link
                    </label>
                    <input
                        className="lake-form__input"
                        id="googleMapsLinkToDam"
                        name="googleMapsLinkToDam"
                        value={lake.googleMapsLinkToDam}
                        onChange={handleChange}
                    />
                </div>

                <div className="lake-form__elevation-grid">
                    <div className="lake-form__field">
                        <label className="lake-form__label" htmlFor="fullPoolElevation">
                            Full Pool Elevation
                        </label>
                        <input
                            className="lake-form__input"
                            type="number"
                            id="fullPoolElevation"
                            name="fullPoolElevation"
                            value={lake.fullPoolElevation}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="lake-form__field">
                        <label className="lake-form__label" htmlFor="minPowerPoolElevation">
                            Min Power Pool
                        </label>
                        <input
                            className="lake-form__input"
                            type="number"
                            id="minPowerPoolElevation"
                            name="minPowerPoolElevation"
                            value={lake.minPowerPoolElevation}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="lake-form__field">
                        <label className="lake-form__label" htmlFor="deadPoolElevation">
                            Dead Pool
                        </label>
                        <input
                            className="lake-form__input"
                            type="number"
                            id="deadPoolElevation"
                            name="deadPoolElevation"
                            value={lake.deadPoolElevation}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
