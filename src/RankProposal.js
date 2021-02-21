export function RankProposal(state, action) {
    const trafficLogs = state.stateUpdate.trafficLogs;
    const votes = state.votes;
    if (SmartWeave.block.heigh < trafficLogs.close) {
        throw new ContractError('voting is ongoing');
    }
    const currentTrafficLogs = trafficLogs.dailyTrafficLog.find(trafficlog => trafficlog.block === trafficLogs.open);
    const proposedLog = currentTrafficLogs.proposedLogs;
    const proposedGateWays = {};
    proposedLog.forEach(prp => {
        const prpVote = votes[prp.voteId];
        if (!proposedGateWays[prp.gateWayId]) {
            if (prpVote.yays > prpVote.nays) {
                proposedGateWays[prp.gateWayId] = prp;
                prp.won = true;
            }
        } else {
            const currentSelectedPrp = proposedGateWays[prp.gateWayId];
            const selectedPrpVote = votes[currentSelectedPrp.voteId];
            const selectedPrpVoteTotal = selectedPrpVote.yays + selectedPrpVote.nays;
            const prpVoteTotal = prpVote.yays + prpVote.nays;
            if ((prpVoteTotal > selectedPrpVoteTotal) && (prpVote.yays > prpVote.nays)) {
                proposedGateWays[prp.gateWayId] = prp;
                prp.won = true;
                currentSelectedPrp.won = false;

            }

            const prpVotePassPer = prpVote.yays - prpVote.nays
            const selPrpVotePassPer = selectedPrpVote.yays - selectedPrpVote.nays
            if ((prpVoteTotal === selectedPrpVoteTotal) && (prpVotePassPer > selPrpVotePassPer)) {
                proposedGateWays[prp.gateWayId] = prp;
                prp.won = true;
                currentSelectedPrp.won = false;
            }

            if ((prpVoteTotal === selectedPrpVoteTotal) && (prpVotePassPer === selPrpVotePassPer) && (prp.blockHeight < currentSelectedPrp.blockHeight)) {
                proposedGateWays[prp.gateWayId] = prp;
                prp.won = true;
                currentSelectedPrp.won = false;
            }

        }


    });

    return { state }



}