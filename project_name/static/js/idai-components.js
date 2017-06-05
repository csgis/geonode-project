'use strict';

var COMPONENTS_GERMAN_LANG = 'de';
var COMPONENTS_ENGLISH_LANG = 'en';

angular.module('idai.components',[]);


'use strict';

angular.module('idai.components')
.factory('countries', ['$http', 'language', '$q',
		function($http, language, $q) {

			var deferred = $q.defer();

			var translationLang=COMPONENTS_ENGLISH_LANG;
			var countries = null;
			if (language.currentLanguage()==COMPONENTS_GERMAN_LANG) translationLang=COMPONENTS_GERMAN_LANG;

			//TODO load countries.json from inside components-module
	        $http.get('info/countries.json').then(function (response) {
	            countries = [];
	            response.data.forEach(function(ctry){
	            	countries.push({
		            	name: ctry['name_' + translationLang],
		            	iso_2: ctry['iso_2']
	            	});
	            });
	            deferred.resolve(countries);
	        });

		    var factory = {};

		    factory.getCountriesAsync = function() {
		        return deferred.promise;
		    };

		    factory.getCountries = function() {
		        return countries;
		    };

		    return factory;
		}
	]);

'use strict';

angular.module('idai.components')


.directive('idaiCountryPicker', function() {
    return {
        restrict: 'E',
        templateUrl: 'forms/idai-country-picker.html',
        scope: {
            model: '='
        },
        controller: [ '$scope', 'countries',
            function($scope, countries) {
                countries.getCountriesAsync().then(function (countries) {
                	$scope.countries = countries;
                });
            }]
    }});
'use strict';

angular.module('idai.components')

/** 
 * @author: Sebastian Cuy
 */

 .directive('idaiPicker', function() {
	return {
		restrict: 'E',
		scope: {
			searchUri: '@',	resultField: '@', titleField: '@',
			totalField: '@', queryParam: '@', limitParam: '@',
			offsetParam: '@', addParams: '=', selectedItem: '='
		},
		templateUrl: 'forms/idai-picker.html',
		controller: [ '$scope', '$parse', '$uibModal',
			function($scope, $parse, $modal) {

				$scope.openModal = function() {
					var modal = $modal.open({
						templateUrl: "picker_modal.html",
						controller: "PickerModalController",
						bindToController: true,
						size: 'lg',
						scope: $scope
					});
					modal.result.then(function(item) {
						$scope.selectedItem = item;
					});
				};

				$scope.$watch("titleField", function(titleField) {
					if (!titleField) titleField = "title";
					$scope.getTitleField = $parse(titleField);
				});

			}
		]
	}
});

'use strict';

angular.module('idai.components')


/**
 * @author Patrick Jominet
 * @author Jan Wieners
 * @author Daniel de Oliveira
 */
.component('idaiSearch', {
    restrict: 'E',
    templateUrl: 'forms/idai-search.html',
    bindings: {
        buttonClass: '@'
    },
    controller: [ '$scope', '$location', 'componentsSettings', '$http','idaiSearchService',
        function($scope,$location,componentsSettings,$http,idaiSearchService) {

            var NUM_SEARCHES_TO_KEEP = 3;
            var localStorageKey='previousSearchQueries';
            $scope.placeholder = undefined;

            $scope.buttonClass = 'btn-primary';
            if (this.buttonClass) {
                $scope.buttonClass = this.buttonClass;
            }

            idaiSearchService.register(function(term) {
                $scope.placeholder = term;
            }.bind(this));

            $scope.$on('$locationChangeStart', function (event,next) {
                if (next.indexOf('search')==-1) idaiSearchService.notify(undefined)
                $scope.q = $location.search().q
            });

            

            $scope.search = function ($item) {
                var searchTerm;
                if ($item) {
                    searchTerm = '"' + $item.model + '"';
                } else {
                    searchTerm = $scope.q;
                }
                memorizeSearch(searchTerm,NUM_SEARCHES_TO_KEEP);

                $scope.q = searchTerm;

                if (!searchTerm) searchTerm = "";
                $location.url('/search?q=' + searchTerm);

                idaiSearchService.notify(searchTerm);
            };

            $scope.selectQueryString = function (event) {
                event.target.select();
            }


            $scope.getSuggestions = function (value) {
                if (!componentsSettings.searchUri) return;

                return $http.get(componentsSettings.searchUri + value)
                    .then(function (response) {
                        if (!response.data.suggestions) return [];

                        var suggestions=
                            response.data.suggestions.map(function(e){return {model:e}});
                        if (!suggestions) return [];
                        enrichWithOldQueries(suggestions);
                        return suggestions;
                    });
            };

            function enrichWithOldQueries(suggestions) {
                var queries = JSON.parse(localStorage.getItem(localStorageKey));
                if (queries) {
                    queries.reverse();
                    queries.forEach(function(term){
                        suggestions.push({model:term,extra:true})
                    });
                }
            }

            function memorizeSearch(searchTerm,searchesToKeep) {

                var queries = JSON.parse(localStorage.getItem(localStorageKey));

                if (queries === null || !queries) {
                    queries = [searchTerm];
                } else {

                    queries.push(searchTerm);

                    // Make unique
                    queries = queries.filter(function(item, pos) {
                        return queries.indexOf(item) == pos;
                    });

                    if (queries.length > searchesToKeep +1) {
                        queries.shift();
                    }
                }
                localStorage.setItem(localStorageKey, JSON.stringify(queries));
            }
        }
    ]
});
'use strict';

angular.module('idai.components')

    .factory('idaiSearchService',
            function() {

                var subscribers=[];

                return {

                    register: function(callback) {
                        subscribers.push(callback);
                    },

                    notify: function(term) {
                        for (var i in subscribers) {
                            subscribers[i](term);
                        }
                    }
                }
            }
    );
'use strict';

angular.module('idai.components')
    
/**
 * @author: Sebastian Cuy
 */
.controller('PickerModalController', [ '$scope', '$http', '$q', '$parse', '$uibModalInstance',
    function($scope, $http, $q, $parse, $modalInstance) {

        var canceler;

        $scope.result;
        $scope.total = 0;
        $scope.offset = 0;
        $scope.limit = 10;
        $scope.loading = false;
        $scope.preselect = 0;

        var search = function() {
            if (canceler) canceler.resolve();
            if ($scope.query) {
                $scope.loading = true;
                canceler = $q.defer();
                if (!$scope.queryParam) $scope.queryParam = "q";
                if (!$scope.limitParam) $scope.limitParam = "limit";
                if (!$scope.offsetParam) $scope.offsetParam = "offset";
                var requestUri = $scope.searchUri + "?" + $scope.queryParam + "=" + $scope.query;
                requestUri += "&" + $scope.limitParam + "=" + $scope.limit;
                requestUri += "&" + $scope.offsetParam + "=" + $scope.offset;
                if ($scope.addParams) {
                    angular.forEach($scope.addParams, function(value, key) {
                        requestUri += "&" + key + "=" + value;
                    });
                }
                $http.get(requestUri, { timeout: canceler.promise }).then(function(response) {
                    if (!$scope.resultField) $scope.resultField = "result";
                    var getResultField = $parse($scope.resultField);
                    if ($scope.offset == 0) {
                        $scope.result = getResultField(response.data);
                    } else {
                        $scope.result = $scope.result.concat(getResultField(response.data));
                    }
                    if (!$scope.totalField) $scope.totalField = "total";
                    var getTotalField = $parse($scope.totalField);
                    $scope.total = getTotalField(response.data);
                    $scope.loading = false;
                });
            } else {
                $scope.result = [];
                $scope.total = 0;
            }
        };

        $scope.more = function() {
            $scope.offset += $scope.limit;
            search();
        };

        $scope.keydown = function($event) {
            // arrow down preselects next item
            if ($event.keyCode == 40 && $scope.preselect < $scope.result.length - 1) {
                $scope.preselect++;
                // arrow up select precious item
            } else if ($event.keyCode == 38 && $scope.preselect > 0) {
                $scope.preselect--;
            }
        };

        $scope.keypress = function($event) {
            // enter selects preselected item (if query has not changed)
            if ($event.keyCode == 13) {
                if ($scope.total > 0 && $scope.query == $scope.lastQuery) {
                    $event.stopPropagation();
                    $scope.selectItem($scope.result[$scope.preselect]);
                } else {
                    $scope.newQuery();
                }
            }
        };

        $scope.newQuery = function() {
            $scope.lastQuery = $scope.query;
            $scope.offset = 0;
            search();
        };

        $scope.open = function(uri) {
            window.open(uri, '_blank');
        };

        $scope.selectItem = function(item) {
            $modalInstance.close(item);
        };

        $scope.$watch("titleField", function(titleField) {
            if (!titleField) titleField = "title";
            $scope.getTitleField = $parse(titleField);
        });

    }
]);

'use strict';

angular.module('idai.components')

/**
 * Given a language, determines by a
 * rule if this language is applicable or if not which
 * other language is applicable in a given context.
 * Once found a suitable language, an operation to
 * apply that language in the clients context gets performed.
 *
 * @author: Daniel de Oliveira
 */
    .factory('languageSelection', ['language', function (language) {

        return {

            /**
             * The language selection rule.
             *
             * @param isLangApplicable - callback function(lang,param) for testing
             *   if lang is applicable in the clients context
             * @param applyLang - callback function(lang_,param) for applying
             *   lang in the clients context
             * @param param - used as second param for the callbacks
             */
            __: function (isLangApplicable, applyLang, param) {

                var lang = localStorage.getItem('lang');

                if (lang) {

                    if (lang === COMPONENTS_GERMAN_LANG || lang === COMPONENTS_ENGLISH_LANG) {
                        applyLang(lang, param);
                        return;
                    }
                }

                if (language.currentLanguage() == COMPONENTS_GERMAN_LANG) {
                    applyLang(COMPONENTS_GERMAN_LANG, param);
                    return;
                }

                if (isLangApplicable(language.currentLanguage(), param)) {
                    applyLang(language.currentLanguage(), param);
                } else if (language.currentLanguage() == COMPONENTS_ENGLISH_LANG) {
                    applyLang(COMPONENTS_GERMAN_LANG, param);
                } else if (isLangApplicable(COMPONENTS_ENGLISH_LANG, param))
                    applyLang(COMPONENTS_ENGLISH_LANG, param);
                else
                    applyLang(COMPONENTS_GERMAN_LANG, param);
            }
        }
    }]);

'use strict';

angular.module('idai.components')

/**
 * @return: the users primary browser language.
 * For german languages (de-*) it shortens the language code to "de".
 * For english languages (en-*) it returns the language code to "en".
 *
 * @author: Daniel de Oliveira
 */
.factory('language', function(){

	var lang=navigator.languages ?
		navigator.languages[0] :
		(navigator.language || navigator.userLanguage);

	return {
		originalBrowserLanguage : function(){
			return lang;
		},
		browserLanguage : function() {
			return this.originalBrowserLanguage().substring(0,2);
		},
		currentLanguage : function(){

            var currentLang = this.browserLanguage();

            // Use user-chosen language settings by using idai-components language-switcher
            var lang = localStorage.getItem('lang');
            if (lang) currentLang = lang;

			return currentLang;
		}
	}
});




'use strict';

/**
 * Perform localization related tasks on 
 * tree structure exemplified by:
 * 
 * node
 *   id: the_id,
 *   title: ( lang_a : title_lang_a, lang_b : title_lang_b ),
 *   children: [ node, node, node ]
 * 
 * @author: Daniel de Oliveira
 */
angular.module('idai.components')

.factory('localizedContent',
	['languageSelection', function(languageSelection) {

	return {

		/**
		 * Walks trough all elements of the tree
		 * and adjusts the titles of nodes to only appear
		 * in one language. 
		 *
		 * The choice is being made for each node independently
		 * of the other nodes via the language selection 
		 * rule, taking into consideration the availability of the 
		 * languages of the node.
		 *
		 * Tree structure before:
		 *
		 * node
		 *   id: the_id,
		 *   title: ( lang_a : title_lang_a, lang_b : title_lang_b ),
		 *   children: [ node, node, node ]
		 *
		 * Tree structure after:
		 *
		 * node
		 *   id: the_id,
		 *   title: title_lang_b,
		 *   children: [ node, node, node ]
		 */
		reduceTitles : function(node){

			var adjustTitleForLang = function(lang,node) {
				if (node.title)
					node.title=node.title[lang];
			};

			var isTitleAvailableForLang = function (lang,node) {
				if (!node.title) return false;
				return node.title[lang];
			};

			var recurseProjectsToAdjustTitle = function(node){

				languageSelection.__(isTitleAvailableForLang,adjustTitleForLang,node);

				if (! node.children) return;
				for (var i=0;i<node.children.length;i++) {
					recurseProjectsToAdjustTitle(node.children[i]);
				}
			};

			recurseProjectsToAdjustTitle(node);
		},

		/**
		 * Walks through all elements of the tree and 
		 * determines which language for a node of 
		 * a given title is applicable. 
		 * 
		 * The choice is beeing made via the language selection 
		 * rule, taking into consideration the availability of the 
		 * languages of the node.
		 *
		 * @param node
		 * @param title
		 */
		determineLanguage : function (node,title) {

			var ret_language = '';

			/**
			 * Searches recursively through an object tree and
			 * determines if there is a node whose title matches
			 * *title* and which has a title for lang.
			 *
			 * Abstract tree structure:
			 * node
			 *   id: the_id,
			 *   title: ( lang_a : title, lang_b : title ),
			 *   children: [ node, node, node ]
			 *
			 * @param lang
			 * @param node the root of the object tree.
			 * @returns true if there is at least one item
			 *   meeting the above mentioned condition. false
			 *   otherwise.
			 */
			var isNodeAvailableForLang = function(lang,node) {
				var recursive = function(node){
					if (node.id==title&&node.title[lang]) return true;
					if (node.children)
						for (var i=0; i< node.children.length;i++)
							if (recursive(node.children[i])) return true;
					return false;
				};
				if (recursive(node)) return true;
				return false;
			};

			var setLang = function(lang) {
				ret_language = lang;
			};

			languageSelection.__ (isNodeAvailableForLang,setLang,node);
			return ret_language;
		},
		
		/**
		 * Walks through the elements of the tree 
		 * until it finds a node of the given id.
		 * 
		 * @return reference to the first node 
		 *   found whose id matches param id. 
		 *   undefined if no node could for the id
		 *   could be found.
		 */
		getNodeById : function (node,id) {
			
			var recurse = function(node,id){
				if (node.id==id) return node;
				if (! node.children) return undefined;
				var foundNode=undefined;
				for (var i=0;i<node.children.length;i++){
					var retval=recurse(node.children[i],id);
					if (retval!=undefined) foundNode=retval;
				}
				return foundNode;
					
			};
			return recurse(node,id);
		}
	};
}]);

'use strict';

/* Services */
angular.module('idai.components')

/**
 * @author: Daniel de Oliveira
 */
    .filter('transl8Number', ['language',function(language){

        var filterFunction = function(nu) {

            if (typeof nu == 'undefined') return undefined;

            if (language.currentLanguage()==COMPONENTS_GERMAN_LANG) {
                return nu.toLocaleString(COMPONENTS_GERMAN_LANG+"-DE");
            } else {
                return nu.toLocaleString(COMPONENTS_ENGLISH_LANG+"-US");
            }
        };
        filterFunction.$stateful=true;
        return filterFunction;
    }]);
'use strict';

/* Services */
angular.module('idai.components')

/**
 * @author: Daniel de Oliveira
 */
.filter('transl8', ['transl8',function(transl8){
	
	var filterFunction = function(key) {
        if (typeof key == 'undefined') return undefined;
        var trans;
        try {
            trans = transl8.getTranslation(key);
        } catch (err) {
            var msg = "TRL8 MISSING ('"+key+"')";
            console.log(msg);
            return msg;
        }
		return trans;
	};
	filterFunction.$stateful=true;
	return filterFunction;
}]);
'use strict';

/**
 * Provides translations for keys based on the primary browser language of the user.
 * Makes use of the CoDArchLab Transl8 tool.
 *
 * @author: Daniel de Oliveira
 * @author: Jan G. Wieners
 */
angular.module('idai.components')
    .factory('transl8', ['$http', '$location', 'language', 'componentsSettings',
        function ($http, $location, language, componentsSettings) {

            var lang = language.currentLanguage(),
                translationsLoaded = false,
                translations = {}; // Map: [transl8_key,translation].
                
            if (['de', 'en'].indexOf(lang) === -1) lang = 'en';

            var transl8Url = componentsSettings.transl8Uri.replace('{LANG}', lang);

            var promise = $http.jsonp(transl8Url).success(function (data) {
                for (var i = 0; i < data.length; i++) {
                    translations[data[i].key] = data[i].value;
                }
                translationsLoaded = true;
            }).error(function () {
                alert("ERROR: Could not get translations. Try to reload the page or send a mail to arachne@uni-koeln.de");
            });

            return {

                /**
                 * @param key an existing key in transl8 with
                 *   translations for all existing language sets.
                 * @returns translation text
                 * @throws Error if the key does not exist in transl8 or
                 *   there is no translation for the given key.
                 */
                getTranslation: function (key) {
                    if (!translationsLoaded) return '';

                    var translation = translations[key];
                    if (!translation || 0 === translation.length) {
                        throw new Error("No translation found for key '" + key + "'");
                    }
                    return translation;
                },

                onLoaded: function () {
                    return promise;
                }

            }
        }
    ]);
'use strict';

angular.module('idai.components')

    /**
     * @author: Jan G. Wieners
     */
    .factory('header', function () {

    });
'use strict';

angular.module('idai.components')


/**
 * @author: Daniel de Oliveira
 * @author: Jan G. Wieners
 */

    .directive('idaiFooter', function () {
        return {
            restrict: 'E',
            scope: {
                institutions: '=',
                version: '@'
            },
            transclude: true,
            templateUrl: 'layout/idai-footer.html',
            controller: ['$scope', '$http', '$sce', 'localizedContent', '$transclude', 'componentsSettings',
                function ($scope, $http, $sce, localizedContent, $transclude,componentsSettings) {

                    $scope.mailto = componentsSettings.mailTo;
                    
                    $transclude(function(clone){
                        $scope.hasTranscludedContent = (clone.length > 0);
                    });

                    $scope.date = new Date();
                    $scope.getFooterLinks = function (contentDir) {

                        var contentInfo = 'info/content.json';

                        $http.get(contentInfo).then(function (success) {

                            var footerLinks = localizedContent.getNodeById(success.data, 'footer');

                            if (!footerLinks) {
                                console.error('error: no footer links found in file ' + contentInfo);
                            } else {
                                localizedContent.reduceTitles(footerLinks);
                                $scope.dynamicLinkList = footerLinks.children;
                            }
                        }, function(error) {
                            console.error(error.data);
                        });
                    }
                }],
            link: function (scope, element, attrs) {

                scope.getFooterLinks(attrs.contentDir);
            }
        }
    });
'use strict';

angular.module('idai.components')

/** 
 * @author: Sebastian Cuy
 */

 .directive('idaiForm', function() {
	return {
		restrict: 'E',
        transclude: true,
		scope: {
			submit: '&', doc: '='
		},
		templateUrl: 'layout/idai-form.html',
		link: function(scope, elem, attrs) {

			scope.reset = function() {
				scope.doc = {};
			};

		}
	}
});

'use strict';

angular.module('idai.components')

    /**
     * @author: Jan G. Wieners
     */
    .directive('idaiHeader', function () {
        return {
            restrict: 'E',
            //replace: 'true',
            scope: {
                image: '@',
                description: '@',
                link: '@'
            },
            templateUrl: 'layout/idai-header.html'
        }
    });
'use strict';

/* Directives */
angular.module('idai.components')


/**
 * @author: Daniel de Oliveira
 * @author: Jan G. Wieners
 */

	.directive('idaiNavbar', function() {
		return {
			restrict: 'E',
			scope: {
				userObject: '=',
				loginFunction: '&',
				logoutFunction: '&',
				hideSearchForm: '=',
				hideRegisterButton: '=', // set "true" to hide it
				hideContactButton: '=', // set "true" to hide it
				hideLanguageSwitcher: '=', // set "true" to hide it
				projectId: '@'
			},
			templateUrl: 'layout/idai-navbar.html',
			transclude: true,
			controller: [ '$scope', '$http', 'localizedContent', '$location', '$window',
				function($scope, $http, localizedContent, $location, $window) {

					$scope.langCode = localStorage.getItem('lang');

					$scope.getNavbarLinks = function(contentDir){

                        var contentInfo = 'info/content.json';

						$http.get(contentInfo).then(function(success){

							var navbarLinks = localizedContent.getNodeById(success.data,'navbar');

							if (!navbarLinks) {
								console.error('error: no navbar links found in file ' + contentInfo);
							} else {
                                localizedContent.reduceTitles(navbarLinks);
                                $scope.dynamicLinkList = navbarLinks.children;
							}
						}, function(error) {
							console.error(error.data)
						});
					};

					$scope.toggleNavbar = function() {

							$scope.isCollapsed = true;
							$scope.$on('$routeChangeSuccess', function () {
								$scope.isCollapsed = true;
							});
					};

					$scope.switchLanguage = function(lang) {
						localStorage.setItem('lang', lang);
                        $window.location.reload();
					};

				}],
			link: function(scope,element,attrs){
				scope.getNavbarLinks(attrs.contentDir);
			}
		}});
'use strict';

/* Directives */
angular.module('idai.components')


/**
 * @author: Daniel de Oliveira
 */

.directive('includeReplace', function () {
    return {
       	require: 'ngInclude',
       	restrict: 'A', /* optional */
       	link: function (scope, el, attrs) {
           	el.replaceWith(el.children());
       	}  
	}});
'use strict';

angular.module('idai.components')


/**
 * @author: Daniel de Oliveira
 */
.component('idaiMessages', {
        restrict: 'E',
        templateUrl: 'messages/idai-messages.html',
        controller: [ '$scope', 'messageService',
            function($scope,messages) {

                $scope.messages = messages.all();

                $scope.remove = function(transl8Key){
                    messages.remove(transl8Key)
                };

            }]
    }
);
'use strict';

/**
 * Message store which holds one or more messages
 * for the purpose of being displayed to the user.
 *
 * Messages are automatically removed on location changes,
 * though this default behavior can be overridden. Messages
 * also can be removed selectively.
 *
 * The message access is based on
 * transl8keys, which are also used to automatically
 * retrieve the message texts via transl8.
 *
 * <b>Note</b> that the basic assumption here is that the
 * iDAI transl8 service tool is up and running and the translations have
 * been fetched when calling methods of the message service.
 * The assumption is made because we say that if the transl8 service is
 * down you cannot navigate anyway so you will not try to perform actions
 * that require communication with users, which is the purpose of this service.
 *
 * Another assumption is that a transl8Key used to add a message exists and
 * that the developer is responsible for creating it prior to using it. For this
 * reason exceptions get thrown if unknown transl8Keys are used.
 *
 * @author Sebastian Cuy
 * @author Daniel de Oliveira
 */
angular.module('idai.components')

.factory('messageService',
    [ '$rootScope', 'transl8', '$sce', 'componentsSettings',
        function( $rootScope, transl8, $sce, componentsSettings ) {

    /**
     * A Map [transl8Key,message].
     */
    var messages = {};

    var clearOnLocationChange = true;


    /**
     * The message data structure.
     * @param transl8Key
     */
    function Message(transl8Key) {
        this.text = transl8.getTranslation(transl8Key);
        this.text = $sce.trustAsHtml(this.text);
        this.level = 'warning';
        this.contactInfo = transl8.getTranslation('components.message.contact')
            .replace('CONTACT', componentsSettings.mailTo);
        
    }

    function isUnknown(level){
        return (['success', 'info', 'warning', 'danger'].indexOf(level) === -1);
    }

    /**
     * Clears all the actual messages.
     * @private
     */
    function _clear() {
        angular.forEach(messages, function(msg, key) {
            delete messages[key];
        });
    }

    /**
     * Creates a new message and adds it to the actual messages.
     * @param transl8Key
     * @returns {*}
     * @private
     */
    function _create(transl8Key) {
        messages[transl8Key]=  new Message(transl8Key);
        return messages[transl8Key];
    }


    /**
     * Clear actual messages when location changes.
     */
    $rootScope.$on("$locationChangeSuccess", function() {
        if (clearOnLocationChange) _clear();
        clearOnLocationChange= true;
    });

    // In case transl8 loaded after(!) messages were already added
    transl8.onLoaded().then(function(){
        angular.forEach(messages, function(msg, key) {
            msg.text = transl8.getTranslation(key);
            msg.text = $sce.trustAsHtml(msg.text);
        });
    });

    return {

        /**
         * Allows clients to specify that the messages are not cleared
         * during the next location change, which would be the default behavior
         * of the message service.
         *
         * NOTE that in order for this to work the angular $location.path()
         * has to be used. It will not work with window.location.href because
         * then everything gets reloaded, including the default
         * value for clearOnLocationChange.
         */
        dontClearOnNextLocationChange: function() {
            clearOnLocationChange= false;
        },

        /**
         * Adds a message to the actual messages. By default, an extra line
         * is appended below the message containing a standard contact info text.
         * This info text will not appear if level is success.
         *
         * @param transl8Key an existing transl8 key.
         *   Used to identify the message and retrieve the message text from transl8.
         * @param level (optional) should be set to one of
         *   'success', 'info', 'warning', 'danger', which are terms from bootstrap.
         *   If not set, the messages level will default to 'warning'.
         * @param showContactInfo boolean. If set and set to false the contact info
         *   line will not be created.
         *
         * @throws Error if level if set but does not match one of the allowed values.
         * @throws Error if there exists no translation for transl8Key.
         */
        add: function(transl8Key, level, showContactInfo) {

            var message = _create(transl8Key);
            if (level) {
                if (isUnknown(level))
                    throw new Error("If used, level must be set to an allowed value.");
                message.level = level;
            }

            if (showContactInfo==false||message.level=='success')
                delete message.contactInfo;
        },

        /**
         * Removes an error message from the actual messages.
         *
         * @param transl8Key the identifier of the message to be removed.
         */
        remove: function(transl8Key) {
            delete messages[transl8Key];
        },


        /**
         * Removes all messages.
         */
        clear: function() {
            _clear();
        },

        all: function() {
            return messages;
        }
    }
}]);