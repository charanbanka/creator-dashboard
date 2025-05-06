const { SERVICE_FAILURE, SERVICE_SUCCESS } = require("../common/constants");
const CreditLogs = require("../models/creditLogs");
const Feeds = require("../models/feeds");
const Users = require("../models/users"); // Import the User model
const { createActivity } = require("./activity-service");
const { createCreditLog } = require("./creditlog-service");

// Function to get all saved posts for a user
async function getSavedPosts(userInfo) {
  try {
    // Find the user by their ID
    const user = await Users.findById(userInfo._id).populate("savedPosts");

    if (!user) {
      return {
        status: SERVICE_FAILURE,
        message: "User not found",
      };
    }

    // let savedPosts = user.savedPost

    // Return the saved posts
    return {
      status: SERVICE_SUCCESS,
      data: user.savedPosts,
    };
  } catch (error) {
    console.error("Error fetching saved posts:", error);
    return {
      status: SERVICE_FAILURE,
      message: "An error occurred while fetching saved posts",
    };
  }
}

// Write an async function to save feed details
async function saveFeed(reqInfo) {
  let userInfo = reqInfo.userInfo;
  try {
    let data = reqInfo.data;
    data.createdBy = userInfo.email;

    // Save the feed
    // Check if a feed with the same externalId and source already exists
    let savedFeed = await Feeds.findOneAndUpdate(
      { externalId: data.externalId, source: data.source }, // Match by externalId and source
      { $set: data }, // Update the feed with the new data
      { new: true, upsert: true } // Return the updated document or create a new one if it doesn't exist
    );

    // Update user's credits (+2) and add feed ID to savedPosts
    await Users.findOneAndUpdate(
      { email: userInfo.email }, // Find the user by email
      {
        $inc: { credits: 2 }, // Increment credits by 2
        $push: { savedPosts: savedFeed._id }, // Add the feed ID to savedPosts
      },
      { new: true } // Return the updated document
    );

    //update credit logs
    await createCreditLog({
      userId: userInfo._id,
      credits: 2,
      userInfo,
      type: "interaction",
      action: "save",
    });

    await createActivity({
      userId: userInfo._id,
      feedId: savedFeed._id,
      action: "save",
      metadata: {
        postTitle: data.title || data.content,
      },
      userInfo,
    });

    return {
      status: SERVICE_SUCCESS,
      message:
        "Feed saved successfully, credits updated, and feed ID added to savedPosts",
    };
  } catch (error) {
    console.log("Error saving feed:", error);
    return {
      status: SERVICE_FAILURE,
      message: "An error occurred while saving the feed",
    };
  }
}

async function shareFeed(reqInfo) {
  let userInfo = reqInfo.userInfo;
  try {
    let data = reqInfo.data;
    data.createdBy = userInfo.email;

    // Update user's credits (+2) and add feed ID to savedPosts
    await Users.findOneAndUpdate(
      { email: userInfo.email }, // Find the user by email
      {
        $inc: { credits: 3 }, // Increment credits by 3
      },
      { new: true } // Return the updated document
    );

    //update credit logs
    await createCreditLog({
      userId: userInfo._id,
      credits: 3,
      userInfo,
      type: "interaction",
      action: "share",
    });

    await createActivity({
      userId: userInfo._id,
      action: "share",
      metadata: {
        postTitle: data.title || data.content,
        postSource: data.source,
      },
      userInfo,
    });

    return {
      status: SERVICE_SUCCESS,
      message:
        "Feed saved successfully, credits updated, and feed ID added to savedPosts",
    };
  } catch (error) {
    console.log("Error saving feed:", error);
    return {
      status: SERVICE_FAILURE,
      message: "An error occurred while saving the feed",
    };
  }
}

// Write an async function to save feed details
async function unSaveFeed(reqInfo) {
  let userInfo = reqInfo.userInfo;
  try {
    let data = reqInfo.data;

    // Update user's credits (-2) and remove feed ID from savedPosts
    await Users.findOneAndUpdate(
      { email: userInfo.email }, // Find the user by email
      {
        $inc: { credits: -2 }, // Decrement credits by 2
        $pull: { savedPosts: data._id || data.id }, // Remove the feed ID from savedPosts
      },
      { new: true } // Return the updated document
    );

    // Optionally, you can log the activity or update credit logs if needed
    await createCreditLog({
      userId: userInfo._id,
      credits: -2,
      userInfo,
      type: "interaction",
      action: "unsave",
    });

    await createActivity({
      userId: userInfo._id,
      feedId: data._id || data.id,
      action: "unsave",
      metadata: {
        postTitle: data.title || data.content,
      },
      userInfo,
    });

    return {
      status: SERVICE_SUCCESS,
      message:
        "Feed unsaved successfully, credits updated, and feed ID removed from savedPosts",
    };
  } catch (error) {
    console.error("Error unsaving feed:", error);
    return {
      status: SERVICE_FAILURE,
      message: "An error occurred while unsaving the feed",
    };
  }
}
/**
 * Function to report a feed
 * @param {Object} reqInfo - Object containing userInfo and feed ID
 * @returns {Object} - Status and message of the operation
 */
async function reportFeed(reqInfo) {
  let { userInfo, data } = reqInfo;

  try {
    let { isNew, id: feedId, reportReason } = data;
    if (isNew) {
      //check and create
      data.createdBy = userInfo.email;
      // Check if a feed with the same externalId and source already exists
      let savedFeed = await Feeds.findOneAndUpdate(
        { externalId: data.externalId, source: data.source }, // Match by externalId and source
        { $set: data }, // Update the feed with the new data
        { new: true, upsert: true } // Return the updated document or create a new one if it doesn't exist
      );
      feedId = savedFeed._id;
    }

    // Update the feed's report column by adding the user ID
    const updatedFeed = await Feeds.findByIdAndUpdate(
      feedId,
      { $addToSet: { reportedBy: userInfo._id } }, // Add user ID to the reports array (avoids duplicates)
      { new: true } // Return the updated document
    );

    await createActivity({
      userId: userInfo._id,
      feedId,
      action: "report",
      metadata: {
        reportReason: reportReason || null,
      },
      userInfo,
    });

    if (!updatedFeed) {
      return {
        status: SERVICE_FAILURE,
        message: "Feed not found or could not be reported",
      };
    }

    return {
      status: SERVICE_SUCCESS,
      message: "Feed reported successfully",
    };
  } catch (error) {
    console.error("Error reporting feed:", error);
    return {
      status: SERVICE_FAILURE,
      message: "An error occurred while reporting the feed",
    };
  }
}

module.exports = { saveFeed, unSaveFeed, getSavedPosts, reportFeed, shareFeed };
