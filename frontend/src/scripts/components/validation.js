import { el } from 'redom';

function removeError(input) {
  const parent = input.parentNode;
  const errorMessage = parent.querySelector('.error-message');
  if (errorMessage) {
    errorMessage.remove();
    parent.classList.remove('input-error');
  }
}

function createError(input, message) {
  const parent = input.parentNode;
  const error = el('span.error-message', message);
  parent.classList.add('input-error');
  parent.append(error);
}

export function validation(form) {
  let result = true;

  const inputs = Array.from(form.querySelectorAll('input'));

  inputs.forEach((input) => {
    removeError(input);
    if (input.value == '' || input.value.length < 6) {
      if (input.name == 'login') {
        createError(input, 'Логин должен быть не менее 6 символов');
        result = false;
      }
      if (input.name == 'password') {
        createError(input, 'Пароль должен быть не менее 6 символов');
        result = false;
      }
    }
  });

  return result;
}

export function userValidation() {
  const errorText = el('p.validation-text', 'Неверный логин или пароль');
  const button = el('button.validation-btn.btn-reset', 'X');
  const userValidation = el('div.validation-user', [errorText, button]);

  button.addEventListener('click', () => {
    userValidation.remove();
  });

  return userValidation;
}
