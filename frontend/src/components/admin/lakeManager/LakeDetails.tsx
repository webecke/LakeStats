import React from 'react';
import './LakeDetails.css';
import { Lake } from '../../../services/data';

interface LakeFormProps {
    lake: Lake;
    setLake: (value: (((prevState: Lake | null) => Lake | null) | Lake | null)) => void;
}

export default function LakeDetails({ lake, setLake }: LakeFormProps) {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setLake(prev => {
            if (!prev) return prev;
            return {
                ...prev,
                [name]: type === 'number' ? parseFloat(value) : value
            };
        });
    };

    return (
        <form className="lake-form">
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
                        value={lake.fillDate.toISOString().split('T')[0]}
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
        </form>
    );
}
