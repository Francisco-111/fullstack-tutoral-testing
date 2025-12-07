const { execSync } = require('child_process');

const tests = [
    { label: 'Login Test', file: 'login.e2e.js' },
];

for (const t of tests) {
    console.log('\n==============================');
    console.log(`▶  Running ${t.label}`);
    console.log('==============================\n');

    execSync(`node src/e2e/${t.file}`, { stdio: 'inherit' });
}

console.log('\n==============================');
console.log('🎉 All Selenium E2E tests completed.');
console.log('==============================\n');
