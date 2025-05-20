import { mount, setChildren } from 'redom';
import '../index.html';
import '../scss/main.scss';

import { container, header, main } from './_vars.js';
import { createHeader, createHeaderNavigation } from './components/header.js';
import { entryForm } from './components/entry-form.js';
import { validation, userValidation } from './components/validation.js';
import { authorization, getAccounts } from './components/api.js';
import { createAccountsUser } from './components/accounts.js';
import { saveToken } from './components/local-storage.js';
import { dragEvent } from './components/draggables.js';

const { entryContainer, form } = entryForm();
const headerContainer = createHeader();

mount(header, headerContainer);
mount(main, entryContainer);
mount(container, header);
mount(container, main);
mount(document.body, container);

form.addEventListener('submit', async function (event) {
  event.preventDefault();

  const inputs = Array.from(form.querySelectorAll('input'));
  const erorrLogin = document.querySelector('.validation-user');
  if (erorrLogin) {
    erorrLogin.remove();
  }
  const data = {};
  if (validation(this)) {
    inputs.forEach((input) => {
      data[input.name] = input.value;
      input.value = '';
    });

    const authorizationUser = await authorization(data);

    if (!authorizationUser.error) {
      const headerContainer = createHeader(createHeaderNavigation());
      setChildren(header, [headerContainer]);
      setChildren(main, []);

      const token = authorizationUser.payload.token;
      saveToken(token);
      const getAccount = await getAccounts(token);

      const renderAccounts = createAccountsUser(getAccount.payload);
      mount(main, renderAccounts);
      dragEvent('.accounts__list');
      window.history.pushState({}, '', '/accounts');
    } else {
      form.prepend(userValidation());
    }
  }
});

