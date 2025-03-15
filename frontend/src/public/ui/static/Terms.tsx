import React from "react";
import "./static.css";
import { PageTitle } from "../../components/PageTitle.tsx";

const Terms: React.FC = () => {
    return (
        <div className="static-container">
            <PageTitle title={"Terms of Service"} />
            <h1>Terms of Service</h1>

            <div className="static-section">
                <h2>Welcome to LakeStats!</h2>
                <p>
                    By using our website, you're agreeing to these terms. Its nothing scary or
                    complicated. Just some basic ground rules to keep things running smoothly.
                </p>
            </div>

            <div className="static-section">
                <h2>Be A Good Internet Neighbor</h2>
                <p>
                    You agree to use LakeStats for good, not evil. Don't try to hack us, spam us, or
                    otherwise mess up the site for others. We can't imagine how you would, but just
                    in case: You are not allowed to use LakeStats or any of its connected systems to
                    break the law or harm others.
                </p>
                <p>
                    The point of this site is to allow you to check lake levels and conditions in an
                    easy, user friendly way. If you're not using it for that, you're doing it wrong.
                </p>
            </div>

            <div className="static-section">
                <h2>The Data Thing</h2>
                <p>
                    We get our data from government sources like the Bureau of Reclamation. While we
                    do our best to keep it accurate, please don't use LakeStats to make
                    life-or-death decisions. Always check official sources if you're planning
                    something where accuracy is critical.
                </p>
                <p>
                    In other words: If you're building an ark, maybe double-check the water levels.
                </p>
            </div>

            <div className="static-section">
                <h2>Your Responsibility</h2>
                <p>
                    Water is wet, rocks are hard, and lakes can be dangerous. LakeStats helps you
                    monitor conditions, but it's up to you to boat, swim, and fish responsibly.
                    Safety first, fun second, cool Instagram photos third.
                </p>
            </div>

            <div className="static-section">
                <h2>This Site 'As Is'</h2>
                <p>
                    LakeStats is a personal programming project built by a single developer. While
                    I'm doing my best to build a robust, user-friendly, and accurate site, I can't
                    guarantee that it will always be perfect. By using the site, you accept the site
                    as-is, with no legally binding guarantees of accuracy or reliability.
                </p>
            </div>

            <div className="static-section">
                <h2>Privacy Stuff</h2>
                <p>
                    We collect literally none of your data. Frankly, we're too busy checking lake
                    levels to build complicated tracking systems. We don't have ads and theres
                    nothing to log in to, so your privacy is safe with us.
                </p>
            </div>

            <div className="static-section">
                <h2>Changes to Terms</h2>
                <p>We might update these terms occasionally, so make sure you check back!</p>
            </div>

            <div className="static-section">
                <h2>Questions?</h2>
                <p>
                    Have questions about these terms or anything else about LakeStats? Feel free to
                    contact us at <a href="mailto:feedback@lakestats.com">feedback@lakestats.com</a>
                    .
                </p>
                <p>Last updated: March 13, 2025</p>
            </div>
        </div>
    );
};

export default Terms;
