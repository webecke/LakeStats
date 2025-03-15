import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { dataService } from "../../shared/services/data";
import logoSvg from "../../assets/LakeStatsLogo-NoBackground.svg";

// Updated interface to match your LakeSystemSettings
interface LakeSystemSettings {
    lakeId: string;
    lakeName: string;
    brandedName: string;
    status: "ENABLED" | "DISABLED" | "TESTING";
    features: string[];
    sortOrder: number;
    accentColor: string;
}
import "./Home.css";
import AsyncContainer from "../components/AsyncContainer.tsx";

// Function to create a color gradient based on the accent color
const getColorGradient = (accentColor: string) => {
    // If no accent color is provided, use a default gradient
    if (!accentColor) {
        return "linear-gradient(to right, var(--status-success), var(--status-info))";
    }

    // Create a gradient with transparency for a nicer effect
    return `linear-gradient(to right, ${accentColor}, ${accentColor}50)`;
};

export default function Home() {
    const [lakes, setLakes] = useState<LakeSystemSettings[]>([]);
    const [isLakeListLoading, setIsLakeListLoading] = useState(true);

    useEffect(() => {
        const fetchLakes = async () => {
            try {
                // Only fetch enabled lakes for the public view
                const enabledLakes = await dataService.getLakesByStatus("ENABLED");
                setLakes(enabledLakes);
            } catch (error) {
                console.error("Error fetching lakes:", error);
            } finally {
                setIsLakeListLoading(false);
            }
        };

        fetchLakes();
    }, []);

    return (
        <div className="home-container">
            <header className="home-header">
                <div className="home-title-container">
                    <img src={logoSvg} alt="LakeStats Logo" className="home-logo" />
                    <h1 className="home-title">LakeStats</h1>
                </div>
                <p className="home-subtitle">
                    Monitor real-time water levels, access points, and conditions for major lakes
                </p>
            </header>

            <AsyncContainer isLoading={isLakeListLoading} error={null} data={lakes}>
                {(lakes) => (
                    <section className="lakes-grid">
                        {lakes.length === 0 ? (
                            <div className="no-lakes">
                                <p>No lakes available at this time.</p>
                            </div>
                        ) : (
                            lakes.map((lake: LakeSystemSettings) => (
                                <Link
                                    to={`/${lake.lakeId}`}
                                    key={lake.lakeId}
                                    className="lake-card"
                                >
                                    <h2 className="lake-card-title">{lake.brandedName}</h2>
                                    <h3 className="lake-card-name">{lake.lakeName}</h3>
                                    <div
                                        className="lake-card-indicator"
                                        style={{
                                            background: getColorGradient(
                                                lake.accentColor || "#3498db"
                                            ),
                                        }}
                                    ></div>
                                </Link>
                            ))
                        )}
                    </section>
                )}
            </AsyncContainer>

            <section className={"home-about"}>
                <h2>What is LakeStats?</h2>
                <p>
                    LakeStats shows you current lake levels and conditions using data from
                    government sources (Particularly the Bureau of Reclamation). We make it easy to
                    check water levels, boat ramp access, and recent changes so you can better plan
                    your lake visits.
                </p>
                <p>
                    We're still working on the site. More lakes and features are in the works. If
                    you have any feedback for the site, whether bug reports, suggested changes, or
                    features you'd like to see, feel free to email me:
                </p>
                <p>
                    <a href="mailto:feedback@lakestats.com">feedback@lakestats.com</a>
                </p>
            </section>
        </div>
    );
}
