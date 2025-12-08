const { execSync } = require('child_process');

const tests = [
    'successful_login.e2e.js',
    'required_email.e2e.js',
    'invalid_email_format.e2e.js',
    'token_stored.e2e.js',
    'logout_clears_token.e2e.js',
    'direct_access_when_logged_in.e2e.js',
    'header_navigation.e2e.js',
    'launch_list_has_items.e2e.js',
    'view_launch_detail.e2e.js',
    'back_from_detail.e2e.js',
    'load_more_launches.e2e.js',
    'launch_tile_keyboard_access.e2e.js',
    'header_visible.e2e.js',
    'book_launch.e2e.js',
    'cancel_launch.e2e.js',
    'book_requires_auth.e2e.js',
    'multiple_bookings.e2e.js',
    'booked_trip_in_my_trips.e2e.js',
    'empty_my_trips.e2e.js',
    'add_to_cart.e2e.js',
    'cart_persists.e2e.js',
    'cart_clears_on_logout.e2e.js',
    'launches_network_error.e2e.js',
    'invalid_token_header.e2e.js',
    'refresh_during_flows.e2e.js',

];

for (const file of tests) {
    console.log('\n====================================');
    console.log(`Running ${file}`);
    console.log('====================================');
    execSync(`node src/e2e/${file}`, { stdio: 'inherit' });
}

console.log('\n====================================');
console.log('All Selenium E2E tests completed');
console.log('====================================\n');
