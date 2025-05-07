import React from "react";
import "./static.css";
import { PageTitle } from "../../components/PageTitle.tsx";
import { Link } from "react-router-dom";

const DataSourcesInfo: React.FC = () => {
    return (
        <div className="static-container">
            <PageTitle title={"About our Data"} />
            <h1>About our Data Sources</h1>

            <div className="static-section">
                <h2>Where We Get Our Data</h2>
                <p>
                    LakeStats itself does not collect any data. Instead, we aggregate publicly available data from the
                    Bureau of Reclamation (BoR). We then process this data to provide you with the most accurate and up-to-date
                    information about your favorite lakes.
                </p>
                <p>
                    We specifically we utilize their HydroData tool, which you can {" "}
                    <a href="https://www.usbr.gov/uc/water/hydrodata/reservoir_data/site_map.html" target="_blank">check out for yourself.</a> {" "}
                    It's actually pretty cool. And if you see a lake on there that you'd like added to LakeStats, {" "}
                    <Link to={"/feedback"}>let us know!</Link>
                </p>
            </div>
            <div className="static-section">
                <h2>When is Data Collected?</h2>
                <p>
                    The BoR collects data on a daily basis at midnight, but the data isn't immediately available.
                </p>
                <blockquote>
                    <p>
                        The json updates early in the morning but times will vary depending on when data comes in, scripts run, and/or if corrections are needed.
                        Typically, this will happen before 8 a.m. even if we need to make some corrections to the process.
                    </p>
                    <cite>Engineer at the BoR</cite>
                </blockquote>
                <p>
                    Because LakeStats doesn't want to continuously spam the BoR checking for updates, we check for updated data
                    hourly 2am-12pm (Utah Time), then a couple more times in the afternoon.
                </p>
                <p>
                    If the data for a lake is out of date, it is because the BoR has not updated it yet. Most lakes do update daily,
                    but some lakes seem to update every few days instead.
                </p>
            </div>

            <div className="static-section">
                <h2>Note About Data Labeling</h2>
                <p>
                    In the previous section we mentioned data is collected at midnight. This is <em>almost</em> true.
                    Technically and officially, the BoR collects data at 11:59PM on the date recorded for the data. We
                    found this caused confusion for our users since it always seemed that the data was at least a day
                    behind, when in reality they were looking at the most up to date data.
                </p>
                <p>
                    LakeStats rolls the date forward to the next day on all data. For example, the data marked in the BoR
                    database as May 3rd 2025 at 11:59PM is labeled as May 4th 2025 at 12:00AM in LakeStats.
                </p>
                <p>
                    This doesn't really change anything for you the user since it is a 1 minute shift on data collected daily,
                    but it may cause some confusion for you if you are getting technical and comparing our data with other tools.
                </p>
            </div>
        </div>
    );
};

export default DataSourcesInfo;
