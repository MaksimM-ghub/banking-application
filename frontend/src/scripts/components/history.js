import { el } from 'redom';
import { accountInformation, accountInformationTop } from './account-info.js';
import { getToken } from './local-storage.js';
import { getAccount } from './api.js';

export function balanceHistory(account, balance, transactions) {
  const headerTop = accountInformationTop(
    'История переводов',
    account,
    balance,
    transactions,
    async () => {
      const token = getToken();
      const currentAccount = await getAccount(token, account);
      return accountInformation(currentAccount.payload)
    }
  );

  const historyDinamic = el('li.history__item.history__dinamic.draggable', { draggable: 'true' }, [el('h2.history__subtitle', 'Динамика баланса'),el('canvas#chartDinamicHistory.history__canvas', {width: 1090, height: 200})]);
  const historyDinamicTransaction = el('li.history__item.history__transaction.draggable', { draggable: 'true' }, [el('h2.history__subtitle', 'Соотношение входящих исходящих транзакций'), el('canvas#chartTransactions.history__canvas', {width: 1090, height: 200})]);
  const historyTable = el('li.history__item.history__table.draggable', { draggable: 'true' }, [createTableHistory(account, balance, transactions)]);

  const historyList = el('ul.history__list.list-reset', [
    historyDinamic,
    historyDinamicTransaction,
    historyTable,
  ]);

  const historyContainer = el('div.history__container', [
    headerTop,
    historyList,
  ]);

  return historyContainer;
}

function createTableHistory(account, balance, transactions) {
  const ITEMS_PER_PAGE = 25; // Количество транзакций на одной странице
  const VISIBLE_BUTTONS = 5; // Количество видимых кнопок на пагинации (без учета первой и последней)

  // Создаем элементы заголовка таблицы
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

  // Создаем тело таблицы
  const tableBody = el('tbody.account-info__table-body');

  // Функция для отрисовки страницы с транзакциями
  function renderPage(pageNumber) {
    // Очищаем тело таблицы
    tableBody.innerHTML = '';

    // Вычисляем диапазон транзакций для текущей страницы
    const startIndex = (pageNumber - 1) * ITEMS_PER_PAGE;
    const endIndex = pageNumber * ITEMS_PER_PAGE;
    const pageTransactions = transactions.slice(startIndex, endIndex);

    // Добавляем строку данных для каждой транзакции
    pageTransactions.forEach((item) => {
      const thAccountSenders = el('th.account-info__th-body', item.from);
      const thAccountRecipients = el('th.account-info__th-body', item.to);
      const thSumBody = el('th.account-info__th-body');

      if (item.from === account) {
        thSumBody.textContent = `-${item.amount}`;
        thSumBody.style.color = 'red';
      } else {
        thSumBody.textContent = item.amount;
        thSumBody.style.color = 'green';
      }

      // Форматируем дату в необходимый вид
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
  }

  // Создаем пагинацию
  const pagination = el('div.history__pagination'); // Контейнер для кнопок пагинации

  const totalPages = Math.ceil(transactions.length / ITEMS_PER_PAGE);
  let currentPage = 1; // Номер текущей страницы

  // Функция для создания кнопок пагинации
  function renderPagination(currentPage) {
    pagination.innerHTML = ''; // Очищаем контейнер пагинации

    if (totalPages <= 1) {
      // Если всего одна страница пагинации, ничего не создаем
      return;
    }

    // Добавляем кнопку первой страницы
    const firstButton = el(
      'button.history__pagination-button',
      '1',
      currentPage === 1 ? { class: 'active' } : null // Подсвечиваем первую страницу как активную
    );
    firstButton.addEventListener('click', () => {
      currentPage = 1;
      renderPage(currentPage);
      renderPagination(currentPage);
    });
    pagination.append(firstButton);

    // Добавляем многоточие после первой страницы, если есть разрыв
    if (currentPage > VISIBLE_BUTTONS) {
      pagination.append(el('span.history__pagination-ellipsis', '...'));
    }

    // Определяем диапазон видимых средних кнопок
    const visibleButtons = [];
    const maxVisiblePagesStart = Math.max(2, currentPage - Math.floor(VISIBLE_BUTTONS / 2));
    const maxVisiblePagesEnd = Math.min(totalPages - 1, maxVisiblePagesStart + VISIBLE_BUTTONS - 1);

    // Заполняем диапазон
    for (let i = maxVisiblePagesStart; i <= maxVisiblePagesEnd; i++) {
      visibleButtons.push(i);
    }

    // Добавляем кнопки диапазона
    visibleButtons.forEach((page) => {
      const pageButton = el(
        'button.history__pagination-button',
        `${page}`,
        currentPage === page ? { class: 'active' } : null // Подсвечиваем текущую страницу
      );
      pageButton.addEventListener('click', () => {
        currentPage = page;
        renderPage(currentPage);
        renderPagination(currentPage);
      });

      pagination.append(pageButton);
    });

    // Добавляем многоточие перед последней страницей, если есть разрыв
    if (currentPage + VISIBLE_BUTTONS < totalPages - 1) {
      pagination.append(el('span.history__pagination-ellipsis', '...'));
    }

    // Добавляем кнопку последней страницы
    const lastButton = el(
      'button.history__pagination-button',
      `${totalPages}`,
      currentPage === totalPages ? { class: 'active' } : null // Подсвечиваем последнюю страницу при необходимости
    );
    lastButton.addEventListener('click', () => {
      currentPage = totalPages;
      renderPage(currentPage);
      renderPagination(currentPage);
    });
    pagination.append(lastButton);
  }

  // Инициализируем таблицу с первой страницы
  renderPage(currentPage);

  // Если больше одной страницы, создаем пагинацию
  if (totalPages > 1) {
    renderPagination(currentPage);
  }

  // Собираем всю таблицу
  const table = el('table.account-info__table', [tableHead, tableBody]);
  const tableWrapper = el('div.account-info__table-container', [
    tableTitle,
    table,
    totalPages > 1 ? pagination : null, // Отображаем пагинацию только если страниц больше одной
  ]);

  return tableWrapper;
}




