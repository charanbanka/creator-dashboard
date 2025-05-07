const Users = require("../models/users");
const { SERVICE_SUCCESS, SERVICE_FAILURE } = require("../common/constants");
const { createCreditLog } = require("./creditlog-service");
const { createActivity } = require("./activity-service");

/**
 * Function to update user details and mark profile as completed if both name and profilePicture are provided
 * @param {Object} reqInfo - Object containing userInfo and data
 * @returns {Object} - Status and message of the operation
 */
async function updateUserProfile(reqInfo) {
  const { userInfo, data } = reqInfo;
  const { name, profilePicture } = data;

  try {
    // Fetch the user from the database to check if the profile is already completed
    const existingUser = await Users.findById(userInfo._id);

    if (!existingUser) {
      return {
        status: SERVICE_FAILURE,
        message: "User not found",
      };
    }

    // Prepare the update object
    const updateData = {
      name,
      profilePicture,
    };

    // Mark profileCompleted as true if both name and profilePicture are provided
    if (name && profilePicture && !existingUser.profileCompleted) {
      updateData.profileCompleted = true;

      // Call createCreditLog to add credits for completing the profile
      await createCreditLog({
        userId: userInfo._id,
        credits: 25,
        userInfo,
        type: "profile_complete",
      });

      await createActivity({
        userId: userInfo._id,
        action: "profile_completion",
        userInfo,
      });

      updateData.credits = (existingUser.credits || 0) + 25;
    } else {
      if (!name || !profilePicture) updateData.profileCompleted = false;
    }

    // Update the user in the database
    const updatedUser = await Users.findByIdAndUpdate(
      userInfo._id, // Find the user by their ID
      { $set: updateData }, // Update the fields
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return {
        status: SERVICE_FAILURE,
        message: "User not found or could not be updated",
      };
    }

    return {
      status: SERVICE_SUCCESS,
      message: "User profile updated successfully",
      data: updatedUser,
    };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return {
      status: SERVICE_FAILURE,
      message: "An error occurred while updating the user profile",
    };
  }
}
/**
 * Function to fetch all users, optionally filtering by name
 * @param {Object} reqInfo - Object containing optional name and userInfo
 * @returns {Object} - Status and list of users or an error message
 */
async function fetchAllUsers(reqInfo) {
  let { name } = reqInfo;
  try {
    // Build the query object
    const query = name
      ? {
          $or: [
            { name: { $regex: name, $options: "i" } },
            { email: { $regex: name, $options: "i" } },
          ],
        }
      : {}; // Case-insensitive search by name or email // Case-insensitive search by name
    console.log("query", query);
    // Fetch users from the database
    const users = await Users.find(query, "-password"); // Exclude the password field for security

    if (!users || users.length === 0) {
      return {
        status: SERVICE_FAILURE,
        message: "No users found",
      };
    }

    return {
      status: SERVICE_SUCCESS,
      data: users,
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    return {
      status: SERVICE_FAILURE,
      message: "An error occurred while fetching users",
    };
  }
}
/**
 * Function to update user credits
 * @param {Object} reqInfo - Object containing userId, credits, and adminInfo
 * @returns {Object} - Status and updated user or an error message
 */
async function updateUserCredits(reqInfo) {
  const { userId, credits, adminInfo } = reqInfo;

  try {
    // Fetch the user to ensure they exist
    const user = await Users.findById(userId);

    if (!user) {
      return {
        status: SERVICE_FAILURE,
        message: "User not found",
      };
    }

    // Update the user's credits
    const updatedUser = await Users.findByIdAndUpdate(
      userId,
      { credits }, // Increment or decrement credits
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return {
        status: SERVICE_FAILURE,
        message: "Failed to update user credits",
      };
    }

    // Log the credit adjustment in the credit logs
    await createCreditLog({
      userId,
      credits: credits - user.credits,
      userInfo: adminInfo,
      type: "admin_adjustment",
      action: credits - user.credits >= 0 ? "credit_added" : "credit_removed",
    });

    return {
      status: SERVICE_SUCCESS,
      message: "User credits updated successfully",
      data: updatedUser,
    };
  } catch (error) {
    console.error("Error updating user credits:", error);
    return {
      status: SERVICE_FAILURE,
      message: "An error occurred while updating user credits",
    };
  }
}

module.exports = { updateUserProfile, fetchAllUsers, updateUserCredits };
