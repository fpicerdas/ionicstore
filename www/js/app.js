angular.module("cashier_app", ["ngCordova","ionic","ionMdInput","ionic-material","ion-datetime-picker","ionic.rating","utf8-base64","angular-md5","chart.js","pascalprecht.translate","tmh.dynamicLocale","cashier_app.controllers", "cashier_app.services"])
	.run(function($ionicPlatform,$window,$interval,$timeout,$ionicHistory,$ionicPopup,$state,$rootScope){

		$rootScope.appName = "Cashier App" ;
		$rootScope.appLogo = "data/images/header/logo.png" ;
		$rootScope.appVersion = "1.0" ;
		$rootScope.headerShrink = false ;

		$rootScope.liveStatus = "pause" ;
		$ionicPlatform.ready(function(){
			$rootScope.liveStatus = "run" ;
		});
		$ionicPlatform.on("pause",function(){
			$rootScope.liveStatus = "pause" ;
		});
		$ionicPlatform.on("resume",function(){
			$rootScope.liveStatus = "run" ;
		});


		$rootScope.hide_menu_dashboard = false ;
		$rootScope.hide_menu_products = false ;
		$rootScope.hide_menu_product_cart = false ;


		$ionicPlatform.ready(function() {

			localforage.config({
				driver : [localforage.WEBSQL,localforage.INDEXEDDB,localforage.LOCALSTORAGE],
				name : "cashier_app",
				storeName : "cashier_app",
				description : "The offline datastore for Cashier App app"
			});

			if(window.cordova){
				$rootScope.exist_cordova = true ;
			}else{
				$rootScope.exist_cordova = false ;
			}
			//required: cordova plugin add ionic-plugin-keyboard --save
			if(window.cordova && window.cordova.plugins.Keyboard) {
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
				cordova.plugins.Keyboard.disableScroll(true);
			}

			//required: cordova plugin add cordova-plugin-statusbar --save
			if(window.StatusBar) {
				StatusBar.styleDefault();
			}


		});
		$ionicPlatform.registerBackButtonAction(function (e){
			if($ionicHistory.backView()){
				$ionicHistory.goBack();
			}else{
				$state.go("cashier_app.dashboard");
			}
			e.preventDefault();
			return false;
		},101);
	})


	.filter("to_trusted", ["$sce", function($sce){
		return function(text) {
			return $sce.trustAsHtml(text);
		};
	}])

	.filter("trustUrl", function($sce) {
		return function(url) {
			return $sce.trustAsResourceUrl(url);
		};
	})

	.filter("trustJs", ["$sce", function($sce){
		return function(text) {
			return $sce.trustAsJs(text);
		};
	}])

	.filter("strExplode", function() {
		return function($string,$delimiter) {
			if(!$string.length ) return;
			var $_delimiter = $delimiter || "|";
			return $string.split($_delimiter);
		};
	})

	.filter("strDate", function(){
		return function (input) {
			return new Date(input);
		}
	})
	.filter("phpTime", function(){
		return function (input) {
			var timeStamp = parseInt(input) * 1000;
			return timeStamp ;
		}
	})
	.filter("strHTML", ["$sce", function($sce){
		return function(text) {
			return $sce.trustAsHtml(text);
		};
	}])
	.filter("strEscape",function(){
		return window.encodeURIComponent;
	})
	.filter("strUnscape", ["$sce", function($sce) {
		var div = document.createElement("div");
		return function(text) {
			div.innerHTML = text;
			return $sce.trustAsHtml(div.textContent);
		};
	}])

	.filter("stripTags", ["$sce", function($sce){
		return function(text) {
			return text.replace(/(<([^>]+)>)/ig,"");
		};
	}])

	.filter("chartData", function(){
		return function (obj) {
			var new_items = [];
			angular.forEach(obj, function(child) {
				var new_item = [];
				var indeks = 0;
				angular.forEach(child, function(v){
						if ((indeks !== 0) && (indeks !== 1)){
							new_item.push(v);
						}
						indeks++;
					});
					new_items.push(new_item);
				});
			return new_items;
		}
	})

	.filter("chartLabels", function(){
		return function (obj){
			var new_item = [];
			angular.forEach(obj, function(child) {
			var indeks = 0;
			new_item = [];
			angular.forEach(child, function(v,l) {
				if ((indeks !== 0) && (indeks !== 1)) {
					new_item.push(l);
				}
				indeks++;
			});
			});
			return new_item;
		}
	})
	.filter("chartSeries", function(){
		return function (obj) {
			var new_items = [];
			angular.forEach(obj, function(child) {
				var new_item = [];
				var indeks = 0;
				angular.forEach(child, function(v){
						if (indeks === 1){
							new_item.push(v);
						}
						indeks++;
					});
					new_items.push(new_item);
				});
			return new_items;
		}
	})



.config(["$translateProvider", function ($translateProvider){
	$translateProvider.preferredLanguage("en-us");
	$translateProvider.useStaticFilesLoader({
		prefix: "translations/",
		suffix: ".json"
	});
	$translateProvider.useSanitizeValueStrategy("escapeParameters");
}])


.config(function(tmhDynamicLocaleProvider){
	tmhDynamicLocaleProvider.localeLocationPattern("lib/ionic/js/i18n/angular-locale_{{locale}}.js");
	tmhDynamicLocaleProvider.defaultLocale("en-us");
})



.config(function($stateProvider,$urlRouterProvider,$sceDelegateProvider,$ionicConfigProvider,$httpProvider){
	/** tabs position **/
	$ionicConfigProvider.tabs.position("bottom"); 
	try{
	// Domain Whitelist
		$sceDelegateProvider.resourceUrlWhitelist([
			"self",
			new RegExp('^(http[s]?):\/\/(w{3}.)?youtube\.com/.+$'),
			new RegExp('^(http[s]?):\/\/(w{3}.)?w3schools\.com/.+$'),
		]);
	}catch(err){
		console.log("%cerror: %cdomain whitelist","color:blue;font-size:16px;","color:red;font-size:16px;");
	}
	$stateProvider
	.state("cashier_app",{
		url: "/cashier_app",
		abstract: true,
		templateUrl: "templates/cashier_app-tabs.html",
	})

	.state("cashier_app.about_us", {
		url: "/about_us",
		views: {
			"cashier_app-about_us" : {
						templateUrl:"templates/cashier_app-about_us.html",
						controller: "about_usCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("cashier_app.bookmarks", {
		url: "/bookmarks",
		views: {
			"cashier_app-bookmarks" : {
						templateUrl:"templates/cashier_app-bookmarks.html",
						controller: "bookmarksCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("cashier_app.categories", {
		url: "/categories",
		cache:false,
		views: {
			"cashier_app-categories" : {
						templateUrl:"templates/cashier_app-categories.html",
						controller: "categoriesCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("cashier_app.dashboard", {
		url: "/dashboard",
		cache:false,
		views: {
			"cashier_app-dashboard" : {
						templateUrl:"templates/cashier_app-dashboard.html",
						controller: "dashboardCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("cashier_app.faqs", {
		url: "/faqs",
		views: {
			"cashier_app-faqs" : {
						templateUrl:"templates/cashier_app-faqs.html",
						controller: "faqsCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("cashier_app.menu_one", {
		url: "/menu_one",
		views: {
			"cashier_app-menu_one" : {
						templateUrl:"templates/cashier_app-menu_one.html",
						controller: "menu_oneCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("cashier_app.menu_two", {
		url: "/menu_two",
		views: {
			"cashier_app-menu_two" : {
						templateUrl:"templates/cashier_app-menu_two.html",
						controller: "menu_twoCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("cashier_app.product_cart", {
		url: "/product_cart",
		cache:false,
		views: {
			"cashier_app-product_cart" : {
						templateUrl:"templates/cashier_app-product_cart.html",
						controller: "product_cartCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("cashier_app.product_checkout", {
		url: "/product_checkout",
		views: {
			"cashier_app-product_checkout" : {
						templateUrl:"templates/cashier_app-product_checkout.html",
						controller: "product_checkoutCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("cashier_app.product_singles", {
		url: "/product_singles/:id",
		cache:false,
		views: {
			"cashier_app-products" : {
						templateUrl:"templates/cashier_app-product_singles.html",
						controller: "product_singlesCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("cashier_app.products", {
		url: "/products/:categories",
		cache:false,
		views: {
			"cashier_app-products" : {
						templateUrl:"templates/cashier_app-products.html",
						controller: "productsCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("cashier_app.slide_tab_menu", {
		url: "/slide_tab_menu",
		views: {
			"cashier_app-slide_tab_menu" : {
						templateUrl:"templates/cashier_app-slide_tab_menu.html",
						controller: "slide_tab_menuCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	$urlRouterProvider.otherwise("/cashier_app/dashboard");
});
