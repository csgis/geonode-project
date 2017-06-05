(function(module) {
try {
  module = angular.module('idai.templates');
} catch (e) {
  module = angular.module('idai.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('forms/idai-country-picker.html',
    '<select class=form-control ng-model=model><option>- {{\'ui_please_select\'|transl8}} -</option><option ng-repeat="country in countries" value={{country.iso_2}}>{{country.name}}</option></select>');
}]);
})();

(function(module) {
try {
  module = angular.module('idai.templates');
} catch (e) {
  module = angular.module('idai.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('forms/idai-picker.html',
    '<div class=idai-picker><script type=text/ng-template id=picker_modal.html><div class="panel panel-default picker-modal"> <div class="panel-heading"> <form class="input-group"> <input ng-keydown="keydown($event)" ng-keypress="keypress($event)" type="text" ng-model="query" class="form-control" autofocus></input> <span class="input-group-btn"> <button ng-click="newQuery()" class="btn btn-default"> <span class="glyphicon glyphicon-search"></span> </button> </span> </form> </div> <div class="panel-body"> <div ng-if="loading" class="loading"></div> <em ng-show="result && total == 0 && !loading">{{ \'picker_no_result\' | transl8 }}</em> <em ng-show="!result && total == 0 && !loading">{{ \'picker_perform_search\' | transl8 }}</em> <div ng-show="total > 0 && !loading" class="text-center small"> <b><i>{{ total | number }} {{ \'results\' | transl8 }}</i></b> </div> </div> <div class="list-group" style="max-height:470px; overflow-y: auto;"> <a href="#" ng-repeat="item in result" class="list-group-item" ng-click="selectItem(item)" ng-class="{ preselected: $index == preselect }"> <div class="row"> <div ng-class="{ \'col-sm-8\': item[\'@id\'], \'col-sm-12\': !item[\'@id\']}"> <span ng-class="{ invisible: $index != preselect }" class="glyphicon glyphicon-menu-right small"></span> {{ getTitleField(item) }} </div> <div class="col-sm-4 text-right" ng-show="item[\'@id\']"> <button class="btn btn-link btn-xs" ng-click="open(item[\'@id\'])" style="padding:0px 5px 1px; border: 0;"> {{ item[\'@id\'] }} <span class="glyphicon glyphicon-new-window" style="font-size:0.8em"></span> </button> </div> </div> </a> <a ng-show="total > offset + limit" href="#" class="list-group-item text-center" ng-click="more()"> ... </a> </div> </div></script><div class=input-group><span class=input-group-btn><button class="btn btn-default" type=button ng-click=openModal()><span class="glyphicon glyphicon-link"></span></button></span> <span class=form-control><span ng-show=!selectedItem>{{ \'pick_an_item\' | transl8 }}</span> <a ng-show="selectedItem && selectedItem[\'@id\']" ng-href="{{ selectedItem[\'@id\'] }}" target=_blank>{{ getTitleField(selectedItem) }}</a> <span ng-show="selectedItem && !selectedItem[\'@id\']">{{ getTitleField(selectedItem) }}</span> <button class="btn btn-link btn-xs" ng-show=selectedItem ng-click="selectedItem = undefined"><span class="glyphicon glyphicon-remove-sign text-muted"></span></button></span></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('idai.templates');
} catch (e) {
  module = angular.module('idai.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('forms/idai-search.html',
    '<form ng-submit=search() class="idai-search input-group form-inline" role=search method=GET autocomplete=off><input type=text ng-model=q name=q uib-typeahead="suggestion for suggestion in getSuggestions($viewValue)" ng-focus=selectQueryString($event) typeahead-on-select=search($item) typeahead-focus-first=false typeahead-select-on-exact=true class=form-control autofocus typeahead-popup-template-url=customPopupTemplate.html placeholder="{{(\'navbar_placeholder_search\'|transl8)}}"> <span class=input-group-btn><button type=submit class="btn {{buttonClass}}">&nbsp;<span class="glyphicon glyphicon-search"></span>&nbsp;</button></span></form><script type=text/ng-template id=customPopupTemplate.html><div class="custom-popup-wrapper" ng-style="{top: position().top+\'px\', left: position().left+\'px\'}" style="display: table;" ng-show="isOpen() && !moveInProgress" aria-hidden="{{!isOpen()}}"> <ul class="dropdown-menu" role="listbox"> <li class="uib-typeahead-match" ng-repeat="match in matches track by $index" ng-class="{active: isActive($index) }" ng-mouseenter="selectActive($index)" ng-click="selectMatch($index)" role="option" id="{{::match.id}}" ng-show="!match.model.extra"> <div uib-typeahead-match index="$index" match="m.model=match.model.model; m.label=match.model.model; m" query="query" template-url="templateUrl"> </div> </li> <hr> <p>{{\'navbar_old_searches\'|transl8}}</p> <li class="uib-typeahead-match" ng-repeat="match in matches track by $index" ng-mouseenter="selectActive($index)" ng-click="selectMatch($index)" id="x-{{::match.id}}" role="option" ng-class="{active: isActive($index) }" ng-show="match.model.extra"> <div uib-typeahead-match index="$index" match="m.model=match.model.model; m.label=match.model.model; m" query="query" template-url="templateUrl"> </div> </li> </ul> </div></script>');
}]);
})();

(function(module) {
try {
  module = angular.module('idai.templates');
} catch (e) {
  module = angular.module('idai.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('layout/idai-footer.html',
    '<style>\n' +
    '    #footer .row {\n' +
    '        padding-bottom: 10px;\n' +
    '    }\n' +
    '</style><div class=row><div class="col-md-12 text-center"><div class=row><a ng-repeat="(key, uri) in institutions" ng-href={{uri}}><img class=logoImage ng-src=img/logo_{{key}}.png></a></div><div class=row ng-if=hasTranscludedContent ng-transclude></div><div class=row><div ng-if=!hasTranscludedContent style="display: inline-block;">{{\'footer_licensed_under\'|transl8}} <a rel=license href=info/order>Creative Commons</a> |&nbsp;</div><span ng-repeat="link in dynamicLinkList"><a href=info/{{link.id}} class=linkitem>{{link.title}}</a>&nbsp;|&nbsp;</span> {{\'footer_bugs_to\'|transl8}} <a href=mailto:{{mailto}}>{{mailto}}</a></div><div class=row ng-show=version><small>{{version}}</small></div></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('idai.templates');
} catch (e) {
  module = angular.module('idai.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('layout/idai-form.html',
    '<form name=form class=form-horizontal><ng-transclude></ng-transclude><div class=form-group><div class="col-sm-offset-3 col-sm-9"><button ng-click=submit() class="btn btn-primary" ng-class="{ disabled: form.$invalid }">{{ \'form_save\' | transl8 }}</button> <button ng-click=reset() class="btn btn-link">{{ \'form_reset\' | transl8 }}</button></div></div></form>');
}]);
})();

(function(module) {
try {
  module = angular.module('idai.templates');
} catch (e) {
  module = angular.module('idai.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('layout/idai-header.html',
    '<a ng-href={{link}} id=headerlink><header id=teaser><div id=background style="background-image: url({{image}});"></div><div id=description>{{description}}</div></header></a>');
}]);
})();

(function(module) {
try {
  module = angular.module('idai.templates');
} catch (e) {
  module = angular.module('idai.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('layout/idai-navbar.html',
    '<nav class="navbar navbar-default navbar-fixed-top" role=navigation><div ng-init="isCollapsed = true"><div style="padding-left:0px; position:relative"><div class="pull-left idai-welt-menu"><ul class="nav navbar-nav"><li uib-dropdown><a href=# uib-dropdown-toggle><img src=img/kleinergreif.png id=brand-img> <b class=caret></b></a><ul uib-dropdown-menu><li><a href=http://www.dainst.org/de/forschung/forschung-digital target=_blank>iDAI.welt</a></li><li class=divider></li><li><a href=http://zenon.dainst.org target=_blank>iDAI.bibliography&nbsp;/&nbsp;Zenon</a></li><li><a href="http://chronontology.dainst.org/" target=_blank>iDAI.chronontology</a></li><li><a href="https://gazetteer.dainst.org/" target=_blank>iDAI.gazetteer</a></li><li><a href="http://geoserver.dainst.org/" target=_blank>iDAI.geoserver</a></li><li><a href="https://arachne.dainst.org/" target=_blank>iDAI.objects&nbsp;/&nbsp;Arachne</a></li><li><a href=https://publications.dainst.org target=_blank>iDAI.publications</a></li><li><a href=http://thesauri.dainst.org target=_blank>iDAI.thesaurus</a></li><li><a href=http://archwort.dainst.org/thesaurus/de/vocab target=_blank>iDAI.vocab&nbsp;/&nbsp;Archwort</a></li><li><a href=http://hellespont.dainst.org target=_blank>Hellespont</a></li></ul></li></ul></div><a href="/" id=projectLogo><img class=pull-left ng-src=img/logo_{{projectId}}.png style="height: 36px; margin-top: 8px;"></a></div><idai-search class="navbar-left idai-navbar-search" ng-hide=hideSearchForm button-class=btn-default></idai-search><div class=navbar-right style=display:inline><button class=navbar-toggle ng-click="isCollapsed = !isCollapsed" type=button><span class=sr-only>Toggle navigation</span> <span class=icon-bar></span> <span class=icon-bar></span> <span class=icon-bar></span></button></div><div style=display:inline class=navbar-right><div ng-class="isCollapsed ? \'collapse\' : \'in\'" class="collapse navbar-collapse" uib-collapse=isCollapsed><ng-transclude></ng-transclude><ul class="nav navbar-nav"><li class=navbar-links ng-repeat="link in dynamicLinkList"><a ng-click=toggleNavbar() ng-href={{link.path}}{{link.id}}>{{link.title}}</a></li><li><ul class="nav navbar-nav"><li id=language-switcher ng-hide=hideLanguageSwitcher uib-dropdown><a href=# uib-dropdown-toggle><img src=img/language-icon.png></a><ul uib-dropdown-menu><li ng-class="{\'selected-language\': langCode == \'de\'}"><a ng-click="switchLanguage(\'de\')">Deutsch</a></li><li ng-class="{\'selected-language\': langCode == \'en\'}"><a ng-click="switchLanguage(\'en\')">English</a></li></ul></li></ul></li><li id=usermenu-navbar><div ng-if=userObject.username ng-cloak uib-dropdown keyboard-nav><a href=bookmarks class="btn btn-default btn-sm navbar-btn" uib-dropdown-toggle><span class="glyphicon glyphicon-user"></span> &nbsp;{{userObject.username}} <span class=caret></span></a><ul uib-dropdown-menu role=menu style="margin-top:-11px; margin-right: 4px;"><div ng-include="\'partials/navbar-menu.html\'" include-replace></div><li class=divider></li><li><a ng-click=logoutFunction();><span class="glyphicon glyphicon-log-out"></span> &nbsp;{{\'navbar_sign_out\' | transl8}}</a></li></ul></div><div ng-if=!userObject.username ng-cloak class="btn-group btn-group-sm"><a type=button id=loginbutton class="btn btn-default navbar-btn" ng-click=loginFunction();><b><span class="glyphicon glyphicon-log-in"></span> &nbsp;{{\'navbar_sign_in\' | transl8}}</b></a> <a ng-if="!hideRegisterButton && !userObject.username" class="btn btn-default navbar-btn" href=register>{{\'navbar_sign_up\' | transl8}}</a></div></li><li ng-if=!hideContactButton style=margin-left:5px><div><a type=button href=contact class="btn btn-sm btn-default navbar-btn"><span class="glyphicon glyphicon-envelope"></span></a></div></li><li style=margin-right:30px></li></ul></div></div></div></nav>');
}]);
})();

(function(module) {
try {
  module = angular.module('idai.templates');
} catch (e) {
  module = angular.module('idai.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('messages/idai-messages.html',
    '<div ng-repeat="(transl8Key,message) in messages" ng-class="\'alert-\' + message.level" class="col-md-10 col-md-offset-1 alert text-center"><div class=alert-message><button class=close ng-click=remove(transl8Key) style=cursor:pointer;>&times;</button> <b ng-bind-html=message.text></b><br><span>{{message.contactInfo}}</span></div></div>');
}]);
})();
