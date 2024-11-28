let screenshotCounter = 0;
let currentTestName = '';

Cypress.on('uncaught:exception', (err, runnable) => {
    // Ignorar el error específico relacionado con la interrupción de reproducción
    if (err.message.includes('The play() request was interrupted because the media was removed from the document')) {
      return false; // Evita que Cypress falle la prueba
    }
    // Permitir que Cypress maneje otras excepciones no controladas normalmente
    return true;
});

Cypress.Commands.add('captureImage', () => {
    const bInfo = Cypress.browser;
    const bName = bInfo.name;
    screenshotCounter++;  // Incrementar el contador con cada captura
    //const testName = Cypress.currentTest.title.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 6); // Limpiar el nombre del test
    const screenshotName = `${bName}/${currentTestName}_step_${screenshotCounter}`; // Generar el nombre del archivo
    // Tomar la captura de pantalla con el nombre generado
    cy.screenshot(screenshotName);
});

beforeEach(() => {
    // Reiniciar el contador cuando cambie de escenario (basado en el nombre del test)
    const testName = Cypress.currentTest.title.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 4);
    
    if (testName !== currentTestName) {
        screenshotCounter = 0;  // Reiniciar contador al cambiar de escenario
        currentTestName = testName; // Guardar el nombre del escenario actual
        const bInfo = Cypress.browser;
        const bName = bInfo.name;
        const folder = `./${Cypress.env('config').Results}/cypress/${bName}`;

        cy.task('clearScreenshots', [folder, testName] ).then((message) => {
            cy.log(message);
        });
    }
});

