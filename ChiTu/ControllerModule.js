﻿(function (ns) {
    var e = ns.Error;
    var u = ns.utility;

    ns.Controller = function (name, actionLocationFormater) {
        if (!name) throw e.argumentNull('name');
        if (!actionLocationFormater) throw e.argumentNull('actionLocationFormater');

        this._name = name;
        this._actionLocationFormater = actionLocationFormater;
        this._actions = {};

        this._actionLocationRoute = crossroads.addRoute(actionLocationFormater);

        this.actionCreated = chitu.Callbacks();
    };

    ns.Controller.prototype = {
        actionLocationFormater: function () {
            return this._actionLocationFormater;
        },
        name: function () {
            return this._name;
        },
        getLocation: function (actionName) {
            /// <param name="actionName" type="String"/>
            /// <returns type="String"/>
            if (!actionName) throw e.argumentNull('actionName');
            if (typeof actionName != 'string') throw e.paramTypeError('actionName', 'String');

            var controllerName = this.name();
            return this._actionLocationRoute.interpolate({ controller: controllerName, action: actionName });
        },
        action: function (name) {
            /// <param name="value" type="chitu.Action" />
            /// <returns type="jQuery.Deferred" />
            if (!name) throw e.argumentNull('name');
            if (typeof name != 'string') throw e.paramTypeError('name', 'String');

            var self = this;
            if (!this._actions[name]) {
                this._actions[name] = this._createAction(name).fail($.proxy(
                    function () {
                        self._actions[this.actionName] = null;
                    },
                    { actionName: name })
                );
            }

            return this._actions[name];
        },
        _createAction: function (actionName) {
            /// <param name="actionName" type="String"/>
            /// <returns type="jQuery.Deferred"/>
            if (!actionName)
                throw e.argumentNull('actionName');

            var self = this;
            var url = this.getLocation(actionName);
            var result = $.Deferred();

            require([url],
                $.proxy(function (obj) {
                    //加载脚本失败
                    if (!obj) {
                        console.warn(u.format('加载活动“{1}.{0}”失败，为该活动提供默认的值。', this.actionName, self.name()));
                        obj = { func: function () { } };
                        //result.reject();
                    }

                    var func = obj.func;

                    if (!$.isFunction(func))
                        throw ns.Error.modelFileExpecteFunction(this.actionName);

                    var action = new ns.Action(self, this.actionName, func);
                    self.actionCreated.fire(self, action);

                    this.result.resolve(action);
                }, { actionName: actionName, result: result }),

                $.proxy(function (err) {
                    this.result.reject(err);
                }, { actionName: actionName, result: result })
           );

            return result;
        }
    };

    ns.ControllerFactory = function (actionLocationFormater) {
        if (!actionLocationFormater)
            throw e.argumentNull('actionLocationFormater');

        this._controllers = {};
        this._actionLocationFormater = actionLocationFormater;
    };

    ns.ControllerFactory.prototype = {
        controllers: function () {
            return this._controllers;
        },
        createController: function (controllerName) {
            /// <param name="controllerName" type="String"/>
            /// <returns type="ns.Controller"/>
            return new ns.Controller(controllerName, this.actionLocationFormater());
        },
        actionLocationFormater: function () {
            return this._actionLocationFormater;
        },
        getController: function (controllerName) {
            /// <summary>Gets the controller by name.</summary>
            /// <param name="controllerName" type="String"/>
            /// <returns type="chitu.Controller"/>
            if (!this._controllers[controllerName])
                this._controllers[controllerName] = this.createController(controllerName);

            return this._controllers[controllerName];
        }
    };

    ns.Action = function (controller, name, handle) {
        /// <param name="controller" type="chitu.Controller"/>
        /// <param name="name" type="String">Name of the action.</param>
        /// <param name="handle" type="Function"/>

        if (!controller) throw e.argumentNull('controller');
        if (!name) throw e.argumentNull('name');
        if (!handle) throw e.argumentNull('handle');
        if (!$.isFunction(handle)) throw e.paramTypeError('handle', 'Function');

        this._name = name;
        this._handle = handle;
        //this.executing = ns.Callbacks();
        //this.executed = ns.Callbacks();
    };
    ns.Action.prototype = {
        name: function () {
            return this._name;
        },
        execute: function (page) {
            /// <param name="page" type="chitu.Page"/>
            /// <returns type="jQuery.Deferred"/>
            if (!page) throw e.argumentNull('page');
            if (page._type != 'Page') throw e.paramTypeError('page', 'Page');

            var result = this._handle.apply(ns.app, [page]);
            return u.isDeferred(result) ? result : $.Deferred().resolve();
        }
    }

    // #region ViewEngine
    ns.ViewEngine = function (controllerName, viewLocationFormater) {
        if (!controllerName) throw e.argumentNull('controllerName');
        if (!viewLocationFormater) throw e.argumentNull('viewLocationFormater');

        this._controllerName = controllerName;
        this._viewLocationFormater = viewLocationFormater;
        this._viewLocationRoute = crossroads.addRoute(viewLocationFormater);
        this._views = {};
    };
    ns.ViewEngine.prototype = {
        //views: {},
        viewFileExtension: 'html',
        viewLocationFormater: function () {
            return this._viewLocationFormater;
        },
        controllerName: function () {
            return this._controllerName;
        },
        getLocation: function (actionName) {
            /// <param name="actionName" type="String"/>
            /// <returns type="String"/>

            var controllerName = this._controllerName;
            return this._viewLocationRoute.interpolate({ controller: controllerName, action: actionName }) + '.' + this.viewFileExtension;
        },
        view: function (actionName) {
            /// <param name="actionName" type="String"/>
            /// <returns type="jQuery.Deferred"/>

            return this._getView(actionName);
        },
        _getView: function (actionName) {
            /// <param name="actionName" type="String"/>
            /// <returns type="jQuery.Deferred"/>

            var url = this.getLocation(actionName);
            var self = this;
            if (!this._views[actionName]) {

                this._views[actionName] = $.Deferred();

                require(['text!' + url],
                    $.proxy(function (html) {
                        if (html != null)
                            this.deferred.resolve(html);
                        else
                            this.deferred.reject();
                    },
                    { deferred: this._views[actionName] }),

                    $.proxy(function (err) {
                        this.deferred.reject(err);
                    },
                    { deferred: this._views[actionName] })
                );
            }

            return this._views[actionName];
        }
    };
    // #endregion

    ns.ViewEngineFacotry = function (viewLocationFormater) {
        if (!viewLocationFormater)
            throw e.argumentNull('viewLocationFormater');

        this._viewLocationFormater = viewLocationFormater;
    };
    ns.ViewEngineFacotry.prototype = {
        viewEngines: {
        },
        viewLocationFormater: function () {
            return this._viewLocationFormater;
        },
        createViewEngine: function (controllerName) {
            return new ns.ViewEngine(controllerName, this.viewLocationFormater());
        },
        getViewEngine: function (controllerName) {
            /// <param name="controllerName" type="String"/>
            if (!this.viewEngines[controllerName])
                this.viewEngines[controllerName] = this.createViewEngine(controllerName);

            return this.viewEngines[controllerName];
        }
    };

    ns.action = ns.register = function (deps, filters, func) {
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

        define(deps, $.proxy(
            function () {
                var args = Array.prototype.slice.call(arguments, 0);
                var func = this.func;
                var filters = this.filters;

                return {
                    func: function (page) {
                        args.unshift(page);
                        return func.apply(func, args);
                    },
                    filters: filters
                }
            },
            { func: func, filters: filters })
        );

        return func;
    };

    ns.ActionInterceptor = function () { };
    ns.ActionInterceptor.prototype = {
        _type: 'ActionInterceptor',
        afterExecute: function () {

        },
        beforeExecute: function () {

        }
    };

    ns.ControllerContext = function (controller, view, routeData) {
        /// <param name="controller" type="chitu.Controller"/>
        /// <param name="view" type="jQuery.Deferred"/>
        /// <param name="routeData" type="chitu.RouteData"/>

        this._controller = controller;
        this._view = view;
        this._routeData = routeData;
    };
    ns.ControllerContext.prototype = {
        _type: 'ControllerContext',
        controller: function () {
            /// <returns type="chitu.Controller"/>
            return this._controller;
        },
        view: function () {
            /// <returns type="jQuery.Deferred"/>
            return this._view;
        },
        routeData: function () {
            /// <returns type="chitu.RouteData"/>
            return this._routeData;
        }
    };
    //new ns.ControllerContext().routeData().route().name
})(chitu);