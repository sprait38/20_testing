/* eslint-disable func-names */
/* eslint-disable cypress/no-unnecessary-waiting */
/// <reference types="cypress" />

describe('example to-do app', () => {
  const x = 4;
  const y = 4;
  beforeEach(() => {
    cy.visit('http://localhost:3000');
    cy.get('.horizont').type(x);
    cy.get('.vertical').type(y);
    cy.contains('Играть').click();
  });

  it('В начальном состоянии игра должна иметь поле четыре на четыре клетки, в каждой клетке цифра должна быть невидима.', () => {
    cy.get('.card').should('have.length', x * y);
    cy.get('.title-hidden').should('have.length', x * y);
  });

  it('Нажать на одну произвольную карточку. Убедиться, что она осталась открытой.', () => {
    cy.clock();
    cy.get('.card')
      .then((cards) => {
        const card = cards[Math.floor(Math.random() * (x * y))];
        return card;
      })
      .as('randomCard')
      .click();

    cy.tick(700);
    cy.get('@randomCard').find('h5').not('.title-hidden').should('be.visible');
  });

  it('Нажать на левую верхнюю карточку, затем на следующую. Если это не пара, то повторять со следующей карточкой, пока не будет найдена пара. Проверить, что найденная пара карточек осталась видимой.', () => {
    function openCards(cardIndex) {
      cy.clock();
      if (cardIndex >= x * y) return;
      cy.get('.card').eq(0).click().find('h5').should('be.visible').invoke('text').as('startElText');
      cy.get('.card').eq(cardIndex).click().find('h5').should('be.visible').invoke('text').as('nextElText');
      cy.then(function () {
        if (this.startElText === this.nextElText) {
          cy.tick(700);
          cy.get('.card').eq(0).find('h5').should('be.visible');
          cy.get('.card').eq(cardIndex).find('h5').should('be.visible');
          return;
        }
        openCards(cardIndex + 1);
      });
    }
    openCards(1);
  });

  it('Нажать на левую верхнюю карточку, затем на следующую. Если это пара, то повторять со следующими двумя карточками, пока не найдутся непарные карточки. Проверить, что после нажатия на вторую карточку обе становятся невидимыми.', () => {
    cy.clock();
    function closeCards(cardIndex) {
      if (cardIndex >= x * y) return;
      cy.get('.card').eq(0).click().find('h5').should('be.visible').invoke('text').as('startElText');
      cy.get('.card').eq(cardIndex).click().find('h5').should('be.visible').invoke('text').as('nextElText');
      cy.then(function () {
        if (this.startElText !== this.nextElText) {
          cy.tick(1000);
          cy.get('.card').eq(0).find('h5').should('not.be.visible');
          cy.get('.card').eq(cardIndex).find('h5').should('not.be.visible');
          return;
        }
        closeCards(cardIndex + 1);
      });
    }
    closeCards(1);
  });
});
