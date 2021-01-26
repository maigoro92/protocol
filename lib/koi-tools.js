// this file contains a library for interacting with the Koi community contract
/*
    Supported Operations / TODO
    1. Add all standard PSC endpoints support
    2. Add wallet management support (wrapper on arweave library)
    3. Add wallet getBalance Support (fetch from permaweb, not contract interaction) X
    4. Upload data and store PST  (hit registerPermaWebData) X
    5. Creating Tasks and funding bounties (hit ) X
    6. Submitting data to tasks (and receiving rewards!) X
    7. Distributing daily KOI rewards (burn KOI to call distributeRewards)
    8. Participate in voting
    9. Approve Traffic Logs
*/
const Arweave = require ('arweave/node')
const arweave = Arweave.init({
  host: 'arweave.net',
  protocol: 'https',
  port: 443
});
const koi_address = "< TODO insert KOI contract address here >"
const koi_contract = "somehow import the contract via smartweave here for interfacing?"
const bundlerNodes = "18.218.133.52" // @abel - I have a gateway set up on this ndoe, I think we can run the server there as well

class koi {

  constructor(wallet) {
    this.wallet = wallet;
    this.myBookmarks = [];
    this.getWalletAddress()
  }

  addToBookmarks(artxid, ref) {
      if ( typeof(this.myBookmarks[artxid]) != "undefined" ) {
          throw Error ('cannot assign a bookmark to ', artxid, ' since it already has a note ', ref)
      } else {
          this.myBookmarks[artxid] = ref
          this.myBookmarks[ref] = artxid
      }
  }

  async getWalletAddress () {
      if (!this.address) this.address = await arweave.wallets.jwkToAddress(this.wallet)
      return this.address;
  }

  async getWalletBalance () {
    this.balance = await arweave.wallets.getBalance(this.address);
    return this.balance;
  }

  async postData (data) { // TODO: define data interface
    // var receivedData: object = {};
    // TODO hit registerPermaWebData in order to add received data to PermaWeb
    // TODO store returned PST

    // First we create the transaction
    const transaction = arweave.createTransaction({
        data: JSON.stringify(data)
    }, this.wallet);

    // Now we sign the transaction
    await arweave.transactions.sign(transaction, this.wallet);

    // After is signed, we send the transaction
    var tx = await arweave.transaction.post(transaction);

    console.log('tx', tx)

    return tx;
  }

  createTask (task, bounty){ // TODO:create task interface
    // TODO: create task id
    // TODO: store task, task id, and bounty in SmartWeave contract
  }

  submitDataToTask (submission) { // TODO: Create submission interface
    // TODO: pass submission from human or machine agent to SmartWeave contract
    // TODO: await rewards from SmartWeave contract and send them to human or machine
    var rewards = 0;
    return rewards;
  }

  distributeDailyRewards () { // TODO: Create rewards interfact
    // TODO:
    return null;
  }

  vote () { // TODO: participate in a voting event via the smart contract
    // TODO: interact with contract here (need to deploy first)
    // voting should be submitted to a 'bundler' node - will need an api interface 
    return null;
  }

  stakeToVote () { // TODO: Stake to participate in voting
    // TODO: interact with contract here (need to deploy first)
    // see the amplifyEconomy/contract/src/stake for example
    return null;
  }
}

module.exports = koi;