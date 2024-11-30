class Webpage {

    Host = '';
    Port = '';

    setHost(h, p){
        this.Host = h;
        this.Port = p;
    }

    visit (url){
        const urlPage = this.Host + ":" + this.Port + url
        cy.visit(urlPage, { failOnStatusCode: false });
        cy.url().should('include', urlPage);
        cy.wait(5000);
    }

    login (username, password){
        cy.get('input[name="identification"]', {timeout:5000}).type(username);
        cy.get('input[name="password"]', {timeout:5000}).type(password);
        cy.get('button[type="submit"]').click();
        cy.wait(8000);
        cy.url().should('include', '/ghost/#/dashboard');
    }

    openSiteSetting(){
        cy.get('a[href="#/settings/"]').first().click();
        cy.url().should('include', '/ghost/#/settings');  
        cy.wait(5000);  
    }

    closeSiteSetting(){
        cy.get('button[data-testid="exit-settings"]').first().click();
        cy.url().should('include', '/ghost/#/dashboard');     
    }

    clickCategory(category){
        if(this.Port==2345){
            cy.get(`a[href="#/settings/${category}/"]`).first().click();
            cy.url().should('include', `/ghost/#/settings/${category}`);
        }
    }


    clickEditSection(title){
        const eName = (this.Port==2345)? 'div.gh-expandable-block':'div.is-not-editing';
        cy.get(eName, { timeout: 3000 }).then($links => {
            const block = $links.filter((index, element) => {
                return Cypress.$(element).text().includes(title); 
            }).first();
            var button = block.find('button');
            button.click();
        });
    }

    setPageTitle(text){
        if(this.Port==2345){
            cy.contains('.gh-expandable-title', 'Title & description')
            .parents('.gh-expandable-block')
            .find('input')
            .first()
            .clear()
            .type(text, { force: true });
        }else{
            cy.get('input[placeholder="Site title"]').clear().type(text);
        }
    }

    setPageDescription(text){
        if(this.Port==2345){
            cy.contains('.gh-expandable-title', 'Title & description')
            .parents('.gh-expandable-block')
            .find('input')
            .eq(1)
            .clear()
            .type(text, { force: true });
        }else{
            cy.get('input[placeholder="Site description"]').clear().type(text);
        }
    }

    clickOnButton(accion, wait=5000)
    {
        cy.get('button').then((buttons) => {
            let matched = null;
        
            // Iterar sobre los botones para encontrar el que contiene "Save"
            buttons.each((index, button) => {
                if (button.innerText.includes(accion)) {
                    matched = button;
                    return false; // Rompe el ciclo each de Cypress
                }
            });
        
            // Lanzar un error si no se encuentra el botón
            if (!matched) {
                throw new Error(`No se encontró un botón para ${accion}`);
            }
        
            // Hacer clic en el botón encontrado
            cy.wrap(matched).click();
            cy.wait(wait);
            
        });
    }

    clickOnPanel(name){
        cy.get(`button[title="${name}"]`).click();
        cy.wait(2000);
    }

    clickOnPickColor(){
        cy.get(`button[aria-label="Pick color"]`).click();
    }

    setColor(color){
        // Definir el selector según el valor de this.Puerto
        const selector = (this.Port == 2345) ? 'input[name="accent-color"].gh-input' : 'input[aria-label="Color value"';
        cy.get(selector)
            .clear({ force: true })
            .type(color, { force: true });
        cy.wait(5000);
    }

    shouldContain(text){
        cy.get('body').then((container) => {
            const containerText = container.text();
            expect(containerText).to.include(text);
        });
    }

    shouldNotContain(text) {
        cy.get('body').then((container) => {
            const containerText = container.text();
            expect(containerText).not.to.include(text);
        });
    }

    shouldContainColor(color){
        cy.document().then((doc) => {
            const headContent = doc.documentElement.innerHTML;
            const colorh = `#${color}`;
            expect(headContent).to.include(color, `El head debe contener el color ${colorh}`);
        });
    }

    randomColor() {
        const r = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
        const g = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
        const b = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
        return `${r}${g}${b}`;
    }
}

export default Webpage;