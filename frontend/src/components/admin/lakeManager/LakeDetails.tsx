import React from 'react';
import './LakeDetails.css';
import { Lake } from '../../../services/data';

interface LakeDetailsProps {
    lake: Lake;
    setLake: (value: (((prevState: Lake | null) => Lake | null) | Lake | null)) => void;
}

export default function LakeDetails({ lake, setLake }: LakeDetailsProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setLake(prev => {
            if (!prev) return prev;

            if (type === 'number') {
                return {
                    ...prev,
                    [name]: parseFloat(value)
                };
            }

            if (type === 'date') {
                const [year, month, day] = value.split('-').map(Number);
                return {
                    ...prev,
                    [name]: new Date(Date.UTC(year, month - 1, day))
                };
            }

            return {
                ...prev,
                [name]: value
            };
        });
    };

    const formatDateForInput = (date: Date) => {
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    return (
        <div className="lake-form">
            <div className="lake-form__grid">
                <h3>Lake Details</h3>

                <div className="lake-form__field">
                    <label className="lake-form__label" htmlFor="description">Description</label>
                    <input
                        className="lake-form__input"
                        id="description"
                        name="description"
                        value={lake.description}
                        onChange={handleChange}
                    />
                </div>

                <div className="lake-form__field">
                    <label className="lake-form__label" htmlFor="fillDate">Fill Date</label>
                    <input
                        className="lake-form__input"
                        type="date"
                        id="fillDate"
                        name="fillDate"
                        value={formatDateForInput(lake.fillDate)}
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
