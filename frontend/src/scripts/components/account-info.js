import { el, setChildren } from 'redom';
import { main } from '../_vars.js';
import { getAccounts, transferFunds } from './api.js';
import { getToken, saveAccounts } from './local-storage.js';
import { createAccountsUser } from './accounts.js';
import { transferValidation } from './transfers-validation.js';
import { showListAccounts } from './autoСompletion.js';
import { switchCardType } from './switchCardType.js';
import { balanceHistory } from './history.js';
import {
  createChart,
  drawingColumnsDinamic,
  drawingColumnTransaction,
} from './chart.js';
import { dragEvent } from './draggables.js';

const token = getToken();
const monthNames = [
  'Янв',
  'Фев',
  'Мар',
  'Апр',
  'Май',
  'Июн',
  'Июл',
  'Авг',
  'Сен',
  'Окт',
  'Ноя',
  'Дек',
];

function createFormTransfer(account, balance) {
  const formTitle = el('h3.account-info__form-title', 'Новый перевод');

  const labelNumber = el(
    'label.account-info__label',
    {
      for: 'number',
    },
    'Номер счета получателя'
  );

  const inputNumber = el(
    'input.account-info__input.accounts-info__number-input',
    {
      type: 'text',
      id: 'number',
      name: 'to',
      placeholder: 'Введите номер получателя',
      autocomplete: 'off',
    }
  );
  const formInputNumberWrapper = el('div.account-info__input-wrapper', [
    labelNumber,
    inputNumber,
  ]);
  //
  const labelSum = el(
    'label.account-info__label',
    {
      for: 'sum',
    },
    'Сумма перевода'
  );

  const inputSum = el('input.account-info__input.accounts-info__sum-input', {
    type: 'text',
    id: 'sum',
    name: 'amount',
    placeholder: 'Введите сумму перевода',
  });
  const formInputSumWrapper = el('div.account-info__input-wrapper', [
    labelSum,
    inputSum,
  ]);
  const formButton = el('button.btn.account-info__btn', 'Отправить');
  const autocompletionList = el(
    'ul.account-info__autocompletion-list.list-reset'
  );

  const imgContainer = el('div.account-info__card-type');

  const form = el(
    'form.account-info__form',
    {
      action: '',
      method: 'POST',
    },
    [
      formTitle,
      formInputNumberWrapper,
      formInputSumWrapper,
      autocompletionList,
      formButton,
      imgContainer,
    ]
  );

  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    const data = {
      from: account,
    };

    if (await transferValidation(this, balance)) {
      document.querySelectorAll('input').forEach((input) => {
        data[input.name] = input.value;
        input.value = '';
      });

      //Изменяем баланс
        document.querySelector('.account-info__balance-money').textContent =
        `${Number(balance) - Number(data.amount)} Руб`;

      //Сохраняем в localStorage номер счета
      saveAccounts(data.to);

      // Функция перевода со счета на счет
      await transferFunds(data, token);
      imgContainer.innerHTML = '';
    }
  });

  inputNumber.addEventListener('input', (event) => {
    const value = event.target.value;
    showListAccounts(value, autocompletionList, inputNumber);
    switchCardType(value, imgContainer);
  });

  document.addEventListener('click', (event) => {
    if (
      !autocompletionList.contains(event.target) &&
      event.target != inputNumber
    ) {
      autocompletionList.style.display = 'none';
    }
  });

  return form;
}

export function createTableTransfers(account, balance, transactions) {
  const tableTitle = el('h3.account-info__table-title', 'История переводов');
  const thAccountSenders = el('th.account-info__th-head', 'Счет отправителя');
  const thAccountRecipients = el('th.account-info__th-head', 'Счет получателя');
  const thSum = el('th.account-info__th-head', 'Сумма');
  const thDate = el('th.account-info__th-head', 'Дата');
  const trHead = el('tr.account-info__table-tr-head', [
    thAccountSenders,
    thAccountRecipients,
    thSum,
    thDate,
  ]);
  const tableHead = el('thead.account-info__table-head', [trHead]);

  const tableBody = el('tbody.account-info__table-body');
  transactions.slice(-10).forEach((item) => {
    const thAccountSenders = el('th.account-info__th-body', item.from);
    const thAccountRecipients = el('th.account-info__th-body', item.to);
    const thSumBody = el('th.account-info__th-body');
    if (item.from === account) {
      thSumBody.textContent = `${-item.amount}`;
      thSumBody.style.color = 'red';
    } else {
      thSumBody.textContent = item.amount;
      thSumBody.style.color = 'green';
    }
    // форматируем дату в необходимый вид
    const dateFormat = new Date(item.date).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });
    const thDate = el('th.account-info__th-body', dateFormat);
    const tr = el('tr.account-info__tr-body', [
      thAccountSenders,
      thAccountRecipients,
      thSumBody,
      thDate,
    ]);
    tableBody.append(tr);
  });
  const table = el('table.account-info__table', [tableHead, tableBody]);
  const tableWrapper = el('div.account-info__table-container', [
    tableTitle,
    table,
  ]);

  return tableWrapper;
}

export function accountInformationTop(
  title,
  account,
  balance,
  transactions,
  callback
) {
  const accountInfoTitle = el('h2.account-info__title', title);
  const accountInfoBtnBack = el(
    'button.btn.account-info__btn-back',
    'Вернуться назад'
  );

  accountInfoBtnBack.addEventListener('click', async () => {
    const renderAccounts = await callback();
    setChildren(main, [renderAccounts]);
    createChart(
      transactionData(account, balance, transactions, 6),
      'chartDinamic',
      drawingColumnsDinamic
    );
  });

  const accountInfoNumber = el('span.account-info__number', `№ ${account}`);
  const accountInfoBalance = el('div.account-info__balance', [
    el('span.account-info__balance-text', 'Баланс'),
    el('span.account-info__balance-money', `${balance} Руб`),
  ]);
  const accountInfoTop = el('div.account-info__top.grid', [
    accountInfoTitle,
    accountInfoBtnBack,
    accountInfoNumber,
    accountInfoBalance,
  ]);

  return accountInfoTop;
}

// Получаем информацию за указанный период
export function transactionData(account, balance, transactions, month) {
  const currentDate = new Date();
  const startData = new Date();
  startData.setMonth(currentDate.getMonth() - month);

  const filterData = transactions.filter((item) => {
    const itemDate = new Date(item.date);
    return itemDate >= startData && itemDate <= currentDate;
  });

  // Группировка транзакций по месяцам
  const transactionForYear = {};
  filterData.forEach((item) => {
    const transactionDate = new Date(item.date);
    const yearMonth = `${transactionDate.getFullYear()}-${String(transactionDate.getMonth() + 1).padStart(2, '0')}`;

    if (!transactionForYear[yearMonth]) {
      transactionForYear[yearMonth] = {
        incoming: 0, // Входящие средства за месяц
        outgoing: 0, // Исходящие средства за месяц
      };
    }
    if (account === item.from) {
      // Исходящая транзакция
      transactionForYear[yearMonth].outgoing += item.amount;
    } else {
      // Входящая транзакция
      transactionForYear[yearMonth].incoming += item.amount;
    }
  });
  const sortedTransactions = Object.entries(transactionForYear).sort(
    (a, b) => new Date(`${b[0]}-01`) - new Date(`${a[0]}-01`)
  );
  let runningBalance = balance;

  return sortedTransactions
    .map(([yearMonth, transaction]) => {
      const { incoming, outgoing } = transaction;
      // Расчет баланса за текущий месяц
      const currentMonthBalance = runningBalance;
      runningBalance -= incoming - outgoing; // Изменение баланса

      const [year, month] = yearMonth.split('-');
      return {
        month: monthNames[+month - 1],
        transaction: {
          incoming,
          outgoing,
          balance: currentMonthBalance,
        },
      };
    })
    .reverse();
}

function createchartDinamic() {
  const canvas = el('canvas#chartDinamic.account-info__canvas', {
    width: 584,
    height: 200,
  });
  const accountInfoItemDynamics = el(
    'li.account-info__item.account-info__dynamics',
    [el('h2.account-info__dynamics-title', 'Динамика баланса'), canvas]
  );

  return accountInfoItemDynamics;
}

export function accountInformation({ account, balance, transactions }) {
  const accountInfoTop = accountInformationTop(
    'Просмотр счета',
    account,
    balance,
    transactions,
    async () => {
      const getAccount = await getAccounts(token);
      return createAccountsUser(getAccount.payload);
    }
  );

  const accountInfoItemTransfer = el(
    'li.account-info__item.account-info__transfer',
    [createFormTransfer(account, balance, transactions)]
  );
  const accountInfoItemHistory = el(
    'li.account-info__item.account-info__history',
    [createTableTransfers(account, balance, transactions)]
  );

  const accountInfoItemDynamics = createchartDinamic();

  [accountInfoItemDynamics, accountInfoItemHistory].forEach((item) => {
    item.addEventListener('click', () => {
      setChildren(main, [balanceHistory(account, balance, transactions)]);
      createChart(
        transactionData(account, balance, transactions, 12),
        'chartDinamicHistory',
        drawingColumnsDinamic
      );
      createChart(
        transactionData(account, balance, transactions, 12),
        'chartTransactions',
        drawingColumnTransaction
      );
      dragEvent('.history__list');
    });
  });

  const accountInfoList = el('ul.account-info__list.list-reset', [
    accountInfoItemTransfer,
    accountInfoItemDynamics,
    accountInfoItemHistory,
  ]);

  const accountInfoContainer = el('div.account-info', [
    accountInfoTop,
    accountInfoList,
  ]);

  return accountInfoContainer;
}
