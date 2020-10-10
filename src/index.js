/**
* File managing
*
* @Note this has to be triggered after await editor.isReady.
* @author sos-productions.com
* @version 2.0
* @history
*    1.0 (03.10.2020) - Initial version from SoSIE
*    2.0 (04.10.2020) - getFilePluginDir
* @property {Object} editor - Editor.js API 
*/


/**
 * last opened File name
 * 
 * @var {String} currentFile
 */
var currentFile='sosie_file.json';

/**
 * Get the last opened File name
 * 
 * @return {String}
 **/ 
function getCurrentFile() {
    return currentFile;
}

/**
 * Get FilePlugin Dir relative to the HTML page
 * 
 * @return {String}
 **/ 
function getFilePluginDir() {
    let currentScript='${currentScript}'; //Relative to the HTML page, resolved by script-loader
    return currentScript.replace('/dist/bundle.js','');  //'editor.js/example/plugins/file-plugin';
}

/**
 * init File Plugin
 * 
 * @param {Object} editor - Editor.js API 
 */
File.init = function (editor) {
    
     var mode='prod'
     var source='local';//Works only with local stored dists as we decided not to publish on npm
     var nocache=false;
     let pluginDir=getFilePluginDir();
     console.log('File plugin found in '+pluginDir);
     target=source+':'+pluginDir;
    
     if(window.hasOwnProperty('loadEditor')) {
        (async () => {
            await loadEditor([
                {'downloadjs@latest':['[src/downloadjs](https://github.com/rndme/download)','../../dist/download.min.js']},
                {'file-saver@latest':['[src/file-saver](https://github.com/eligrey/FileSaver.js)','../../dist/FileSaver.min.js']
                }],nocache,mode,target) 
        })();
        console.log('File plugin initialized ');
     } else {
        alert('You need to load sosie-js/script-loader version 2.3.+ available on github');
     }
}

/**
 * Helper to download JSON file using the data content and file name
 * 
 * @param {Object} data - Json data
 * @param {String} name - Name of the file
 * @param {Obhject} options - holds compact (true for pretty format) and method (fielsaver or download-js)
 */
function downloadJSON(data, name, options) {
            
    // Create a blob of the data because json data may contain invalid chars to be transmitted directly making JSON.parse crashing
    
    if(options['compact']) {
        data=JSON.stringify(data);
    } else { //pretty, human readable
        data=JSON.stringify(data,null, 2);
    }
    
    var blob = new Blob([data]);
            
    // Launch the download
    
    if(options['method'] == 'filesaver') {
        //see also for big files: https://github.com/jimmywarting/StreamSaver.js 
        saveAs(blob, name, "application/json");
    } else {
        download(blob, name, "application/json");
    }

}

/**
 * Prompt to choice between clear editor or open the url provided
 * 
 * @param {Object} editor - Editor.js API 
 */
function clearOrOpenUrl(editor) {
    
    var url=prompt('Clear the editor(content will be lost using this url) ?','about:blank');
    
    if (url != 'about:blank') {
        if(/https?:\/\//.test(url)) {
                var payload = { url: url }
                
                var data = new FormData();
                data.append( "data", JSON.stringify( payload ) );

            fetch(getFilePluginDir()+'/dist/corsget.php', //Echo script to breakthrough CORS limitation, should
            {
                method: "POST",
                /* headers: {  
                    // neither 'Content-Type': 'application/x-www-form-urlencoded', nor 'application/json' 
                    //'auth': '1234'  
                },  */
                credentials: 'same-origin',
                body: data
            }).then(function(res) {
                if (res.ok) {
                    return res.text();
                } else {
                    //var error = new Error(response.statusText)
                    //error.response = res
                    return Promise.reject("Error "+res.status+' : '+ res.statusText);
                }
            },function(error) {
                alert(error.message); 
            }).then((async (res) => {
                let errcode,errstr;
                if((errcode=/^Error : (\d+)$/.exec(res)) !== null) {
                    switch(parseInt(errcode[1])) {
                        case 404:
                            errstr='MISSING DATA';
                        break
                        case 504:
                            errstr='FORBIDDEN DOMAIN; check your CORS settings in corsget.php';
                        break
                        default:
                            errstr='Unknown Error code '+errcode;
                    }
                    alert(errstr);
                } else {
                    loadHTML(res);
                }
            })).catch(function(error) { 
                alert("Error : " + error + '(requires corsget.php to be installed)')
            });
        
        } else {
            alert('Invalid Url');
        }
    
    } else {
        editor.clear(); 
    }
}

/**
 * Open file selector and add content as block in SoSIe Editor 
 * 
 * @param Event - evt Click Event front input type file
 **/
function openFileHandler(evt) {
                    
    //limit the types of files that can be uploaded to only those specified by the input's accept attribute; compare the whole string of the extension, without case-sensitivty
    var $changed_input = this,
        file_extension = $changed_input.value.match(/\.([^\.]+)$/)[1].toLowerCase(),
        allowed_extensions = new RegExp($changed_input.getAttribute('accept').replace(/,/g, "$|^").replace(/\./g, "").toLowerCase());
    console.log('Is "' + file_extension + '" in "' + allowed_extensions + '"?');
    if (file_extension.match(allowed_extensions)) {
            //alert($changed_input.value);
            var files = evt.target.files; // FileList object

            // use the 1st file from the list
            f = files[0];
            currentFile=f.name;
            console.info('Open File',currentFile);

            var reader = new FileReader();

            
            var printError = function(error, explicit) {
                alert(`[${explicit ? 'EXPLICIT' : 'INEXPLICIT'}] ${error.name}: ${error.message}`);
            }
            
            
            // Closure to capture the file information.
            reader.onload = (function(theFile) {
                return function(e) {
                    try {
                        var json=e.target.result;
                        var jsondata=JSON.parse(json);
                        window.loadJS(jsondata);
                        //.save does not trigger Editor.isRead
                        //if(refreshBlocksStatusPanel) refreshBlocksStatusPanel();
                    } catch(error) {
                        if (error instanceof SyntaxError) {
                            printError(error, true);
                        } else {
                            printError(error, false);
                        }
                    }
                };
            })(f);

            reader.readAsText(f);
    } else {
        alert('Please do not try to upload files with the extension "' + file_extension + '".');
    }
}

/**
 * Get a snapshot of the whole blocks and trigger the download box to save the json on the disk 
 * 
 * @param {Object} editor - Editor.js API 
 */
function saveFileInLocal(editor) {
    editor.save(true).then((savedData) => {
        let name=getCurrentFile();
        downloadJSON(savedData,name,{method:'filesaver',compact:false});
    });
}

//Register so SoSIE will autoinit.    
SoSIE.register('File');
