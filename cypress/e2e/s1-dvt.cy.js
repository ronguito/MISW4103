import Webpage from './src/webpage';
import Post from './src/post';
import Member from './src/member';
import Page from './src/page';
import Tag from './src/tag';

import { beforeEach } from 'mocha';

const { faker } = require('@faker-js/faker');

const config = Cypress.env('config');
const f01e01 = require('./data/f01e01.json');
const f01e02 = require('./data/f01e02.json');
const f02e01 = require('./data/f02e01.json');
const f03e01 = require('./data/f03e01.json');
const f04e01 = require('./data/f04e01.json');
const f05e01 = require('./data/f05e01.json');

describe('Suit de Escenarios: Prueba de diferentes escenarios de inyeccion de datos ', () => {
    
    const wp = new Webpage();
    const member = new Member();
    const post = new Post();
    const page = new Page();
    const tag = new Tag();

    beforeEach(() => {
        member.Port=config.Port
        //Given
        wp.setHost(config.Host, config.Port)
        wp.visit(config.UrlLogin);
        wp.login(config.UserName, config.UserPass);
    });

    f01e01.forEach((scenario) => {
    
        it(`${scenario.description} ${scenario.strategy}`, () => {
		
           let title = getValue(scenario);

            //Given
            wp.visit("/ghost/#/dashboard");
            wp.openSiteSetting();
            
            //When
            wp.clickCategory("general")
            wp.clickEditSection("Title & description");
            wp.setPageTitle(title);
            wp.clickOnButton("Save");
            
            //Then
            wp.visit(config.UrlPublic);
            wp.shouldContain(title);
        });
        
    });
    
        

    f01e02.forEach((scenario) => {

        it(`${scenario.description} ${scenario.strategy}`, () => {

            let text = getValue(scenario);
            //Given
            wp.visit("/ghost/#/dashboard");
            wp.openSiteSetting();
            
            //When
            wp.clickCategory("general")
            wp.clickEditSection("Title & description");
            wp.setPageDescription(text);
            wp.clickOnButton("Save");
    
            //Then
            wp.visit(config.UrlPublic);
            wp.shouldContain(text);		
        });
    });



    f02e01.forEach((scenario) => {

        it(`${scenario.description} ${scenario.strategy}`, () => {

            let name;
            let email;

            let dato = getValue(scenario);

            if(scenario.field=="name"){
                name = dato;
                email = scenario.email;
            }else  if(scenario.field=="email"){
                email = dato;
                name = scenario.name;
            }

            //Given
            wp.visit(config.UrlMember);
            
            //When
            member.create();
            member.setName(name);
            member.setEmail(email);
            wp.clickOnButton("Save");
            
            //Then
            if (scenario.email_tipo == "invalid") {
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
      
    //escenarios de post
    f03e01.forEach((scenario) => {

        it(`${scenario.description} ${scenario.strategy}`, () => {

            let title = getValue(scenario);

            //Given
            wp.visit(config.UrlPost);
            
            //When
            post.create();
            post.setTitle(title);
            post.save();
            
            //Then
            wp.visit(config.UrlPost);
            post.verifyStatus('Draft', title);
        });
      });
      
      
	//Escenarios de paginas
    f04e01.forEach((scenario) => {

        it(`${scenario.description} ${scenario.strategy}`, () => {

            let title = getValue(scenario);

            //Given
            wp.visit(config.UrlPage);
            
            //When
            page.create();
            page.setTitle(title);
            page.save();
            
            //then
            page.verifyStatus('Draft', title);
            
            page.selectFirst('Draft').then(t => {
                //When
                page.getUrl().then(url => {
                    page.deleteLastPage();        
                });
            });
            
        });
      });

    //escearios de tags
    f05e01.forEach((scenario) => {

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
        const partes = scenario.data.split('.'); // Dividir en ['string', 'alphanumeric']
        value = faker[partes[0]][partes[1]](); 
    }else if(scenario.strategy=="pool"){
        const indice = Math.floor(Math.random() * scenario.data.length);
        value = scenario.data[indice];
    } 
    return value; 
}