const logTransactionChange = (action, performedBy, targetUser, transactionId, changes) => {
    return {
      action,
      performedBy,
      targetUser,
      transactionId,
      changes,
      timestamp: new Date(),
    };
  };
  
  module.exports = logTransactionChange;
  