export async function BatchAction(state, action) {
    const stakes = state.stakes;
    const input = action.input;
    const caller = action.caller;
    const votes = state.votes;
    const validBundlers = state.validBundlers;
    const batchTxId = input.batchFile;
    const voteId = input.voteId;
    const vote = votes[voteId];
    if (!batchTxId) {
        throw new ContractError('No txId specified');
    }
    if (!voteId) {
        throw new ContractError('No voteId specified');
    }
    if (SmartWeave.block.height > vote.end) {
        throw new ContractError('it is already submmited ;)');
    }
    if (!typeof batchTxId === 'string') {
        throw new ContractError('batchTxId should be string');
    }
    if (!validBundlers.includes(action.caller)) {
        throw new ContractError('Only selected bundlers can write batch actions.');
    }
    if (!(caller in stakes)) {
        throw new ContractError('caller hasnt staked');
    }
    if (stakes[caller] < state.minBundlerStake) {
        throw new ContractError('You must stake at least', state.minBundlerStake, ' submit a vote to lower this number.');
    }
    const batch = await SmartWeave.unsafeClient.transactions.getData(batchTxId, { decode: true, string: true });
    const line = batch.split('\r\n');
    line.forEach(element => {
        var voteObj = JSON.parse(element);
        if (voteObj.vote.voteId === voteId && !vote.voted.includes(voteObj.senderAddress)) {
            if (voteObj.vote.userVote === 'true') {
                vote['yays'] += 1;
                voters.push(voteObj.senderAddress);
            }
            if (voteObj.vote.userVote === 'false') {
                vote['nays'] += 1;
                voters.push(voteObj.senderAddress);
            }
        }
    });
    if (!caller in vote.bundlers) {
        vote.bundlers[caller] = [];
    }
    vote.bundlers[caller].push(batchTxId);

    return { state };

}