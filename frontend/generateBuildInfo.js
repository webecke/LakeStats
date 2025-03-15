import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

console.log("Generating build info...");

const buildTime = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
    timeZone: 'America/Denver',
    timeZoneName: 'short'
});

// ES modules equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const outputPath = join(__dirname, 'src', 'buildInfo.ts');

const content = `// This file is auto-generated. Do not edit directly.
export const BUILD_TIME: string = "${buildTime}";
`;

writeFileSync(outputPath, content);

console.log('Build info generated:', buildTime);
