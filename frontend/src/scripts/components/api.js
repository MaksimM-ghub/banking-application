import { setChildren } from 'redom';
import { createLoaderBtn } from './loader-btn.js';
import { main } from '../_vars.js';
import { accountsSkeleton, accountInfoSkeleton, mapsSkeleton, currencySkeleton } from './skeleton-loader.js';

const skeleton = accountsSkeleton([...Array(6).keys()]);

export async function authorization({ login, password }) {
  const btn = document.querySelector('.entry-form__button-entry');
  const loader = createLoaderBtn();
  btn.append(loader);
  try {
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      body: JSON.stringify({
        login,
        password,
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
  } finally {
    loader.remove();
  }
}
// Получение всех счетов
export async function getAccounts(token) {
  main.append(skeleton);
  try {
    const response = await fetch('http://localhost:3000/accounts', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Basic ${token}`,
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error.error);
  } finally {
    skeleton.remove();
  }
}

//Получение подробной информации о текущем счете
export async function getAccount(token, id) {
  const skeleton = accountInfoSkeleton();
  setChildren(main, skeleton);
  try {
    const response = await fetch(`http://localhost:3000/account/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Basic ${token}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  } finally {
    skeleton.remove();
  }
}

//Создание еще одного счета
export async function createAccount(token) {
  try {
    const response = await fetch('http://localhost:3000/create-account', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Basic ${token}`,
      },
    });

    const data = response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

// Получение валютных счетов пользователя
export async function getCurrency(token) {
  const skeleton = currencySkeleton();
  setChildren(main, skeleton);
  try {
    const response = await fetch('http://localhost:3000/currencies', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Basic ${token}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  } finally {
    skeleton.remove();
  }
}

//Валютный обмен
export async function currencyBuy({ from, to, amount }, token) {
  try {
    const response = await fetch('http://localhost:3000/currency-buy', {
      method: 'POST',
      body: JSON.stringify({
        from,
        to,
        amount,
      }),
      headers: {
        'Content-Type': 'application/json',
        authorization: `Basic ${token}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

//Перевод со счета на счет
export async function transferFunds({ from, to, amount }, token) {
  try {
    const response = await fetch('http://localhost:3000/transfer-funds', {
      method: 'POST',
      body: JSON.stringify({
        from,
        to,
        amount,
      }),
      headers: {
        'Content-Type': 'application/json',
        authorization: `Basic ${token}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function getKnownCurrency() {
  try {
    const response = await fetch('http://localhost:3000/all-currencies');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function getChangedCurrency() {
  return new WebSocket('ws://localhost:3000/currency-feed');
}

// Получение координат банкоматов
export async function getBanks() {
  const skeleton = mapsSkeleton();
  main.append(skeleton)
  try {
    const response = await fetch('http://localhost:3000/banks');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
  finally {
    skeleton.remove();
  }
}
