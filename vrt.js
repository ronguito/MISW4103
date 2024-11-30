const compareImages = require("resemblejs/compareImages")
const config = require("./resemble.json");
const fs = require('fs');

const { viewportHeight, viewportWidth, browsers, options } = config;

const arregloNombre = new Array();

async function executeTest(){
    
    let resultInfo = {}
    let datetime = new Date().toISOString().replace(/:/g,".");

    if(!fs.existsSync('./results/compare')){
        fs.mkdirSync('./results/compare', { recursive: true });
    }

    if(!fs.existsSync('./results/cypress')){
      fs.mkdirSync('./results/cypress', { recursive: true });
    }
    
    const folders = fs.readdirSync("./results/cypress");
    console.log(folders);
    const [f1,f2] = folders;
    if(f1==undefined || f2==undefined){
      console.log("No se encontro carpetas validas para la regresion");
      return;
    }
    
    const base1 = fs.readdirSync("./results/cypress/" + f1)
    const base2 = fs.readdirSync("./results/cypress/" + f2)
    for (let i = 0; i < base1.length; i++) {

        foto1 = base1[i];
        foto2 = false;
        
        for (let j = 0; j < base2.length; j++) {
            if(base2[j]==foto1){
                foto2=base2[j];
                base2.splice(j, 1);
                console.log("Archivo:", foto2);
                break;
            }
        }
        if(!foto2) { console.log("No encontrado pareja:", ss45); continue; }
        arregloNombre.push({"name": foto2.trim(),"f1":f1,"f2":f2});

        const data = await compareImages(
            fs.readFileSync(`./results/cypress/${f1}/${foto1}`),
            fs.readFileSync(`./results/cypress/${f2}/${foto2}`),
            options
        );

        resultInfo[foto2.trim()] = {
            isSameDimensions: data.isSameDimensions,
            dimensionDifference: data.dimensionDifference,
            rawMisMatchPercentage: data.rawMisMatchPercentage,
            misMatchPercentage: data.misMatchPercentage,
            diffBounds: data.diffBounds,
            analysisTime: data.analysisTime
        }

        fs.writeFileSync(`./results/compare/${foto2}`, data.getBuffer());
        
    }
    fs.writeFileSync(`./results/index.html`, createReport(datetime, resultInfo));

    console.log('------------------------------------------------------------------------------------');
    console.log("Execution finished. Check the report under the results folder");
    console.log(arregloNombre);
    return resultInfo;  
  }


(async ()=>console.log(await executeTest()))();

function browser(b, info){

    return `<div class=" browser">
    <div class=" btitle">
        <h2>Prueba: ${b.name} ( ${info.misMatchPercentage} % )</h2>
        <p>Data: ${JSON.stringify(info)}</p>
    </div>
    <div class="imgline">
      <div class="imgcontainer">
        <span class="imgname">Navegador ${b.f1}</span>
        <img src="./cypress/${b.f1}/${b.name}" id="refImage" label="Reference">
      </div>
      <div class="imgcontainer">
        <span class="imgname">Navegador ${b.f2}</span>
        <img src="./cypress/${b.f2}/${b.name}" id="testImage" label="Test">
      </div>
      <div class="imgcontainer">
        <span class="imgname">Difference</span>
        <img src="./compare/${b.name}".png" id="diffImage" label="Diff">
      </div>
    </div>
  </div>`
}

function createReport(datetime, resInfo){
    return `
    <html>
        <head>
            <title>  Reporte de regresion Visual Ghost </title>
            <link href="../index.css" type="text/css" rel="stylesheet">
        </head>
        <body>
            <h1>Reporte de regresion Visual Ghost </h1>
            <p>Executed: ${datetime}</p>
            <div id="visualizer">
            ${arregloNombre.map(b=>browser(b, resInfo[b.name]))}
            </div>
        </body>
    </html>`
}
