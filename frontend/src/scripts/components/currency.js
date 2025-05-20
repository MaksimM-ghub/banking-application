import { el, h, setChildren } from 'redom';
import { currencyBuy, getChangedCurrency, getCurrency } from './api.js';
import { getToken } from './local-storage.js';

const token = getToken();
export let globalSocket = null;

export async function pageCurrency(currency, knownCurrency) {
  const yourCurrencies = el('li.currency__item', [
    el('h3.currency__subtitle', 'Ваши валюты'),
    createYourCurrenciesList(currency),
  ]);
  const currencyExchange = el('li.currency__item', [
    el('h3.currency__subtitle', 'Обмен валют'),
    createCurrencyExchange(knownCurrency),
  ]);
  const changingСurrencies = el('li.currency__item', [
    el('h3.currency__subtitle', 'Изменение курсов в реальном времени'),
  ]);

  const changingCurrenciesList = await createChangingCurrenciesList();
  changingСurrencies.append(changingCurrenciesList);

  const currencyList = el('ul.currency__list.list-reset.grid', [
    yourCurrencies,
    changingСurrencies,
    currencyExchange,
  ]);
  const currencyContainer = el('div.currency__container', [
    el('h2.currency__title', 'Валютный обмен'),
    currencyList,
  ]);
  return currencyContainer;
}

//Создание списка валют
function createYourCurrenciesList(currency) {
  const yourCurrenciesList = el('ul.currency-your__list.list-reset');

  Object.values(currency).forEach((item) => {
    if (item.amount != 0) {
      const currencyName = el('span.currency-your__name', item.code);
      const currencyValue = el(
        'span.currency-your__value',
        item.amount.toFixed(2)
      );
      const yourCurrenciesItem = el('li.currency-your__item', [
        currencyName,
        currencyValue,
      ]);
      yourCurrenciesList.append(yourCurrenciesItem);
    }
  });

  return yourCurrenciesList;
}

//Создание Обмена валют
function createCurrencyExchange(currency) {
  const data = {};
  const labelFrom = el('label.currency-exchange__label', 'Из');
  const selectFrom = h(
    'select.currency-exchange__select',
    currency.map((item) => {
      return el(
        'option.currency-exchange__option',
        {
          value: item,
        },
        item
      );
    })
  );

  const labelTo = el('label.currency-exchange__label', 'в');
  const selectTo = h(
    'select.currency-exchange__select',
    currency.map((item) => {
      return el(
        'option.currency-exchange__option',
        {
          value: item,
        },
        item
      );
    })
  );
  const currencySelectWrapper = el('div.currency-exchange__select-wrapper', [
    labelFrom,
    selectFrom,
    labelTo,
    selectTo,
  ]);

  const labelSum = el(
    'label.currency-exchange__label',
    { for: 'sum' },
    'Сумма'
  );
  const inputSum = el('input.currency-exchange__input', {
    type: 'text',
    id: 'sum',
    placeholder: 'Введите сумму',
  });

  inputSum.addEventListener('blur', (event) => {
    const value = event.target.value;
    const regex = /^\d*\.?\d+$/;

    if (!regex.test(value) && value !== '') {
      event.target.value = value.slice(0, -1);
    }
  });

  const currencyInputWrapper = el('div.currency-exchange__input-wrapper', [
    labelSum,
    inputSum,
  ]);
  const button = el('button.btn.currency-exchange__btn', 'Обменять');
  const form = el('form.currency-exchange__form.grid', [
    currencySelectWrapper,
    currencyInputWrapper,
    button,
  ]);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    data.from = selectFrom.value;
    data.to = selectTo.value;
    data.amount = inputSum.value;

    const errorEl = document.querySelector(
      '.currency-exchange__error-container'
    );
    if (errorEl) {
      errorEl.remove();
    }

    const transfer = await currencyBuy(data, token);
    const errorMessage = transfer.error;

    if (inputSum.value == '') {
      validationCurrents(form, 'Не указана сумма перевода');
    }

    switch (errorMessage) {
      case 'Invalid amount':
        validationCurrents(
          form,
          'Не указана сумма перевода, или она отрицательная'
        );
        break;
      case 'Not enought currency':
        validationCurrents(form, 'На валютном счете списания нет средств');
        break;
      case 'Overdraft prevented':
        validationCurrents(
          form,
          'Попытка перевести больше, чем доступно на счете списания'
        );
        break;
    }

    if (!errorMessage) {
      inputSum.value = '';
    }
  });

  return form;
}

// Создание списка валют
async function createChangingCurrenciesList() {
  const changingCurrencies = el('ul.currency-changing__list');

  if (globalSocket) globalSocket.close();

  const socket = await getChangedCurrency();

  globalSocket = socket;

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    const { from, to, rate, change } = data;

    const currencyName = el('span.currency-changing__name', `${from}/${to}`);
    const currencyValue = el(
      'span.currency-changing__value',
      `${rate.toFixed(5)}`
    );

    currencyName.classList.remove('increasing', 'decreasing');
    currencyValue.classList.remove('increasing', 'decreasing');

    if (change === 1) {
      currencyName.classList.add('increasing');
      currencyValue.classList.add('increasing');
    } else if (change === -1) {
      currencyName.classList.add('decreasing');
      currencyValue.classList.add('decreasing');
    }

    const changingCurrenciesItem = el('li.currency-changing__item', [
      currencyName,
      currencyValue,
    ]);

    changingCurrencies.append(changingCurrenciesItem);

    const yourCurrencies = document.querySelector('.currency__item');
    const changingCurrenciesElement = document.querySelector(
      '.currency__item:nth-child(2)'
    );
    const currencyExchange = document.querySelector(
      '.currency__item:nth-child(3)'
    );

    if (yourCurrencies && changingCurrenciesElement && currencyExchange) {
      const leftHeightCurrency =
        yourCurrencies.offsetHeight + currencyExchange.offsetHeight + 50; // Учет высоты с отступом
      const rightHeightCurrency = changingCurrenciesElement.offsetHeight;

      // Удаляем первый элемент, если высоты не совпадают или превышено количество элементов
      if (
        rightHeightCurrency < leftHeightCurrency ||
        changingCurrencies.children.length > 20
      ) {
        changingCurrencies.firstChild.remove();
      }
    }
  };

  return changingCurrencies;
}

function validationCurrents(form, message) {
  const errorContainer = el('div.currency-exchange__error-container', [
    el('p.currency-exchange__error'),
    message,
  ]);
  form.append(errorContainer);
}
