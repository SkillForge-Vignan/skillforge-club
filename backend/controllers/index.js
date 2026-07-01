/**
 * Controller to handle status check
 */
export const getStatus = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Backend API is running smoothly',
    timestamp: new Date().toISOString()
  });
};
