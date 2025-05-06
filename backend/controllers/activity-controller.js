const {
  createActivity,
  getActivitiesByUserId,
} = require("../services/activity-service");
const { SERVICE_SUCCESS, SERVICE_FAILURE } = require("../common/constants");

/**
 * Controller to create an activity
 */
const createActivityController = async (req, res) => {
  try {
    const activityInfo = {
      userId: req.user._id, // Assuming `req.user` contains the authenticated user's info
      feedId: req.body.feedId,
      action: req.body.action,
      metadata: req.body.metadata,
      userInfo: req.user,
    };

    const response = await createActivity(activityInfo);

    if (response.status === SERVICE_SUCCESS) {
      return res.status(201).json(response);
    } else {
      return res.status(400).json(response);
    }
  } catch (error) {
    console.error("Error in createActivityController:", error);
    return res.status(500).json({
      status: SERVICE_FAILURE,
      message: "An internal server error occurred",
    });
  }
};

/**
 * Controller to fetch activities by userId
 */
const getActivitiesByUserIdController = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming `req.user` contains the authenticated user's info
    const response = await getActivitiesByUserId(userId);

    if (response.status === SERVICE_SUCCESS) {
      return res.status(200).json(response);
    } else {
      return res.status(404).json(response);
    }
  } catch (error) {
    console.error("Error in getActivitiesByUserIdController:", error);
    return res.status(500).json({
      status: SERVICE_FAILURE,
      message: "An internal server error occurred",
    });
  }
};

module.exports = { createActivityController, getActivitiesByUserIdController };
