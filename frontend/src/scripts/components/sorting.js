export function sortAccounts(accounts, prop) {
  return accounts.sort((accountsOne, accountsTwo) => {
    // if (accountsOne[prop] > accountsTwo[prop]) return 1;
    if (accountsOne[prop] < accountsTwo[prop]) return -1;
    return 0;
  });
}
