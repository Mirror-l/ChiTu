"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

define(["require", "exports", "maishu-chitu-service", "./PageMaster", "./Errors"], function (require, exports, maishu_chitu_service_1, PageMaster_1, Errors_1) {
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
        window.addEventListener('popstate', function () {
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
});
//# sourceMappingURL=Application.js.map
