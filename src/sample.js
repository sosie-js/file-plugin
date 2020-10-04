/**
* Sample of buttons for the File Plugin
*
* @property {EditorJS} editor - an instance of Editor.js with SoSIE menubar
*/


function sampleFile(editor) {
 

    if(editor.hasOwnProperty('sosie')) { 
    
        let sosie=editor.sosie;
        
        /**
        * Load Json data into the editor
        *
        * @param {Object} json  Json file data provided by the user.
        */
        window.loadJS=function(json) {
            editor.blocks.render(json);
        }
        
        /**
        * Load HTML data into the editor
        *
        * @note experimental
        * @param {Object} json  Json file data provided by the user.
        */
        window.loadHTML=function(html) {
            editor.blocks.renderFromHTML(html).then(e => {
                // page scroll to top when new content is loaded
                //await editor.isReady;
                setTimeout(() => {
                    window.scrollTo(0,0);
                },100);
            })
        }
        
        /**
        * Clear Menu button
        */
        editor.sosie.addMenuIconBtn({   
            icon:'file-o',
            id:'clearButton',
            title:'New/clear',
            text:'',
            onClick: [function(evt){ var edt=editor; return clearOrOpenUrl(edt)}, false]
        });
	
        /**
        * Open Menu button
        */
        editor.sosie.addMenuIconBtn({   
            icon:'folder-open-o',
            id:'openButton',
            title:'Open',
            text:'',
            onClick: [function (evt) {
                this.firstChild.lastChild.click();//Triggers input file defined in custom.input below
                evt.stopPropagation();
            },false],
            custom: {
                input: {
                    type:'file',
                    required:'required',
                    accept:'.json',//,.sos,.docx
                    style:'display:none',
                    onChange:[openFileHandler,false]
                }
            }
        });
            
        /**
        * Save Menu button
        */
        editor.sosie.addMenuIconBtn({   
            icon:'save',
            id:'saveMenuButton',
            title:'Save',
            text:'',
            onClick: [function(evt){ var edt=editor; return saveFileInLocal(edt)}, false]
        });
      
    }
}

