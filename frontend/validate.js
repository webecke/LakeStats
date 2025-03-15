// validate.js
import { execSync } from 'child_process';

try {
    console.log('Running format check...');
    execSync('npm run format', { stdio: 'inherit' });

    console.log('Running linting check...');
    // Add --max-warnings=0 to the actual eslint command
    execSync('npm run lint -- --max-warnings=0', { stdio: 'inherit' });

    console.log('Running type check...');
    execSync('npm run typecheck', { stdio: 'inherit' });

    // Only reaches here if all commands succeeded
    console.log('\n\n\n\n\n✅ 🎉 All checks passed! 🎉 ✅\nReady to push');
} catch (error) {
    console.error('\n❌ Validation failed ❌ \nPlease fix the issues before pushing.');
    // Exit with error code to indicate failure
    process.exit(1);
}
