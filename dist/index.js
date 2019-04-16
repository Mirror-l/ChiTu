
/*
 * maishu-chitu v2.7.0
 * https://github.com/ansiboy/chitu
 *
 * Copyright (c) 2016-2018, shu mai <ansiboy@163.com>
 * Licensed under the MIT License.
 *
 */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.maishuChitu = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Callback {
    constructor() {
        this.funcs = new Array();
    }
    add(func) {
        this.funcs.push(func);
    }
    remove(func) {
        this.funcs = this.funcs.filter(o => o != func);
    }
    fire(...args) {
        this.funcs.forEach(o => o(...args));
    }
}
exports.Callback = Callback;
function Callbacks() {
    return new Callback();
}
exports.Callbacks = Callbacks;

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errors = {
    serviceUrlCanntNull(serviceName) {
        let msg = `Service '${serviceName}' base url can not null.`;
        return new Error(msg);
    },
    unexpectedNullResult() {
        let msg = `Null result is unexpected.`;
        return new Error(msg);
    },
    unexpectedNullValue(name) {
        let msg = `variable ${name} is unexpected null value.`;
        return new Error(msg);
    },
    argumentNull(name) {
        let msg = `Arugment ${name} cannt null or empty.`;
        return new Error(msg);
    },
    fieldNull(field, itemName) {
        let msg = `${itemName} ${field} cannt be null or empty`;
        return new Error(msg);
    },
    instanceMessangerStart() {
        let msg = `Instance messanger is start.`;
        return new Error(msg);
    }
};

},{}],3:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const callback_1 = require("./callback");
const errors_1 = require("./errors");
class Service {
    constructor() {
        this.error = callback_1.Callbacks();
    }
    ajax(url, options) {
        // options = options || {} as any
        if (options === undefined)
            options = {};
        let data = options.data;
        let method = options.method;
        let headers = options.headers || {};
        let body;
        if (data != null) {
            let is_json = (headers['content-type'] || '').indexOf('json') >= 0;
            if (is_json) {
                body = JSON.stringify(data);
            }
            else {
                body = new URLSearchParams();
                for (let key in data) {
                    body.append(key, data[key]);
                }
            }
        }
        // return callAjax<T>(url, { headers: headers as any, body, method }, this, this.error);
        return new Promise((reslove, reject) => {
            let options = { headers: headers, body, method };
            let timeId;
            if (options == null)
                throw errors_1.errors.unexpectedNullValue('options');
            if (method == 'get') {
                timeId = setTimeout(() => {
                    let err = new Error(); //new AjaxError(options.method);
                    err.name = 'timeout';
                    err.message = '网络连接超时';
                    reject(err);
                    this.error.fire(this, err);
                    clearTimeout(timeId);
                }, Service.settings.ajaxTimeout * 1000);
            }
            ajax(url, options)
                .then(data => {
                reslove(data);
                if (timeId)
                    clearTimeout(timeId);
            })
                .catch(err => {
                reject(err);
                this.error.fire(this, err);
                if (timeId)
                    clearTimeout(timeId);
            });
        });
    }
    /**
     * 创建服务
     * @param type 服务类型
     */
    createService(type) {
        type = type || Service;
        let service = new type();
        service.error.add((sender, error) => {
            this.error.fire(service, error);
        });
        return service;
    }
}
Service.settings = {
    ajaxTimeout: 30,
};
exports.Service = Service;
function ajax(url, options) {
    return __awaiter(this, void 0, void 0, function* () {
        let response = yield fetch(url, options);
        let responseText = response.text();
        let p;
        if (typeof responseText == 'string') {
            p = new Promise((reslove, reject) => {
                reslove(responseText);
            });
        }
        else {
            p = responseText;
        }
        let text = yield responseText;
        let textObject;
        let isJSONContextType = (response.headers.get('content-type') || '').indexOf('json') >= 0;
        if (isJSONContextType) {
            textObject = text ? JSON.parse(text) : null;
        }
        else {
            textObject = text;
        }
        if (response.status >= 300) {
            let err = new Error();
            err.method = options.method;
            err.name = `${response.status}`;
            err.message = isJSONContextType ? (textObject.Message || textObject.message) : textObject;
            err.message = err.message || response.statusText;
            throw err;
        }
        return textObject;
    });
}

},{"./callback":1,"./errors":2}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 实现数据的存储，以及数据修改的通知
 */
class ValueStore {
    constructor(value) {
        this.items = new Array();
        this._value = value === undefined ? null : value;
    }
    add(func, sender) {
        this.items.push({ func, sender });
        return func;
    }
    remove(func) {
        this.items = this.items.filter(o => o.func != func);
    }
    fire(value) {
        this.items.forEach(o => o.func(value, o.sender));
    }
    get value() {
        if (this._value === undefined)
            return null;
        return this._value;
    }
    set value(value) {
        this._value = value;
        this.fire(value);
    }
}
exports.ValueStore = ValueStore;

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Service_1 = require("./Service");
const PageMaster_1 = require("./PageMaster");
const Errors_1 = require("./Errors");
const EmtpyStateData = "";
const DefaultPageName = "index";
function parseUrl(app, url) {
    if (!app)
        throw Errors_1.Errors.argumentNull('app');
    if (!url)
        throw Errors_1.Errors.argumentNull('url');
    let sharpIndex = url.indexOf('#');
    let routeString;
    if (sharpIndex >= 0)
        routeString = url.substr(sharpIndex + 1);
    else
        routeString = url;
    if (!routeString)
        throw Errors_1.Errors.canntParseRouteString(url);
    if (routeString.startsWith('!')) {
        throw Errors_1.Errors.canntParseRouteString(routeString);
    }
    let routePath;
    let search = null;
    let param_spliter_index = routeString.indexOf('?');
    if (param_spliter_index >= 0) {
        search = routeString.substr(param_spliter_index + 1);
        routePath = routeString.substring(0, param_spliter_index);
    }
    else {
        routePath = routeString;
    }
    if (!routePath)
        routePath = DefaultPageName;
    let values = {};
    if (search) {
        values = pareeUrlQuery(search);
    }
    let pageName = routePath;
    return { pageName, values };
}
function pareeUrlQuery(query) {
    let match, pl = /\+/g, search = /([^&=]+)=?([^&]*)/g, decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); };
    let urlParams = {};
    while (match = search.exec(query))
        urlParams[decode(match[1])] = decode(match[2]);
    return urlParams;
}
function createUrl(pageName, params) {
    let path_parts = pageName.split('.');
    let path = path_parts.join('/');
    if (!params)
        return `#${path}`;
    let paramsText = '';
    for (let key in params) {
        let value = params[key];
        let type = typeof params[key];
        if (type != 'string' || value == null) {
            continue;
        }
        paramsText = paramsText == '' ? `?${key}=${params[key]}` : paramsText + `&${key}=${params[key]}`;
    }
    return `#${path}${paramsText}`;
}
class Application extends PageMaster_1.PageMaster {
    constructor(args) {
        super((args || {}).container || document.body, (args || {}).parser);
        this._runned = false;
        this.closeCurrentOnBack = null;
        this.tempPageData = undefined;
    }
    parseUrl(url) {
        if (!url)
            throw Errors_1.Errors.argumentNull('url');
        let routeData = parseUrl(this, url);
        return routeData;
    }
    createUrl(pageName, values) {
        return createUrl(pageName, values);
    }
    run() {
        if (this._runned)
            return;
        let showPage = () => {
            let url = location.href;
            let sharpIndex = url.indexOf('#');
            let routeString = url.substr(sharpIndex + 1);
            if (routeString.startsWith('!')) {
                return;
            }
            if (sharpIndex < 0) {
                url = '#' + DefaultPageName;
            }
            this.showPageByUrl(url, true);
        };
        showPage();
        window.addEventListener('popstate', () => {
            showPage();
        });
        this._runned = true;
    }
    showPageByUrl(url, fromCache) {
        if (!url)
            throw Errors_1.Errors.argumentNull('url');
        var routeData = this.parseUrl(url);
        if (routeData == null) {
            throw Errors_1.Errors.noneRouteMatched(url);
        }
        let tempPageData = this.fetchTemplatePageData();
        let result = null;
        if (this.closeCurrentOnBack == true) {
            this.closeCurrentOnBack = null;
            if (tempPageData == null)
                this.closeCurrentPage();
            else
                this.closeCurrentPage(tempPageData);
            result = this.currentPage;
        }
        else if (this.closeCurrentOnBack == false) {
            this.closeCurrentOnBack = null;
            var page = this.pageStack.pop();
            if (page == null)
                throw new Error('page is null');
            page.hide(this.currentPage);
            result = this.currentPage;
        }
        if (result == null || result.name != routeData.pageName) {
            let args = routeData.values || {};
            if (tempPageData) {
                args = Object.assign(args, tempPageData);
            }
            result = this.showPage(routeData.pageName, args);
        }
        return result;
    }
    fetchTemplatePageData() {
        if (this.tempPageData == null) {
            return null;
        }
        let data = this.tempPageData;
        this.tempPageData = undefined;
        return data;
    }
    setLocationHash(url) {
        history.pushState(EmtpyStateData, "", url);
    }
    redirect(pageNameOrUrl, args) {
        if (!pageNameOrUrl)
            throw Errors_1.Errors.argumentNull('pageNameOrUrl');
        let page = this.showPageByNameOrUrl(pageNameOrUrl, args);
        let url = this.createUrl(page.name, page.data);
        this.setLocationHash(url);
        return page;
    }
    forward(pageNameOrUrl, args, setUrl) {
        if (!pageNameOrUrl)
            throw Errors_1.Errors.argumentNull('pageNameOrUrl');
        if (setUrl == null)
            setUrl = true;
        let page = this.showPageByNameOrUrl(pageNameOrUrl, args, true);
        if (setUrl) {
            let url = this.createUrl(page.name, page.data);
            this.setLocationHash(url);
        }
        else {
            history.pushState(pageNameOrUrl, "", "");
        }
        return page;
    }
    showPageByNameOrUrl(pageNameOrUrl, args, rerender) {
        let pageName;
        if (pageNameOrUrl.indexOf('?') < 0) {
            pageName = pageNameOrUrl;
        }
        else {
            let obj = this.parseUrl(pageNameOrUrl);
            pageName = obj.pageName;
            args = Object.assign(obj.values, args || {});
        }
        return this.showPage(pageName, args, rerender);
    }
    reload(pageName, args) {
        let result = this.showPage(pageName, args, true);
        return result;
    }
    back(closeCurrentPage, data) {
        const closeCurrentPageDefault = true;
        if (typeof closeCurrentPage == 'object') {
            data = closeCurrentPage;
            closeCurrentPage = null;
        }
        this.closeCurrentOnBack = closeCurrentPage == null ? closeCurrentPageDefault : closeCurrentPage;
        this.tempPageData = data;
        history.back();
    }
    createService(type) {
        type = type || Service_1.Service;
        let service = new type();
        service.error.add((sender, error) => {
            this.error.fire(this, error, null);
        });
        return service;
    }
}
exports.Application = Application;

},{"./Errors":6,"./PageMaster":9,"./Service":10}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Errors {
    static pageNodeNotExists(pageName) {
        let msg = `Page node named ${pageName} is not exists.`;
        return new Error(msg);
    }
    static actionCanntNull(pageName) {
        let msg = `Action of '${pageName}' can not be null.`;
        return new Error(msg);
    }
    static argumentNull(paramName) {
        var msg = `The argument "${paramName}" cannt be null.`;
        return new Error(msg);
    }
    static modelFileExpecteFunction(script) {
        var msg = `The eval result of script file "${script}" is expected a function.`;
        return new Error(msg);
    }
    static paramTypeError(paramName, expectedType) {
        var msg = `The param "${paramName}" is expected "${expectedType}" type.`;
        return new Error(msg);
    }
    static paramError(msg) {
        return new Error(msg);
    }
    static pathPairRequireView(index) {
        var msg = `The view value is required for path pair, but the item with index "${index}" is miss it.`;
        return new Error(msg);
    }
    static notImplemented(name) {
        var msg = `'The method "${name}" is not implemented.'`;
        return new Error(msg);
    }
    static routeExists(name) {
        var msg = `Route named "${name}" is exists.`;
        return new Error(msg);
    }
    static noneRouteMatched(url) {
        var msg = `None route matched with url "${url}".`;
        var error = new Error(msg);
        return error;
    }
    static emptyStack() {
        return new Error('The stack is empty.');
    }
    static canntParseUrl(url) {
        var msg = `Can not parse the url "${url}" to route data.`;
        return new Error(msg);
    }
    static canntParseRouteString(routeString) {
        var msg = `Can not parse the route string "${routeString}" to route data.;`;
        return new Error(msg);
    }
    static routeDataRequireController() {
        var msg = 'The route data does not contains a "controller" file.';
        return new Error(msg);
    }
    static routeDataRequireAction() {
        var msg = 'The route data does not contains a "action" file.';
        return new Error(msg);
    }
    static viewCanntNull() {
        var msg = 'The view or viewDeferred of the page cannt null.';
        return new Error(msg);
    }
    static createPageFail(pageName) {
        var msg = `Create page "${pageName}" fail.`;
        return new Error(msg);
    }
    static actionTypeError(pageName) {
        let msg = `The action in page '${pageName}' is expect as function.`;
        return new Error(msg);
    }
    static canntFindAction(pageName) {
        let msg = `Cannt find action in page '${pageName}', is the exports has default field?`;
        return new Error(msg);
    }
    static exportsCanntNull(pageName) {
        let msg = `Exports of page '${pageName}' is null.`;
        return new Error(msg);
    }
    static scrollerElementNotExists() {
        let msg = "Scroller element is not exists.";
        return new Error(msg);
    }
    static resourceExists(resourceName, pageName) {
        let msg = `Rosource '${resourceName}' is exists in the resources of page '${pageName}'.`;
        return new Error(msg);
    }
    static siteMapRootCanntNull() {
        let msg = `The site map root node can not be null.`;
        return new Error(msg);
    }
    static duplicateSiteMapNode(name) {
        let msg = `The site map node ${name} is exists.`;
        return new Error(name);
    }
}
exports.Errors = Errors;

},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Callback {
    constructor() {
        this.funcs = new Array();
    }
    add(func) {
        this.funcs.push(func);
    }
    remove(func) {
        this.funcs = this.funcs.filter(o => o != func);
    }
    fire(...args) {
        this.funcs.forEach(o => o(...args));
    }
}
exports.Callback = Callback;
function Callbacks() {
    return new Callback();
}
exports.Callbacks = Callbacks;
class ValueStore {
    constructor(value) {
        this.items = new Array();
        this._value = value === undefined ? null : value;
    }
    add(func, sender) {
        this.items.push({ func, sender });
        return func;
    }
    remove(func) {
        this.items = this.items.filter(o => o.func != func);
    }
    fire(value) {
        this.items.forEach(o => o.func(value, o.sender));
    }
    get value() {
        if (this._value === undefined)
            return null;
        return this._value;
    }
    set value(value) {
        this._value = value;
        this.fire(value);
    }
}
exports.ValueStore = ValueStore;

},{}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Extends_1 = require("./Extends");
const Service_1 = require("./Service");
class Page {
    constructor(params) {
        this.data = {};
        this.showing = Extends_1.Callbacks();
        this.shown = Extends_1.Callbacks();
        this.hiding = Extends_1.Callbacks();
        this.hidden = Extends_1.Callbacks();
        this.closing = Extends_1.Callbacks();
        this.closed = Extends_1.Callbacks();
        this._element = params.element;
        this._app = params.app;
        this._displayer = params.displayer;
        this.data = params.data;
        this._name = params.name;
    }
    on_showing() {
        return this.showing.fire(this, this.data);
    }
    on_shown() {
        return this.shown.fire(this, this.data);
    }
    on_hiding() {
        return this.hiding.fire(this, this.data);
    }
    on_hidden() {
        return this.hidden.fire(this, this.data);
    }
    on_closing() {
        return this.closing.fire(this, this.data);
    }
    on_closed() {
        return this.closed.fire(this, this.data);
    }
    show() {
        this.on_showing();
        let currentPage = this._app.currentPage;
        if (this == currentPage) {
            currentPage = null;
        }
        return this._displayer.show(this, currentPage).then(o => {
            this.on_shown();
        });
    }
    hide(currentPage) {
        this.on_hiding();
        return this._displayer.hide(this, currentPage).then(o => {
            this.on_hidden();
        });
    }
    close() {
        this.on_closing();
        this._element.remove();
        this.on_closed();
        return Promise.resolve();
    }
    createService(type) {
        type = type || Service_1.Service;
        let service = new type();
        service.error.add((sender, error) => {
            this._app.error.fire(this._app, error, this);
        });
        return service;
    }
    get element() {
        return this._element;
    }
    get name() {
        return this._name;
    }
    get app() {
        return this._app;
    }
}
Page.tagName = 'div';
exports.Page = Page;
class PageDisplayerImplement {
    show(page, previous) {
        page.element.style.display = 'block';
        if (previous != null) {
            previous.element.style.display = 'none';
        }
        return Promise.resolve();
    }
    hide(page, previous) {
        page.element.style.display = 'none';
        if (previous != null) {
            previous.element.style.display = 'block';
        }
        return Promise.resolve();
    }
}
exports.PageDisplayerImplement = PageDisplayerImplement;

},{"./Extends":7,"./Service":10}],9:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Extends_1 = require("./Extends");
const Page_1 = require("./Page");
const Errors_1 = require("./Errors");
class PageMaster {
    constructor(container, parser) {
        this.pageCreated = Extends_1.Callbacks();
        this.pageShowing = Extends_1.Callbacks();
        this.pageShown = Extends_1.Callbacks();
        this.pageType = Page_1.Page;
        this.pageDisplayType = Page_1.PageDisplayerImplement;
        this.cachePages = {};
        this.page_stack = new Array();
        this.nodes = {};
        this.error = Extends_1.Callbacks();
        this.parser = parser || this.defaultPageNodeParser();
        if (!container)
            throw Errors_1.Errors.argumentNull("container");
        this.parser.actions = this.parser.actions || {};
        this.container = container;
    }
    defaultPageNodeParser() {
        let nodes = {};
        let p = {
            actions: {},
            parse: (pageName) => {
                let node = nodes[pageName];
                if (node == null) {
                    let path = `modules_${pageName}`.split('_').join('/');
                    node = { action: this.createDefaultAction(path, this.loadjs), name: pageName };
                    nodes[pageName] = node;
                }
                return node;
            }
        };
        return p;
    }
    createDefaultAction(url, loadjs) {
        return (page) => __awaiter(this, void 0, void 0, function* () {
            let actionExports = yield loadjs(url);
            if (!actionExports)
                throw Errors_1.Errors.exportsCanntNull(url);
            let _action = actionExports.default;
            if (_action == null) {
                throw Errors_1.Errors.canntFindAction(page.name);
            }
            let result;
            if (PageMaster.isClass(_action)) {
                let action = _action;
                result = new action(page, this);
            }
            else {
                let action = _action;
                result = action(page, this);
            }
            return result;
        });
    }
    loadjs(path) {
        return new Promise((reslove, reject) => {
            requirejs([path], function (result) {
                reslove(result);
            }, function (err) {
                reject(err);
            });
        });
    }
    on_pageCreated(page) {
        return this.pageCreated.fire(this, page);
    }
    get currentPage() {
        if (this.page_stack.length > 0)
            return this.page_stack[this.page_stack.length - 1];
        return null;
    }
    getPage(node, values) {
        console.assert(node != null);
        values = values || {};
        let pageName = node.name;
        let cachePage = this.cachePages[pageName];
        if (cachePage != null) {
            cachePage.data = values || {};
            return { page: cachePage, isNew: false };
        }
        let page = this.createPage(pageName, values);
        this.cachePages[pageName] = page;
        this.on_pageCreated(page);
        return { page, isNew: true };
    }
    createPage(pageName, values) {
        if (!pageName)
            throw Errors_1.Errors.argumentNull('pageName');
        values = values || {};
        let element = this.createPageElement(pageName);
        let displayer = new this.pageDisplayType(this);
        console.assert(this.pageType != null);
        let page = new this.pageType({
            app: this,
            name: pageName,
            data: values,
            displayer,
            element,
        });
        let showing = (sender) => {
            this.pageShowing.fire(this, sender);
        };
        let shown = (sender) => {
            this.pageShown.fire(this, sender);
        };
        page.showing.add(showing);
        page.shown.add(shown);
        page.closed.add(() => {
            page.showing.remove(showing);
            page.shown.remove(shown);
        });
        return page;
    }
    createPageElement(pageName) {
        let element = document.createElement(Page_1.Page.tagName);
        this.container.appendChild(element);
        return element;
    }
    showPage(pageName, args, forceRender) {
        args = args || {};
        forceRender = forceRender == null ? false : true;
        if (!pageName)
            throw Errors_1.Errors.argumentNull('pageName');
        let node = this.findSiteMapNode(pageName);
        if (node == null)
            throw Errors_1.Errors.pageNodeNotExists(pageName);
        if (this.currentPage != null && this.currentPage.name == pageName)
            return this.currentPage;
        let { page, isNew } = this.getPage(node, args);
        if (isNew || forceRender) {
            let siteMapNode = this.findSiteMapNode(pageName);
            if (siteMapNode == null)
                throw Errors_1.Errors.pageNodeNotExists(pageName);
            let action = siteMapNode.action;
            if (action == null)
                throw Errors_1.Errors.actionCanntNull(pageName);
            action(page, this);
        }
        page.show();
        this.pushPage(page);
        console.assert(page == this.currentPage, "page is not current page");
        return page;
    }
    closePage(page) {
        if (page == null)
            throw Errors_1.Errors.argumentNull('page');
        page.close();
        delete this.cachePages[page.name];
        this.page_stack = this.page_stack.filter(o => o != page);
    }
    pushPage(page) {
        this.page_stack.push(page);
    }
    findSiteMapNode(pageName) {
        if (this.nodes[pageName])
            return this.nodes[pageName];
        let node = null;
        let action = this.parser.actions ? this.parser.actions[pageName] : null;
        if (action != null) {
            node = { action, name: pageName };
        }
        if (node == null && this.parser.parse != null) {
            node = this.parser.parse(pageName);
            console.assert(node.action != null);
        }
        if (node != null)
            this.nodes[pageName] = node;
        return node;
    }
    closeCurrentPage(passData) {
        var page = this.page_stack.pop();
        if (page == null)
            return;
        this.closePage(page);
        if (this.currentPage) {
            if (passData) {
                console.assert(this.currentPage.data != null);
                this.currentPage.data = Object.assign(this.currentPage.data, passData);
            }
            this.currentPage.show();
        }
    }
    get pageStack() {
        return this.page_stack;
    }
}
PageMaster.isClass = (function () {
    var toString = Function.prototype.toString;
    function fnBody(fn) {
        return toString.call(fn).replace(/^[^{]*{\s*/, '').replace(/\s*}[^}]*$/, '');
    }
    function isClass(fn) {
        return (typeof fn === 'function' &&
            (/^class(\s|\{\}$)/.test(toString.call(fn)) ||
                (/^.*classCallCheck\(/.test(fnBody(fn)))));
    }
    return isClass;
})();
exports.PageMaster = PageMaster;

},{"./Errors":6,"./Extends":7,"./Page":8}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var maishu_chitu_service_1 = require("maishu-chitu-service");
exports.Service = maishu_chitu_service_1.Service;
exports.Callback = maishu_chitu_service_1.Callback;
exports.ValueStore = maishu_chitu_service_1.ValueStore;

},{"maishu-chitu-service":"maishu-chitu-service"}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Application_1 = require("./Application");
exports.Application = Application_1.Application;
var PageMaster_1 = require("./PageMaster");
exports.PageMaster = PageMaster_1.PageMaster;
var Page_1 = require("./Page");
exports.Page = Page_1.Page;
var maishu_chitu_service_1 = require("maishu-chitu-service");
exports.Callback = maishu_chitu_service_1.Callback;
exports.Callbacks = maishu_chitu_service_1.Callbacks;
exports.ValueStore = maishu_chitu_service_1.ValueStore;

},{"./Application":5,"./Page":8,"./PageMaster":9,"maishu-chitu-service":"maishu-chitu-service"}],"maishu-chitu-service":[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var service_1 = require("./service");
exports.Service = service_1.Service;
var callback_1 = require("./callback");
exports.Callback = callback_1.Callback;
exports.Callbacks = callback_1.Callbacks;
var value_store_1 = require("./value-store");
exports.ValueStore = value_store_1.ValueStore;

},{"./callback":1,"./service":3,"./value-store":4}]},{},[11])("maishu-chitu-service")
});
