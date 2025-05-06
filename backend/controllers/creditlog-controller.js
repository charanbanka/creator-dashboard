const { getCreditLogsByUserId } = require("../services/creditlog-service");
const { SERVICE_SUCCESS, SERVICE_FAILURE } = require("../common/constants");

/**
 * Controller to fetch credit logs by userId
 */
const getCreditLogsByUserIdController = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming `req.user` contains the authenticated user's info
    const response = await getCreditLogsByUserId(userId);

    if (response.status === SERVICE_SUCCESS) {
      return res.status(200).json(response);
    } else {
      return res.status(404).json(response);
    }
  } catch (error) {
    console.error("Error in getCreditLogsByUserIdController:", error);
    return res.status(500).json({
      status: SERVICE_FAILURE,
      message: "An internal server error occurred",
    });
  }
};

module.exports = { getCreditLogsByUserIdController };