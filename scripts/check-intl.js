const nav = require('next-intl/navigation');
const routing = require('next-intl/routing');
console.log('nav keys', Object.keys(nav));
console.log('routing keys', Object.keys(routing));
console.log('defineRouting', typeof routing.defineRouting);
console.log('createNavigation', typeof nav.createNavigation);
