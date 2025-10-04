const errorHandler = (err, req, res, next) => {
  console.error('Error global:', err);
  
  // Determinar código de estado
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  // Respuesta de error
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
  });
};

module.exports = { errorHandler };