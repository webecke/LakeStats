import { useState, FormEvent } from "react";
import { Button } from "../../../shared/components/Button";
import { authService } from "../../../shared/services/auth";
import "./LoginForm.css";

export function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            await authService.signIn(email, password);
        } catch (err) {
            setError("Invalid email or password");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="login-form">
            <h1 className="login-form__title">LakeStats Admin Login</h1>
            <p>Only LakeStats developers and team members have access to this panel.</p>
            <p>New users must be added by the system admin from the Firebase Auth Console.</p>

            <Button variant="secondary" href="/">
                Return to LakeStats
            </Button>

            <hr />

            <div className="login-form__field">
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>

            <div className="login-form__field">
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>

            {error && (
                <div className="login-form__error">
                    {error}
                    <hr />
                    <p>
                        Remember: this page is for LakeStats admins only. You don't need an account
                        to use the services provided by LakeStats!
                    </p>
                </div>
            )}

            <Button type="submit" isLoading={isLoading} className="login-form__submit">
                Sign In
            </Button>
        </form>
    );
}
