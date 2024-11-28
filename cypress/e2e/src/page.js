class Page {

    //Title = '';

    create (){
        cy.get('a[href="#/editor/page/"]').first().click();
        cy.url().should('include', '/ghost/#/editor/page');
        cy.captureImage();
    }

    save(){
        cy.wait(6000);
        cy.get('a.gh-editor-back-button').click();
        cy.wait(6000);
    }

    update(){
        cy.url().should('match', /\/ghost\/#\/editor\/post\/.+/);
        if(this.Port==2345){
            cy.get('div.gh-publishmenu-trigger').first().click();
            cy.get('button.gh-publishmenu-button').click();
        }else{
            cy.get('button[data-test-button="publish-save"').first().click();
        }
        cy.captureImage();
        cy.wait(5000);
    }

    setTitle(title){
        cy.get('textarea.gh-editor-title').then($textarea => {
            const text = $textarea.val();
            if (text) {
                cy.get('textarea.gh-editor-title').clear();
            }
            cy.get('textarea.gh-editor-title').type(title);
        });
        cy.captureImage();
    }

    selectFirst(status){
        return cy.get('li.gh-posts-list-item', { timeout: 3000 }).then($links => {
            const post = $links.filter((index, element) => {
                const statusLc = status.toLowerCase();
                return Cypress.$(element).text().toLowerCase().includes(statusLc); 
            }).first();
            var title = post.find('h3').text().trim().replace(/\n+/g, ' ').trim();
            post.find('a').first().click();
            return title; 
        });
    }

    getUrl() {
        const open = 'button[title="Settings"]';
        const close = this.Port == 2345? 'button[aria-label="Close"]': open;
        cy.get(open).click(); 
        cy.wait(1000);
    
        return cy.get('input[name="post-setting-slug"]').invoke('val').then((url) => {
            cy.get(close).click(); // Cierra el menú
            return cy.wrap(url); // Devuelve el valor de forma segura dentro de la cadena de Cypress
        });
    }

    setUrl(url) {
        const open = 'button[title="Settings"]';
        const close = this.Port == 2345? 'button[aria-label="Close"]': open;
        cy.get(open).click(); 
        cy.wait(1000);
        cy.get('input[name="post-setting-slug"]').clear({ force: true }).type(url, { force: true });
        cy.get(close).click(); 
        cy.wait(1000);
    }
    

    publish(){
        cy.url().should('match', /\/ghost\/#\/editor\/page\/.+/);
        if(this.Port==2345){
            cy.get('div.gh-publishmenu-trigger').first().click();
            cy.get('button.gh-publishmenu-button').click();
            cy.captureImage();
            cy.wait(2000);
        }else{
            cy.get('button[data-test-button="publish-flow"').first().click();
            cy.get('button[data-test-button="continue"]').click();
            cy.captureImage();
            cy.get('button[data-test-button="confirm-publish"]').click();
            cy.url().should('include', '/ghost/#/pages');
            cy.get('button[data-test-button="close-publish-flow"]').click();
        }
    }

    delete(){
        cy.url().should('match', /\/ghost\/#\/editor\/page\/.+/);
        cy.get('button[title="Settings"]').click();// Abrir el menú de opciones del pagina
        cy.captureImage();
        cy.get('.settings-menu-delete-button').click();// clic boton en eliminar
        cy.captureImage();
        cy.get('.gh-btn-red').click(); // Confirmar la eliminación
        cy.url().should('include', '/ghost/#/pages');
    }

    deleteLastPage(){
        cy.url().should('match', /\/ghost\/#\/editor\/page\/.+/);
        cy.get('button[title="Settings"]').click();// Abrir el menú de opciones del pagina        
        cy.get('.settings-menu-delete-button').click();// clic boton en eliminar
        cy.get('.gh-btn-red').click(); // Confirmar la eliminación
        cy.url().should('include', '/ghost/#/pages');
    }

    verifyStatus(status, title){

        cy.get('li.gh-list-row', { timeout: 3000 }).then($links => {
            const post = $links.filter((index, element) => {
                const statusLc = status.toLowerCase();
                return Cypress.$(element).text().toLowerCase().includes(statusLc); 
            }).first();
            const read = post.find('h3').text().trim().replace(/\n+/g, ' ').trim();
            expect(read).to.equal(title); 
        });
    }

}

export default Page;