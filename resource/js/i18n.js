var app = angular.module('Miu', ['pascalprecht.translate']);


app.config(['$translateProvider', function ($translateProvider) {
  $translateProvider.useStorage('customStorage');
  $translateProvider.translations('en', {
  	'GLOBAL':{
  		'save': 'Save',
  		'cancel': 'Cancel',
  		'confirm': 'Confirm'
  	},
    'NAV':{
    	'file': {
    		'title': 'File',
    		'option': {
    			'new': 'New',
    			'open': 'Open',
    			'save': 'Save',
    			'saveas': 'Save as',
          'html': 'Export as HTML'
    		}
    	},
    	'about': 'About'
    },
    'SIDEBAR':{
    	'setting': 'Setting',
    	'cloud': {
    		'title': 'Cloud',
    		'temp': 'What kind of cloud service do you need?'
    	},
    	'colorful': 'Colorful',
    	'customcss': 'Custom CSS',
    	'github': 'Connect to github',
    	'preview': {
    		'title': 'Preview style',
    		'content': 'Please choose CSS file under %APP DIR%/theme/preview/'
    	}
    }
  });

 
  $translateProvider.translations('cn', {
  	'GLOBAL':{
  		'save': '保存',
  		'cancel': '取消',
  		'confirm': '确定'
  	},
    'NAV':{
    	'file': {
    		'title': '文件',
    		'option': {
    			'new': '新建',
    			'open': '打开',
    			'save': '保存',
    			'saveas': '另存为',
          'html': '导出为 HTML'
    		}
    	},
    	'about': '关于'
    },
    'SIDEBAR':{
    	'setting': '设置',
    	'cloud': {
    		'title': '云服务',
    		'temp': '告诉我们你需要什么样的云服务'
    	},
    	'colorful': '开启多彩的世界',
    	'customcss': '自定义 CSS',
    	'github': '连接到 Github',
    	'preview': {
    		'title': '预览界面样式',
    		'content': '请选择 %APP DIR%/theme/preview/ 下的 CSS 文件'
    	}
    }
  });

  $translateProvider.translations('jp', {
  	'GLOBAL':{
  		'save': '保存',
  		'cancel': '取り消す',
  		'confirm': '確認する'
  	},
    'NAV':{
    	'file': {
    		'title': 'ファイル',
    		'option': {
    			'new': '新規作成',
    			'open': '開く',
    			'save': '保存',
    			'saveas': '名前を付けて保存',
          'html': '导出为 HTML'
    		}
    	},
    	'about': 'について'
    },
    'SIDEBAR':{
    	'setting': '設定',
    	'cloud': {
    		'title': 'クロウド',
    		'temp': 'あなたはクラウドサービスを必要とするものを教えてください'
    	},
    	'colorful': '虹色表示',
    	'customcss': 'CSSカスタマイズ',
    	'github': 'githubにアクセス',
    	'preview': {
    		'title': 'スタイルプレビュー',
    		'content': '%APP DIR%/theme/preview/ から CSSﾌｧｲﾙを選んでください'
    	}
    }
  });
 
  var lang = simpleStorage.get('language') || 'en';

  $translateProvider.preferredLanguage(lang);
}]);

app.factory('customStorage', function () {
  return {
    set: function (name, value) {
      simpleStorage.set(name,value)
    },
    get: function (name) {
      simpleStorage.get(name)
    }
  };
});

app.controller('langCtrl', ['$translate', '$scope', function ($translate, $scope) {
 
  $scope.changeLanguage = function (langKey) {
    $translate.use(langKey);
    simpleStorage.set('language',langKey);
    win.reload()
  };
}]);
