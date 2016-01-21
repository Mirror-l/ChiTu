var chitu;
(function (chitu) {
    var ns = chitu;
    var u = chitu.Utility;
    var e = chitu.Errors;
    var PAGE_STACK_MAX_SIZE = 10;
    var ACTION_LOCATION_FORMATER = '{controller}/{action}';
    var VIEW_LOCATION_FORMATER = '{controller}/{action}';
    var Application = (function () {
        function Application(config) {
            this.pageCreating = ns.Callbacks();
            this.pageCreated = ns.Callbacks();
            this.page_stack = [];
            this._routes = new RouteCollection();
            this._runned = false;
            this.controllerFactory = new chitu.ControllerFactory();
            this.viewFactory = new chitu.ViewFactory();
            if (config == null)
                throw e.argumentNull('container');
            if (!config.container) {
                throw new Error('The config has not a container property.');
            }
            if (!$.isFunction(config.container) && !config.container['tagName'])
                throw new Error('Parameter container is not a function or html element.');
            this._container = config['container'];
            this._swipe = config.openSwipe || function (routeData) { return chitu.SwipeDirection.None; };
            this._scrollType = config.scrollType || function (routeData) { return chitu.ScrollType.Document; };
        }
        Application.prototype.on_pageCreating = function (context) {
            return ns.fireCallback(this.pageCreating, [this, context]);
        };
        Application.prototype.on_pageCreated = function (page) {
            return ns.fireCallback(this.pageCreated, [this, page]);
        };
        Application.prototype.routes = function () {
            return this._routes;
        };
        Application.prototype.controller = function (routeData) {
            if (typeof routeData !== 'object')
                throw e.paramTypeError('routeData', 'object');
            if (!routeData)
                throw e.argumentNull('routeData');
            return this.controllerFactory.getController(routeData);
        };
        Application.prototype.currentPage = function () {
            if (this.page_stack.length > 0)
                return this.page_stack[this.page_stack.length - 1];
            return null;
        };
        Application.prototype.previousPage = function () {
            if (this.page_stack.length > 1)
                return this.page_stack[this.page_stack.length - 2];
            return null;
        };
        Application.prototype.action = function (routeData) {
            if (typeof routeData !== 'object')
                throw e.paramTypeError('routeData', 'object');
            if (!routeData)
                throw e.argumentNull('routeData');
            var controllerName = routeData.controller;
            if (!controllerName)
                throw e.argumentNull('name');
            if (typeof controllerName != 'string')
                throw e.routeDataRequireController();
            var actionName = routeData.action;
            if (!actionName)
                throw e.argumentNull('name');
            if (typeof actionName != 'string')
                throw e.routeDataRequireAction();
            var controller = this.controller(routeData);
            return controller.getAction(actionName);
        };
        Application.prototype.hashchange = function () {
            var hash = window.location.hash;
            if (!hash) {
                u.log('The url is not contains hash.');
                return;
            }
            var current_page_url = '';
            if (this.previousPage() != null)
                current_page_url = this.previousPage().context().routeData().url();
            if (current_page_url.toLowerCase() == hash.substr(1).toLowerCase()) {
                this.closeCurrentPage();
            }
            else {
                var args = window.location['arguments'] || {};
                window.location['arguments'] = null;
                if (window.location['skip'] == true) {
                    window.location['skip'] = false;
                    return;
                }
                this.showPage(hash.substr(1), args);
            }
        };
        Application.prototype.run = function () {
            if (this._runned)
                return;
            var app = this;
            $.proxy(this.hashchange, this)();
            $(window).bind('hashchange', $.proxy(this.hashchange, this));
            this._runned = true;
        };
        Application.prototype.getCachePage = function (name) {
            for (var i = this.page_stack.length - 1; i >= 0; i--) {
                if (this.page_stack[i].name() == name)
                    return this.page_stack[i];
            }
            return null;
        };
        Application.prototype.showPage = function (url, args) {
            /// <param name="container" type="HTMLElement" canBeNull="false"/>
            /// <param name="url" type="String" canBeNull="false"/>
            /// <param name="args" type="object" canBeNull="true"/>
            /// <returns type="jQuery.Deferred"/>
            args = args || {};
            if (!url)
                throw e.argumentNull('url');
            var routeData = this.routes().getRouteData(url);
            if (routeData == null) {
                throw e.noneRouteMatched(url);
            }
            var container;
            if ($.isFunction(this._container)) {
                container = this._container(routeData.values());
                if (container == null)
                    throw new Error('The result of continer function cannt be null');
            }
            else {
                container = this._container;
            }
            var page_node = document.createElement('div');
            container.appendChild(page_node);
            var page = this._createPage(url, page_node, this.currentPage());
            this.page_stack.push(page);
            console.log('page_stack lenght:' + this.page_stack.length);
            if (this.page_stack.length > PAGE_STACK_MAX_SIZE) {
                var p = this.page_stack.shift();
                p.close();
            }
            var swipe = this._swipe(routeData);
            $.extend(args, routeData.values());
            page.open(args, swipe);
            return page;
        };
        Application.prototype.createPageNode = function () {
            var element = document.createElement('div');
            return element;
        };
        Application.prototype.closeCurrentPage = function () {
            var current = this.currentPage();
            var previous = this.previousPage();
            if (current != null) {
                current.close();
                if (previous != null)
                    previous.show();
                this.page_stack.pop();
                console.log('page_stack lenght:' + this.page_stack.length);
            }
        };
        Application.prototype._createPage = function (url, container, previous) {
            if (!url)
                throw e.argumentNull('url');
            if (!container)
                throw e.argumentNull('element');
            var routeData = this.routes().getRouteData(url);
            if (routeData == null) {
                throw e.noneRouteMatched(url);
            }
            var controllerName = routeData.values().controller;
            var actionName = routeData.values().action;
            var controller = this.controller(routeData);
            var view_deferred = this.viewFactory.getView(routeData);
            var action_deferred = controller.getAction(routeData);
            var context = new ns.ControllerContext(controller, view_deferred, routeData);
            this.on_pageCreating(context);
            var scrollType = this._scrollType(routeData);
            var page = new ns.Page(context, container, scrollType, previous);
            this.on_pageCreated(page);
            $.when(view_deferred, action_deferred).done(function (html, action) {
                page.nodes().content.innerHTML = html;
                action.execute(page);
                page.on_load(context.routeData().values());
            });
            return page;
        };
        Application.prototype.redirect = function (url, args) {
            if (args === void 0) { args = {}; }
            window.location['arguments'] = args;
            window.location.hash = url;
        };
        Application.prototype.back = function (args) {
            if (args === void 0) { args = undefined; }
            if (window.history.length == 0)
                return $.Deferred().reject();
            window.history.back();
            return $.Deferred().resolve();
        };
        return Application;
    })();
    chitu.Application = Application;
})(chitu || (chitu = {}));
//var ns = chitu;
//var e = ns.Errors;
//var u = chitu.Utility;
var crossroads = window['crossroads'];
function interpolate(pattern, data) {
    var http_prefix = 'http://'.toLowerCase();
    if (pattern.substr(0, http_prefix.length).toLowerCase() == http_prefix) {
        var link = document.createElement('a');
        link.setAttribute('href', pattern);
        pattern = decodeURI(link.pathname);
        var route = crossroads.addRoute(pattern);
        return http_prefix + link.host + route.interpolate(data);
    }
    var route = crossroads.addRoute(pattern);
    return route.interpolate(data);
}
var Controller = (function () {
    function Controller(name) {
        //if (!routeData) throw e.argumentNull('routeData');
        ////if (typeof routeData !== 'object') throw e.paramTypeError('routeData', 'object');
        this._actions = {};
        this._name = name;
        this._actions = {};
        this.actionCreated = chitu.Callbacks();
    }
    Controller.prototype.name = function () {
        return this._name;
    };
    Controller.prototype.getAction = function (routeData) {
        /// <param name="value" type="chitu.Action" />
        /// <returns type="jQuery.Deferred" />
        var controller = routeData.values().controller;
        ;
        if (!controller)
            throw e.routeDataRequireController();
        if (this._name != controller) {
            throw new Error('Not same a controller.');
        }
        var name = routeData.values().action;
        if (!name)
            throw e.routeDataRequireAction();
        var self = this;
        if (!this._actions[name]) {
            this._actions[name] = this._createAction(routeData);
        }
        return this._actions[name];
    };
    Controller.prototype._createAction = function (routeData) {
        /// <param name="actionName" type="String"/>
        /// <returns type="jQuery.Deferred"/>
        var actionName = routeData.values().action;
        if (!actionName)
            throw e.routeDataRequireAction();
        var self = this;
        var url = interpolate(routeData.actionPath(), routeData.values());
        var result = $.Deferred();
        requirejs([url], $.proxy(function (obj) {
            if (!obj) {
                result.reject();
            }
            var func = obj.func || obj;
            if (!$.isFunction(func))
                throw ns.Errors.modelFileExpecteFunction(this.actionName);
            var action = new Action(self, this.actionName, func);
            self.actionCreated.fire(self, action);
            this.result.resolve(action);
        }, { actionName: actionName, result: result }), $.proxy(function (err) {
            this.result.reject(err);
        }, { actionName: actionName, result: result }));
        return result;
    };
    return Controller;
})();
var Action = (function () {
    function Action(controller, name, handle) {
        /// <param name="controller" type="chitu.Controller"/>
        /// <param name="name" type="String">Name of the action.</param>
        /// <param name="handle" type="Function"/>
        if (!controller)
            throw e.argumentNull('controller');
        if (!name)
            throw e.argumentNull('name');
        if (!handle)
            throw e.argumentNull('handle');
        if (!$.isFunction(handle))
            throw e.paramTypeError('handle', 'Function');
        this._name = name;
        this._handle = handle;
    }
    Action.prototype.name = function () {
        return this._name;
    };
    Action.prototype.execute = function (page) {
        if (!page)
            throw e.argumentNull('page');
        var result = this._handle.apply({}, [page]);
        return chitu.Utility.isDeferred(result) ? result : $.Deferred().resolve();
    };
    return Action;
})();
function action(deps, filters, func) {
    /// <param name="deps" type="Array" canBeNull="true"/>
    /// <param name="filters" type="Array" canBeNull="true"/>
    /// <param name="func" type="Function" canBeNull="false"/>
    switch (arguments.length) {
        case 0:
            throw e.argumentNull('func');
        case 1:
            if (typeof arguments[0] != 'function')
                throw e.paramTypeError('arguments[0]', 'Function');
            func = deps;
            filters = deps = [];
            break;
        case 2:
            func = filters;
            if (typeof func != 'function')
                throw e.paramTypeError('func', 'Function');
            if (!$.isArray(deps))
                throw e.paramTypeError('deps', 'Array');
            if (deps.length == 0) {
                deps = filters = [];
            }
            else if (typeof deps[0] == 'function') {
                filters = deps;
                deps = [];
            }
            else {
                filters = [];
            }
            break;
    }
    for (var i = 0; i < deps.length; i++) {
        if (typeof deps[i] != 'string')
            throw e.paramTypeError('deps[' + i + ']', 'string');
    }
    for (var i = 0; i < filters.length; i++) {
        if (typeof filters[i] != 'function')
            throw e.paramTypeError('filters[' + i + ']', 'function');
    }
    if (!$.isFunction(func))
        throw e.paramTypeError('func', 'function');
    define(deps, $.proxy(function () {
        var args = Array.prototype.slice.call(arguments, 0);
        var func = this.func;
        var filters = this.filters;
        return {
            func: function (page) {
                args.unshift(page);
                return func.apply(func, args);
            },
            filters: filters
        };
    }, { func: func, filters: filters }));
    return func;
}
;
var chitu;
(function (chitu) {
    var ControllerContext = (function () {
        function ControllerContext(controller, view, routeData) {
            this._routeData = routeData;
            this._controller = controller;
            this._view = view;
            this._routeData = routeData;
        }
        ControllerContext.prototype.controller = function () {
            return this._controller;
        };
        ControllerContext.prototype.view = function () {
            return this._view;
        };
        ControllerContext.prototype.routeData = function () {
            return this._routeData;
        };
        return ControllerContext;
    })();
    chitu.ControllerContext = ControllerContext;
})(chitu || (chitu = {}));
var chitu;
(function (chitu) {
    var e = chitu.Errors;
    var ns = chitu;
    var ControllerFactory = (function () {
        function ControllerFactory() {
            //if (!actionLocationFormater)
            //    throw e.argumentNull('actionLocationFormater');
            this._controllers = {};
            this._controllers = {};
        }
        ControllerFactory.prototype.controllers = function () {
            return this._controllers;
        };
        ControllerFactory.prototype.createController = function (name) {
            /// <param name="routeData" type="Object"/>
            /// <returns type="ns.Controller"/>
            //if (!routeData.values().controller)
            //    throw e.routeDataRequireController();
            return new Controller(name);
        };
        ControllerFactory.prototype.actionLocationFormater = function () {
            return this._actionLocationFormater;
        };
        ControllerFactory.prototype.getController = function (routeData) {
            /// <summary>Gets the controller by routeData.</summary>
            /// <param name="routeData" type="Object"/>
            /// <returns type="chitu.Controller"/>
            if (!routeData.values().controller)
                throw e.routeDataRequireController();
            if (!this._controllers[routeData.values().controller])
                this._controllers[routeData.values().controller] = this.createController(routeData.values().controller);
            return this._controllers[routeData.values().controller];
        };
        return ControllerFactory;
    })();
    chitu.ControllerFactory = ControllerFactory;
})(chitu || (chitu = {}));
var chitu;
(function (chitu) {
    var u = chitu.Utility;
    var Errors = (function () {
        function Errors() {
        }
        Errors.argumentNull = function (paramName) {
            var msg = u.format('The argument "{0}" cannt be null.', paramName);
            return new Error(msg);
        };
        Errors.modelFileExpecteFunction = function (script) {
            var msg = u.format('The eval result of script file "{0}" is expected a function.', script);
            return new Error(msg);
        };
        Errors.paramTypeError = function (paramName, expectedType) {
            /// <param name="paramName" type="String"/>
            /// <param name="expectedType" type="String"/>
            var msg = u.format('The param "{0}" is expected "{1}" type.', paramName, expectedType);
            return new Error(msg);
        };
        Errors.viewNodeNotExists = function (name) {
            var msg = u.format('The view node "{0}" is not exists.', name);
            return new Error(msg);
        };
        Errors.pathPairRequireView = function (index) {
            var msg = u.format('The view value is required for path pair, but the item with index "{0}" is miss it.', index);
            return new Error(msg);
        };
        Errors.notImplemented = function (name) {
            var msg = u.format('The method "{0}" is not implemented.', name);
            return new Error(msg);
        };
        Errors.routeExists = function (name) {
            var msg = u.format('Route named "{0}" is exists.', name);
            return new Error(msg);
        };
        Errors.routeResultRequireController = function (routeName) {
            var msg = u.format('The parse result of route "{0}" does not contains controler.', routeName);
            return new Error(msg);
        };
        Errors.routeResultRequireAction = function (routeName) {
            var msg = u.format('The parse result of route "{0}" does not contains action.', routeName);
            return new Error(msg);
        };
        Errors.ambiguityRouteMatched = function (url, routeName1, routeName2) {
            var msg = u.format('Ambiguity route matched, {0} is match in {1} and {2}.', url, routeName1, routeName2);
            return new Error(msg);
        };
        Errors.noneRouteMatched = function (url) {
            var msg = u.format('None route matched with url "{0}".', url);
            var error = new Error(msg);
            return error;
        };
        Errors.emptyStack = function () {
            return new Error('The stack is empty.');
        };
        Errors.canntParseUrl = function (url) {
            var msg = u.format('Can not parse the url "{0}" to route data.', url);
            return new Error(msg);
        };
        Errors.routeDataRequireController = function () {
            var msg = 'The route data does not contains a "controller" file.';
            return new Error(msg);
        };
        Errors.routeDataRequireAction = function () {
            var msg = 'The route data does not contains a "action" file.';
            return new Error(msg);
        };
        Errors.parameterRequireField = function (fileName, parameterName) {
            var msg = u.format('Parameter {1} does not contains field {0}.', fileName, parameterName);
            return new Error(msg);
        };
        return Errors;
    })();
    chitu.Errors = Errors;
})(chitu || (chitu = {}));
var chitu;
(function (chitu) {
    var rnotwhite = (/\S+/g);
    var optionsCache = {};
    function createOptions(options) {
        var object = optionsCache[options] = {};
        jQuery.each(options.match(rnotwhite) || [], function (_, flag) {
            object[flag] = true;
        });
        return object;
    }
    var Callback = (function () {
        function Callback(source) {
            this.source = source;
        }
        Callback.prototype.add = function (func) {
            this.source.add(func);
        };
        Callback.prototype.remove = function (func) {
            this.source.remove(func);
        };
        Callback.prototype.has = function (func) {
            return this.source.has(func);
        };
        Callback.prototype.fireWith = function (context, args) {
            return this.source.fireWith(context, args);
        };
        Callback.prototype.fire = function (arg1, arg2, arg3, arg4) {
            return this.source.fire(arg1, arg2, arg3);
        };
        return Callback;
    })();
    chitu.Callback = Callback;
    function Callbacks(options) {
        if (options === void 0) { options = null; }
        options = typeof options === "string" ?
            (optionsCache[options] || createOptions(options)) :
            jQuery.extend({}, options);
        var memory, fired, firing, firingStart, firingLength, firingIndex, list = [], stack = !options.once && [], fire = function (data) {
            memory = options.memory && data;
            fired = true;
            firingIndex = firingStart || 0;
            firingStart = 0;
            firingLength = list.length;
            firing = true;
            for (; list && firingIndex < firingLength; firingIndex++) {
                var result = list[firingIndex].apply(data[0], data[1]);
                if (result != null) {
                    data[0].results.push(result);
                }
                if (result === false && options.stopOnFalse) {
                    memory = false;
                    break;
                }
            }
            firing = false;
            if (list) {
                if (stack) {
                    if (stack.length) {
                        fire(stack.shift());
                    }
                }
                else if (memory) {
                    list = [];
                }
                else {
                    self.disable();
                }
            }
        }, self = {
            results: [],
            add: function () {
                if (list) {
                    var start = list.length;
                    (function add(args) {
                        jQuery.each(args, function (_, arg) {
                            var type = jQuery.type(arg);
                            if (type === "function") {
                                if (!options.unique || !self.has(arg)) {
                                    list.push(arg);
                                }
                            }
                            else if (arg && arg.length && type !== "string") {
                                add(arg);
                            }
                        });
                    })(arguments);
                    if (firing) {
                        firingLength = list.length;
                    }
                    else if (memory) {
                        firingStart = start;
                        fire(memory);
                    }
                }
                return this;
            },
            remove: function () {
                if (list) {
                    jQuery.each(arguments, function (_, arg) {
                        var index;
                        while ((index = jQuery.inArray(arg, list, index)) > -1) {
                            list.splice(index, 1);
                            if (firing) {
                                if (index <= firingLength) {
                                    firingLength--;
                                }
                                if (index <= firingIndex) {
                                    firingIndex--;
                                }
                            }
                        }
                    });
                }
                return this;
            },
            has: function (fn) {
                return fn ? jQuery.inArray(fn, list) > -1 : !!(list && list.length);
            },
            empty: function () {
                list = [];
                firingLength = 0;
                return this;
            },
            disable: function () {
                list = stack = memory = undefined;
                return this;
            },
            disabled: function () {
                return !list;
            },
            lock: function () {
                stack = undefined;
                if (!memory) {
                    self.disable();
                }
                return this;
            },
            locked: function () {
                return !stack;
            },
            fireWith: function (context, args) {
                context.results = [];
                if (list && (!fired || stack)) {
                    args = args || [];
                    args = [context, args.slice ? args.slice() : args];
                    if (firing) {
                        stack.push(args);
                    }
                    else {
                        fire(args);
                    }
                }
                return context.results;
            },
            fire: function () {
                return self.fireWith(this, arguments);
            },
            fired: function () {
                return !!fired;
            },
            count: function () {
                return list.length;
            }
        };
        return new chitu.Callback(self);
    }
    chitu.Callbacks = Callbacks;
    function fireCallback(callback, args) {
        var results = callback.fire.apply(callback, args);
        var deferreds = [];
        for (var i = 0; i < results.length; i++) {
            if (chitu.Utility.isDeferred(results[i]))
                deferreds.push(results[i]);
        }
        if (deferreds.length == 0)
            return $.Deferred().resolve();
        return $.when.apply($, deferreds);
    }
    chitu.fireCallback = fireCallback;
    var crossroads = window['crossroads'];
    $.extend(crossroads, {
        _create: crossroads.create,
        create: function () {
            var obj = this._create();
            obj.getRouteData = function (request, defaultArgs) {
                request = request || '';
                defaultArgs = defaultArgs || [];
                if (!this.ignoreState &&
                    (request === this._prevMatchedRequest ||
                        request === this._prevBypassedRequest)) {
                    return;
                }
                var routes = this._getMatchedRoutes(request), i = 0, n = routes.length, cur;
                if (n == 0)
                    return null;
                if (n > 1) {
                    throw chitu.Errors.ambiguityRouteMatched(request, 'route1', 'route2');
                }
                return routes[0];
            };
            return obj;
        }
    });
})(chitu || (chitu = {}));
var chitu;
(function (chitu) {
    var ns = chitu;
    var u = chitu.Utility;
    var e = chitu.Errors;
    function eventDeferred(callback, sender, args) {
        if (args === void 0) { args = {}; }
        return chitu.fireCallback(callback, [sender, args]);
    }
    ;
    var PAGE_CLASS_NAME = 'page-node';
    var PAGE_HEADER_CLASS_NAME = 'page-header';
    var PAGE_BODY_CLASS_NAME = 'page-body';
    var PAGE_FOOTER_CLASS_NAME = 'page-footer';
    var PAGE_LOADING_CLASS_NAME = 'page-loading';
    var PAGE_CONTENT_CLASS_NAME = 'page-content';
    var ShowTypes;
    (function (ShowTypes) {
        ShowTypes[ShowTypes["swipeLeft"] = 0] = "swipeLeft";
        ShowTypes[ShowTypes["swipeRight"] = 1] = "swipeRight";
        ShowTypes[ShowTypes["none"] = 2] = "none";
    })(ShowTypes || (ShowTypes = {}));
    var PageNodeParts;
    (function (PageNodeParts) {
        PageNodeParts[PageNodeParts["header"] = 1] = "header";
        PageNodeParts[PageNodeParts["body"] = 2] = "body";
        PageNodeParts[PageNodeParts["loading"] = 4] = "loading";
        PageNodeParts[PageNodeParts["footer"] = 8] = "footer";
    })(PageNodeParts || (PageNodeParts = {}));
    var PageStatus;
    (function (PageStatus) {
        PageStatus[PageStatus["open"] = 0] = "open";
        PageStatus[PageStatus["closed"] = 1] = "closed";
    })(PageStatus || (PageStatus = {}));
    (function (SwipeDirection) {
        SwipeDirection[SwipeDirection["None"] = 0] = "None";
        SwipeDirection[SwipeDirection["Left"] = 1] = "Left";
        SwipeDirection[SwipeDirection["Right"] = 2] = "Right";
        SwipeDirection[SwipeDirection["Up"] = 3] = "Up";
        SwipeDirection[SwipeDirection["Donw"] = 4] = "Donw";
    })(chitu.SwipeDirection || (chitu.SwipeDirection = {}));
    var SwipeDirection = chitu.SwipeDirection;
    (function (ScrollType) {
        ScrollType[ScrollType["IScroll"] = 0] = "IScroll";
        ScrollType[ScrollType["Div"] = 1] = "Div";
        ScrollType[ScrollType["Document"] = 2] = "Document";
    })(chitu.ScrollType || (chitu.ScrollType = {}));
    var ScrollType = chitu.ScrollType;
    var PageNodes = (function () {
        function PageNodes(node) {
            node.className = PAGE_CLASS_NAME;
            this.container = node;
            this.header = document.createElement('div');
            this.header.className = PAGE_HEADER_CLASS_NAME;
            node.appendChild(this.header);
            this.body = document.createElement('div');
            this.body.className = PAGE_BODY_CLASS_NAME;
            node.appendChild(this.body);
            this.content = document.createElement('div');
            this.content.className = PAGE_CONTENT_CLASS_NAME;
            $(this.content).hide();
            this.body.appendChild(this.content);
            this.loading = document.createElement('div');
            this.loading.className = PAGE_LOADING_CLASS_NAME;
            this.loading.innerHTML = '<div class="spin"><i class="icon-spinner icon-spin"></i><div>';
            this.body.appendChild(this.loading);
            this.footer = document.createElement('div');
            this.footer.className = PAGE_FOOTER_CLASS_NAME;
            node.appendChild(this.footer);
        }
        return PageNodes;
    })();
    var Page = (function () {
        function Page(context, element, scrollType, previous) {
            this._loadViewModelResult = null;
            this._openResult = null;
            this._hideResult = null;
            this._showTime = Page.animationTime;
            this._hideTime = Page.animationTime;
            this.init = ns.Callbacks();
            this.preLoad = ns.Callbacks();
            this.load = ns.Callbacks();
            this.loadCompleted = ns.Callbacks();
            this.closing = ns.Callbacks();
            this.closed = ns.Callbacks();
            this.scroll = ns.Callbacks();
            this.showing = ns.Callbacks();
            this.shown = ns.Callbacks();
            this.hiding = ns.Callbacks();
            this.hidden = ns.Callbacks();
            this.scrollEnd = ns.Callbacks();
            if (!context)
                throw e.argumentNull('context');
            if (!element)
                throw e.argumentNull('element');
            if (scrollType == null)
                throw e.argumentNull('scrollType');
            var controllerName = context.routeData().values().controller;
            var actionName = context.routeData().values().action;
            this._name = Page.getPageName(context.routeData());
            this._context = context;
            this._prevous = previous;
            this._pageNode = new PageNodes(element);
            if (scrollType == ScrollType.IScroll) {
                $(this.nodes().container).addClass('ios');
                this.ios_scroller = new IOSScroll(this);
            }
            else if (scrollType == ScrollType.Div) {
                $(this.nodes().container).addClass('div');
                new DisScroll(this);
            }
            else if (scrollType == ScrollType.Document) {
                $(this.nodes().container).addClass('doc');
                new DocumentScroll(this);
            }
        }
        Page.getPageName = function (routeData) {
            var name;
            if (routeData.pageName()) {
                var route = window['crossroads'].addRoute(routeData.pageName());
                name = route.interpolate(routeData.values());
            }
            else {
                name = routeData.values().controller + '.' + routeData.values().action;
            }
            return name;
        };
        Page.prototype.context = function () {
            return this._context;
        };
        Page.prototype.name = function () {
            return this._name;
        };
        Page.prototype.node = function () {
            return this._pageNode.container;
        };
        Page.prototype.nodes = function () {
            return this._pageNode;
        };
        Page.prototype.previous = function () {
            return this._prevous;
        };
        Page.prototype.hide = function (swipe) {
            debugger;
            if (!$(this.node()).is(':visible'))
                return;
            swipe = swipe || SwipeDirection.None;
            this.hidePageNode(swipe);
        };
        Page.prototype.show = function (swipe) {
            if ($(this.node()).is(':visible'))
                return;
            swipe = swipe || SwipeDirection.None;
            this.showPageNode(swipe);
        };
        Page.prototype.visible = function () {
            return $(this.node()).is(':visible');
        };
        Page.prototype.hidePageNode = function (swipe) {
            var _this = this;
            var result = $.Deferred();
            var container_width = $(this.nodes().container).width();
            var container_height = $(this.nodes().container).height();
            var on_end = function () {
                $(_this.node()).hide();
                result.resolve();
                _this.on_hidden({});
            };
            switch (swipe) {
                case SwipeDirection.None:
                default:
                    on_end();
                    break;
                case SwipeDirection.Up:
                    move(this.nodes().container).y(container_height).end()
                        .y(0 - container_height).duration(this._hideTime).end(on_end);
                    break;
                case SwipeDirection.Donw:
                    move(this.nodes().container).y(container_height).duration(this._hideTime).end(on_end);
                    break;
                case SwipeDirection.Right:
                    move(this.node())
                        .x(container_width)
                        .duration(this._hideTime)
                        .end(on_end);
                    break;
                case SwipeDirection.Left:
                    move(this.node())
                        .x(0 - container_width)
                        .duration(this._hideTime)
                        .end(on_end);
                    break;
            }
            return result;
        };
        Page.prototype.showPageNode = function (swipe) {
            var _this = this;
            this.on_showing({});
            var result = $.Deferred();
            this.node().style.display = 'block';
            var container_width = $(this.nodes().container).width();
            var container_height = $(this.nodes().container).height();
            var on_end = function () {
                result.resolve();
            };
            switch (swipe) {
                case SwipeDirection.None:
                default:
                    on_end();
                    break;
                case SwipeDirection.Donw:
                    move(this.node()).y(0 - container_height).duration(0).end(on_end);
                    move(this.node()).y(0).duration(0).end(on_end);
                    break;
                case SwipeDirection.Up:
                    move(this.node()).y(container_height).duration(0).end();
                    move(this.node()).y(0).duration(this._showTime).end(on_end);
                    break;
                case SwipeDirection.Right:
                    move(this.node()).x(0 - container_width).duration(0).end();
                    move(this.node()).x(0).duration(this._showTime).end(on_end);
                    break;
                case SwipeDirection.Left:
                    move(this.node()).x(container_width).duration(0).end();
                    move(this.node()).x(0).duration(this._showTime).end(on_end);
                    break;
            }
            result.done(function () {
                if (_this._prevous != null)
                    _this._prevous.hide();
            });
            return result;
        };
        Page.prototype.showBodyNode = function () {
            $(this._pageNode.container).show();
            $(this._pageNode.loading).hide();
            $(this._pageNode.body).show();
            this.on_shown({});
        };
        Page.prototype.on_load = function (args) {
            var _this = this;
            var result = eventDeferred(this.load, this, args);
            result.done(function () {
                eventDeferred(_this.loadCompleted, _this, args);
                if (_this.ios_scroller)
                    _this.ios_scroller.refresh();
            });
            return result;
        };
        Page.prototype.on_closed = function (args) {
            return eventDeferred(this.closed, this, args);
        };
        Page.prototype.on_scroll = function (args) {
            return eventDeferred(this.scroll, this, args);
        };
        Page.prototype.on_showing = function (args) {
            return eventDeferred(this.showing, this, args);
        };
        Page.prototype.on_shown = function (args) {
            return eventDeferred(this.shown, this, args);
        };
        Page.prototype.on_hiding = function (args) {
            return eventDeferred(this.hiding, this, args);
        };
        Page.prototype.on_hidden = function (args) {
            return eventDeferred(this.hidden, this, args);
        };
        Page.prototype.on_scrollEnd = function (args) {
            return eventDeferred(this.scrollEnd, this, args);
        };
        Page.prototype.open = function (args, swipe) {
            var _this = this;
            if (this._openResult)
                return this._openResult;
            args = args || {};
            swipe = swipe || SwipeDirection.None;
            $(this.nodes().loading).show();
            this.loadCompleted.add(function () {
                $(_this.nodes().loading).hide();
                $(_this.nodes().content).show();
            });
            this.showPageNode(swipe);
        };
        Page.prototype.close = function (args, swipe) {
            /// <summary>
            /// Colse the page.
            /// </summary>
            /// <param name="args" type="Object" canBeNull="true">
            /// The value passed to the hide event functions.
            /// </param>
            /// <returns type="jQuery.Deferred"/>
            var _this = this;
            if (args === void 0) { args = undefined; }
            this.hidePageNode(swipe).done(function () {
                $(_this.node()).remove();
            });
            args = args || {};
            this.on_closed(args);
        };
        Page.animationTime = 300;
        return Page;
    })();
    chitu.Page = Page;
})(chitu || (chitu = {}));
;
var Route = (function () {
    function Route(name, pattern, defaults) {
        this._name = name;
        this._pattern = pattern;
        this._defaults = defaults;
    }
    Route.prototype.name = function () {
        return this._name;
    };
    Route.prototype.defaults = function () {
        return this._defaults;
    };
    Route.prototype.url = function () {
        return this._pattern;
    };
    return Route;
})();
var ns = chitu;
var e = chitu.Errors;
var RouteCollection = (function () {
    function RouteCollection() {
        this._init();
    }
    RouteCollection.prototype._init = function () {
        var crossroads = window['crossroads'];
        this._source = crossroads.create();
        this._source.ignoreCase = true;
        this._source.normalizeFn = crossroads.NORM_AS_OBJECT;
        this._priority = 0;
    };
    RouteCollection.prototype.count = function () {
        return this._source.getNumRoutes();
    };
    RouteCollection.prototype.mapRoute = function (args) {
        args = args || {};
        var name = args.name;
        var url = args.url;
        var defaults = args.defaults;
        var rules = args.rules || {};
        if (!name)
            throw e.argumentNull('name');
        if (!url)
            throw e.argumentNull('url');
        this._priority = this._priority + 1;
        var route = new Route(name, url, defaults);
        route.viewPath = args.viewPath;
        route.actionPath = args.actionPath;
        var originalRoute = this._source.addRoute(url, function (args) {
        }, this._priority);
        originalRoute.rules = rules;
        originalRoute.newRoute = route;
        if (this._defaultRoute == null) {
            this._defaultRoute = route;
            if (this._defaultRoute.viewPath == null)
                throw new Error('default route require view path.');
            if (this._defaultRoute.actionPath == null)
                throw new Error('default route require action path.');
        }
        route.viewPath = route.viewPath || this._defaultRoute.viewPath;
        route.actionPath = route.actionPath || this._defaultRoute.actionPath;
        return route;
    };
    RouteCollection.prototype.getRouteData = function (url) {
        var data = this._source.getRouteData(url);
        if (data == null)
            throw e.canntParseUrl(url);
        var values = {};
        var paramNames = data.route._paramsIds || [];
        for (var i = 0; i < paramNames.length; i++) {
            var key = paramNames[i];
            values[key] = data.params[0][key];
        }
        var routeData = new RouteData(url);
        routeData.values(values);
        routeData.actionPath(data.route.newRoute.actionPath);
        routeData.viewPath(data.route.newRoute.viewPath);
        return routeData;
    };
    RouteCollection.defaultRouteName = 'default';
    return RouteCollection;
})();
var RouteData = (function () {
    function RouteData(url) {
        this._url = url;
    }
    RouteData.prototype.values = function (value) {
        if (value === void 0) { value = undefined; }
        if (value !== undefined)
            this._values = value;
        return this._values;
    };
    RouteData.prototype.viewPath = function (value) {
        if (value === void 0) { value = undefined; }
        if (value !== undefined)
            this._viewPath = value;
        return this._viewPath;
    };
    RouteData.prototype.actionPath = function (value) {
        if (value === void 0) { value = undefined; }
        if (value !== undefined)
            this._actionPath = value;
        return this._actionPath;
    };
    RouteData.prototype.pageName = function (value) {
        if (value === void 0) { value = undefined; }
        if (value !== undefined)
            this._pageName = value;
        return this._pageName;
    };
    RouteData.prototype.url = function () {
        return this._url;
    };
    return RouteData;
})();
var ScrollArguments = (function () {
    function ScrollArguments() {
    }
    return ScrollArguments;
})();
var DisScroll = (function () {
    function DisScroll(page) {
        var cur_scroll_args = new ScrollArguments();
        var pre_scroll_top;
        var checking_num;
        var CHECK_INTERVAL = 300;
        var scrollEndCheck = function (page) {
            if (checking_num != null)
                return;
            checking_num = 0;
            checking_num = window.setInterval(function () {
                if (pre_scroll_top == cur_scroll_args.scrollTop) {
                    window.clearInterval(checking_num);
                    checking_num = null;
                    pre_scroll_top = null;
                    page.on_scrollEnd(cur_scroll_args);
                    return;
                }
                pre_scroll_top = cur_scroll_args.scrollTop;
            }, CHECK_INTERVAL);
        };
        var wrapper_node = page.nodes().body;
        wrapper_node.onscroll = function () {
            var args = {
                scrollTop: wrapper_node.scrollTop,
                scrollHeight: wrapper_node.scrollHeight,
                clientHeight: wrapper_node.clientHeight
            };
            page.on_scroll(args);
            cur_scroll_args.clientHeight = args.clientHeight;
            cur_scroll_args.scrollHeight = args.scrollHeight;
            cur_scroll_args.scrollTop = args.scrollTop;
            scrollEndCheck(page);
        };
    }
    return DisScroll;
})();
var cur_scroll_args = new ScrollArguments();
var pre_scroll_top;
var checking_num;
var CHECK_INTERVAL = 300;
function scrollEndCheck(page) {
    if (checking_num != null)
        return;
    checking_num = 0;
    checking_num = window.setInterval(function () {
        if (pre_scroll_top == cur_scroll_args.scrollTop) {
            window.clearInterval(checking_num);
            checking_num = null;
            pre_scroll_top = null;
            page['on_scrollEnd'](cur_scroll_args);
            return;
        }
        pre_scroll_top = cur_scroll_args.scrollTop;
    }, CHECK_INTERVAL);
}
var DocumentScroll = (function () {
    function DocumentScroll(page) {
        $(document).scroll(function (event) {
            var args = {
                scrollTop: $(document).scrollTop(),
                scrollHeight: document.body.scrollHeight,
                clientHeight: $(window).height()
            };
            cur_scroll_args.clientHeight = args.clientHeight;
            cur_scroll_args.scrollHeight = args.scrollHeight;
            cur_scroll_args.scrollTop = args.scrollTop;
            if (page.visible())
                scrollEndCheck(page);
        });
    }
    return DocumentScroll;
})();
var _this = this;
var IOSScroll = (function () {
    function IOSScroll(page) {
        var options = {
            tap: true,
            useTransition: false,
            HWCompositing: false,
            preventDefault: true,
            probeType: 1,
        };
        var iscroller = this.iscroller = page['iscroller'] = new IScroll(page.nodes().body, options);
        iscroller.on('scrollEnd', function () {
            var scroller = this;
            var args = {
                scrollTop: 0 - scroller.y,
                scrollHeight: scroller.scrollerHeight,
                clientHeight: scroller.wrapperHeight
            };
            console.log('directionY:' + scroller.directionY);
            console.log('startY:' + scroller.startY);
            console.log('scroller.y:' + scroller.y);
            page.on_scrollEnd(args);
        });
        iscroller.on('scroll', function () {
            var scroller = this;
            var args = {
                scrollTop: 0 - scroller.y,
                scrollHeight: scroller.scrollerHeight,
                clientHeight: scroller.wrapperHeight
            };
            console.log('directionY:' + scroller.directionY);
            console.log('startY:' + scroller.startY);
            console.log('scroller.y:' + scroller.y);
            page.on_scroll(args);
        });
        (function (scroller, wrapperNode) {
            $(wrapperNode).on('tap', function (event) {
                if (page['iscroller'].enabled == false)
                    return;
                var MAX_DEEPH = 4;
                var deeph = 1;
                var node = event.target;
                while (node != null) {
                    if (node.tagName == 'A')
                        return window.open($(node).attr('href'), '_self');
                    node = node.parentNode;
                    deeph = deeph + 1;
                    if (deeph > MAX_DEEPH)
                        return;
                }
            });
        })(iscroller, page.nodes().body);
        page.closed.add(function () { return iscroller.destroy(); });
        $(window).on('resize', function () {
            window.setTimeout(function () { return iscroller.refresh(); }, 500);
        });
    }
    IOSScroll.prototype.refresh = function () {
        this.iscroller.refresh();
    };
    return IOSScroll;
})();
chitu.scroll = function (page, config) {
    $(page.nodes().body).addClass('wrapper');
    $(page.nodes().content).addClass('scroller');
    var wrapperNode = page['_wrapperNode'] = page.nodes().body;
    page['_scrollerNode'] = page.nodes().content;
    $.extend(page, {
        scrollEnd: chitu.Callbacks(),
        on_scrollEnd: function (args) {
            return chitu.fireCallback(this.scrollEnd, [this, args]);
        },
        scrollTop: $.proxy(function (value) {
            if (value === undefined)
                return (0 - page['iscroller'].y) + 'px';
            if (typeof value === 'string')
                value = new Number(value.substr(0, value.length - 2)).valueOf();
            var scroller = _this['iscroller'];
            if (scroller) {
                scroller.scrollTo(0, value);
            }
        }, page)
    });
    var page_shown = function (sender) {
        window.setTimeout(function () {
            page['iscroller'].refresh();
        }, 500);
    };
    page.shown.add(page_shown);
    if (page.visible())
        page_shown(page);
};
var chitu;
(function (chitu) {
    var e = chitu.Errors;
    var Utility = (function () {
        function Utility() {
        }
        Utility.isType = function (targetType, obj) {
            for (var key in targetType.prototype) {
                if (obj[key] === undefined)
                    return false;
            }
            return true;
        };
        Utility.isDeferred = function (obj) {
            if (obj == null)
                return false;
            if (obj.pipe != null && obj.always != null && obj.done != null)
                return true;
            return false;
        };
        Utility.format = function (source, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10) {
            var params = [arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10];
            for (var i = 0; i < params.length; i++) {
                if (params[i] == null)
                    break;
                source = source.replace(new RegExp("\\{" + i + "\\}", "g"), function () {
                    return params[i];
                });
            }
            return source;
        };
        Utility.fileName = function (url, withExt) {
            if (!url)
                throw e.argumentNull('url');
            withExt = withExt || true;
            url = url.replace('http://', '/');
            var filename = url.replace(/^.*[\\\/]/, '');
            if (withExt === true) {
                var arr = filename.split('.');
                filename = arr[0];
            }
            return filename;
        };
        Utility.log = function (msg, args) {
            if (args === void 0) { args = []; }
            if (!window.console)
                return;
            if (args == null) {
                console.log(msg);
                return;
            }
            var txt = this.format.apply(this, arguments);
            console.log(txt);
        };
        return Utility;
    })();
    chitu.Utility = Utility;
})(chitu || (chitu = {}));
var chitu;
(function (chitu) {
    var e = chitu.Errors;
    var crossroads = window['crossroads'];
    function interpolate(pattern, data) {
        var http_prefix = 'http://'.toLowerCase();
        if (pattern.substr(0, http_prefix.length).toLowerCase() == http_prefix) {
            var link = document.createElement('a');
            link.setAttribute('href', pattern);
            pattern = decodeURI(link.pathname);
            var route = crossroads.addRoute(pattern);
            return http_prefix + link.host + route.interpolate(data);
        }
        var route = crossroads.addRoute(pattern);
        return route.interpolate(data);
    }
    var ViewFactory = (function () {
        function ViewFactory() {
            this._views = [];
        }
        ViewFactory.prototype.getView = function (routeData) {
            /// <param name="routeData" type="Object"/>
            /// <returns type="jQuery.Deferred"/>
            if (!routeData.values().controller)
                throw e.routeDataRequireController();
            if (!routeData.values().action)
                throw e.routeDataRequireAction();
            var url = interpolate(routeData.viewPath(), routeData.values());
            var self = this;
            var viewName = routeData.values().controller + '_' + routeData.values().action;
            if (!this._views[viewName]) {
                this._views[viewName] = $.Deferred();
                var http = 'http://';
                if (url.substr(0, http.length).toLowerCase() == http) {
                    $.ajax({ url: url })
                        .done($.proxy(function (html) {
                        if (html != null)
                            this.deferred.resolve(html);
                        else
                            this.deferred.reject();
                    }, { deferred: this._views[viewName] }))
                        .fail($.proxy(function (err) {
                        this.deferred.reject(err);
                    }, { deferred: this._views[viewName] }));
                }
                else {
                    requirejs(['text!' + url], $.proxy(function (html) {
                        if (html != null)
                            this.deferred.resolve(html);
                        else
                            this.deferred.reject();
                    }, { deferred: this._views[viewName] }), $.proxy(function (err) {
                        this.deferred.reject(err);
                    }, { deferred: this._views[viewName] }));
                }
            }
            return this._views[viewName];
        };
        return ViewFactory;
    })();
    chitu.ViewFactory = ViewFactory;
})(chitu || (chitu = {}));