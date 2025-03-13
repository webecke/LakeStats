import { useEffect } from 'react';

interface PageTitleProps {
    title: string;
    siteName?: string;
}

export const PageTitle: React.FC<PageTitleProps> = ({ title, siteName = 'LakeStats' }) => {
    useEffect(() => {
        const previousTitle = document.title;
        document.title = siteName ? `${title} | ${siteName}` : title;

        return () => {
            document.title = previousTitle;
        };
    }, [title, siteName]);

    return null;
};
