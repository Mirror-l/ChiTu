import { PageMaster } from "./PageMaster";
import { IService, ServiceConstructor, Callback1 } from "maishu-chitu-service";
export declare type PageData = {
    [key: string]: string | Function;
};
export interface PageDisplayConstructor {
    new (app: PageMaster): PageDisplayer;
}
export interface PageDisplayer {
    show(targetPage: Page, currentPage: Page | null): Promise<any>;
    hide(targetPage: Page, currentPage: Page | null): Promise<any>;
}
export interface PageParams {
    app: PageMaster;
    element: HTMLElement;
    displayer: PageDisplayer;
    data: PageData;
    url: string;
}
export declare class Page {
    private _element;
    private _app;
    private _displayer;
    private _name;
    private _url;
    static tagName: string;
    data: PageData;
    showing: Callback1<this, PageData>;
    shown: Callback1<this, PageData>;
    hiding: Callback1<this, PageData>;
    hidden: Callback1<this, PageData>;
    closing: Callback1<this, PageData>;
    closed: Callback1<this, PageData>;
    constructor(params: PageParams);
    private on_showing;
    private on_shown;
    private on_hiding;
    private on_hidden;
    private on_closing;
    private on_closed;
    show(): Promise<any>;
    hide(currentPage: Page | null): Promise<any>;
    close(): Promise<any>;
    createService<T extends IService>(type?: ServiceConstructor<T>): T;
    readonly element: HTMLElement;
    readonly name: string;
    readonly url: string;
    readonly app: PageMaster;
}
export interface PageConstructor {
    new (args: PageParams): Page;
}
export declare class PageDisplayerImplement implements PageDisplayer {
    show(page: Page, previous: Page): Promise<void>;
    hide(page: Page, previous: Page): Promise<void>;
}
