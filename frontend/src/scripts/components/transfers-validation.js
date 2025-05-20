import { el } from 'redom';
import { getAccounts } from './api.js';
import { getToken } from './local-storage.js';

function removeError(input) {
  const parent = input.closest('.account-info__input-wrapper');
  const error = parent.querySelector('.message-error');

  if (error) {
    parent.classList.remove('transfer-error');
    error.remove();
  }
}

function createError(input, message) {
  const parent = input.closest('.account-info__input-wrapper');
  const error = el('span.message-error', message);

  removeError(input);
  parent.classList.add('transfer-error');
  parent.append(error);
}

export async function transferValidation(form, balance) {
  let isValid = true;
  const token = getToken();

  const accounts = await getAccounts(token);
  const arrAccounts = accounts.payload.map((item) => item.account);

  const inputs = Array.from(form.querySelectorAll('input'));

  inputs.forEach((input) => {
    if (input.name === 'to') {
      if (input.value.trim() === '') {
        createError(input, 'Введите номер счёта получателя');
        isValid = false;
      } else if (!arrAccounts.includes(input.value.trim())) {
        createError(input, 'Номер счёта не найден');
        isValid = false;
      }
    }

    if (input.name === 'amount') {
      if (input.value.trim() === '') {
        createError(input, 'Введите сумму перевода');
        isValid = false;
      } else if (isNaN(input.value) || Number(input.value) <= 0) {
        createError(input, 'Введите корректную сумму');
        isValid = false;
      }

      if (balance < input.value.trim()) {
        createError(input, 'Недостаточно средств');
        isValid = false;
      }
    }
  });

  return isValid;
}
