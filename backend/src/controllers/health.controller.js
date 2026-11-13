export function getHealth(req, res) {
  res.status(200).json({
    status: 'ok',
    message: 'School Management API is running',
  });
}
