import React from "react";
import "./static.css";
import { PageTitle } from "../../components/PageTitle.tsx";
import { Button } from "../../../shared/components/Button";

const Feedback: React.FC = () => {
    return (
        <div className="static-container">
            <PageTitle title={"Feedback & Contact"} />
            <h1>Feedback</h1>

            <div className="static-section">
                <h2>Public Beta Feedback</h2>
                <p>
                    LakeStats is currently in public beta. We have plenty of features we want to implement, and we want to know whats important to you the users! It would be a great help if you took just one minute to fill out our short survey about the app.
                </p>
                <a href="https://forms.gle/tQ6yU7WRMDdUHZdz9" target="_blank"><Button className="button--lg">Take Public Beta Feedback Survey</Button></a>
            </div>

            <div className="static-section">
                <h2>Contact</h2>
                <p>
                    Got questions? Or just wanna get in contact? Email us at <a href="mailto:feedback@lakestats.com">feedback@lakestats.com</a>
                </p>
            </div>
        </div>
    );
};

export default Feedback;
