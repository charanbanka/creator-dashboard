const Users = require("../models/users");
const CreditLogs = require("../models/creditLogs");
const Feeds = require("../models/feeds");
const Activities = require("../models/activities");

/**
 * Fetch credits earned by day
 */
async function getCreditsByDay() {
  try {
    const creditsByDay = await CreditLogs.aggregate([
      {
        $group: {
          _id: { $dayOfWeek: "$createdAt" },
          credits: { $sum: "$credits" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const formattedData = creditsByDay.map((item) => ({
      name: days[item._id - 1],
      credits: item.credits,
    }));

    return { status: "success", data: formattedData };
  } catch (error) {
    console.error("Error fetching credits by day:", error);
    return { status: "failure", message: "Failed to fetch credits by day" };
  }
}

/**
 * Fetch user activity (logins and posts) by week
 */
async function getUserActivity() {
  try {
    const userActivity = await Activities.aggregate([
      {
        $group: {
          _id: { $week: "$createdAt" },
          logins: {
            $sum: {
              $cond: [{ $eq: ["$action", "daily_login"] }, 1, 0],
            },
          },
          posts: {
            $sum: {
              $cond: [{ $eq: ["$action", "post"] }, 1, 0],
            },
          },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const formattedData = userActivity.map((item) => ({
      name: `Week ${item._id}`,
      logins: item.logins,
      posts: item.posts,
    }));

    return { status: "success", data: formattedData };
  } catch (error) {
    console.error("Error fetching user activity:", error);
    return { status: "failure", message: "Failed to fetch user activity" };
  }
}

/**
 * Fetch feed sources distribution
 */
async function getFeedSources() {
  try {
    const feedSources = await Feeds.aggregate([
      {
        $group: {
          _id: "$source",
          value: { $sum: 1 },
        },
      },
    ]);

    const formattedData = feedSources.map((item) => ({
      name: item._id,
      value: item.value,
    }));

    return { status: "success", data: formattedData };
  } catch (error) {
    console.error("Error fetching feed sources:", error);
    return { status: "failure", message: "Failed to fetch feed sources" };
  }
}

/**
 * Fetch feed actions distribution
 */
async function getFeedActions() {
  try {
    const feedActions = await Activities.aggregate([
      {
        $group: {
          _id: "$action",
          value: { $sum: 1 },
        },
      },
    ]);

    const formattedData = feedActions.map((item) => ({
      name: item._id,
      value: item.value,
    }));

    return { status: "success", data: formattedData };
  } catch (error) {
    console.error("Error fetching feed actions:", error);
    return { status: "failure", message: "Failed to fetch feed actions" };
  }
}

module.exports = {
  getCreditsByDay,
  getUserActivity,
  getFeedSources,
  getFeedActions,
};
