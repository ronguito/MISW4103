import Webpage from './src/webpage';
const config = Cypress.env('config');

describe('Prueba exploratoria automatizada - Monkey', function() {

    const wp = new Webpage();

    beforeEach(() => {
      wp.setHost(config.Host, config.Port) 
      wp.visit(config.UrlLogin);
      wp.login(config.UserName, config.UserPass);
      
    });

    it('t000 - Exploracion del sistema administrativo de Ghost', function() {
        cy.wait(1000);
        randomEvent(config.Iterations);
    })

})

// Función genera número aleatorio entre un mínimo y un máximo
function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
}
/*
function randomElement(monkeysLeft, element) {
    console.log("Activando el elemento " + element);
   
    cy.get(element, { timeout: 3000 }).then($elements => {
        if ($elements.length === 0) {
            console.log("No se encontró el elemento " + element);
            return; 
        }

        var ElementSelected = $elements.get(getRandomInt(0, $elements.length));

        if (!Cypress.dom.isHidden(ElementSelected)) {
            if (element === 'input[type="text"]') {
                cy.wrap(ElementSelected).invoke('val', 'Texto aleatorio').trigger('change');
            } else if (element === 'select') {
                const randomIndex = getRandomInt(0, ElementSelected.options.length);
                cy.wrap(ElementSelected).select(randomIndex);
            } else {
                cy.wrap(ElementSelected).click({ force: true });
            }
        }
    });

    if (monkeysLeft > 0) {
        cy.wait(1000);
        randomElement(monkeysLeft - 1, element); 
    }
}
*/
function randomElement(monkeysLeft, element) {
    cy.log("Activando el elemento " + element);

    cy.document().then(doc => {
        const elements = doc.querySelectorAll(element);

        if (elements.length === 0) {
            console.log("No se encontró el elemento " + element);
            return;
        }

        const randomIndex = getRandomInt(0, elements.length);
        const ElementSelected = elements[randomIndex];

        if (!Cypress.dom.isHidden(ElementSelected)) {
            if (element === 'input[type="text"]') {
                cy.wrap(ElementSelected)
                    .invoke('val', 'Texto aleatorio')
                    .trigger('change');
            } else if (element === 'select') {
                const randomOptionIndex = getRandomInt(0, ElementSelected.options.length);
                cy.wrap(ElementSelected).select(randomOptionIndex);
            } else {
                cy.wrap(ElementSelected).click({ force: true });
            }
        }

        if (monkeysLeft > 0) {
            cy.wait(1000);
            randomElement(monkeysLeft - 1, element);
        }
    });
}



function randomEvent(eventsLeft) {

	randomElement(0,'a');
    if (eventsLeft > 0) {
		 cy.wait(1000);
        randomEvent(eventsLeft - 1);
    }
}
