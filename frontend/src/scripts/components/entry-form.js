import { el } from 'redom';

export function entryForm() {
  const labelLogin = el(
    'label.entry-form__label-login',
    {
      for: 'login',
    },
    'Логин'
  );

  const inputLogin = el('input.entry-form__input-login', {
    id: 'login',
    placeholder: 'Введите логин',
    name: 'login',
    required: true,
  });

  const loginWrapper = el('div.entry-form__login-wrapper', [
    labelLogin,
    inputLogin,
  ]);

  const labelPassword = el(
    'label.entry-form__label-password',
    {
      for: 'password',
    },
    'Пароль'
  );

  const inputPassword = el('input.entry-form__input-password', {
    type: 'password',
    id: 'password',
    placeholder: 'Введите пароль',
    name: 'password',
    required: true,
  });

  const passwordWrapper = el('div.entry-form__password-wrapper', [
    labelPassword,
    inputPassword,
  ]);

  const button = el('button.btn.entry-form__button-entry', 'Войти');

  const form = el(
    'form.entry-form__form',
    {
      action: '',
      method: 'POST',
      novalidate: true,
    },
    [loginWrapper, passwordWrapper, button]
  );

  form.addEventListener('input', (event) => {
    if (event.target.tagName.toLowerCase() === 'input') {
      event.target.value = event.target.value.replace(/\s+/g, '');
    }
  });

  const title = el('span.entry-form__title', 'Вход в аккаунт');

  const formWrapper = el('div.entry-form__wrapper', [title, form]);
  const entryContainer = el('div.entry-form', [formWrapper]);

  return {
    entryContainer,
    form,
  };
}
