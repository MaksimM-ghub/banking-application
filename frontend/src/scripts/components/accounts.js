import { el, h, setChildren } from 'redom';
import { getToken } from './local-storage.js';
import { main } from '../_vars.js';
import { createAccount, getAccount, getAccounts } from './api.js';
import { accountInformation, transactionData } from './account-info.js';
import { sortAccounts } from './sorting.js';
import { createChart, drawingColumnsDinamic } from './chart.js';

const token = localStorage.getItem('token');

function createOneAccount({ account, balance, transactions }) {
  const numberAccount = el('span.accounts__number', account);
  const moneyAccount = el('span.accounts__money', `${balance} Руб`);

  // Проверяем, что transactions это массив, прежде чем пытаться получить длину
  const hasTransactions =
    Array.isArray(transactions) && transactions.length > 0;

  // Если транзакции есть – выбираем последнюю, иначе null
  const lastTransaction = hasTransactions ? transactions[0] : null;

  // Форматируем дату последней транзакции, если она существует
  const lastTransactionDate = lastTransaction
    ? new Date(lastTransaction.date).toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Нет транзакций';

  // Создаем элементы интерфейса
  const dateAccount = el('div.accounts__date', [
    el('span.accounts__date-text', 'Последняя транзакция: '),
    el('span.accounts__date-text--date', lastTransactionDate),
  ]);

  const btnAccount = el('button.btn.accounts__open-btn', 'Открыть');

  btnAccount.addEventListener('click', async function (event) {
    event.preventDefault();
    const item = event.target.closest('li');
    const id = item.dataset.id;

    // Получить информацию о текущем счете
    const currentAccount = await getAccount(token, id);
    const { account, balance, transactions } = currentAccount.payload;
    // Перерисовываем main
    setChildren(main, [accountInformation(currentAccount.payload)]);
    createChart(transactionData(account, balance, transactions, 6), 'chartDinamic', drawingColumnsDinamic);
  });

  const accountInner = el('div.accounts__inner', [dateAccount, btnAccount]);

  const accountItem = el('li.accounts__item.draggable', { draggable: 'true' }, [
    numberAccount,
    moneyAccount,
    accountInner,
  ]);

  // Устанавливаем data-id атрибут
  accountItem.setAttribute('data-id', account);

  return accountItem;
}

function createSelect() {
  const options = [
    { value: 'sorting', text: 'Сортировка' },
    { value: 'account', text: 'По номеру' },
    { value: 'balance', text: 'По балансу' },
    { value: 'transactions.date', text: 'По последней транзакции' },
  ];

  const select = h(
    'select.accounts__select',
    options.map((item) => {
      return el(
        'option.accounts__option',
        {
          value: item.value,
        },
        item.text
      );
    })
  );

  select.addEventListener('change', async () => {
    const prop = select.value;
    const token = getToken();
    const getAccount = await getAccounts(token);
    const sortArr = sortAccounts(getAccount.payload, prop);
    const accountsList = document.querySelector('.accounts__list');
    const accountsItem = sortArr.map((account) => createOneAccount(account));
    setChildren(accountsList, [accountsItem]);
  });

  return select;
}

export function createAccountsUser(accounts) {
  const accountsTitle = el('h2.accounts__title', 'Ваши счета');
  const accountsSelect = createSelect();
  const accountsButton = el(
    'button.btn.accounts__new-btn',
    'Создать новый счет'
  );

  accountsButton.addEventListener('click', async (event) => {
    event.preventDefault();
    const token = getToken();
    const account = await createAccount(token);
    const item = document.querySelector('.accounts__list');
    item.append(createOneAccount(account.payload));
  });

  const accountsTop = el('div.accounts__top', [
    accountsTitle,
    accountsSelect,
    accountsButton,
  ]);

  const accountsItem = accounts.map((account) => createOneAccount(account));
  const accountsList = el('ul.accounts__list.list-reset.grid', [accountsItem]);
  const accountsContainer = el('div.accouts', [accountsTop, accountsList]);

  return accountsContainer;
}
