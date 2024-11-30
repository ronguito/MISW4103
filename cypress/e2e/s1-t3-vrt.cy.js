import Webpage from './src/webpage';
import Member from './src/member';
import Post from './src/post';
import Page from './src/page';
import Tag from './src/tag';

//import { beforeEach } from 'mocha';

const { faker } = require('@faker-js/faker');

const config = Cypress.env('config');


describe('Semana1: Pruebas e2e, genera imagenes para VRT', () => {
    
    const wp = new Webpage();
    const member = new Member();
    const post = new Post();
    const page = new Page();
    const tag = new Tag();

    beforeEach(() => {
      wp.setHost(config.Host, config.Port) 
      member.Port = config.Port;
      post.Port = config.Port;
      page.Port = config.Port;
      tag.Port = config.Port;

      //Given
      wp.visit(config.UrlLogin);
      cy.captureImage();
      wp.login(config.UserName, config.UserPass);
      
    });
    
    it('vr01: Configurar el título del sitio', () => {
		
        const title = faker.company.name();
        //Given
        wp.openSiteSetting();
        cy.captureImage();
        //When
        wp.clickCategory("general")
        wp.clickEditSection("Title & description");
        cy.captureImage();
        wp.setPageTitle(title);
        wp.clickOnButton("Save");
        
        //Then
        wp.visit(config.UrlPublic);
        cy.captureImage();
        wp.shouldContain(title);
        
    });

    
    
	it('vr02: Crear un nuevo member', () => {
		  
      const name = faker.person.fullName();
      const email = faker.internet.email();

      //Given
      wp.visit(config.UrlMember);
      cy.captureImage();
      
      //When
      member.create();
      cy.captureImage();
      member.setName(name);
      member.setEmail(email);
      wp.clickOnButton("Save");
      cy.captureImage();
      wp.visit(config.UrlMember);
      
      //Then
      member.verifyMemberEmail(email);

    });
    
});
