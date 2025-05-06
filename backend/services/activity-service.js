const Activities = require("../models/activities");
const { SERVICE_SUCCESS, SERVICE_FAILURE } = require("../common/constants");

/**
 * Function to create an activity record
 * @param {Object} activityInfo - Object containing userId, feedId, action, metadata, and userInfo
 * @returns {Object} - Status and message of the operation
 */
async function createActivity(activityInfo) {
  const { userId, feedId, action, metadata, userInfo } = activityInfo;

  try {
    // Create a new activity record
    const activity = new Activities({
      userId,
      feedId: feedId || null, // Optional feedId
      action,
      metadata: metadata || {}, // Optional metadata
      createdBy: userInfo.email, // Assuming userInfo contains the email of the creator
      updatedBy: userInfo.email || null,
    });

    // Save the activity to the database
    const savedActivity = await activity.save();

    return {
      status: SERVICE_SUCCESS,
      message: "Activity recorded successfully",
      data: savedActivity,
    };
  } catch (error) {
    console.error("Error creating activity:", error);
    return {
      status: SERVICE_FAILURE,
      message: "An error occurred while recording the activity",
    };
  }
}

/**
 * Function to fetch activity records by userId
 * @param {String} userId - The ID of the user
 * @returns {Object} - Status and list of activities or an error message
 */
async function getActivitiesByUserId(userId) {
  try {
    const activities = await Activities.find({ userId }).sort({ createdAt: -1 }); // Sort by most recent

    if (!activities || activities.length === 0) {
      return {
        status: SERVICE_FAILURE,
        message: "No activities found for the user",
      };
    }

    return {
      status: SERVICE_SUCCESS,
      data: activities,
    };
  } catch (error) {
    console.error("Error fetching activities:", error);
    return {
      status: SERVICE_FAILURE,
      message: "An error occurred while fetching activities",
    };
  }
}

module.exports = { createActivity, getActivitiesByUserId };