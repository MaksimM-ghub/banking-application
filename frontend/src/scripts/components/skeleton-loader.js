import { el } from 'redom';

function createOneAccountSkeleton() {
  const numberAccount = el('div.accounts-skeleton-number.pulsate');
  const moneyAccount = el('div.accounts-skeleton-money.pulsate');

  const dateAccount = el('div.accounts-skeleton-date.pulsate');
  const btnAccount = el('div.accounts-skeleton-open-btn.pulsate');

  const accountInner = el('div.accounts-skeleton-inner', [
    dateAccount,
    btnAccount,
  ]);

  const accountItem = el('li.accounts-skeleton-item', [
    numberAccount,
    moneyAccount,
    accountInner,
  ]);

  return accountItem;
}

export function accountsSkeleton(itemsArr) {
  const accountsTitle = el('div.accounts-skeleton-title.pulsate');
  const accountsSelect = el('div.accounts-skeleton-select.pulsate');
  const accountsButton = el('div.accounts-skeleton-new-btn.pulsate');
  const accountsTop = el('div.accounts-skeleton-top', [
    accountsTitle,
    accountsSelect,
    accountsButton,
  ]);

  const accountsItem = itemsArr.map((account) =>
    createOneAccountSkeleton(account)
  );
  const accountsList = el('ul.accounts-skeleton-list.list-reset.grid', [
    accountsItem,
  ]);
  const accountsContainer = el('div.accouts-skeleton', [
    accountsTop,
    accountsList,
  ]);

  return accountsContainer;
}

export function currencySkeleton() {
  const currencyTitle = el('div.currency-skeleton-title.pulsate');

  const yourСurrenciesTitle = el('div.currency-skeleton-your-title.pulsate');
  const yourСurrenciesList = el('div.currency-skeleton-your-list.pulsate');
  const yourСurrencies = el('div.currency-skeleton-your', [
    yourСurrenciesTitle,
    yourСurrenciesList,
  ]);

  const currencyExchangeTitle = el(
    'div.currency-skeleton-exchange-title.pulsate'
  );
  const currencyExchangeFrom = el(
    'div.currency-skeleton-exchange-from.pulsate'
  );
  const currencyExchangeTo = el('div.currency-skeleton-exchange-to.pulsate');
  const currencyExchangeSum = el('div.currency-skeleton-exchange-sum.pulsate');
  const currencyExchangeLeft = el('div.currency-skeleton-exchange-left', [
    currencyExchangeFrom,
    currencyExchangeTo,
    currencyExchangeSum,
  ]);
  const currencyExchangeBtn = el('div.currency-skeleton-exchange-btn.pulsate');
  const currencyWrapper = el('div.currency-skeleton-wrapper', [
    currencyExchangeLeft,
    currencyExchangeBtn,
  ]);
  const currencyExchange = el('div.currency-skeleton-exchange', [
    currencyExchangeTitle,
    currencyWrapper,
  ]);

  const currencyChangeTitle = el('div.currency-skeleton-change-title.pulsate');
  const currencyChangeList = el('div.currency-skeleton-change-list.pulsate');
  const currencyChange = el('div.currency-skeleton-change', [
    currencyChangeTitle,
    currencyChangeList,
  ]);
  const currencyList = el('div.currency-skeleton-list.grid', [
    yourСurrencies,
    currencyExchange,
    currencyChange,
  ]);
  const currencyContainer = el('div.currency-skeleton', [
    currencyTitle,
    currencyList,
  ]);

  return currencyContainer;
}

export function mapsSkeleton() {
  const mapsTitle = el('div.maps-skeleton-title.pulsate');
  const mapsWrapper = el('div.maps-skeleton-wrapper.pulsate');

  const mapsContainer = el('div.maps-skeleton-container', [
    mapsTitle,
    mapsWrapper,
  ]);

  return mapsContainer;
}

export function accountInfoSkeleton() {
  // Верхняя часть страницы
  const accountTitle = el('div.account-info-top-title.pulsate');
  const accountNumber = el('div.account-info-top-number.pulsate');
  const accountBtnTop = el('div.account-info-top-btn.pulsate');
  const accountBalance = el('div.account-info-top-balance.pulsate');
  const accountTop = el('div.account-info-top.grid', [accountTitle, accountNumber, accountBtnTop, accountBalance]);
  // Блок с переводом
  const accountTransferTitle = el('div.account-info-transfer-title.pulsate');
  const accountNumberWrapper = el('div.account-info-number-wrapper', [el('div.account-info-number-label.pulsate'), el('div.account-info-number-input.pulsate')]);
  const accountSumWrapper = el('div.account-info-sum-wrapper', [el('div.account-info-sum-label.pulsate'), el('div.account-info-sum-input.pulsate')]);
  const accountBtn = el('div.account-info-btn.pulsate');
  const accountItemTransfer = el('li.account-info-item.grid', [accountTransferTitle, accountNumberWrapper, accountSumWrapper, accountBtn]);
  // Блок с диаграммой
  const accountChartTitle = el('div.account-info-chart-title.pulsate');
  const accountChart = el('div.account-info-chart.pulsate');
  const accountItemChart = el('li.account-info-item.grid', [accountChartTitle, accountChart]);
  // Блок с таблицей
  const accountTableTitle = el('div.account-info-table-title.pulsate');
  const accountTableHead = el('div.account-info-table-head.pulsate');
  const accountItemTable = el('li.account-info-item.grid', [accountTableTitle, accountTableHead]);

  const accountList = el('ul.account-info-list.list-reset.grid', [accountItemTransfer, accountItemChart, accountItemTable]);

  const accountInfoContainer = el('div.account-info-container', [accountTop, accountList]);

  return accountInfoContainer;
}
