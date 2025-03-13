import { useSearchParams } from 'react-router-dom';
import notFoundGif from '../../../assets/404.gif';
import {PageTitle} from "../../components/PageTitle.tsx"; // Update this path to match your project structure

const NotFound = () => {
    const [searchParams] = useSearchParams();
    const source = searchParams.get('source') || '';

    return (
        <div className="not-found-container" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            padding: '1rem 2rem',
            margin: '0 auto'
        }}>
            <PageTitle title={"404 Not Found"} />
            <div className="gif-container" style={{ marginBottom: '1.5rem' }}>
                <img
                    src={notFoundGif}
                    alt="404 Not Found"
                    className="not-found-gif"
                    style={{ maxWidth: '100%', height: 'auto', maxHeight: '300px' }}
                />
            </div>

            <h1>404 - Page Not Found</h1>
            <p>The page you are looking for doesn't exist or has been moved.</p>
            {source && (
                <p>
                    Unable to find: <code>/{source}</code>
                </p>
            )}
            <p>
                If you were expecting something to be here, please let us know by emailing <a href={"mailto:feedback@lakestats.com"}>feedback@lakestats.com</a>
            </p>
            <a href="/" style={{ display: 'inline-block', marginTop: '1rem', color: '#0077cc', textDecoration: 'none' }}>
                Return to home page
            </a>
        </div>
    );
};

export default NotFound;
