import Keycloak from 'keycloak-js';

const _kc = new Keycloak({
    url: 'http://localhost:8089',
    realm: 'ims3i',
    clientId: 'mountainGalleryFrontend'
});

/**
 * Initializes Keycloak instance and calls the provided callback function if successfully authenticated.
 *
 * @param onAuthenticatedCallback
 */
const initKeycloak = (onAuthenticatedCallback) => {
    _kc.init({
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
        pkceMethod: 'S256'
    })
        .then((authenticated) => {
            if (authenticated) {
                onAuthenticatedCallback();
            }
        })
};

const doLogin = _kc.login.bind(_kc);

const doLogout = _kc.logout.bind(_kc);

const getToken = () => _kc.token;

const isLoggedIn = () => !!_kc.token;

const updateToken = (successCallback) =>
    _kc.updateToken(30)
        .then(successCallback)
        .catch(doLogin);

const getUsername = () => _kc.tokenParsed?.preferred_username;

const hasRole = (roles) => roles.some((role) => _kc.hasRealmRole(role));

const AuthService = {
    initKeycloak,
    doLogin,
    doLogout,
    isLoggedIn,
    getToken,
    updateToken,
    getUsername,
    hasRole
};

export default AuthService;