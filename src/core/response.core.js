
const ErrorType = {
    NotFoundResource: 'Not_Founded_Resource',
    ConflictData: 'Conflict_Data',
    BadRequest: 'Bad_Request',
    UnAuthorized: 'UnAuthorized',
    NotFoundApi: 'NotFoundApi'
}

class NotFoundApi {

    constructor(message) {
        this.code = 404;
        this.error = ErrorType.NotFoundResource
        this.event = event
        this.message = message || 'Api path is not found.';
    }

}

class NotFoundResource {
    
    constructor(message, event) {
        this.code = 404;
        this.error = ErrorType.NotFoundResource
        this.event = event
        this.message = message;
    }
    
}


class ConflictData {
    constructor(message, event) {
        this.code = 409;
        this.event = event
        this.error = ErrorType.ConflictData
        this.message = message;
    }
    
}


class BadRequest {
    constructor(message, event) {
        this.code = 400;
        this.error = ErrorType.BadRequest
        this.message = message;
        this.event = event
    }
}


class UnAuthorized {
    constructor(message) {
        this.code = 401;
        this.error = ErrorType.UnAuthorized
        this.message = message;
    }
}


class InternalError {
    constructor(message) {
        this.code = 500
        this.error = ErrorType.InternalError
        this.message = message;
    }
}

module.exports = {
    UnAuthorized,
    BadRequest,
    ConflictData,
    NotFoundResource,
    InternalError,
    NotFoundApi
}