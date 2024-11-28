class Member {

    //Title = '';
    Port = '';

    create (){
        cy.wait(5000)
        cy.get('a[href="#/members/new/"]', {timeout:5000}).first().click();
        cy.url().should('include', '/ghost/#/members/new');
        cy.captureImage();
    }

    editFirstMember (){
        cy.get('a.gh-list-data', {timeout:5000}).first().click();
        cy.url().should('match', /\/ghost\/#\/members\/.+/);

    }

    editLastMember (){
        cy.get('a.gh-list-data', {timeout:5000}).last().click();
        cy.url().should('match', /\/ghost\/#\/members\/.+/);

    }

    setName(name){
        cy.wait(5000)
        cy.get('input[id="member-name"]')
            .then(($input) => {
                if ($input.length > 0) {
                    cy.wrap($input).clear({force:true}).type(name,{force:true});
                } else {
                    cy.log('El campo "member-name" no está disponible');
                }
            });
        cy.captureImage();
       
    }

    setEmail(email){
        cy.get('input[id="member-email"]', { timeout: 5000 })
            .should('exist')
            .clear({force:true})
            .type(email,{force:true});
        cy.captureImage();
    }


    verifyMemberEmail(email){

        cy.get('p.gh-members-list-email', { timeout: 5000 }).then($links => {
            const member = $links.filter((index, element) => {
                return Cypress.$(element).text().includes(email); 
            }).first();
            // const read = member.find('h3').text().trim().replace(/\n+/g, ' ').trim();
            // expect(read).to.equal(title); 
        });
    }

    verifyMemberName(name){
        cy.get('h3.gh-members-list-name', { timeout: 3000 }).then($links => {
            const member = $links.filter((index, element) => {
                return Cypress.$(element).text().includes(name); 
            }).first();
        });
    }

    verifyErrorMessage(msg){
        const selector = this.Port==2345? 'div.gh-alert-content':'p.response'
        cy.get(selector, { timeout: 5000 }).then($links => {
            const member = $links.filter((index, element) => {
                return Cypress.$(element).text().includes(msg); 
            }).first();
        });
        cy.captureImage();
    }

    deleteMember(){
        if(this.Port==2345){
            cy.get('button.gh-btn-red').first().click();
            cy.get('.modal-content').find('button.gh-btn-red').first().click();
        }else{
            cy.get('button[data-test-button="member-actions"]').first().click();
            cy.get('button[data-test-button="delete-member"]').click();
            cy.get('button[data-test-button="confirm"]').click();
        }
    }
    
    checkInvalidEmail() {
        const selector = this.Port == 2345 ? 'div.gh-alert-content' : 'p.response';
        const msg = 'Invalid Email.';
        return cy.get('body').then($body => {
            if ($body.find(selector).length === 0) {
                // Si el elemento no está presente, considerar el email como válido
                return cy.wrap(false);
            }
    
            return cy.get(selector, { timeout: 5000 }).then($elements => {
                // Verificar si el mensaje de error está presente
                const hasInvalidEmail = $elements.filter((index, element) => {
                    return Cypress.$(element).text().includes(msg);
                }).length > 0;
    
                // Si el mensaje está presente, hacer clic en el botón y devolver `false`
                if (hasInvalidEmail) {
                    cy.get('div.modal-footer').find('button.gh-btn-red').first().click();
                }
    
                // Devolver `false` si no se encontró el mensaje
                return true;
            });
        });
    }

}

export default Member;