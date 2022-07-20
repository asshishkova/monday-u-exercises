describe("Add Todo Action", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });

  it("Should add a new todo", () => {
    const newItem = 'Feed the cat';
    cy.get('#new-todo-textbox').type(`${newItem}{enter}`);
    cy.get('#todos-list .todo-li')
      .should('have.length', 1)
      .last()
      .should('have.text', newItem);

  });

  it("Should add a new pokemon", () => {
    const newPokemons = '1';
    cy.get('#new-todo-textbox').type(`${newPokemons}{enter}`);
    cy.get('#todos-list .todo-li')
      .should('have.length', 2)
      .last()
      .should('have.text', 'Catch bulbasaur with id 1 and type grass');
  });

  it("Should add several new pokemons even if found", () => {
    const newPokemons = '3,5,0';
    cy.get('#new-todo-textbox').type(`${newPokemons}{enter}`);
    cy.get('#todos-list .todo-li')
      .should('have.length', 5)
      .last()
      .should('have.text', 'Failed to fetch 0');
  });

  it("Should mark todo as done and show right amount of todos in filters", () => {
    cy.get('.todo-li').contains('Feed the cat').click();
    cy.get('.todo-li').contains('Catch charmeleon with id 5 and type fire').click();
    cy.get('.filter-radio-buttons').contains('pending').click();
    cy.get('#todos-list .todo-li')
      .should('have.length', 3);
    cy.get('.filter-radio-buttons').contains('done').click();
      cy.get('#todos-list .todo-li')
        .should('have.length', 2);
  });

  it("Should start search if search is activated", () => {
    cy.get('.filter-radio-buttons').contains('all').click();
    cy.get('.search-filter').click();
    cy.get('#new-todo-textbox').type(`cat`);
    cy.get('#todos-list .todo-li')
      .should('have.length', 4);
  });

  it("Should delete an item and restore the last deleted item", () => {
    cy.get('.delete-todo-button').last().invoke('show').click();
    cy.get('#todos-list .todo-li')
      .should('have.length', 4);
  });

  it("Should clear all items", () => {
    cy.get('#clear-all-button').click();
    cy.get('#todos-list .todo-li')
      .should('have.length', 0);
  });

  // it("Should restore the last deleted item", () => {
  //   cy.get('#restore-deleted').click();
  //   cy.get('#todos-list .todo-li')
  //     .should('have.length', 4)
  //     .last()
  //     .should('have.text', 'Failed to fetch 0');;
  // });
});
