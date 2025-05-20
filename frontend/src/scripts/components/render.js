import { mount } from 'redom';
import { container, main } from './_vars.js';
import { createHeader, createHeaderNavigation } from './components/header.js';

export function render(page) {
  const header = createHeader(createHeaderNavigation());
  // const container = document.getElementById('container');
  container.innerHTML = '';
  mount(main, page);
  mount(container, header);
  mount(container, main);
}
