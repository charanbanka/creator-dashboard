const {
  updateUserProfile,
  fetchAllUsers,
  updateUserCredits,
} = require("../services/user-service");
const { SERVICE_SUCCESS, SERVICE_FAILURE } = require("../common/constants");

/**
 * Controller to update user profile
 */
const updateUserProfileController = async (req, res) => {
  try {
    const reqInfo = {
      userInfo: req.user, // Assuming `req.user` contains the authenticated user's info
      data: req.body, // Data from the request body
    };

    const response = await updateUserProfile(reqInfo);

    if (response.status === SERVICE_SUCCESS) {
      return res.status(200).json(response);
    } else {
      return res.status(400).json(response);
    }
  } catch (error) {
    console.error("Error in updateUserProfileController:", error);
    return res.status(500).json({
      status: SERVICE_FAILURE,
      message: "An internal server error occurred",
    });
  }
};

const fetchUserProfileController = async (req, res) => {
  try {
    return res.status(200).json({ status: SERVICE_SUCCESS, data: req.user });
  } catch (error) {
    console.error("Error in updateUserProfileController:", error);
    return res.status(500).json({
      status: SERVICE_FAILURE,
      message: "An internal server error occurred",
    });
  }
};

/**
 * Controller to fetch all users
 */
const fetchAllUsersController = async (req, res) => {
  try {
    let { name } = req.query;
    let userInfo = req.user;
    const response = await fetchAllUsers({ name, userInfo });

    if (response.status === SERVICE_SUCCESS) {
      return res.status(200).json(response);
    } else {
      return res.status(404).json(response);
    }
  } catch (error) {
    console.error("Error in fetchAllUsersController:", error);
    return res.status(500).json({
      status: SERVICE_FAILURE,
      message: "An internal server error occurred",
    });
  }
};

/**
 * Controller to update user credits
 */
const updateUserCreditsController = async (req, res) => {
  try {
    const { userId, credits } = req.body; // Extract userId and credits from the request body
    const adminInfo = req.user; // Assuming `req.user` contains the authenticated admin's info

    if (!userId || credits === undefined) {
      return res.status(400).json({
        status: SERVICE_FAILURE,
        message: "userId and credits are required",
      });
    }

    const response = await updateUserCredits({ userId, credits, adminInfo });

    if (response.status === SERVICE_SUCCESS) {
      return res.status(200).json(response);
    } else {
      return res.status(400).json(response);
    }
  } catch (error) {
    console.error("Error in updateUserCreditsController:", error);
    return res.status(500).json({
      status: SERVICE_FAILURE,
      message: "An internal server error occurred",
    });
  }
};

module.exports = {
  updateUserProfileController,
  fetchUserProfileController,
  fetchAllUsersController,
  updateUserCreditsController
};
