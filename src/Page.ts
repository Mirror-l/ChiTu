

namespace chitu {

    export interface PageDisplayConstructor {
        new(app: Application): PageDisplayer
    }

    export interface PageDisplayer {
        show(page: Page): Promise<any>;
        hide(page: Page): Promise<any>;
    }

    export interface PageParams {
        app: Application,
        routeData: RouteData,
        element: HTMLElement,
        displayer: PageDisplayer,
        previous?: Page
    }

    export class Page {
        private animationTime: number = 300;
        private num: Number;

        private _element: HTMLElement;
        private _previous: Page;
        private _app: Application;
        private _routeData: RouteData;
        private _displayer: PageDisplayer;

        static tagName = 'div';

        error = Callbacks<Page, Error>();

        /** 脚本文件加载完成后引发 */
        load = Callbacks<this, null>();

        /** 脚本执行完成后引发 */
        loadComplete = Callbacks<this, null>();

        /** 页面显示时引发 */
        showing = Callbacks<this, null>();

        /** 页面显示时完成后引发 */
        shown = Callbacks<this, null>();

        hiding = Callbacks<this, null>();
        hidden = Callbacks<this, null>();

        closing = Callbacks<this, null>();
        closed = Callbacks<this, null>();

        active = Callbacks<this, null>();
        deactive = Callbacks<this, null>();

        constructor(params: PageParams) {
            this._element = params.element;
            this._previous = params.previous;
            this._app = params.app;
            this._routeData = params.routeData;
            this._displayer = params.displayer;
            this.loadPageAction();
        }
        private on_load() {
            return this.load.fire(this, null);
        }
        private on_loadComplete() {
            return this.loadComplete.fire(this, null);
        }
        private on_showing() {
            return this.showing.fire(this, null);
        }
        private on_shown() {
            return this.shown.fire(this, null);
        }
        private on_hiding() {
            return this.hiding.fire(this, null);
        }
        private on_hidden() {
            return this.hidden.fire(this, null);
        }
        private on_closing() {
            return this.closing.fire(this, null);
        }
        private on_closed() {
            return this.closed.fire(this, null);
        }
        show(): Promise<any> {
            this.on_showing();
            return this._displayer.show(this).then(o => {
                this.on_shown();
            });
        }
        hide(): Promise<any> {
            this.on_hiding();
            return this._displayer.hide(this).then(o => {
                this.on_hidden();
            });
        }
        close(): Promise<any> {
            return this.hide().then(() => {
                this.on_closing();
                this._element.remove();
                this.on_closed();
            });
        }

        createService<T extends Service>(type: ServiceConstructor<T>): T {
            let service = new type();
            service.error.add((ender, error) => {
                this.error.fire(this, error);
            })
            return service;
        }
        get element(): HTMLElement {
            return this._element;
        }
        get previous(): Page {
            return this._previous;
        }
        set previous(value: Page) {
            this._previous = value;
        }
        get routeData(): RouteData {
            return this._routeData;
        }
        get name(): string {
            return this.routeData.pageName;
        }

        private async loadPageAction() {
            console.assert(this._routeData != null);

            let routeData = this._routeData;
            var url = routeData.actionPath;

            let actionResult;
            try {
                actionResult = await loadjs(url);
            }
            catch (err) {
                this.error.fire(this, err);
                throw err;
            }

            if (!actionResult)
                throw Errors.exportsCanntNull(routeData.pageName);

            let actionName = 'default';
            let action = actionResult[actionName];
            if (action == null) {
                throw Errors.canntFindAction(routeData.pageName);
            }

            let actionExecuteResult;
            if (typeof action == 'function') {
                // if (action['prototype'] != null)
                //     throw Errors.actionTypeError(routeData.pageName);

                let actionResult = action(this) as Promise<any>;
                if (actionResult != null && actionResult.then != null && actionResult.catch != null) {
                    actionResult.then(() => this.on_loadComplete());
                }
            }
            else {
                throw Errors.actionTypeError(routeData.pageName);
            }

            this.on_load();
        }

        reload() {
            return this.loadPageAction();
        }
    }


}


interface PageActionConstructor {
    new(page: chitu.Page);
}

interface PageConstructor {
    new(args: chitu.PageParams): chitu.Page
}

class PageDisplayerImplement implements chitu.PageDisplayer {
    show(page: chitu.Page) {
        page.element.style.display = 'block';
        if (page.previous != null) {
            page.previous.element.style.display = 'none';
        }
        return Promise.resolve();
    }
    hide(page: chitu.Page) {
        page.element.style.display = 'none';
        if (page.previous != null) {
            page.previous.element.style.display = 'block';
        }
        return Promise.resolve();
    }
}