﻿module chitu {
    export class RouteData {
        private _values: any;
        private _viewPath: string;
        private _actionPath: string;
        private _pageName: string;

        public values(value: any = undefined): any {
            if (value !== undefined)
                this._values = value;

            return this._values;
        }

        public viewPath(value: string = undefined): string {
            if (value !== undefined)
                this._viewPath = value;

            return this._viewPath;
        }

        public actionPath(value: string = undefined): string {
            if (value !== undefined)
                this._actionPath = value;

            return this._actionPath;
        }

        public pageName(value: string = undefined): string {
            if (value !== undefined)
                this._pageName = value;

            return this._pageName;
        }
    }
} 