﻿import { IService, ServiceConstructor, Service } from "maishu-chitu-service";
import { PageMaster } from "./PageMaster";
import { PageData, Page } from "./Page";
import { Errors } from "./Errors";

export type StringPropertyNames<T> = { [K in keyof T]: T[K] extends string ? K : never }[keyof T];
export type Action = ((page: Page, app: PageMaster) => void);
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
    parse?: (pageName: string) => PageNode,
}

const DefaultPageName = "index"
export function parseUrl(url: string): { pageName: string, values: PageData } {
    if (!url) throw Errors.argumentNull('url')

    let sharpIndex = url.indexOf('#');
    let routeString;
    if (sharpIndex >= 0)
        routeString = url.substr(sharpIndex + 1);
    else
        routeString = url

    if (!routeString)
        throw Errors.canntParseRouteString(url);

    /** 以 ! 开头在 hash 忽略掉 */
    if (routeString.startsWith('!')) {
        throw Errors.canntParseRouteString(routeString);
    }

    let routePath: string;
    let search: string | null = null;
    let param_spliter_index: number = routeString.indexOf('?');
    if (param_spliter_index >= 0) {
        search = routeString.substr(param_spliter_index + 1);
        routePath = routeString.substring(0, param_spliter_index);
    }
    else {
        routePath = routeString;
    }

    if (!routePath)
        routePath = DefaultPageName //throw Errors.canntParseRouteString(routeString);

    let values: { [key: string]: string } = {};
    if (search) {
        values = pareeUrlQuery(search);
    }

    let pageName = routePath;
    return { pageName, values };
}

function pareeUrlQuery(query: string): { [key: string]: string } {
    let match,
        pl = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s: string) { return decodeURIComponent(s.replace(pl, " ")); };

    let urlParams: { [key: string]: string } = {};
    while (match = search.exec(query))
        urlParams[decode(match[1])] = decode(match[2]);

    return urlParams;
}

function createPageUrl<T>(pageName: string, params?: T) {
    let path_parts = pageName.split('.');
    let path = path_parts.join('/');
    if (!params)
        return `${path}`;

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
    return `${path}${paramsText}`;
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
        super((args || {}).container || document.body, (args || {}).parser);
    }

    /**
     * 解释路由，将路由字符串解释为 RouteData 对象
     * @param url 要解释的 路由字符串
     */
    parseUrl(url: string) {
        if (!url)
            throw Errors.argumentNull('url')

        let routeData = parseUrl(url);
        return routeData;
    }

    /**
     * 创建 url
     * @param pageName 页面名称
     * @param values 页面参数
     */
    createUrl<T>(pageName: string, values?: T) {
        return createPageUrl(pageName, values);
    }

    /**
     * 运行当前应用
     */
    public run() {
        if (this._runned) return;

        let showPage = () => {
            let url = location.href;
            let sharpIndex = url.indexOf('#');
            let routeString = url.substr(sharpIndex + 1);
            /** 以 ! 开头在 hash 忽略掉 */
            if (routeString.startsWith('!')) {
                return
            }
            if (sharpIndex < 0) {
                url = '#' + DefaultPageName
            }
            this.showPageByUrl(url);
        }

        showPage()
        // window.addEventListener('popstate', () => {
        //     showPage()
        // });
        window.addEventListener('hashchange', () => {
            if(this.location.skip){
                delete this.location.skip
                return
            }
            showPage()
        })

        this._runned = true;
    }

    /**
     * 显示页面
     * @param url 页面的路径
     */
    private showPageByUrl(url: string): Page | null {
        if (!url) throw Errors.argumentNull('url');

        // var routeData = this.parseUrl(url);
        // if (routeData == null) {
        //     throw Errors.noneRouteMatched(url);
        // }

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

        if (result == null || result.url != url) {
            // let args = routeData.values || {};
            // if (tempPageData) {
            //     args = Object.assign(args, tempPageData);
            // }
            result = this.showPage(url);
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

    private setLocationHash(pageUrl: string) {
        // history.pushState(EmtpyStateData, "", url)
        this.location.hash = `#${pageUrl}`
        this.location.skip = true
    }

    private get location(): Location & { skip?: boolean } {
        return location
    }


    /**
     * 页面跳转
     * @param node 页面节点
     * @param args 传递到页面的参数
     */
    public redirect<T>(pageUrl: string, args?: object): Page {
        if (!pageUrl) throw Errors.argumentNull('pageUrl')

        let page = this.showPage(pageUrl, args);
        let url = this.createUrl(page.name, page.data);
        this.setLocationHash(url);

        return page;
    }

    /**
     * 页面向下一级页面跳转，页面会重新渲染
     * @param node 页面节点
     * @param args 传递到页面的参数
     * @param setUrl 是否设置链接里 Hash
     */
    public forward(pageUrl: string, args?: object, setUrl?: boolean) {
        if (!pageUrl) throw Errors.argumentNull('pageNameOrUrl')
        if (setUrl == null)
            setUrl = true

        let page = this.showPage(pageUrl, args, true);
        if (setUrl) {
            let url = this.createUrl(page.name, page.data);
            this.setLocationHash(url);
        }
        // else {
        //     history.pushState(pageUrl, "", "")
        // }

        return page;
    }

    // private showPageByNameOrUrl(pageNameOrUrl: string, args?: object, rerender?: boolean) {
    //     // let pageName: string
    //     // if (pageNameOrUrl.indexOf('?') < 0) {
    //     //     pageName = pageNameOrUrl
    //     // }
    //     // else {
    //     //     let obj = this.parseUrl(pageNameOrUrl);
    //     //     pageName = obj.pageName;
    //     //     args = Object.assign(obj.values, args || {});
    //     // }
    //     return this.showPage(pageNameOrUrl, args, rerender);
    // }

    public reload(pageName: string, args?: object) {
        let result = this.showPage(pageName, args, true)
        return result
    }


    /**
     * 返回上一个页面
     * @param closeCurrentPage 返回上一个页面时，是否关闭当前页面，true 关闭当前页，false 隐藏当前页。默认为 true。
     */
    public back(): void
    public back(closeCurrentPage: boolean): void
    public back(data: any): void
    public back<T>(closeCurrentPage?: boolean, data?: Pick<T, StringPropertyNames<T>>): void
    public back<T>(closeCurrentPage?: any, data?: Pick<T, StringPropertyNames<T>>): void {
        const closeCurrentPageDefault = true
        if (typeof closeCurrentPage == 'object') {
            data = closeCurrentPage;
            closeCurrentPage = null;
        }

        this.closeCurrentOnBack = closeCurrentPage == null ? closeCurrentPageDefault : closeCurrentPage;
        this.tempPageData = data as any;
        history.back();
    }

    /**
     * 创建服务
     * @param type 服务类型
     */
    createService<T extends IService>(type?: ServiceConstructor<T>): T {
        type = type || Service as any as ServiceConstructor<T>
        let service = new type();
        service.error.add((sender, error) => {
            this.error.fire(this, error, null)
        })
        return service;
    }
}


