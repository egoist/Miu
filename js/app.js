
// Get the current window


// Load native UI library

var gui = require('nw.gui'); //or global.window.nwDispatcher.requireNwGui() (see https://github.com/rogerwang/node-webkit/issues/707)
var fs = require('fs');
var path = require('path');

var toMarkdown = require('to-markdown').toMarkdown;





// Get the current window
var win = gui.Window.get();

var isMax = false;
var isMenu = false;
function closeWindow () {
	win.close();
}

function miniWindow () {
	win.minimize();
}

function maxWindow () {
	if(isMax === false) {
		win.maximize();
		$('.features .editor .entry-markdown').css('min-height','90vmin');
		$('.entry-preview').css('min-height',$('.sketch').height())
		
		isMax = true;
	}else if(isMax === true) {
		$('.features .editor .entry-markdown').css('min-height','590px')
		win.unmaximize();
		isMax = false;
	}
	
}

function fullScreen () {
	win.toggleFullscreen();
}

 /*function jQueryMain ()
    {
        $(document).mouseup (function (evt) {alert (evt.pageX + ':' + evt.pageY);} );
    }

    $(document).ready (jQueryMain);
    */

function replaceNew (data)
{
	$('#original-file').html(data);
	$('.editor').ghostDown('destroy');
	$(".editor").ghostDown();
}



function checkUpdate(){                             
	var version = $('#version').html();
  $.ajax({                                      
    type: "GET",                                        
    url: "https://raw.githubusercontent.com/0x142857/Miu/master/latest_version.json",     
    dataType: 'json',  
    success: function(msg){   
    var latest = msg.version;
    if(latest > version){
    	var notice = '检测到新版本 '+latest+ ' <a href="#;" id="download-src" onclick="home()" data-download="'+msg.source+'">前往下载</a>';
    	$('.checkUpdate').html(notice);
    }else{
    	var notice = '已经是最新版';
    	$('.checkUpdate').html(notice);
    }          
    }
  });
}


function home(){
	return gui.Shell.openExternal('https://miu.0x142857.com');
}
var settings = new Object();
settings.preview = simpleStorage.get('preview')?simpleStorage.get('preview'):'Github2.css';
settings.mode = simpleStorage.get('mode');
if(settings.mode == 'colorful'){
	$('.header').addClass('colorful-header');
	$('#colorful-check').attr('checked','checked');
}
var css_link = $("<link>", {
        rel: "stylesheet",
        type: "text/css",
        href: "themes/preview/"+settings.preview
    });
    css_link.appendTo('head');
$(function() {

	
	$('#settings-trigger').on('click',function(){
		if(isMenu === false){
			isMenu = true;
			$('.wrap').animate({
			left:'260px'
			})
			$('.settings').css('left','0')
			$('.settings').css('box-shadow','0px 2px 10px #333')
			setTimeout(function(){
				$('#settings-trigger').animate({
				left:"-11px"
				})
			},600)
				
			
		}else if(isMenu === true){
			isMenu = false;
			$('.settings').css('left','-260px')
			$('.wrap').animate({
			left:'0'
			},'normal')
			
			$('.settings').css('box-shadow','none')
				setTimeout(function(){
					$('#settings-trigger').animate({
				left:"3px"
				})
				},600)
			
		}
		
	})

	$('#about-trigger').click(function(){
		checkUpdate();
		$('.override').show();
		$('#about').notifyModal({
			duration : -1,
			placement : 'center',
			overlay : true,
			type : 'simple',
			onClose : function() {}

			});
	})

		
		$('body').keydown(function(e){
			if((e.ctrlKey || e.metaKey) && e.which === 83){
				if($('.current-file').data('save') == true){
					saveAction();
				}else if($('.current-file').data('save') == false){
					$('#save_file').click();
				}
				
			}

			})
			//

			
				setTimeout(function(){autoSave()},60000);
				
					
					
				
				
			//}
		
	
        $('#open-trigger').click(function () {
        	$('#open_file').click();
        	
		})
		$('#save-trigger').click(function () {
			if($('.current-file').data('save') == false){
				$('#save_file').click();
			}else if($('.current-file').data('save') == true){
				saveAction();
			}
			
			
				
		})
		$('#savenew-trigger').click(function(){
			$('#savenew_file').click();
		})
		$('#new-trigger').click(function(){
			$('#original-file').html('');
			$('.editor').ghostDown('destroy');
			$(".editor").ghostDown();
			$('.current-file').data('save',false).html('未命名文档');
		})
		$('#html-trigger').click(function () {
			
				$('#save_html').click();			
				
		})
		$('#pdf-trigger').click(function(){
			$('#save_pdf').click();
		})
		$('#doc-trigger').click(function(){
			$('#save_doc').click();
		})
		$('#save_file').on('change',function(){
				saveAction();
		})
		$('#savenew_file').on('change',function(){
				savenewAction();
		})
		$('#open_file').on('change',function(){
				openAction();
		})
		$('#save_html').on('change',function(){
				htmlAction();
		})
		$('#save_pdf').on('change',function(){
				pdfAction();
		})
		$('#save_doc').on('change',function(){
				docAction();
		})
		var fileTree = false;
		var toolTree = false;
		$('.features').click(function(){
			$('.header').css('overflow','hidden')
					$('#file-action').removeClass('file-action-active')
					$('.dropdown').slideUp()
					fileTree = false
		})
		$('#file-action').on(
			'click',function(){
				if(fileTree === false){
					//
					toolTree = false;
					$('.topDropdown').hide()
					$('.topAction').removeClass('file-action-active')
					//

					$('.header').css('overflow','visible')
					$('#file-action').addClass('file-action-active')
					$('.dropdown').slideDown()
					fileTree = true
				}else if(fileTree === true){
					$('.header').css('overflow','hidden')
					$('#file-action').removeClass('file-action-active')
					$('.dropdown').slideUp()
					fileTree = false
				}
				
			}
			
			

			)
		$('#tool-action').on(
			'click',function(){
				if(toolTree === false){

					fileTree = false;
					$('.topDropdown').hide()
					$('.topAction').removeClass('file-action-active')

					$('.header').css('overflow','visible')
					$('#tool-action').addClass('file-action-active')
					$('.tool-dropdown').slideDown()
					toolTree = true
				}else if(toolTree === true){
					$('.header').css('overflow','hidden')
					$('#tool-action').removeClass('file-action-active')
					$('.tool-dropdown').slideUp()
					toolTree = false
				}
				
			}
			
			)

		$('#css-input').on('change',function(){
			var new_css = path.basename($('#css-input').val());
			simpleStorage.set('preview',new_css);
			$('.notie').html('你的自定义 CSS <'+new_css+'> 将在下次启动时生效').slideDown();
			setTimeout(function(){
				$('.notie').slideUp();
			},3000)
		})
		//check
		$('#colorful-label').click(function(){
			if($('#colorful-check').is(":checked") === true){
				$('.header').addClass('colorful-header');
				simpleStorage.set('mode','colorful');

			}else if($('#colorful-check').is(":checked") === false){
				$('.header').removeClass('colorful-header');
				simpleStorage.set('mode','light');
			}
		})
		$('#css-label').click(function(){
			if($(this).data('open') == false){
				
				$(this).data('open',true);
				$(this).find('i').css('-webkit-transform','rotate(90deg)');
				$('.css-label-cont').slideDown()
			}else if($(this).data('open') == true){
				
				$(this).data('open',false);
				$(this).find('i').css('-webkit-transform','rotate(0deg)');
				$('.css-label-cont').slideUp()
			}
		})
		$('#css-input-trigger').click(function(){
			$('#css-input').click()
		})
		$('#cloud-trigger').click(function(){
			$('.notie').html('告诉我们你需要什么样的云服务？');
			$('.notie').slideDown();
			setTimeout(function(){
				$('.notie').slideUp();
			},4000)
			
		})
});

function saveAction () {
				var toSave = $('.rendered-markdown').html().toString();
				toSave = toMarkdown(toSave);
				savePath = $('#save_file').val();
				if(!savePath){
					savePath = $('.current-file').data('location');
				}
				fs.writeFile(savePath, toSave , function (err) {
				  if (err) alert(err);
				  var oldTitle = $('.current-file').html();
				  $('.current-file').animate({top:'-35px'},function(){
				  	$('.current-file').html('已保存');
				  	$('.current-file').animate({top:'0'},function(){
				  		setTimeout(function(){
				  			var replaceTitle = path.basename(savePath);
				 		 $('.current-file').html(replaceTitle).data('save',true);
				 		 $('.current-file').animate({top:"0"})
				 		 
				  		},1000);
				  		
				  		 
				  	});
				  })
				  console.log('It\'s saved!');
				  $('#save_file').val()
				});	
}
function savenewAction () {
				var toSave = $('.rendered-markdown').html();
				toSave = toMarkdown(toSave);
				savePath = $('#savenew_file').val();
				var oldTitle = $('.current-file').html();
				fs.writeFile(savePath, toSave , function (err) {
				  if (err) alert(err);
				  var oldTitle = $('.current-file').html();
				  var replaceTitle = path.basename(savePath);
				  			$('.current-file').html('已另存为 '+replaceTitle);
				  $('.current-file').animate({top:'-35px'},function(){
				  	
				  	$('.current-file').animate({top:'0'},function(){
				  		setTimeout(function(){
				  			
				 		 $('.current-file').html(oldTitle);
				 		 $('.current-file').animate({top:"0"})
				 		 
				  		},1000);
				  		
				  	});
				  })
				  console.log('It\'s saved!');
				  $('#savenew_file').val('');
				});	
}
function htmlAction () {
				var htmlSave = $('.rendered-markdown').html();
				htmlSave = toMarkdown(htmlSave);
				var HTMLcon = new Showdown.converter();
				htmlSave = HTMLcon.makeHtml(htmlSave);
				var htmlPath = $('#save_html').val();
				if(htmlPath){
					fs.writeFile(htmlPath, htmlSave , function (err) {
					  if (err) alert(err);
					  var oldTitle = $('.current-file').html();
					  $('.current-file').animate({top:'-35px'},function(){
					  	$('.current-file').html('已另存为 HTML');
					  	$('.current-file').animate({top:'0'},function(){
					  		setTimeout(function(){
					  			
					 		 $('.current-file').html(oldTitle);
					 		 $('.current-file').animate({top:"0"})
					 		 
					  		},1000);
					  		
					  		 
					  	});
					  })
					  console.log('HTML\'s saved!');
					  $('#save_html').val('')
					});	
				}
				
}
function pdfAction () {
				var markdownpdf = require("markdown-pdf");
				var oldTitle = $('.current-file').html();
				$('.current-file').html('正在保存中');
				var toSave = $('.rendered-markdown').html();
				toSave = toMarkdown(toSave);
				savePath = $('#save_pdf').val();
				markdownpdf().from.string(toSave).to(savePath, function () {
				 
				  
				  $('.current-file').animate({top:'-35px'},function(){
				  	$('.current-file').html('已另存为 PDF');
				  	$('.current-file').animate({top:'0'},function(){
				  		setTimeout(function(){
				 		 $('.current-file').html(oldTitle);
				 		 $('.current-file').animate({top:"0"})
				 		 
				  		},1000);
				  		
				  		 
				  	});
				  })
				  console.log('PDF\'s saved!');
				  $('#save_pdf').val('');
				});	
}
function docAction () {
		    var markdownword = require("markdown-word");
			var oldTitle = $('.current-file').html();
				$('.current-file').html('正在保存中');
				var toSave = $('.rendered-markdown').html();
				toSave = toMarkdown(toSave);
				savePath = $('#save_doc').val();
				
				markdownword.documentFromMarkdown(toSave,savePath, function () {
				 
				  
				  $('.current-file').animate({top:'-35px'},function(){
				  	$('.current-file').html('已另存为 DOC');
				  	$('.current-file').animate({top:'0'},function(){
				  		setTimeout(function(){
				 		 $('.current-file').html(oldTitle);
				 		 $('.current-file').animate({top:"0"})
				 		 $('#save_doc').val('');
				  		},1000);
				  		
				  		 
				  	});
				  })
				  console.log('DOC\'s saved!');
				 
				});	
				 
}
function autoSave () {
	if($('.current-file').data('save') == true){
						var toSave = $('.rendered-markdown').html();
				toSave = toMarkdown(toSave);
				savePath = $('#save_file').val();
				if(!savePath){
					savePath = $('.current-file').data('location');
				}
				fs.writeFile(savePath, toSave , function (err) {
				  if (err) alert(err);
				  var oldTitle = $('.current-file').html();
				  $('.current-file').animate({top:'-35px'},function(){
				  	$('.current-file').html('已自动保存');
				  	$('.current-file').animate({top:'0'},function(){
				  		setTimeout(function(){
				  			var replaceTitle = path.basename(savePath);
				 		 $('.current-file').html(replaceTitle).data('save',true);
				 		 $('.current-file').animate({top:"0"})
				 		 
				  		},1000);
				  		console.log('auto save');
				  		 
				  	});
				  })

				});	
	}
	setTimeout(function(){autoSave()},60000);
}

function openAction () {
			var mdPath = $('#open_file').val();
			if(mdPath){
				 fs.readFile(mdPath, function (err, data) {
				  if (err) throw err;
				  replaceNew(data.toString());
				  var replaceTitle = path.basename(mdPath);
					  $('.current-file').html(replaceTitle).data('save',true).data('location',mdPath);
				$('#open_file').val('')
				});
			}
           
}

