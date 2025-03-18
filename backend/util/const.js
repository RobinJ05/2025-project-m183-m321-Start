exports.ISO8601 = '%Y-%m-%dT%T';

exports.JWTSECTRET = 'rumpelstilzchen2.0';
exports.JWTEXPIRATION = '1h';

exports.ERR_DB_DUP_ENTRY = 1062;
exports.ERR_DB_UNKONW_COLUMN = 1054;

exports.HTTP_STATUS_OK = 200;
exports.HTTP_STATUS_CREATED = 201;
exports.HTTP_STATUS_NO_CONTENT = 204;
exports.HTTP_STATUS_BAD_REQUEST = 400;
exports.HTTP_STATUS_UNAUTHORIZED = 401;
exports.HTTP_STATUS_NOT_FOUND = 404;
exports.HTTP_STATUS_CONFLICT = 409;
exports.HTTP_STATUS_UNPROCESSABLE_CONTENT = 422;
exports.HTTP_STATUS_INTERNAL_SERVER_ERROR = 500;

exports.SEQ_UNIQUE_CONSTRAINT_ERR = "SequelizeUniqueConstraintError";
exports.SEQ_DB_ERR = "SequelizeDatabaseError";

exports.STATIC_DIR = "public";

exports.BCRYPTSALTROUNDS = 10;

// Authentication method switch
exports.USE_SESSION_HANDLING = false; // Set to false to use Keycloak/JWT instead of Passport/Session
