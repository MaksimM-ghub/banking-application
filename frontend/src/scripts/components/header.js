import { el, h, setChildren, mount } from 'redom';
import Navigo from 'navigo';
import { header, main } from '../_vars.js';
import { pageCurrency, globalSocket } from './currency.js';
import { getAccounts, getCurrency, getKnownCurrency } from './api.js';
import { getToken } from './local-storage.js';
import { createAccountsUser } from './accounts.js';
import { createMap } from './maps.js';
import { entryForm } from './entry-form.js';
import { initMap } from './maps.js';
import { dragEvent } from './draggables.js';

const token = getToken();

export function createHeaderNavigation() {
  const itemsData = [
    { href: '/ATMs', text: 'Банкоматы' },
    { href: '/bills', text: 'Счета' },
    { href: '/currency', text: 'Валюта' },
    { href: '/exit', text: 'Выйти' },
  ];

  const router = new Navigo('/');

  router.on({
    '/ATMs': async function () {
      if (globalSocket) globalSocket.close();

      try {
        if (globalSocket) globalSocket.close();

        const mapContainer = createMap();
        setChildren(main, mapContainer);

        await initMap();
      } catch (error) {
        console.error('Ошибка при загрузке карты:', error);
      }
    },
    '/bills': async function () {
      if (globalSocket) globalSocket.close();
      const getAccount = await getAccounts(token);
      const renderAccounts = createAccountsUser(getAccount.payload);
      setChildren(main, renderAccounts);
      dragEvent('.accounts__list');
    },
    '/currency': async function () {
      if (globalSocket) globalSocket.close();
      const currencyList = await getCurrency(token);
      const knownCurrency = await getKnownCurrency();
      setChildren(
        main,
        await pageCurrency(currencyList.payload, knownCurrency.payload)
      );
    },
    '/exit': function () {
      if (globalSocket) globalSocket.close();
      setChildren(header, createHeader());
      setChildren(main, entryForm().entryContainer);
      window.location.pathname = '';
    },
  });

  const list = h(
    'ul.nav__list.list-reset',
    itemsData.map((item) => {
      const link = h('a.nav__link.link-reset', { href: item.href }, item.text);

      if (link.getAttribute('href') === '/bills') {
        link.classList.add('active');
      }

      link.addEventListener('click', async function (event) {
        event.preventDefault();
        document.querySelectorAll('.nav__item').forEach((item) => {
          item.classList.remove('active');
        });
        const parentItem = event.target.closest('.nav__item');
        parentItem.classList.add('active');
        router.navigate(item.href);
      });

      return h('li.nav__item', link);
    })
  );

  const nav = el('nav.nav', [list]);

  return nav;
}

export function createHeader(nav) {
  const logo = el('a.header__logo', 'Coin.');
  const header = el('header.header__container', logo);

  if (nav) {
    mount(header, nav);
  }

  return header;
}
