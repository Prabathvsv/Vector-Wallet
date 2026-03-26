export const analyzeTransactionError = (errorMsg: string): string => {
  const lowerMsg = errorMsg.toLowerCase();
  if (lowerMsg.includes('insufficient funds')) {
    return "💡 Agent Tip: You don't have enough ETH for this transaction plus the gas fee. Try sending a smaller amount.";
  }
  if (lowerMsg.includes('nonce too low')) {
    return "💡 Agent Tip: A previous transaction is still pending or stuck. Try resetting your wallet connection.";
  }
  if (lowerMsg.includes('execution reverted')) {
    return "💡 Agent Tip: The smart contract rejected your transaction. Check the contract requirements or try increasing the gas limit.";
  }
  return "💡 Agent Tip: An unknown error occurred. Double check your inputs and try again.";
};

export const suggestOptimalGas = (baseFeeWei: bigint) => {
  return {
    slow: (baseFeeWei * 110n) / 100n,
    average: (baseFeeWei * 150n) / 100n,
    fast: (baseFeeWei * 200n) / 100n
  };
};

export const checkSuspiciousAddress = (address: string) => {
  // Mock check for demo purposes
  const knownScams = ['0x1234567890123456789012345678901234567890'];
  if (knownScams.includes(address.toLowerCase())) {
    return "⚠️ WARNING: The destination address is flagged as suspicious. Proceed with extreme caution.";
  }
  if (address === '0x0000000000000000000000000000000000000000') {
    return "⚠️ WARNING: You are sending to the zero address, which will burn your ETH.";
  }
  return null;
};
