export const ApiResponse = {
  success(res, data = null, message = "OK", status = 200, meta = null, code = "SUCCESS") {
    const response = {
      success: true,
      status,
      message,
      data,
      code,
      timestamp: new Date().toISOString(),
    };

    if (meta) response.meta = meta;

    return res.status(status).json(response);
  },

error(res, error = "Ocurrió un error", statusOverride = 500) {
    let status = statusOverride;
    let message = "Ocurrió un error";
    let code = "ERROR";

    // Si viene un objeto (AppError o {status, code, message})
    if (typeof error === "object" && error !== null) {
      console.log('ERROR', error)
      status = error.status || statusOverride;
      message = error.message || message;
      code = error.code || code;
    }

    // Si viene un string directo
    if (typeof error === "string") {
      message = error;
    }

    return res.status(status).json({
      success: false,
      status,
      message,
      code,
      timestamp: new Date().toISOString(),
    });
  }
};