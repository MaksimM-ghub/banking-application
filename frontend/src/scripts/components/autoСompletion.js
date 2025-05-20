import { el } from 'redom';
import { getAccountsLocalStorage } from './local-storage.js';

export function showListAccounts(value, autocompletionList, inputNumber) {
  let accounts = getAccountsLocalStorage();

  // Отфильтровать счета по введенному значению
  const filterAccounts = accounts.filter((account) => {
    // Убедимся, что введенное значение не пустое и совпадает с началом строки
    return value !== '' && account.startsWith(value);
  });

  // Очистить текущий список автокомплита
  autocompletionList.innerHTML = '';

  if (filterAccounts.length > 0) {
    filterAccounts.forEach((account) => {
      const item = el('li.account-info__autocompletion-item');
      item.textContent = account;
      autocompletionList.append(item);

      // Добавить обработчик клика
      item.addEventListener('click', () => {
        inputNumber.value = account;
        autocompletionList.style.display = 'none';
      });
    });
    autocompletionList.style.display = 'block';
  } else {
    autocompletionList.style.display = 'none';
  }
}
