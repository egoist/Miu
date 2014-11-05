var version = "0.1.4";

// Get the current window
// Load native UI library
var gui = require("nw.gui");

//or global.window.nwDispatcher.requireNwGui() (see https://github.com/rogerwang/node-webkit/issues/707)
var fs = require("fs");

var path = require("path");

var lang = simpleStorage.get("language") || "en";
// Create a shortcut with |option|.
var option = {
    key:"Ctrl+M",
    active:function() {
        console.log("Global desktop keyboard shortcut: " + this.key + " active.");
    },
    failed:function(msg) {
        // :(, fail to register the |key| or couldn't parse the |key|.
        console.log(msg);
    }
};

var shortcut = new gui.Shortcut(option);

var tray;

self.show = true;

// Create a tray icon
tray = new gui.Tray({
    title:"Miu",
    icon:"miu.png"
});

var menu = new gui.Menu();

var startItem = new gui.MenuItem({
    type:"normal",
    label:"Miu",
    click:function() {
        showWin();
        self.show = true;
    }
});

var hideItem = new gui.MenuItem({
    type:"normal",
    label:"Hide",
    click:function() {
        this.label = !self.show ? "Hide" :"Show";
        if (self.show) {
            self.show = false;
            return win.hide();
        }
        self.show = true;
        return win.show();
    }
});

var quitItem = new gui.MenuItem({
    type:"normal",
    label:"Quit",
    click:function() {
        gui.App.unregisterGlobalHotKey(shortcut);
        return win.close();
    }
});

menu.append(startItem);

menu.append(hideItem);

menu.append(quitItem);

tray.menu = menu;

window.tray = tray;

function showWin() {
    if (!self.show) win.show();
    self.show = true;
    return win.focus();
}

function destroyTray() {
    tray.remove();
    tray = null;
}

// Get the current window
var win = gui.Window.get();

var isMax = false;

var isMenu = false;

function closeWindow() {
    self.show = false;
    win.hide();
}

function miniWindow() {
    win.minimize();
}

function maxWindow() {
    if (isMax === false) {
        win.maximize();
        $(".features .editor .entry-markdown").css("min-height", "90vmin");
        $(".entry-preview").css("min-height", $(".sketch").height());
        isMax = true;
    } else if (isMax === true) {
        $(".features .editor .entry-markdown").css("min-height", "590px");
        win.unmaximize();
        isMax = false;
    }
}

function fullScreen() {
    win.toggleFullscreen();
}

/*function jQueryMain ()
    {
        $(document).mouseup (function (evt) {alert (evt.pageX + ':' + evt.pageY);} );
    }

    $(document).ready (jQueryMain);
    */
function replaceNew(data) {
    $("#original-file").html(data);
    $(".editor").ghostDown("destroy");
    $(".editor").ghostDown();
}

function new_file() {
    $("#original-file").html("");
    $(".editor").ghostDown("destroy");
    $(".editor").ghostDown();
    $(".current-file").data("save", false).html("Untitled");
}

function checkUpdate() {
    
    $.ajax({
        type:"GET",
        url:"https://raw.githubusercontent.com/IndieInn/Miu/master/latest_version.json",
        dataType:"json",
        success:function(msg) {

            if(msg.version != version) $('.confirm').html('检测到新版本')
            

            
        }
    });
}

function github() {

    var $gist_name = $(".current-file").html() ? $(".current-file").html() :"Miu.txt";
    if ($gist_name == "Miu") $gist_name += ".md";
    var $gist_content = $('.editor').ghostDown('getMarkdown');
    var notie = "Share an emtpy gist is not welcome by Miu";
    if (lang == "cn") notie = "提交内容为空的文档会浪费 Github 的资源"; else if (lang == "jp") notie = "提出空のドキュメントは、Githubのリソースの無駄になります";
    if ($gist_content == "") {
        swal({
            title:"Error!",
            type:"error",
            text:notie,
            timer:2e3
        });
        return false;
    } else {
        var oldTitle = $(".current-file").html();
        $(".current-file").html('<div class="wobblebar">Loading...div>');
    }
    //var files = '"files":{"'+gist_name+'":{"content":'+'"'+gist_content+'"}}';
    var gist = {};
    gist[$gist_name] = {
        content:$gist_content
    };
    var dataObject = {
        description:"Created by Miu https://miu.0x142857.com",
        "public":true,
        files:gist
    };
    var token = simpleStorage.get("github_token");
    var header = token ? {
        Authorization:"token " + token
    } :"";
    $.ajax({
        type:"POST",
        headers:header,
        url:"https://api.github.com/gists",
        dataType:"json",
        data:JSON.stringify(dataObject),
        success:function(msg) {
            $(".current-file").html(oldTitle);
            var username = token ? msg.owner.login :"Miu 用户";
            var success_notie = "Your gist is being published to Github successfully";
            if (lang == "cn") success_notie = "你的 Gist 已经发布到 Github"; else if (lang == "jp") success_notie = "あなたの要旨は正常にGithubのに公開されている";
            swal({
                title:"Success!",
                text:"Hi, " + username + " " + success_notie + " <code>ID: " + msg.id + "</code>",
                type:"success",
                showCancelButton:true,
                confirmButtonColor:"#DD6B55",
                confirmButtonText:lang == "en" ? "Visit" :lang == "cn" ? "访问" :"訪問",
                cancelButtonText:lang == "en" ? "Return" :lang == "cn" ? "返回" :"リターン",
                closeOnConfirm:false,
                closeOnCancel:true
            }, function(isConfirm) {
                if (isConfirm) {
                    if (token) {
                        gui.Shell.openExternal("https://gist.github.com/" + username + "/" + msg.id);
                    } else {
                        gui.Shell.openExternal("https://gist.github.com/anonymous/" + msg.id);
                    }
                }
            });
        }
    });
}

function home() {
    return gui.Shell.openExternal("https://miu.0x142857.com");
}

var settings = new Object();

settings.preview = simpleStorage.get("preview") ? simpleStorage.get("preview") :"Github2.css";

settings.mode = simpleStorage.get("mode");

if (settings.mode == "colorful") {
    $(".header").addClass("colorful-header");
    $("#colorful-check").attr("checked", "checked");
}

var css_link = $("<link>", {
    rel:"stylesheet",
    type:"text/css",
    href:"themes/preview/" + settings.preview
});

css_link.appendTo("head");

$(function() {
    tray.on("click", function() {
        if (!self.show) {
            self.show = true;
            win.show();
            return win.focus();
        }
    });
    gui.App.registerGlobalHotKey(shortcut);
    // If register |shortcut| successfully and user struck "Ctrl+Shift+A", |shortcut|
    // will get an "active" event.
    // You can also add listener to shortcut's active and failed event.
    shortcut.on("active", function() {
        if (!self.show) {
            self.show = true;
            win.show();
            return win.focus();
        }
        self.show = false;
        return win.hide();
    });
    shortcut.on("failed", function(msg) {
        console.log(msg);
    });
    $(".editor").ghostDown();
    $("#original-file").html("");
    $(".editor").ghostDown("destroy");
    $(".editor").ghostDown();
    $("#settings-trigger").on("click", function() {
        if (isMenu === false) {
            isMenu = true;
            $(".wrap").animate({
                left:"260px"
            });
            $(".settings").css("left", "0");
            $(".settings").css("box-shadow", "0px 2px 10px #333");
            setTimeout(function() {
                $("#settings-trigger").animate({
                    left:"-11px"
                });
            }, 600);
        } else if (isMenu === true) {
            isMenu = false;
            $(".settings").css("left", "-260px");
            $(".wrap").animate({
                left:"0"
            }, "normal");
            $(".settings").css("box-shadow", "none");
            setTimeout(function() {
                $("#settings-trigger").animate({
                    left:"3px"
                });
            }, 600);
        }
    });
    $("#github-trigger").click(function() {
        swal({
            title:lang == "en" ? "Share your love to" :lang == "cn" ? "发送你的爱意到" :"にあなたの愛を共有する",
            text:"<a href='#' id='github'><span class='icon-github'></span></a>",
            imageUrl:"resource/img/plane.png",
            allowOutsideClick:true,
            confirmButtonColor:"#DD6B55",
            confirmButtonText:lang == "en" ? "Send" :lang == "cn" ? "发送" :"送る",
            cancelButtonText:lang == "en" ? "Return" :lang == "cn" ? "返回" :"リターン",
            closeOnConfirm:false,
            closeOnCancel:false
        }, function(isConfirm) {
            if (isConfirm) {
                github();
            }
        });
    });
    $("#about-trigger").click(function() {
       
        
        swal({
            title:"Miu Ange",
            text:"<p>Version "+version+"</p>Markdown Editor for Windows",
            imageUrl:"https://miu.0x142857.com/img/miu.png",
            showCancelButton:true,
            allowOutsideClick:true,
            confirmButtonColor:"#DD6B55",
            confirmButtonText:'已经是最新版',
            cancelButtonText:lang == "en" ? "Close" :lang == "cn" ? "关闭" :"閉じる",
            closeOnConfirm:false,
            closeOnCancel:true
        }, function(isConfirm) {
            if (isConfirm) {
                home();
            }
        });
    });
    $(".current-file").click(function() {
        $(this).attr("contentEditable", true).css("cursor", "text").focus();
    });
    $(".current-file").on("blur", function() {
        $(this).attr("contentEditable", false).css("cursor", "pointer");
        //$('#savenew_file').val($(this).html())
        $("#savenew_file").attr("nwsaveas", $(this).html()).attr("accept", "");
        if ($(this).data("save") == true) {
            //已存在的文件重命名
            var new_location = path.dirname($(this).data("location")) + "/" + $(this).html();
            $(this).data("location", new_location);
        }
    });
    $("body").keydown(function(e) {
        if ((e.ctrlKey || e.metaKey) && e.which === 83 && !e.shiftKey) {
            if ($(".current-file").data("save") == true) {
                saveAction();
            } else if ($(".current-file").data("save") == false) {
                $("#savenew_file").click();
            }
        }
        if ((e.ctrlKey || e.metaKey) && e.which === 83 && e.shiftKey) {
            $("#savenew_file").click();
        }
        if ((e.ctrlKey || e.metaKey) && e.which === 79 && !e.shiftKey) {
            $("#open_file").click();
        }
        if ((e.ctrlKey || e.metaKey) && e.which === 78 && !e.shiftKey) {
            new_file();
        }
        if ((e.ctrlKey || e.metaKey) && e.which === 71 && !e.shiftKey) {
            $("#github-trigger").click();
        }
    });
    //
    setTimeout(function() {
        autoSave();
    }, 6e4);
    //}
    $("#open-trigger").click(function() {
        $("#open_file").click();
    });
    $("#save-trigger").click(function() {
        if ($(".current-file").data("save") == false) {
            $("#save_file").click();
        } else if ($(".current-file").data("save") == true) {
            saveAction();
        }
    });
    $("#savenew-trigger").click(function() {
        $("#savenew_file").click();
    });
    $("#new-trigger").click(function() {
        new_file();
    });
    $("#html-trigger").click(function() {
        $("#save_html").click();
    });
    $("#pdf-trigger").click(function() {
        $("#save_pdf").click();
    });
    $("#doc-trigger").click(function() {
        $("#save_doc").click();
    });
    $("#save_file").on("change", function() {
        saveAction();
    });
    $("#savenew_file").on("change", function() {
        savenewAction();
    });
    $("#open_file").on("change", function() {
        openAction();
    });
    $("#save_html").on("change", function() {
        htmlAction();
    });
    $("#save_pdf").on("change", function() {
        pdfAction();
    });
    $("#save_doc").on("change", function() {
        docAction();
    });
    var fileTree = false;
    var toolTree = false;
    $(".features").click(function() {
        $("#file-action").removeClass("file-action-active");
        $(".dropdown").slideUp();
        fileTree = false;
    });
    $("#file-action").on("click", function() {
        if (fileTree === false) {
            //
            toolTree = false;
            $(".topDropdown").hide();
            $(".topAction").removeClass("file-action-active");
            //
            $("#file-action").addClass("file-action-active");
            $(".dropdown").slideDown();
            fileTree = true;
        } else if (fileTree === true) {
            $("#file-action").removeClass("file-action-active");
            $(".dropdown").slideUp();
            fileTree = false;
        }
    });
    $("#tool-action").on("click", function() {
        if (toolTree === false) {
            fileTree = false;
            $(".topDropdown").hide();
            $(".topAction").removeClass("file-action-active");
            $("#tool-action").addClass("file-action-active");
            $(".tool-dropdown").slideDown();
            toolTree = true;
        } else if (toolTree === true) {
            $("#tool-action").removeClass("file-action-active");
            $(".tool-dropdown").slideUp();
            toolTree = false;
        }
    });
    $("#auth_url").on("click", function() {
        $(".github-label-cont").slideDown();
        var new_win = gui.Shell.openExternal("http://miu_oauth.jd-app.com/login");
    });
    $("#css-input").on("change", function() {
        var new_css = path.basename($("#css-input").val());
        simpleStorage.set("preview", new_css);
        $(".notie").html("你的自定义 CSS <" + new_css + "> 将在下次启动时生效").slideDown();
        setTimeout(function() {
            $(".notie").slideUp();
        }, 3e3);
    });
    $("#update-github").click(function() {
        simpleStorage.set("github_token", $("#github-token").val());
        $(".notie").html("你已经以 Github 用身份登录").slideDown();
        setTimeout(function() {
            $(".notie").slideUp();
        }, 3e3);
    });
    //check
    $("#colorful-label").click(function() {
        if ($("#colorful-check").is(":checked") === true) {
            $(".header").addClass("colorful-header");
            simpleStorage.set("mode", "colorful");
        } else if ($("#colorful-check").is(":checked") === false) {
            $(".header").removeClass("colorful-header");
            simpleStorage.set("mode", "light");
        }
    });
    $("#css-label").click(function() {
        if ($(this).data("open") == false) {
            $(this).data("open", true);
            $(this).find("i").css("-webkit-transform", "rotate(90deg)");
            $(".css-label-cont").slideDown();
        } else if ($(this).data("open") == true) {
            $(this).data("open", false);
            $(this).find("i").css("-webkit-transform", "rotate(0deg)");
            $(".css-label-cont").slideUp();
        }
    });
    $("#css-input-trigger").click(function() {
        $("#css-input").click();
    });
    $("#cloud-trigger").click(function() {
        $(".notie").html(lang == "en" ? "What kind of Cloud service do you need?" :lang == "cn" ? "告诉我们你需要什么样的云服务?" :"あなたはクラウドサービスはどのような必要なのですか？");
        $(".notie").slideDown();
        setTimeout(function() {
            $(".notie").slideUp();
        }, 4e3);
    });
});

function saveAction() {
    var toSave = $('.editor').ghostDown('getMarkdown');

    savePath = $("#save_file").val();
    if (!savePath) {
        savePath = $(".current-file").data("location");
    }
    fs.writeFile(savePath, toSave, function(err) {
        if (err) alert(err);
        var oldTitle = $(".current-file").html();
        $(".current-file").animate({
            top:"-44px"
        }, function() {
            $(".current-file").html(lang == "en" ? "Saved" :lang == "cn" ? "已保存" :"已保存");
            $(".current-file").animate({
                top:"50%"
            }, function() {
                setTimeout(function() {
                    $(".current-file").animate({
                        top:"-44px"
                    });
                    setTimeout(function() {
                        var replaceTitle = path.basename(savePath);
                        $(".current-file").html(replaceTitle).data("save", true);
                        $(".current-file").animate({
                            top:"50%"
                        });
                    }, 600);
                }, 1e3);
            });
        });
        console.log("It's saved!" + path.basename(savePath));
        $("#save_file").val();
    });
}

function savenewAction() {
    var toSave = $('.editor').ghostDown('getMarkdown');
    savePath = $("#savenew_file").val();
    var oldTitle = $(".current-file").html();
    fs.writeFile(savePath, toSave, function(err) {
        if (err) alert(err);
        var oldTitle = $(".current-file").html();
        var replaceTitle = path.basename(savePath);
        $(".current-file").animate({
            top:"-44%"
        }, function() {
            $(".current-file").html(lang == "en" ? "Saved as " :(lang == "cn" ? "已另存为 " :"已另存为 ") + replaceTitle);
            $(".current-file").animate({
                top:"50%"
            }, function() {
                setTimeout(function() {
                    $(".current-file").animate({
                        top:"-44px"
                    });
                    setTimeout(function() {
                        $(".current-file").html(oldTitle);
                        $(".current-file").animate({
                            top:"50%"
                        });
                    }, 600);
                }, 1e3);
            });
        });
        console.log("It's saved!");
        $("#savenew_file").val("").attr("nwsaveas", "");
    });
}

function autoSave() {
    if ($(".current-file").data("save") == true) {
        var toSave = $('.editor').ghostDown('getMarkdown');
        savePath = $("#save_file").val();
        if (!savePath) {
            savePath = $(".current-file").data("location");
        }
        fs.writeFile(savePath, toSave, function(err) {
            if (err) alert(err);
          
        });
    }
    setTimeout(function() {
        autoSave();
    }, 60000);
}

function openAction() {
    var mdPath = $("#open_file").val();
    if (mdPath) {
        fs.readFile(mdPath, function(err, data) {
            if (err) throw err;
            replaceNew(data.toString());
            var replaceTitle = path.basename(mdPath);
            $(".current-file").html(replaceTitle).data("save", true).data("location", mdPath);
            $("#open_file").val("");
        });
    }
}

function htmlAction() {
    var toSave = $('.rendered-markdown').html();
    var css = '<link rel="stylesheet" type="text/css" href="http://cdn.staticfile.org/normalize/3.0.1/normalize.min.css"><link rel="stylesheet" type="text/css" href="https://miu.0x142857.com/static/css/html.css">'
    savePath = $("#save_html").val();
    var oldTitle = $(".current-file").html();
    var body = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>'+oldTitle+'</title>'+css+'</head><body><div class="wrap">'+toSave+'</div></body></html>'
    
    $(".current-file").html('<div class="wobblebar">Loading...div>');
    fs.writeFile(savePath, body, function(err) {
        if (err) alert(err);
        var replaceTitle = path.basename(savePath);
       
            
            
            
                   
                    setTimeout(function() {
                        $(".current-file").html(lang == "en" ? "Saved as " :(lang == "cn" ? "已另存为 " :"已另存为 ") + replaceTitle);
                        setTimeout(function(){

                             $(".current-file").animate({
                                top:'-44px'
                             },function(){
                                 $(".current-file").html(oldTitle);
                                 setTimeout(function(){
                                    $(".current-file").animate({
                                        top:'50%'
                                     },1000)
                                 })
                             })
                         },1000)
                       
                        
                    }, 1000);
           
         
       
        console.log("It's saved as HTML!");
        $("#save_html").val("").attr("nwsaveas", "");
    });
}