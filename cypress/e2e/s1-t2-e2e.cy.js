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
      wp.login(config.UserName, config.UserPass);
      
    });
    
    it('t001: Configurar el título del sitio', () => {
		
        const title = faker.company.name();
        //Given
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

    
    it('t002: Configurar la descripción del sitio', () => {
        const text = faker.company.buzzPhrase();
        //Given
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
    
    it('t003: Cambiar el color de los botones', () => {
		const color = wp.randomColor();
        //Given
        wp.openSiteSetting();
        
        //When
        if(config.Port==2368){
            wp.clickEditSection("Design & branding");
            wp.clickOnPanel("Brand");
        }else{
            wp.clickOnButton("Branding");
        }
        wp.setColor(color);
        wp.clickOnButton("Save");
        if(config.Port==2368){
            wp.clickOnButton("Close")
        }
        
        //Then
        wp.visit(config.UrlPublic);
        wp.shouldContainColor(color);	
	
    });
    
    it('t004: Cambiar el color de fondo de la pagina', () => {
		const color = wp.randomColor();
        //Given
        wp.openSiteSetting();
        
        //When
        if(config.Port==2368){
            wp.clickEditSection("Design & branding");
            wp.clickOnPanel("Site wide");
            wp.clickOnPickColor();
            wp.setColor(color);
        }else{
            wp.clickOnButton("Branding");
        }
       
        wp.clickOnButton("Save");
        if(config.Port==2368){
            wp.clickOnButton("Close")
        }

        //Then
        wp.visit(config.UrlPublic);
        if(config.Port==2368){
            wp.shouldContainColor(color);
        }	
	
    });
    
	it('t005: Crear un nuevo member', () => {
		  
      const name = faker.person.fullName();
      const email = faker.internet.email();

      //Given
      wp.visit(config.UrlMember);
      
      //When
      member.create();
      member.setName(name);
      member.setEmail(email);
      wp.clickOnButton("Save");
      wp.visit(config.UrlMember);
      
      //Then
      member.verifyMemberEmail(email);

    });
    
    it('t006: Intentar ingresar un correo existente', () => {
      const name1 = faker.person.fullName();
      const name2 = faker.person.fullName();
      const email = faker.internet.email();

      //Given
      wp.visit(config.UrlMember);
      
      //When
      member.create();
      member.setName(name1);
      member.setEmail(email);
      wp.clickOnButton("Save");
      wp.visit(config.UrlMember);
      member.create();
      member.setName(name2);
      member.setEmail(email);
      wp.clickOnButton("Save");
      
      //Then
      let msg = "Member already exists. Attempting to add member with existing email address"
      member.verifyErrorMessage(msg);

    });
    
    it('t007: Editar un member', () => {
      const name1 = faker.person.fullName();
      const email1 = faker.internet.email();

      //Given
      wp.visit(config.UrlMember);
      
      //When
      member.editFirstMember();
      member.setName(name1);
      member.setEmail(email1);
      wp.clickOnButton("Save");
      
      //Then
      wp.visit(config.UrlMember);
      member.verifyMemberName(name1);
	
    });
    
    it('t008: Editar un member con email duplicado', () => {
      const name = faker.person.fullName();
      const email = faker.internet.email();

      //Given
      wp.visit(config.UrlMember);
      
      //When
      member.create();
      member.setName(name);
      member.setEmail(email);
      wp.clickOnButton("Save");
      wp.visit(config.UrlMember);
      member.editLastMember();
      member.setEmail(email);
      wp.clickOnButton("Save");

      //Then
      let msg = "Attempting to add member with existing email address"
      member.verifyErrorMessage(msg);

    });
    
    it('t009: Crear un nuevo post en estado de borrador', () => {
		  
      const title = faker.hacker.phrase();

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
    
    it('t010: Publicar un post', () => {
      //Given
      wp.visit(config.UrlPost);
      
      post.selectFirst('Draft').then(title => {
        //When
        post.publish();

        //Then
        wp.visit(config.UrlPost);
        post.verifyStatus('Published', title);
        wp.visit(config.UrlPublic);
        wp.shouldContain(title);

      });

    });
    
    
    it('t011: Modificar un post publicado', () => {
      const newTitle = faker.hacker.phrase();
      //Given
      wp.visit(config.UrlPost);

      post.selectFirst('Published').then(title => {
        //When
        post.setTitle(newTitle);
        post.update();
        post.save();

        //Then
        wp.visit(config.UrlPost);
        post.verifyStatus('Published', newTitle);
        wp.visit(config.UrlPublic);
        wp.shouldContain(newTitle);
        wp.shouldNotContain(title);
        
      });
	
    });
    
   
    it('t012: Eliminar un post publicado', () => {
      //Given
      wp.visit(config.UrlPost);

      post.selectFirst('Published').then(title => {
        
        //When
        post.delete();

        //Then
        wp.visit(config.UrlPublic);
        wp.shouldNotContain(title);
        
      });
    });

    it('t013: Crear un nueva pagina en estado de borrador', () => {
		  
      const title = faker.hacker.phrase();

      //Given
      wp.visit(config.UrlPage);
      
      //When
      page.create();
      page.setTitle(title);
      page.save();
      
      //then
      page.verifyStatus('Draft', title);

    });
    
    it('t014: Publicar una pagina', () => {
      //Given
      wp.visit(config.UrlPage);
      
      page.selectFirst('Draft').then(title => {
        //When
        page.getUrl().then(url => {
          page.publish();
          
          //Then
          wp.visit(config.UrlPage);
          page.verifyStatus('Published', title);
          const urlPage = `${config.UrlPublic}/${url}`;
          wp.visit(urlPage);
          wp.shouldContain(title);

        });
      });

    });
    
    it('t015: Modificar url de una pagina publicada', () => {
      //Given 
      wp.visit(config.UrlPage);
      
      page.selectFirst('Published').then(title => {
        //When
        page.getUrl().then(url => {
          const oldUrlPage = `${config.UrlPublic}/${url}`;
          url = faker.word.adjective();
          page.setUrl(url);
          const newUrlPage =  `${config.UrlPublic}/${url}`; 
          page.save();
          
          //Then
          wp.visit(config.UrlPage);
          page.verifyStatus('Published', title);
          
          wp.visit(oldUrlPage);
          wp.shouldContain("Page not found");
          wp.visit(newUrlPage);
          wp.shouldContain(title);

        });
      });
	
    });
    
    it('t016: Eliminar una pagina publicada', () => {
      //Given
      wp.visit(config.UrlPage);

      page.selectFirst('Published').then(title => {
        //When
        page.getUrl().then(url => {
          page.delete();
          
          //Then
          const urlPage = `${config.UrlPublic}/${url}`;
          wp.visit(urlPage);
          wp.shouldContain('Page not found');

        });
      });
    });  

    it('t017: Crear un nuevo tag', () => {
		  
      const nameTag = faker.hacker.verb();

      //Give:
      wps.visit(config.UrlTag);
      
      //When
      tag.create();
      tag.setName(nameTag);
      wps.clickOnButton("Save");
      
      //then
      wps.visit(config.UrlTag);
      tag.verifyTag(nameTag);

    });
    
    it('t018: Asignar un tag a un post', () => {
      //Given 
      wps.visit(config.UrlTag);
      tag.editFirstTag();
      
      tag.getName().then(name => {
        tag.getUrl().then(url => {
          
          wps.visit(config.UrlPost);
          post.selectFirst('Published').then(title => {
          
            //When
            post.setTag(name);
            post.update();
            
            //Then
            const urlPage = `${config.UrlPublic}/tag/${url}/`
            wps.visit(urlPage);
            wps.shouldContain(title);
            
          });
        });
      });
    });
    
    it('t019: Editar un tag', () => {
      const nameTag2 = faker.hacker.verb();
      
      //Given
      wps.visit(config.UrlTag);

      //When
      tag.editFirstTag();
      tag.setName(nameTag2);
      wps.clickOnButton("Save");

      //then
      wps.visit(config.UrlTag);
      tag.verifyTag(nameTag2);

    });
        
    it('t020: Eliminar un tag', () => {
      const nameTag3 = faker.hacker.verb();
      //Given
      wps.visit(config.UrlTag);

      //When
      wps.visit(config.UrlTag);
      tag.editFirstTag();
      tag.deleteTag();
      tag.confirmDeleteTag();
      //then
      wps.visit(config.UrlTag);
      tag.verifyTagDelete(nameTag3);

    }); 
    
});
