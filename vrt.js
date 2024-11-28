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
    
    const folders = fs.readdirSync("./results/cypress");
    console.log(folders);
    return;
    
    const base = fs.readdirSync("./results/cypress/")
    const rc = fs.readdirSync("./results/cypress")
    for (let i = 0; i < base.length; i++) {

        ss45 = base[i];
        ss68 = false;
        
        for (let j = 0; j < rc.length; j++) {
            if(rc[j]==ss45){
                ss68=rc[j];
                rc.splice(j, 1);
                console.log("Archivo:", ss68);
                break;
            }
        }
        if(!ss68) { console.log("No encontrado pareja:", ss45); continue; }
        arregloNombre.push(ss68.trim());
        const data = await compareImages(
            fs.readFileSync(`./results/kraken/2345/${ss45}`),
            fs.readFileSync(`./results/kraken/2368/${ss68}`),
            options
        );

        resultInfo[ss68.trim()] = {
            isSameDimensions: data.isSameDimensions,
            dimensionDifference: data.dimensionDifference,
            rawMisMatchPercentage: data.rawMisMatchPercentage,
            misMatchPercentage: data.misMatchPercentage,
            diffBounds: data.diffBounds,
            analysisTime: data.analysisTime
        }

        fs.writeFileSync(`./results/kraken/compare/${ss68}`, data.getBuffer());
        
    }
    fs.writeFileSync(`./results/kraken/index.html`, createReport(datetime, resultInfo));
    fs.copyFileSync('./index.css', `./results/kraken/index.css`);
    console.log('------------------------------------------------------------------------------------');
    console.log("Execution finished. Check the report under the results folder");
    console.log(arregloNombre);
    return resultInfo;  
  }


(async ()=>console.log(await executeTest()))();

function browser(b, info){

    return `<div class=" browser" id="test0">
    <div class=" btitle">
        <h2>Prueba: ${b}</h2>
        <p>Data: ${JSON.stringify(info)}</p>
    </div>
    <div class="imgline">
      <div class="imgcontainer">
        <span class="imgname">Reference</span>
        <img class="img2" src="../kraken/2368/${b}" id="refImage" label="Reference">
      </div>
      <div class="imgcontainer">
        <span class="imgname">Test</span>
        <img class="img2" src="../kraken/2345/${b}" id="testImage" label="Test">
      </div>
    </div>
    <div class="imgline">
      <div class="imgcontainer">
        <span class="imgname">Diff</span>
        <img class="imgfull" src="../kraken/compare/${b}".png" id="diffImage" label="Diff">
      </div>
    </div>
  </div>`
}

function createReport(datetime, resInfo){
    return `
    <html>
        <head>
            <title>  Reporte de comparación de la verión 5.96 y 4.5 de Ghost </title>
            <link href="index.css" type="text/css" rel="stylesheet">
        </head>
        <body>
            <h1>Reporte de comparación de la verión 5.96 y 5.4 de Ghost con la ejecución de pruebas automatizadas con Kraken 
                 
            </h1>
            <p>Executed: ${datetime}</p>
            <div id="visualizer">
            ${arregloNombre.map(b=>browser(b, resInfo[b]))}
            </div>
        </body>
    </html>`
}
