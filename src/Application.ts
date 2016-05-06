﻿namespace chitu {

    export interface PageInfo {
        actionPath: string,
        viewPath: string,
        cssPath: string,
        parameters: any,
        pageName: string
    }

    export class UrlParser {
        private path_string = '';
        private path_spliter_char = '_';
        private param_spliter = '?'

        private _actionPath = '';
        private _viewPath = '';
        private _cssPath = '';
        private _parameters = {};
        private _pageName = '';

        pathBase = '';

        public pareeUrl(url: string): PageInfo {
            if (!url)
                throw Errors.argumentNull('url');

            let a = document.createElement('a');
            a.href = url;

            if (a.search && a.search.length > 1) {
                this._parameters = this.pareeUrlQuery(a.search.substr(1));
            }
            if (a.hash && a.hash.length > 1) {
                this._pageName = a.hash.substr(1);
            }

            let path_parts = a.hash.substr(1).split(this.path_spliter_char);
            if (path_parts.length < 2)
                throw Errors.canntParseUrl(url);

            let path = path_parts.join('/');
            let page_name = path_parts.join('.');
            var result = {
                actionPath: this.pathBase + path + '.js',
                viewPath: this.pathBase + path + '.html',
                cssPath: this.pathBase + path + '.css',
                parameters: {},
                pageName: page_name,
                controller: path_parts[0],
                action: path_parts[1]
            }

            return result;
        }

        private pareeUrlQuery(query: string): Object {
            let match,
                pl = /\+/g,  // Regex for replacing addition symbol with a space
                search = /([^&=]+)=?([^&]*)/g,
                decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); };

            let urlParams = {};
            while (match = search.exec(query))
                urlParams[decode(match[1])] = decode(match[2]);

            return urlParams;
        }
    }



    var PAGE_STACK_MAX_SIZE = 10;
    var ACTION_LOCATION_FORMATER = '{controller}/{action}';
    var VIEW_LOCATION_FORMATER = '{controller}/{action}';

    export interface ApplicationConfig {
        container?: (routeData: PageInfo, prevous: PageContainer) => PageContainer,
        openSwipe?: (routeData: PageInfo) => SwipeDirection,
        closeSwipe?: (route: PageInfo) => SwipeDirection,
        urlParser?: UrlParser,
    }

    export class Application {
        pageCreating: chitu.Callback = Callbacks();
        pageCreated: chitu.Callback = Callbacks();

        //private page_stack: chitu.Page[] = [];
        private _config: ApplicationConfig;
        //private _routes: chitu.RouteCollection = new RouteCollection();
        private _runned: boolean = false;
        private zindex: number;
        private back_deferred: JQueryDeferred<any>;
        private start_flag_hash: string;
        private start_hash: string;
        private container_stack = new Array<PageContainer>();

        constructor(config: ApplicationConfig) {
            if (config == null)
                throw Errors.argumentNull('container');

            this._config = config;
            this._config.openSwipe = config.openSwipe || function (routeData: PageInfo) { return SwipeDirection.None; };
            this._config.closeSwipe = config.closeSwipe || function (routeData: PageInfo) { return SwipeDirection.None; };
            this._config.container = config.container || $.proxy(function (routeData: PageInfo, previous: PageContainer) {
                return PageContainerFactory.createInstance(this.app, routeData, previous);
            }, { app: this });

            this._config.urlParser = this._config.urlParser || new UrlParser();

        }

        on_pageCreating() {
            return chitu.fireCallback(this.pageCreating, [this]);
        }
        on_pageCreated(page: chitu.Page) {
            return chitu.fireCallback(this.pageCreated, [this, page]);
        }
        get config(): chitu.ApplicationConfig {
            return this._config;
        }
        currentPage(): chitu.Page {
            if (this.container_stack.length > 0)
                return this.container_stack[this.container_stack.length - 1].currentPage;

            return null;
        }
        get pageContainers(): Array<PageContainer> {
            return this.container_stack;
        }
        private createPageContainer(routeData: PageInfo): PageContainer {
            var container = this.config.container(routeData, this.pageContainers[this.pageContainers.length - 1]);

            this.container_stack.push(container);
            if (this.container_stack.length > PAGE_STACK_MAX_SIZE) {
                var c = this.container_stack.shift();
                c.close(SwipeDirection.None);
            }

            return container;
        }
        protected hashchange() {
            if (window.location['skip'] == true) {
                window.location['skip'] = false;
                return;
            }

            var back_deferred: JQueryDeferred<any>
            if (this.back_deferred && this.back_deferred['processed'] == null) {
                back_deferred = this.back_deferred;
                back_deferred['processed'] = true;
            }

            var hash = window.location.hash;
            if (!hash || hash == this.start_flag_hash) {
                if (!hash)
                    console.log('The url is not contains hash.url is ' + window.location.href);

                if (hash == this.start_flag_hash) {
                    window.history.pushState({}, '', this.start_hash);
                    console.log('The hash is start url, the hash is ' + hash);
                }

                if (back_deferred)
                    back_deferred.reject();

                return;
            }

            if (!this.start_flag_hash) {
                //TODO:生成随机字符串
                this.start_flag_hash = '#AABBCCDDEEFF';
                this.start_hash = hash;
                window.history.replaceState({}, '', this.start_flag_hash);
                window.history.pushState({}, '', hash);
            }

            var url = location.href; //hash.substr(1);
            //var routeData = this.routes().getRouteData(url);
            //var pageName = Page.getPageName(routeData.values());
            var pageInfo = this.config.urlParser.pareeUrl(url);
            var page = this.getPage(pageInfo.pageName);
            var container: PageContainer = page != null ? page.container : null;
            if (container != null && $.inArray(container, this.container_stack) == this.container_stack.length - 2) {
                var c = this.container_stack.pop();
                var swipe = this.config.closeSwipe(c.currentPage.routeData);
                if (c.previous != null) {
                    c.previous.visible = true;
                }
                c.close(swipe);
            }
            else {
                var args = window.location['arguments'] || {};
                window.location['arguments'] = null;
                this.showPage(url, args);
            }

            if (back_deferred)
                back_deferred.resolve();
        }

        public run() {
            if (this._runned) return;

            var app = this;

            $.proxy(this.hashchange, this)();
            $(window).bind('hashchange', $.proxy(this.hashchange, this));

            this._runned = true;
        }
        public getPage(name: string): chitu.Page {
            for (var i = this.container_stack.length - 1; i >= 0; i--) {
                var page = this.container_stack[i].pages[name];
                if (page != null)
                    return page;
            }
            return null;
        }
        public showPage(url: string, args: Array<any>): JQueryPromise<Page> {
            if (!url) throw Errors.argumentNull('url');

            var routeData = this.config.urlParser.pareeUrl(url); 
            if (routeData == null) {
                throw Errors.noneRouteMatched(url);
            }

            var container = this.createPageContainer(routeData);
            container.pageCreated.add((sender, page: Page) => this.on_pageCreated(page));
            var swipe = this.config.openSwipe(routeData);
            var result = container.showPage(routeData, args, swipe);

            return result;
        }
        protected createPageNode(): HTMLElement {
            var element = document.createElement('div');
            return element;
        }
        public redirect(url: string, args: Array<any>): JQueryPromise<Page> {
            window.location['skip'] = true;
            window.location.hash = url;
            return this.showPage(url, args);
        }
        public back(args = undefined): JQueryPromise<any> {
            this.back_deferred = $.Deferred();
            if (window.history.length == 0) {
                this.back_deferred.reject();
                return this.back_deferred;
            }

            window.history.back();
            return this.back_deferred;
        }
    }
} 
