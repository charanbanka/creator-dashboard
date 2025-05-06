const { getSavedPosts, saveFeed, reportFeed, unSaveFeed, shareFeed } = require("../services/feed-service");
const { SERVICE_FAILURE, SERVICE_SUCCESS } = require("../common/constants");

// Controller to get all saved posts for a user
const getSavedPostsController = async (req, res) => {
  try {
    const userInfo = req.user; // Assuming `req.user` contains the authenticated user's info
    const response = await getSavedPosts(userInfo);

    if (response.status === SERVICE_SUCCESS) {
      return res.status(200).json({
        status: SERVICE_SUCCESS,
        data: response.data,
      });
    } else {
      return res.status(404).json({
        status: SERVICE_FAILURE,
        message: response.message,
      });
    }
  } catch (error) {
    console.error("Error in getSavedPostsController:", error);
    return res.status(500).json({
      status: SERVICE_FAILURE,
      message: "An internal server error occurred",
    });
  }
};

// Controller to save a feed
const saveFeedController = async (req, res) => {
  try {
    const reqInfo = {
      userInfo: req.user, // Assuming `req.user` contains the authenticated user's info
      data: req.body, // Feed data from the request body
    };

    const response = await saveFeed(reqInfo);

    if (response.status === SERVICE_SUCCESS) {
      return res.status(201).json({
        status: SERVICE_SUCCESS,
        message: response.message,
      });
    } else {
      return res.status(400).json({
        status: SERVICE_FAILURE,
        message: response.message,
      });
    }
  } catch (error) {
    console.error("Error in saveFeedController:", error);
    return res.status(500).json({
      status: SERVICE_FAILURE,
      message: "An internal server error occurred",
    });
  }
};


// Controller to save a feed
const shareFeedController = async (req, res) => {
  try {
    const reqInfo = {
      userInfo: req.user, // Assuming `req.user` contains the authenticated user's info
      data: req.body, // Feed data from the request body
    };

    const response = await shareFeed(reqInfo);

    if (response.status === SERVICE_SUCCESS) {
      return res.status(201).json({
        status: SERVICE_SUCCESS,
        message: response.message,
      });
    } else {
      return res.status(400).json({
        status: SERVICE_FAILURE,
        message: response.message,
      });
    }
  } catch (error) {
    console.error("Error in saveFeedController:", error);
    return res.status(500).json({
      status: SERVICE_FAILURE,
      message: "An internal server error occurred",
    });
  }
};

// Controller to save a feed
const unSaveFeedController = async (req, res) => {
    try {
      const reqInfo = {
        userInfo: req.user, // Assuming `req.user` contains the authenticated user's info
        data: req.body, // Feed data from the request body
      };
  
      const response = await unSaveFeed(reqInfo);
  
      if (response.status === SERVICE_SUCCESS) {
        return res.status(201).json({
          status: SERVICE_SUCCESS,
          message: response.message,
        });
      } else {
        return res.status(400).json({
          status: SERVICE_FAILURE,
          message: response.message,
        });
      }
    } catch (error) {
      console.error("Error in saveFeedController:", error);
      return res.status(500).json({
        status: SERVICE_FAILURE,
        message: "An internal server error occurred",
      });
    }
  };

// Controller to report feed
const reportFeedController = async (req, res) => {
  try {
    const reqInfo = {
      userInfo: req.user, // Assuming `req.user` contains the authenticated user's info
      data: req.body, // Feed data from the request body
    };

    const response = await reportFeed(reqInfo);

    if (response.status === SERVICE_SUCCESS) {
      return res.status(201).json({
        status: SERVICE_SUCCESS,
        message: response.message,
      });
    } else {
      return res.status(400).json({
        status: SERVICE_FAILURE,
        message: response.message,
      });
    }
  } catch (error) {
    console.error("Error in reportFeedController:", error);
    return res.status(500).json({
      status: SERVICE_FAILURE,
      message: "An internal server error occurred",
    });
  }
};

module.exports = {
  getSavedPostsController,
  saveFeedController,
  unSaveFeedController,
  reportFeedController,
  shareFeedController
};
