require("dotenv").config();

const express = require("express");
const router = express.Router();
const Mnemonic = require("./../../utils/seedPhrase");
const Keypair = require("./../../utils/keypair");
const Account = require("./model");
const SeedPhrase = require("./../seedPhrase/model");
const VRTAccount = require("./../vrtAccount/model");
const VRT = require("./../vrt/model");
const TokenAccount = require("./../tokenAccount/model");
const Transaction = require("./../transaction/model");
const authenticateToken = require('../../middleware/authenticateToken');
const User = require("../user/model");
const verifyToken = require("../../middleware/auth");
const { associateAccountWithUser } = require("../../middleware/openAccount");

// get all accounts 
router.get("/", async (req, res, next) => {
  try {
    const accounts = await Account.find().select("publicKey tokenAccounts transactions vrtBalance");
    res.json(accounts);
  } catch (error) {
    next(error);
  }
});


// Create a new account associated with logged-in user
router.post('/', verifyToken, async (req, res, next) => {
  try {
    // Check if the user already has an associated account
    if (req.user.account) {
      return res.status(400).json({ message: 'user already has an associated account' });
    }

    // Generate a new key pair and seed phrase
    const keypair = Keypair.generate();
    const seedPhrase = Mnemonic.generate();

    // Create a new seed phrase document
    const newSeedPhrase = new SeedPhrase({
      seedPhrase: seedPhrase.seedPhrase,
    });

    // Save the new seed phrase to the database
    await newSeedPhrase.save();

    // Create a new account associated with the seed phrase
    const newAccount = new Account({
      seedPhrase: newSeedPhrase._id, // Reference the saved seed phrase document
      publicKey: keypair.publicKey,
      privateKey: keypair.privateKey,
    }); 

    // Save the new account to the database
    await newAccount.save();

    // Retrieve the seed phrase document from the database using its ID
    const retrievedSeedPhrase = await SeedPhrase.findById(newSeedPhrase._id);

    // Associate the account with the user using the middleware
    await associateAccountWithUser(newAccount._id, req.user._id); 


    // Respond with the newly created account data and the seed phrase
    res.status(201).json({
      account: newAccount,
      seedPhrase: retrievedSeedPhrase.seedPhrase,
    });
  } catch (error) {
    next(error);
  }
});


//yup
router.post('/2', authenticateToken, async (req, res, next) => {
  const userId = req.gamer.gamer.gamer._id;
  try {
    // Check if the gamer already has an associated account
    if (req.gamer.gamer.gamer.account) {
      return res.status(400).json({ message: 'Gamer already has an associated account' });
    }

    // Generate a new key pair and seed phrase
    const keypair = Keypair.generate();
    const seedPhrase = Mnemonic.generate();

    // Create a new seed phrase document
    const newSeedPhrase = new SeedPhrase({
      seedPhrase: seedPhrase.seedPhrase,
    });

    // Save the new seed phrase to the database
    await newSeedPhrase.save();

    // Create a new account associated with the seed phrase
    const newAccount = new Account({
      seedPhrase: newSeedPhrase._id, // Reference the saved seed phrase document
      publicKey: keypair.publicKey,
      privateKey: keypair.privateKey,
    });

    console.log("newAccountID", newAccount._id);

    // Save the new account to the database
    await newAccount.save();

    // Retrieve the seed phrase document from the database using its ID
    const retrievedSeedPhrase = await SeedPhrase.findById(newSeedPhrase._id);    

    // Associate the account with the gamer using the middleware
    // await associateAccountWithUser(newAccount._id, gamerId);    

    // Retrieve the native coin token (replace 'NativeCoin' with your actual token name)
    const nativeCoin = await VRT.findOne({ symbol: 'VRT' });

    console.log("nativeCoin", nativeCoin);

    // Create a new vrt account associated with the new account and native coin 
    const newVrtAccount = new VRTAccount({
      owner: gamerId,
      coin: nativeCoin._id,
      publicKey: Keypair.generate().publicKey,
    });

    // Save the new token account to the database
    await newVrtAccount.save();


    // Associate the account with the gamer using the middleware
    await associateVrtAccount(newAccount._id, newVrtAccount._id); 

    console.log("newAccountID", newAccount._id);
    console.log("newVrtAccountID", newVrtAccount._id);

    // Respond with the newly created account data, the seed phrase, and the associated token account
    res.status(201).json({
      account: newAccount,
      seedPhrase: retrievedSeedPhrase.seedPhrase,
      vrtAccount: newVrtAccount,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/vrt', verifyToken, async (req, res, next) => {
  try {
    // Check if the user already has an associated account
    if (req.user.account) {
      return res.status(400).json({ message: 'User already has an associated account' });
    }

    // Generate a new key pair and seed phrase
    const keypair = Keypair.generate();
    const seedPhrase = Mnemonic.generate();

    // Create a new seed phrase document
    const newSeedPhrase = new SeedPhrase({
      seedPhrase: seedPhrase.seedPhrase,
    });

    // Save the new seed phrase to the database
    await newSeedPhrase.save();

    // Create a new account associated with the seed phrase
    const newAccount = new Account({
      seedPhrase: newSeedPhrase._id, // Reference the saved seed phrase document
      publicKey: keypair.publicKey,
      privateKey: keypair.privateKey,
    }); 

    // Save the new account to the database
    await newAccount.save();

    // Create a new VRT account associated with the user's account
    const newVRTAccount = new VRTAccount({
      owner: req.user._id, // Reference the user's ID
      coin: 'VRT', // Assuming 'VRT' is the ID of the VRT coin document in your database
      publicKey: keypair.publicKey, // Using the same public key for VRT account
    });

    // Save the new VRT account to the database
    await newVRTAccount.save();

    // Associate the VRT account with the user's account
    await associateVrtAccount(newAccount._id, newVRTAccount._id);

    // Respond with the newly created account data and the seed phrase
    res.status(201).json({
      account: newAccount,
      vrtAccount: newVRTAccount,
      seedPhrase: seedPhrase.seedPhrase,
    });
  } catch (error) {
    next(error);
  }
});


// Add account to user
router.post("/add-account", async (req, res, next) => {
  try {
    const { userName, accountId } = req.body;
    console.log(req.body);

    // Find user's account based on their gamerTag
    const user = await User.findOne({ userName: userName });

    if (!user) {
      return res.status(404).json({ message: 'User account not found' });
    }

    // Check if the account with the provided accountId exists
    const existingAccount = await Account.findById(accountId);

    if (!existingAccount) {
      return res.status(404).json({ message: 'Account not found' });
    }
 
    // Associate the existing account with the gamer's account
    user.account = existingAccount._id;

    // Save the updated gamer's account
    await user.save();

    res.status(200).json({ message: 'Account associated with user successfully' });
  } catch (error) {
    console.error(error); // Log the error for debugging
    next(error);
  }
});







// get vrt balance by public key
router.get('/getBalance/:publicKey/', async (req, res, next) => {
  try {
    const { publicKey } = req.params;

    // Find the user's account using their publicKey
    const userAccount = await Account.findOne({ publicKey });

    if (!userAccount) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Retrieve the user's VRT balance from their account
    const vrtBalance = userAccount.vrtBalance;

    res.status(200).json({ vrtBalance });
  } catch (error) {
    next(error);
  }
});
 
// Transfer VRT token from one account to another
router.post("/transfer", async (req, res, next) => {
  try {
    const { senderPublicKey, recipientPublicKey, amount } = req.body;

    // Find the sender's account using their publicKey
    const senderAccount = await Account.findOne({ publicKey: senderPublicKey });

    if (!senderAccount) {
      return res.status(404).json({ message: "Sender not found" });
    }

    // Find the recipient's account using their publicKey
    const recipientAccount = await Account.findOne({ publicKey: recipientPublicKey });

    if (!recipientAccount) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    // Deduct the transfer amount from the sender's VRT balance
    if (senderAccount.vrtBalance < amount) {
      return res.status(400).json({ message: "Insufficient VRT balance for transfer" });
    }

    // Deduct the transfer amount from the sender's VRT balance
    senderAccount.vrtBalance -= amount;
    await senderAccount.save();

    // Increment the recipient's VRT balance
    recipientAccount.vrtBalance += amount;
    await recipientAccount.save();

    // Create a new transaction
    const newTransaction = new Transaction({
      sender: {
        id: senderAccount._id,
        publicKey: senderPublicKey,
      },
      recipient: {
        id: recipientAccount._id,
        publicKey: recipientPublicKey,
      },
      amount: amount
    });

    // Save the transaction to the database
    await newTransaction.save();

    // Push the transaction ID to the sender's and recipient's transaction arrays
    senderAccount.transactions.push(newTransaction._id);
    recipientAccount.transactions.push(newTransaction._id);

    // Save the sender and recipient accounts again to update their transaction arrays
    await senderAccount.save();
    await recipientAccount.save();

    // Respond with the updated VRT balance
    res.status(200).json({ message: "Transfer successful", vrtBalance: senderAccount.vrtBalance });
  } catch (error) {
    next(error);
  }
});

// get account by seed phrase array from request body
router.post("/getAccount", async (req, res, next) => {
  try {
    const { seedPhrase } = req.body;

    // Find the seed phrase document using the seed phrase array
    const seedPhraseDocument = await SeedPhrase.findOne({ seedPhrase });

    if (!seedPhraseDocument) {
      return res.status(404).json({ message: "Seed phrase not found" });
    }

    // Find the account associated with the seed phrase document
    const account = await Account.findOne({ seedPhrase: seedPhraseDocument._id });

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    // Respond with the account data
    res.status(200).json({
      publicKey: account.publicKey,
      privateKey: account.privateKey,
    });
  } catch (error) {
    next(error);
  }
});

// Convert vrt to vrtx
router.post("/convert", async (req, res, next) => {
  try {
    const { publicKey, amount } = req.body;

    // Find the user's account using their publicKey
    const userAccount = await Account.findOne({ publicKey });

    if (!userAccount) {
      return res.status(404).json({ message: "User not found" });
    }

    // Deduct the conversion amount from the user's VRT balance
    if (userAccount.vrtBalance < amount) {
      return res.status(400).json({ message: "Insufficient VRT balance for conversion" });
    }

    // Deduct the conversion amount from the user's VRT balance
    userAccount.vrtBalance -= amount;
    await userAccount.save();

    // Increment the user's VRTX balance
    userAccount.vrtxBalance += amount;
    await userAccount.save();

    // Create a new transaction
    const newTransaction = new Transaction({
      sender: {
        id: userAccount._id,
        publicKey: publicKey,
      },
      recipient: {
        id: userAccount._id,
        publicKey: publicKey,
      },
      amount: amount
    });

    // Save the transaction to the database
    await newTransaction.save();

    // Push the transaction ID to the user's transaction array
    userAccount.transactions.push(newTransaction._id);

    // Save the user account again to update their transaction array
    await userAccount.save();

    // Respond with the updated VRT balance
    res.status(200).json({ message: "Conversion successful", vrtBalance: userAccount.vrtBalance });
  } catch (error) {
    next(error);
  }
});


  







module.exports = router;
