describe('Тестирование приложения банка', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/');
    cy.get('.entry-form__input-login').type('developer');
    cy.get('.entry-form__input-password').type('skillbox');
    cy.get('.entry-form__form').submit();
  });

  it('Авторизация пользователя', () => {
    cy.url().should('include', '/accounts');
  });

  it('Добавление нового счета', () => {
    cy.get('.accounts__item').then((items) => {
      const itemLength = items.length;
      cy.contains('Создать новый счет').click();
      cy.get('.accounts__item').should('have.length', itemLength + 1);
    });
  });

  it('Сортировка списка счетов пользователя', () => {
    cy.get('.accounts__select')
      .select('balance')
      .should('have.value', 'balance')
      .wait(2500);
    cy.get('.accounts__item').then((items) => {
      const balances = [...items].map((item) => {
        const balance = item.querySelector('.accounts__money');
        return parseFloat(balance.textContent);
      });
      // Создаем новую копию массива balances и сортируем её
      const sortedBalances = [...balances].sort((a, b) => a - b);
      // Проверяем, соответствует ли массив balances корректный отсортированному массиву
      expect(balances).to.deep.equal(sortedBalances); // Ошибка устранена
    });
  });

  it('Перевод со счета на счет', () => {
    cy.get('.accounts__item')
      .should('have.length.greaterThan', 0)
      .eq(0)
      .then((item) => {
        cy.wrap(item).find('.accounts__open-btn').click();
      });

    cy.wait(2500);

    cy.get('.accounts-info__number-input')
      .should('exist')
      .type('25674573670461057881157457');

    cy.get('.accounts-info__sum-input').should('exist').type('1000');

    cy.get('.entry-form__form').submit();
  });
});
