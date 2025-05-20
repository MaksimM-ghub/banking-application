export function saveToken(token) {
  localStorage.setItem('token', token);
}

export function getToken() {
  const token = localStorage.getItem('token');
  if (token) {
    return token;
  } else {
    return null;
  }
}

export function saveAccounts(account) {
  let accounts = getAccountsLocalStorage();

  // Проверка, является ли accounts массивом, если нет, создаем пустой массив
  if (!Array.isArray(accounts)) {
    accounts = [];
  }

  if (!accounts.includes(account)) {
    accounts.push(account);
    localStorage.setItem('accounts', JSON.stringify(accounts));
  }
}

export function getAccountsLocalStorage() {
  const accounts = localStorage.getItem('accounts');

  // Проверяем, если значение есть, то пытаемся его парсить, иначе возвращаем пустой массив
  return accounts ? JSON.parse(accounts) : [];
}
