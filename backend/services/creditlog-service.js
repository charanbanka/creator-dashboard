const CreditLogs = require("../models/creditLogs");
const { SERVICE_SUCCESS, SERVICE_FAILURE } = require("../common/constants");

/**
 * Function to create a credit log record
 * @param {ObjectId} userId - The ID of the user
 * @param {String} type - The type of credit log (e.g., "daily_login", "profile_complete")
 * @param {Number} credits - The number of credits to log
 * @param {Object} userInfo - The user information (e.g., createdBy, updatedBy)
 * @returns {Object} - The created credit log or an error message
 */
async function createCreditLog(reqInfo) {
  let { userId, type, credits,action, userInfo } = reqInfo;
  try {
    // Create a new credit log record
    const creditLog = new CreditLogs({
      userId,
      type,
      credits,
      action,
      createdBy: userInfo.email, // Assuming userInfo contains the email of the creator
      updatedBy: userInfo.email || null,
    });

    // Save the credit log to the database
    const savedCreditLog = await creditLog.save();

    return {
      status: SERVICE_SUCCESS,
      data: savedCreditLog,
    };
  } catch (error) {
    console.log("Error creating credit log:", error);
    return {
      status: SERVICE_FAILURE,
      message: "An error occurred while creating the credit log",
    };
  }
}

/**
 * Function to fetch credit logs by userId
 * @param {String} userId - The ID of the user
 * @returns {Object} - Status and list of credit logs or an error message
 */
async function getCreditLogsByUserId(userId) {
  try {
    const creditLogs = await CreditLogs.find({ userId }).sort({ createdAt: -1 }); // Sort by most recent

    if (!creditLogs || creditLogs.length === 0) {
      return {
        status: SERVICE_FAILURE,
        message: "No credit logs found for the user",
      };
    }

    return {
      status: SERVICE_SUCCESS,
      data: creditLogs,
    };
  } catch (error) {
    console.error("Error fetching credit logs:", error);
    return {
      status: SERVICE_FAILURE,
      message: "An error occurred while fetching credit logs",
    };
  }
}

module.exports = { createCreditLog,getCreditLogsByUserId };
