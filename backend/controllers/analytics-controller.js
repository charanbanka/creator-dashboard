const {
  getCreditsByDay,
  getUserActivity,
  getFeedSources,
  getFeedActions,
} = require("../services/analytics-service");

/**
 * Controller to fetch credits by day
 */
const getCreditsByDayController = async (req, res) => {
  const response = await getCreditsByDay();
  res.status(response.status === "success" ? 200 : 500).json(response);
};

/**
 * Controller to fetch user activity
 */
const getUserActivityController = async (req, res) => {
  const response = await getUserActivity();
  res.status(response.status === "success" ? 200 : 500).json(response);
};

/**
 * Controller to fetch feed sources
 */
const getFeedSourcesController = async (req, res) => {
  const response = await getFeedSources();
  res.status(response.status === "success" ? 200 : 500).json(response);
};

/**
 * Controller to fetch feed actions
 */
const getFeedActionsController = async (req, res) => {
  const response = await getFeedActions();
  res.status(response.status === "success" ? 200 : 500).json(response);
};

module.exports = {
  getCreditsByDayController,
  getUserActivityController,
  getFeedSourcesController,
  getFeedActionsController,
};
