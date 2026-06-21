export function errorHandler(err, req, res, next) {
  console.error('Error:', err);
  
  if (err.code === 'permission-denied') {
    return res.status(403).json({ error: 'Permission denied' });
  }
  
  if (err.code === 'not-found') {
    return res.status(404).json({ error: 'Resource not found' });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }

  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
}

export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export function validate(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
  };
}
