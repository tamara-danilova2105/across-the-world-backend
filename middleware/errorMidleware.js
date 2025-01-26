class ApiError extends Error {
    constructor(status, message, errors = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static BadRequest(message, errors = []) {
        return new ApiError(400, message, errors);
    }

    static Unauthorized() {
        return new ApiError(401, 'Пользователь не авторизован');
    }

    static NotFound(message) {
        return new ApiError(404, message);
    }
}

module.exports = function errorMiddleware(err, req, res, next) {
    console.log(err);
    
    if (err instanceof ApiError) {
        return res.status(err.status).json({
            message: err.message,
            errors: err.errors 
        });
    }
    
    return res.status(500).json({
        message: 'Непредвиденная ошибка сервера'
    });
}

module.exports.ApiError = ApiError;