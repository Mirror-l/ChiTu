/*!
 * 
 *  maishu-chitu v2.9.25
 *  https://github.com/ansiboy/chitu
 *  
 *  Copyright (c) 2016-2018, shu mai <ansiboy@163.com>
 *  Licensed under the MIT License.
 * 
 */
define(["maishu-chitu-service"], function(__WEBPACK_EXTERNAL_MODULE_maishu_chitu_service__) { return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./out-es5/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./out-es5/Application.js":
/*!********************************!*\
  !*** ./out-es5/Application.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! maishu-chitu-service */ "maishu-chitu-service"), __webpack_require__(/*! ./PageMaster */ "./out-es5/PageMaster.js"), __webpack_require__(/*! ./Errors */ "./out-es5/Errors.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, maishu_chitu_service_1, PageMaster_1, Errors_1) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var EmtpyStateData = "";
  var DefaultPageName = "index";

  function _parseUrl(app, url) {
    if (!app) throw Errors_1.Errors.argumentNull('app');
    if (!url) throw Errors_1.Errors.argumentNull('url');
    var sharpIndex = url.indexOf('#');
    var routeString;
    if (sharpIndex >= 0) routeString = url.substr(sharpIndex + 1);else routeString = url;
    if (!routeString) throw Errors_1.Errors.canntParseRouteString(url);

    if (routeString.startsWith('!')) {
      throw Errors_1.Errors.canntParseRouteString(routeString);
    }

    var routePath;
    var search = null;
    var param_spliter_index = routeString.indexOf('?');

    if (param_spliter_index >= 0) {
      search = routeString.substr(param_spliter_index + 1);
      routePath = routeString.substring(0, param_spliter_index);
    } else {
      routePath = routeString;
    }

    if (!routePath) routePath = DefaultPageName;
    var values = {};

    if (search) {
      values = pareeUrlQuery(search);
    }

    var pageName = routePath;
    return {
      pageName: pageName,
      values: values
    };
  }

  function pareeUrlQuery(query) {
    var match,
        pl = /\+/g,
        search = /([^&=]+)=?([^&]*)/g,
        decode = function decode(s) {
      return decodeURIComponent(s.replace(pl, " "));
    };

    var urlParams = {};

    while (match = search.exec(query)) {
      urlParams[decode(match[1])] = decode(match[2]);
    }

    return urlParams;
  }

  function _createUrl(pageName, params) {
    var path_parts = pageName.split('.');
    var path = path_parts.join('/');
    if (!params) return "#".concat(path);
    var paramsText = '';

    for (var key in params) {
      var value = params[key];

      var type = _typeof(params[key]);

      if (type != 'string' || value == null) {
        continue;
      }

      paramsText = paramsText == '' ? "?".concat(key, "=").concat(params[key]) : paramsText + "&".concat(key, "=").concat(params[key]);
    }

    return "#".concat(path).concat(paramsText);
  }

  var Application =
  /*#__PURE__*/
  function (_PageMaster_1$PageMas) {
    _inherits(Application, _PageMaster_1$PageMas);

    function Application(args) {
      var _this;

      _classCallCheck(this, Application);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Application).call(this, (args || {}).container || document.body, (args || {}).parser));
      _this._runned = false;
      _this.closeCurrentOnBack = null;
      _this.tempPageData = undefined;
      return _this;
    }

    _createClass(Application, [{
      key: "parseUrl",
      value: function parseUrl(url) {
        if (!url) throw Errors_1.Errors.argumentNull('url');

        var routeData = _parseUrl(this, url);

        return routeData;
      }
    }, {
      key: "createUrl",
      value: function createUrl(pageName, values) {
        return _createUrl(pageName, values);
      }
    }, {
      key: "run",
      value: function run() {
        var _this2 = this;

        if (this._runned) return;

        var showPage = function showPage() {
          var url = location.href;
          var sharpIndex = url.indexOf('#');
          var routeString = url.substr(sharpIndex + 1);

          if (routeString.startsWith('!')) {
            return;
          }

          if (sharpIndex < 0) {
            url = '#' + DefaultPageName;
          }

          _this2.showPageByUrl(url, true);
        };

        showPage();
        window.addEventListener('hashchange', function () {
          showPage();
        });
        this._runned = true;
      }
    }, {
      key: "showPageByUrl",
      value: function showPageByUrl(url, fromCache) {
        if (!url) throw Errors_1.Errors.argumentNull('url');
        var routeData = this.parseUrl(url);

        if (routeData == null) {
          throw Errors_1.Errors.noneRouteMatched(url);
        }

        var tempPageData = this.fetchTemplatePageData();
        var result = null;

        if (this.closeCurrentOnBack == true) {
          this.closeCurrentOnBack = null;
          if (tempPageData == null) this.closeCurrentPage();else this.closeCurrentPage(tempPageData);
          result = this.currentPage;
        } else if (this.closeCurrentOnBack == false) {
          this.closeCurrentOnBack = null;
          var page = this.pageStack.pop();
          if (page == null) throw new Error('page is null');
          page.hide(this.currentPage);
          result = this.currentPage;
        }

        if (result == null || result.name != routeData.pageName) {
          var args = routeData.values || {};

          if (tempPageData) {
            args = Object.assign(args, tempPageData);
          }

          result = this.showPage(routeData.pageName, args);
        }

        return result;
      }
    }, {
      key: "fetchTemplatePageData",
      value: function fetchTemplatePageData() {
        if (this.tempPageData == null) {
          return null;
        }

        var data = this.tempPageData;
        this.tempPageData = undefined;
        return data;
      }
    }, {
      key: "setLocationHash",
      value: function setLocationHash(url) {
        history.pushState(EmtpyStateData, "", url);
      }
    }, {
      key: "redirect",
      value: function redirect(pageNameOrUrl, args) {
        if (!pageNameOrUrl) throw Errors_1.Errors.argumentNull('pageNameOrUrl');
        var page = this.showPageByNameOrUrl(pageNameOrUrl, args);
        var url = this.createUrl(page.name, page.data);
        this.setLocationHash(url);
        return page;
      }
    }, {
      key: "forward",
      value: function forward(pageNameOrUrl, args, setUrl) {
        if (!pageNameOrUrl) throw Errors_1.Errors.argumentNull('pageNameOrUrl');
        if (setUrl == null) setUrl = true;
        var page = this.showPageByNameOrUrl(pageNameOrUrl, args, true);

        if (setUrl) {
          var url = this.createUrl(page.name, page.data);
          this.setLocationHash(url);
        } else {
          history.pushState(pageNameOrUrl, "", "");
        }

        return page;
      }
    }, {
      key: "showPageByNameOrUrl",
      value: function showPageByNameOrUrl(pageNameOrUrl, args, rerender) {
        var pageName;

        if (pageNameOrUrl.indexOf('?') < 0) {
          pageName = pageNameOrUrl;
        } else {
          var obj = this.parseUrl(pageNameOrUrl);
          pageName = obj.pageName;
          args = Object.assign(obj.values, args || {});
        }

        return this.showPage(pageName, args, rerender);
      }
    }, {
      key: "reload",
      value: function reload(pageName, args) {
        var result = this.showPage(pageName, args, true);
        return result;
      }
    }, {
      key: "back",
      value: function back(closeCurrentPage, data) {
        var closeCurrentPageDefault = true;

        if (_typeof(closeCurrentPage) == 'object') {
          data = closeCurrentPage;
          closeCurrentPage = null;
        }

        this.closeCurrentOnBack = closeCurrentPage == null ? closeCurrentPageDefault : closeCurrentPage;
        this.tempPageData = data;
        history.back();
      }
    }, {
      key: "createService",
      value: function createService(type) {
        var _this3 = this;

        type = type || maishu_chitu_service_1.Service;
        var service = new type();
        service.error.add(function (sender, error) {
          _this3.error.fire(_this3, error, null);
        });
        return service;
      }
    }]);

    return Application;
  }(PageMaster_1.PageMaster);

  exports.Application = Application;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=Application.js.map


/***/ }),

/***/ "./out-es5/Errors.js":
/*!***************************!*\
  !*** ./out-es5/Errors.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var Errors =
  /*#__PURE__*/
  function () {
    function Errors() {
      _classCallCheck(this, Errors);
    }

    _createClass(Errors, null, [{
      key: "pageNodeNotExists",
      value: function pageNodeNotExists(pageName) {
        var msg = "Page node named ".concat(pageName, " is not exists.");
        return new Error(msg);
      }
    }, {
      key: "actionCanntNull",
      value: function actionCanntNull(pageName) {
        var msg = "Action of '".concat(pageName, "' can not be null.");
        return new Error(msg);
      }
    }, {
      key: "argumentNull",
      value: function argumentNull(paramName) {
        var msg = "The argument \"".concat(paramName, "\" cannt be null.");
        return new Error(msg);
      }
    }, {
      key: "modelFileExpecteFunction",
      value: function modelFileExpecteFunction(script) {
        var msg = "The eval result of script file \"".concat(script, "\" is expected a function.");
        return new Error(msg);
      }
    }, {
      key: "paramTypeError",
      value: function paramTypeError(paramName, expectedType) {
        var msg = "The param \"".concat(paramName, "\" is expected \"").concat(expectedType, "\" type.");
        return new Error(msg);
      }
    }, {
      key: "paramError",
      value: function paramError(msg) {
        return new Error(msg);
      }
    }, {
      key: "pathPairRequireView",
      value: function pathPairRequireView(index) {
        var msg = "The view value is required for path pair, but the item with index \"".concat(index, "\" is miss it.");
        return new Error(msg);
      }
    }, {
      key: "notImplemented",
      value: function notImplemented(name) {
        var msg = "'The method \"".concat(name, "\" is not implemented.'");
        return new Error(msg);
      }
    }, {
      key: "routeExists",
      value: function routeExists(name) {
        var msg = "Route named \"".concat(name, "\" is exists.");
        return new Error(msg);
      }
    }, {
      key: "noneRouteMatched",
      value: function noneRouteMatched(url) {
        var msg = "None route matched with url \"".concat(url, "\".");
        var error = new Error(msg);
        return error;
      }
    }, {
      key: "emptyStack",
      value: function emptyStack() {
        return new Error('The stack is empty.');
      }
    }, {
      key: "canntParseUrl",
      value: function canntParseUrl(url) {
        var msg = "Can not parse the url \"".concat(url, "\" to route data.");
        return new Error(msg);
      }
    }, {
      key: "canntParseRouteString",
      value: function canntParseRouteString(routeString) {
        var msg = "Can not parse the route string \"".concat(routeString, "\" to route data.;");
        return new Error(msg);
      }
    }, {
      key: "routeDataRequireController",
      value: function routeDataRequireController() {
        var msg = 'The route data does not contains a "controller" file.';
        return new Error(msg);
      }
    }, {
      key: "routeDataRequireAction",
      value: function routeDataRequireAction() {
        var msg = 'The route data does not contains a "action" file.';
        return new Error(msg);
      }
    }, {
      key: "viewCanntNull",
      value: function viewCanntNull() {
        var msg = 'The view or viewDeferred of the page cannt null.';
        return new Error(msg);
      }
    }, {
      key: "createPageFail",
      value: function createPageFail(pageName) {
        var msg = "Create page \"".concat(pageName, "\" fail.");
        return new Error(msg);
      }
    }, {
      key: "actionTypeError",
      value: function actionTypeError(pageName) {
        var msg = "The action in page '".concat(pageName, "' is expect as function.");
        return new Error(msg);
      }
    }, {
      key: "canntFindAction",
      value: function canntFindAction(pageName) {
        var msg = "Cannt find action in page '".concat(pageName, "', is the exports has default field?");
        return new Error(msg);
      }
    }, {
      key: "exportsCanntNull",
      value: function exportsCanntNull(pageName) {
        var msg = "Exports of page '".concat(pageName, "' is null.");
        return new Error(msg);
      }
    }, {
      key: "scrollerElementNotExists",
      value: function scrollerElementNotExists() {
        var msg = "Scroller element is not exists.";
        return new Error(msg);
      }
    }, {
      key: "resourceExists",
      value: function resourceExists(resourceName, pageName) {
        var msg = "Rosource '".concat(resourceName, "' is exists in the resources of page '").concat(pageName, "'.");
        return new Error(msg);
      }
    }, {
      key: "siteMapRootCanntNull",
      value: function siteMapRootCanntNull() {
        var msg = "The site map root node can not be null.";
        return new Error(msg);
      }
    }, {
      key: "duplicateSiteMapNode",
      value: function duplicateSiteMapNode(name) {
        var msg = "The site map node ".concat(name, " is exists.");
        return new Error(name);
      }
    }]);

    return Errors;
  }();

  exports.Errors = Errors;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=Errors.js.map


/***/ }),

/***/ "./out-es5/Page.js":
/*!*************************!*\
  !*** ./out-es5/Page.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! maishu-chitu-service */ "maishu-chitu-service")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, maishu_chitu_service_1) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var Page =
  /*#__PURE__*/
  function () {
    function Page(params) {
      _classCallCheck(this, Page);

      this.data = {};
      this.showing = maishu_chitu_service_1.Callbacks();
      this.shown = maishu_chitu_service_1.Callbacks();
      this.hiding = maishu_chitu_service_1.Callbacks();
      this.hidden = maishu_chitu_service_1.Callbacks();
      this.closing = maishu_chitu_service_1.Callbacks();
      this.closed = maishu_chitu_service_1.Callbacks();
      this._element = params.element;
      this._app = params.app;
      this._displayer = params.displayer;
      this.data = params.data;
      this._name = params.name;
    }

    _createClass(Page, [{
      key: "on_showing",
      value: function on_showing() {
        return this.showing.fire(this, this.data);
      }
    }, {
      key: "on_shown",
      value: function on_shown() {
        return this.shown.fire(this, this.data);
      }
    }, {
      key: "on_hiding",
      value: function on_hiding() {
        return this.hiding.fire(this, this.data);
      }
    }, {
      key: "on_hidden",
      value: function on_hidden() {
        return this.hidden.fire(this, this.data);
      }
    }, {
      key: "on_closing",
      value: function on_closing() {
        return this.closing.fire(this, this.data);
      }
    }, {
      key: "on_closed",
      value: function on_closed() {
        return this.closed.fire(this, this.data);
      }
    }, {
      key: "show",
      value: function show() {
        var _this = this;

        this.on_showing();
        var currentPage = this._app.currentPage;

        if (this == currentPage) {
          currentPage = null;
        }

        return this._displayer.show(this, currentPage).then(function (o) {
          _this.on_shown();
        });
      }
    }, {
      key: "hide",
      value: function hide(currentPage) {
        var _this2 = this;

        this.on_hiding();
        return this._displayer.hide(this, currentPage).then(function (o) {
          _this2.on_hidden();
        });
      }
    }, {
      key: "close",
      value: function close() {
        this.on_closing();

        this._element.remove();

        this.on_closed();
        return Promise.resolve();
      }
    }, {
      key: "createService",
      value: function createService(type) {
        var _this3 = this;

        type = type || maishu_chitu_service_1.Service;
        var service = new type();
        service.error.add(function (sender, error) {
          _this3._app.error.fire(_this3._app, error, _this3);
        });
        return service;
      }
    }, {
      key: "element",
      get: function get() {
        return this._element;
      }
    }, {
      key: "name",
      get: function get() {
        return this._name;
      }
    }, {
      key: "app",
      get: function get() {
        return this._app;
      }
    }]);

    return Page;
  }();

  Page.tagName = 'div';
  exports.Page = Page;

  var PageDisplayerImplement =
  /*#__PURE__*/
  function () {
    function PageDisplayerImplement() {
      _classCallCheck(this, PageDisplayerImplement);
    }

    _createClass(PageDisplayerImplement, [{
      key: "show",
      value: function show(page, previous) {
        page.element.style.display = 'block';

        if (previous != null) {
          previous.element.style.display = 'none';
        }

        return Promise.resolve();
      }
    }, {
      key: "hide",
      value: function hide(page, previous) {
        page.element.style.display = 'none';

        if (previous != null) {
          previous.element.style.display = 'block';
        }

        return Promise.resolve();
      }
    }]);

    return PageDisplayerImplement;
  }();

  exports.PageDisplayerImplement = PageDisplayerImplement;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=Page.js.map


/***/ }),

/***/ "./out-es5/PageMaster.js":
/*!*******************************!*\
  !*** ./out-es5/PageMaster.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : new P(function (resolve) {
        resolve(result.value);
      }).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! maishu-chitu-service */ "maishu-chitu-service"), __webpack_require__(/*! ./Page */ "./out-es5/Page.js"), __webpack_require__(/*! ./Errors */ "./out-es5/Errors.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, maishu_chitu_service_1, Page_1, Errors_1) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var PageMaster =
  /*#__PURE__*/
  function () {
    function PageMaster(container, parser) {
      _classCallCheck(this, PageMaster);

      this.pageCreated = maishu_chitu_service_1.Callbacks();
      this.pageShowing = maishu_chitu_service_1.Callbacks();
      this.pageShown = maishu_chitu_service_1.Callbacks();
      this.pageType = Page_1.Page;
      this.pageDisplayType = Page_1.PageDisplayerImplement;
      this.cachePages = {};
      this.page_stack = new Array();
      this.nodes = {};
      this.error = maishu_chitu_service_1.Callbacks();
      this.parser = parser || this.defaultPageNodeParser();
      if (!container) throw Errors_1.Errors.argumentNull("container");
      this.parser.actions = this.parser.actions || {};
      this.container = container;
    }

    _createClass(PageMaster, [{
      key: "defaultPageNodeParser",
      value: function defaultPageNodeParser() {
        var _this = this;

        var nodes = {};
        var p = {
          actions: {},
          parse: function parse(pageName) {
            var node = nodes[pageName];

            if (node == null) {
              var path = "modules_".concat(pageName).split('_').join('/');
              node = {
                action: _this.createDefaultAction(path, _this.loadjs),
                name: pageName
              };
              nodes[pageName] = node;
            }

            return node;
          }
        };
        return p;
      }
    }, {
      key: "createDefaultAction",
      value: function createDefaultAction(url, loadjs) {
        var _this2 = this;

        return function (page) {
          return __awaiter(_this2, void 0, void 0,
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee() {
            var actionExports, _action, result, action, _action2;

            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return loadjs(url);

                  case 2:
                    actionExports = _context.sent;

                    if (actionExports) {
                      _context.next = 5;
                      break;
                    }

                    throw Errors_1.Errors.exportsCanntNull(url);

                  case 5:
                    _action = actionExports.default;

                    if (!(_action == null)) {
                      _context.next = 8;
                      break;
                    }

                    throw Errors_1.Errors.canntFindAction(page.name);

                  case 8:
                    if (PageMaster.isClass(_action)) {
                      action = _action;
                      result = new action(page, this);
                    } else {
                      _action2 = _action;
                      result = _action2(page, this);
                    }

                    return _context.abrupt("return", result);

                  case 10:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee, this);
          }));
        };
      }
    }, {
      key: "loadjs",
      value: function loadjs(path) {
        return new Promise(function (reslove, reject) {
          requirejs([path], function (result) {
            reslove(result);
          }, function (err) {
            reject(err);
          });
        });
      }
    }, {
      key: "on_pageCreated",
      value: function on_pageCreated(page) {
        return this.pageCreated.fire(this, page);
      }
    }, {
      key: "getPage",
      value: function getPage(node, values) {
        console.assert(node != null);
        values = values || {};
        var pageName = node.name;
        var cachePage = this.cachePages[pageName];

        if (cachePage != null) {
          cachePage.data = values || {};
          return {
            page: cachePage,
            isNew: false
          };
        }

        var page = this.createPage(pageName, values);
        this.cachePages[pageName] = page;
        this.on_pageCreated(page);
        return {
          page: page,
          isNew: true
        };
      }
    }, {
      key: "createPage",
      value: function createPage(pageName, values) {
        var _this3 = this;

        if (!pageName) throw Errors_1.Errors.argumentNull('pageName');
        values = values || {};
        var element = this.createPageElement(pageName);
        var displayer = new this.pageDisplayType(this);
        console.assert(this.pageType != null);
        var page = new this.pageType({
          app: this,
          name: pageName,
          data: values,
          displayer: displayer,
          element: element
        });

        var showing = function showing(sender) {
          _this3.pageShowing.fire(_this3, sender);
        };

        var shown = function shown(sender) {
          _this3.pageShown.fire(_this3, sender);
        };

        page.showing.add(showing);
        page.shown.add(shown);
        page.closed.add(function () {
          page.showing.remove(showing);
          page.shown.remove(shown);
        });
        return page;
      }
    }, {
      key: "createPageElement",
      value: function createPageElement(pageName) {
        var element = document.createElement(Page_1.Page.tagName);
        this.container.appendChild(element);
        return element;
      }
    }, {
      key: "showPage",
      value: function showPage(pageName, args, forceRender) {
        args = args || {};
        forceRender = forceRender == null ? false : true;
        if (!pageName) throw Errors_1.Errors.argumentNull('pageName');
        var node = this.findSiteMapNode(pageName);
        if (node == null) throw Errors_1.Errors.pageNodeNotExists(pageName);
        if (this.currentPage != null && this.currentPage.name == pageName) return this.currentPage;

        var _this$getPage = this.getPage(node, args),
            page = _this$getPage.page,
            isNew = _this$getPage.isNew;

        if (isNew || forceRender) {
          var siteMapNode = this.findSiteMapNode(pageName);
          if (siteMapNode == null) throw Errors_1.Errors.pageNodeNotExists(pageName);
          var action = siteMapNode.action;
          if (action == null) throw Errors_1.Errors.actionCanntNull(pageName);
          action(page, this);
        }

        page.show();
        this.pushPage(page);
        console.assert(page == this.currentPage, "page is not current page");
        return page;
      }
    }, {
      key: "closePage",
      value: function closePage(page) {
        if (page == null) throw Errors_1.Errors.argumentNull('page');
        page.close();
        delete this.cachePages[page.name];
        this.page_stack = this.page_stack.filter(function (o) {
          return o != page;
        });
      }
    }, {
      key: "pushPage",
      value: function pushPage(page) {
        this.page_stack.push(page);
      }
    }, {
      key: "findSiteMapNode",
      value: function findSiteMapNode(pageName) {
        if (this.nodes[pageName]) return this.nodes[pageName];
        var node = null;
        var action = this.parser.actions ? this.parser.actions[pageName] : null;

        if (action != null) {
          node = {
            action: action,
            name: pageName
          };
        }

        if (node == null && this.parser.parse != null) {
          node = this.parser.parse(pageName);
          console.assert(node.action != null);
        }

        if (node != null) this.nodes[pageName] = node;
        return node;
      }
    }, {
      key: "closeCurrentPage",
      value: function closeCurrentPage(passData) {
        var page = this.page_stack.pop();
        if (page == null) return;
        this.closePage(page);

        if (this.currentPage) {
          if (passData) {
            console.assert(this.currentPage.data != null);
            this.currentPage.data = Object.assign(this.currentPage.data, passData);
          }

          this.currentPage.show();
        }
      }
    }, {
      key: "currentPage",
      get: function get() {
        if (this.page_stack.length > 0) return this.page_stack[this.page_stack.length - 1];
        return null;
      }
    }, {
      key: "pageStack",
      get: function get() {
        return this.page_stack;
      }
    }]);

    return PageMaster;
  }();

  PageMaster.isClass = function () {
    var toString = Function.prototype.toString;

    function fnBody(fn) {
      return toString.call(fn).replace(/^[^{]*{\s*/, '').replace(/\s*}[^}]*$/, '');
    }

    function isClass(fn) {
      return typeof fn === 'function' && (/^class(\s|\{\}$)/.test(toString.call(fn)) || /^.*classCallCheck\(/.test(fnBody(fn)));
    }

    return isClass;
  }();

  exports.PageMaster = PageMaster;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=PageMaster.js.map


/***/ }),

/***/ "./out-es5/index.js":
/*!**************************!*\
  !*** ./out-es5/index.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! ./Application */ "./out-es5/Application.js"), __webpack_require__(/*! ./PageMaster */ "./out-es5/PageMaster.js"), __webpack_require__(/*! ./Page */ "./out-es5/Page.js"), __webpack_require__(/*! maishu-chitu-service */ "maishu-chitu-service")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, Application_1, PageMaster_1, Page_1, maishu_chitu_service_1) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Application = Application_1.Application;
  exports.PageMaster = PageMaster_1.PageMaster;
  exports.Page = Page_1.Page;
  exports.Callback = maishu_chitu_service_1.Callback;
  exports.Callbacks = maishu_chitu_service_1.Callbacks;
  exports.ValueStore = maishu_chitu_service_1.ValueStore;
  exports.Service = maishu_chitu_service_1.Service;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=index.js.map


/***/ }),

/***/ "maishu-chitu-service":
/*!***************************************!*\
  !*** external "maishu-chitu-service" ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_maishu_chitu_service__;

/***/ })

/******/ })});;
//# sourceMappingURL=index.es5.js.map