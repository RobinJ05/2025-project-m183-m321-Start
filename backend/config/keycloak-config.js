const session = require('express-session');
const Keycloak = require('keycloak-connect');
const MemoryStore = require('memorystore')(session);

const memoryStore = new MemoryStore();
const keycloak = new Keycloak({ store: memoryStore });

module.exports = { keycloak };
