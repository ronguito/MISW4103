import Webpage from './src/webpage';
import Member from './src/member';
import Tag from './src/tag';

const { faker } = require('@faker-js/faker');

const config = Cypress.env('config');
const dvt01 = require('./dvt/dvt01.json');
const dvt02 = require('./dvt/dvt02.json');

describe('Suit de Escenarios: Prueba de diferentes escenarios de inyeccion de datos ', () => {
    
    const wp = new Webpage();
    const member = new Member();
    const tag = new Tag();

    beforeEach(() => {
        member.Port=config.Port
        //Given
        wp.setHost(config.Host, config.Port)
        wp.visit(config.UrlLogin);
        wp.login(config.UserName, config.UserPass);
    });


    dvt01.forEach((scenario) => {

        it(`${scenario.description} ${scenario.strategy}`, () => {

            let datos = getValue(scenario);
            let name = datos.name;
            let email = datos.mail;

            //Given
            wp.visit(config.UrlMember);
            
            //When
            member.create();
            member.setName(name);
            member.setEmail(email);
            wp.clickOnButton("Save");
            
            //Then
            if (scenario.type == "invalid") {
                member.checkInvalidEmail()
            } else {
            //Then
                wp.visit(config.UrlMember);
                member.verifyMemberEmail(email);
                member.editFirstMember()
                member.deleteMember()
            }
            
        });
      });  
    

    //escearios de tags
    dvt02.forEach((scenario) => {

        it(`${scenario.description} ${scenario.strategy}`, () => {

            let nameTag = getValue(scenario);

            //Give:
            wp.visit(config.UrlTag);
            
            //When
            tag.create();
            tag.setName(nameTag);
            wp.clickOnButton("Save");
            
            //then
            wp.visit(config.UrlTag);
            tag.verifyTag(nameTag);

            
        });
      });
    
});

function getValue(scenario){

    let value = scenario.data;
    if(scenario.strategy=="random"){
        if (typeof value === 'string') {
            const partes = value.split('.'); // Dividir
            value = faker[partes[0]][partes[1]]();
        } else if (typeof value === 'object' && value !== null) {
            // Iterar sobre las propiedades del objeto
            Object.keys(value).forEach((key) => {
                const partes = value[key].split('.'); // Dividir cada propiedad
                value[key] = faker[partes[0]][partes[1]](); // Actualizar la propiedad con el valor generado
            });
        }
        
    }else if(scenario.strategy=="pool"){
        const indice = Math.floor(Math.random() * scenario.data.length);
        value = scenario.data[indice];
    } 

    return value; 
}