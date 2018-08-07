﻿/// <reference path="PageMaster.ts"/>

namespace chitu {

    export type Action = ((page: Page) => void);
    export type SiteMapChildren<T extends PageNode> = { [key: string]: T }
    /**
     * 页面结点
     */
    export interface PageNode {
        action: Action,
        name: string,
    }

    export interface PageNodeParser {
        actions?: { [key: string]: Action },
        pageNameParse?: (pageName: string) => PageNode
    }

    const EmtpyStateData = "";
    const DefaultPageName = "index"
    function parseUrl(app: Application, url: string): { pageName: string, values: PageData } | null {
        let sharpIndex = url.indexOf('#');
        if (sharpIndex < 0) {
            let pageName = DefaultPageName
            return { pageName, values: {} };
        }

        let routeString = url.substr(sharpIndex + 1);
        if (!routeString)
            throw Errors.canntParseRouteString(url);

        /** 以 ! 开头在 hash 忽略掉 */
        if (routeString.startsWith('!')) {
            // let url = createUrl(app.currentPage.name, app.currentPage.data);
            // history.replaceState(EmtpyStateData, "", url)
            // return null;
            throw Errors.canntParseRouteString(routeString);
        }

        let routePath: string;
        let search: string | null = null;
        let param_spliter_index: number = routeString.indexOf('?');
        if (param_spliter_index > 0) {
            search = routeString.substr(param_spliter_index + 1);
            routePath = routeString.substring(0, param_spliter_index);
        }
        else {
            routePath = routeString;
        }

        if (!routePath)
            throw Errors.canntParseRouteString(routeString);

        let values = {};
        if (search) {
            values = pareeUrlQuery(search);
        }

        let pageName = routePath;
        return { pageName, values };
    }

    function pareeUrlQuery(query: string): PageData {
        let match,
            pl = /\+/g,  // Regex for replacing addition symbol with a space
            search = /([^&=]+)=?([^&]*)/g,
            decode = function (s: string) { return decodeURIComponent(s.replace(pl, " ")); };

        let urlParams: { [key: string]: string } = {};
        while (match = search.exec(query))
            urlParams[decode(match[1])] = decode(match[2]);

        return urlParams;
    }

    function createUrl(pageName: string, params?: PageData) {
        let path_parts = pageName.split('.');
        let path = path_parts.join('/');
        if (!params)
            return `#${path}`;

        //==============================================
        // 移除 function, null, object 字段
        let paramsText = '';
        for (let key in params) {
            let value = params[key];
            let type = typeof params[key];
            if (type != 'string' || value == null) {
                continue;
            }
            paramsText = paramsText == '' ? `?${key}=${params[key]}` : paramsText + `&${key}=${params[key]}`;
        }
        //==============================================
        return `#${path}${paramsText}`;
    }

    /**
     * 应用，处理页面 URL 和 Page 之间的关联
     */
    export class Application extends PageMaster {

        private _runned: boolean = false;
        private closeCurrentOnBack: boolean | null = null;
        private tempPageData: PageData | undefined = undefined;

        /**
         * 构造函数
         * @param parser 地图，描述站点各个页面结点
         * @param allowCachePage 是允许缓存页面，默认 true
         */
        constructor(args?: { parser?: PageNodeParser, container?: HTMLElement }) {
            super((args || {}).container || document.body, (args || {}).parser);//? parser : Application.defaultPageNodeParser()
        }

        /**
         * 解释路由，将路由字符串解释为 RouteData 对象
         * @param url 要解释的 路由字符串
         */
        parseUrl(url: string) {
            let routeData = parseUrl(this, url);
            return routeData;
        }

        /**
         * 创建 url
         * @param pageName 页面名称
         * @param values 页面参数
         */
        createUrl(pageName: string, values?: PageData) {
            return createUrl(pageName, values);
        }

        /**
         * 运行当前应用
         */
        public run() {
            if (this._runned) return;

            this.showPageByUrl(location.href, false);
            window.addEventListener('popstate', () => {

                let url = location.href;
                let sharpIndex = url.indexOf('#');
                let routeString = url.substr(sharpIndex + 1);
                /** 以 ! 开头在 hash 忽略掉 */
                if (sharpIndex < 0 || routeString.startsWith('!')) {
                    return
                }
                this.showPageByUrl(url, true);
            });

            this._runned = true;
        }

        /**
         * 显示页面
         * @param url 页面的路径
         */
        private showPageByUrl(url: string, fromCache: boolean): Page {
            if (!url) throw Errors.argumentNull('url');

            var routeData = this.parseUrl(url);
            if (routeData == null) {
                throw Errors.noneRouteMatched(url);
            }

            let tempPageData = this.fetchTemplatePageData();

            let result: Page | null = null;
            //==========================================
            // closeCurrentOnBack != null 表示返回操作
            if (this.closeCurrentOnBack == true) {
                this.closeCurrentOnBack = null;
                if (tempPageData == null)
                    this.closeCurrentPage()
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
            //==========================================

            if (result == null) {
                let args = routeData.values || {};
                if (tempPageData) {
                    args = Object.assign(args, tempPageData);
                }
                result = this.showPage(routeData.pageName, fromCache, args);
            }
            return result;
        }

        private fetchTemplatePageData() {
            if (this.tempPageData == null) {
                return null;
            }
            let data = this.tempPageData;
            this.tempPageData = undefined;
            return data;
        }

        private setLocationHash(url: string) {
            history.pushState(EmtpyStateData, "", url)
        }

        public redirect(node: PageNode, args?: PageData): Page
        public redirect(node: PageNode, fromCache?: boolean, args?: PageData): Page
        public redirect(pageName: string, args?: PageData): Page
        public redirect(pageName: string, fromCache?: boolean, args?: PageData): Page
        /**
         * 页面跳转
         * @param node 页面节点
         * @param fromCache 是否从缓存读取
         * @param args 传递到页面的参数
         */
        public redirect(node: PageNode | string, fromCache?: any, args?: PageData): Page {
            if (!node) throw Errors.argumentNull("node");
            if (typeof node == 'string') {
                let pageName = node;
                let findNode = this.findSiteMapNode(pageName);
                if (findNode == null)
                    throw Errors.pageNodeNotExists(pageName);

                node = findNode
            }

            let result = this.showPage(node, fromCache, args);
            if (typeof (fromCache) == 'object') {
                args = fromCache;
            }
            let url = this.createUrl(node.name, args);
            this.setLocationHash(url);

            return result;
        }


        /**
         * 返回上一个页面
         * @param closeCurrentPage 返回上一个页面时，是否关闭当前页面，true 关闭当前页，false 隐藏当前页。默认为 true。
         */
        public back(): void
        public back(closeCurrentPage: boolean): void
        public back(data: PageData): void
        public back(closeCurrentPage?: boolean, data?: PageData): void
        public back(closeCurrentPage?: any, data?: PageData): void {
            const closeCurrentPageDefault = true
            if (typeof closeCurrentPage == 'object') {
                data = closeCurrentPage;
                closeCurrentPage = null;
            }

            this.closeCurrentOnBack = closeCurrentPage == null ? closeCurrentPageDefault : closeCurrentPage;
            this.tempPageData = data;
            history.back();
        }

    }

} 
