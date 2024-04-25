const User = require('../domains/user/model');
const Account = require('../domains/account/model');

const associateAccountWithUser = async (accountId, userId) => {
  try {
    // Update the gamer's document to associate the account
    const updatedGamer = await User.findByIdAndUpdate(userId, { account: accountId }, { new: true });

    if (!updatedGamer) {
      throw new Error("Gamer not found or failed to update.");
    }
  } catch (error) {
    console.error("Error associating account with gamer:", error.message);
    throw error;
  }
};

const associateTokenAccount = async (accountId, tokenAccountId) => {
  try {
    // Update the gamer's account to associate the tokenAccount
    const updatedAccount = await Account.findByIdAndUpdate(
      accountId,
      { $push: { tokenAccounts: tokenAccountId } },
      { new: true }
    );

    if (!updatedAccount) {
      throw new Error("Gamer not found or failed to update.");
    }
  } catch (error) {
    console.error("Error associating token account with gamer:", error.message);
    throw error;
  }
};

// Associate the vrt account with the gamer's account
const associateVrtAccount = async (accountId, vrtAccountId) => {
  try {
    // Update the gamer's account to associate the vrtAccount
    const updatedAccount = await Account.findByIdAndUpdate(
      accountId,
      { $set: { vrtAccount: vrtAccountId } },
      { new: true }
      );

    if (!updatedAccount) {
      throw new Error("Gamer not found or failed to update.");
    }

    return updatedAccount;
  } catch (error) {
    console.error("Error associating vrt account with gamer:", error.message);
    throw error;
  }
}



module.exports = {associateAccountWithUser, associateTokenAccount, associateVrtAccount};
