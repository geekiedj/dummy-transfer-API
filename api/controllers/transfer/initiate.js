module.exports = {


  friendlyName: 'Initiate',


  description: 'Initiate transfer.',


  inputs: {
    email: {
      type: 'string',
      required: true
    },

    amount: {
      type: 'number',
      required: true
    }
  },


  exits: {

  },


  fn: async function (inputs) {

    const newEmail = inputs.email.toLowerCase()

    try {
      let senderWallet = await Wallet.findOne({ user: this.req.profile.data.id });
    
      if (!senderWallet) {
        return this.res.status(400).json({message: 'Sender wallet not found'});
      }
  
      let recipient = await User.findOne({ email: newEmail })
      
      if (!recipient) {
        return this.res.status(400).json({message: 'Recipient wallet not found'});
      }

      let recipientWallet = await Wallet.findOne({ user: recipient.id })
  
      if (senderWallet.balance < inputs.amount) {
        return this.res.status(400).send('Insufficient balance');
      }
  
      recipientWallet.balance += inputs.amount;
      senderWallet.balance -= inputs.amount;

  
      await Promise.all([
        Wallet.updateOne({ id: senderWallet.id }).set(senderWallet),
        Wallet.updateOne({ id: recipientWallet.id }).set(recipientWallet),
      ]);
  
      return this.res.status(200).send('Funds transferred successfully');
    } catch (error) {
      console.log(error)
      return this.res.status(500).send('An error occurred while transferring funds');
    }

  }

}
