class Tag {

    //Title = '';

    create (){
         
        cy.get('a[href*="#/tags/new/"]').click();
        cy.url().should('include', '/ghost/#/tags/new');
    }  
    
    setName (name){ 
        cy.wait(2000);     
        cy.get('#tag-name', { timeout: 5000 }).clear({force:true}).type(name,{force:true});        
    } 

    getName(){
        cy.wait(1000);
        return cy.get('#tag-name').invoke('val').then((name) => {
            return cy.wrap(name); // Devuelve el valor de forma segura dentro de la cadena de Cypress
        });       
    }

    getUrl(){
        cy.wait(1000);
        return cy.get('input[name="slug"]').invoke('val').then((url) => {
            return cy.wrap(url); // Devuelve el valor de forma segura dentro de la cadena de Cypress
        });       
    }

    verifyTag(name){

        cy.get('a[title="Edit tag"]', { timeout: 5000 }).then($links => {
            const member = $links.filter((index, element) => {
                return Cypress.$(element).text().includes(name); 
            }).first();
        });
    }

    editFirstTag (){
        cy.get('a[title="Edit tag"]', {timeout:2000}).first().click();
        cy.url().should('match', /\/ghost\/#\/tags\/.+/);
    }

    deleteTag(){
        cy.get('button.gh-btn-red').click({ force: true });
        cy.wait(3000);
    }  

    confirmDeleteTag(){
        cy.get('.modal-content').find('button.gh-btn-red').click();
        cy.url().should('include', '/ghost/#/tags');
    }  
    
    verifyTagDelete(name){
        cy.get('a[title="Edit tag"]', { timeout: 5000 }).then($links => {
            const matchingLinks = $links.filter((index, element) => {
                return Cypress.$(element).text().includes(name);
            });
    
            // Verifica que no se encontraron elementos coincidentes
            expect(matchingLinks.length).to.eq(0, `No se encontraron enlaces con el nombre: ${name}`);
        });
    }

}

export default Tag;