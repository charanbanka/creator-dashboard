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

module.exports = { updateUserProfile };
