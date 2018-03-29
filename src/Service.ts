interface ServiceError extends Error {
    method?: string
}

async function ajax<T>(url: string, options: RequestInit): Promise<T> {
    let response = await fetch(url, options);

    let responseText = response.text();
    let p: Promise<string>;
    if (typeof responseText == 'string') {
        p = new Promise<string>((reslove, reject) => {
            reslove(responseText);
        })
    }
    else {
        p = responseText as Promise<string>;
    }

    let text = await responseText;
    let textObject;
    let isJSONContextType = (response.headers.get('content-type') || '').indexOf('json') >= 0;
    if (isJSONContextType) {
        textObject = JSON.parse(text);
    }
    else {
        textObject = text;
    }

    if (response.status >= 300) {
        let err: ServiceError = new Error();
        err.method = options.method;
        err.name = `${response.status}`;
        err.message = isJSONContextType ? (textObject.Message || textObject.message) : textObject;
        err.message = err.message || response.statusText;

        throw err
    }

    return textObject;
}

function callAjax<T>(
    url: string, options: RequestInit,
    service: chitu.Service, error: chitu.Callback1<chitu.Service, Error>
) {
    return new Promise<T>((reslove, reject) => {
        let timeId: number;
        if (options.method == 'get') {
            timeId = setTimeout(() => {
                let err = new Error(); //new AjaxError(options.method);
                err.name = 'timeout';
                err.message = '网络连接超时';
                reject(err);
                error.fire(service, err);
                clearTimeout(timeId);

            }, chitu.Service.settings.ajaxTimeout * 1000)
        }

        ajax<T>(url, options)
            .then(data => {
                reslove(data);
                if (timeId)
                    clearTimeout(timeId);
            })
            .catch(err => {
                reject(err);
                error.fire(service, err);

                if (timeId)
                    clearTimeout(timeId);
            });

    })
}

namespace chitu {
    export interface ServiceConstructor<T> {
        new(): T
    }

    export class Service {

        error = Callbacks<Service, Error>();

        static settings = {
            ajaxTimeout: 30,
        }

        ajax(url: string, options?: { data?: Object, headers?: Headers, contentType?: string, method?: string }) {
            options = options || {} as any
            let data = options.data;
            let method = options.method;
            let headers = options.headers || [];
            let body: any

            if (data != null) {
                let is_json = ((headers['content-type'] || '') as string).indexOf('json') >= 0;
                if (is_json) {
                    body = JSON.stringify(data);
                }
                else {
                    body = new URLSearchParams();
                    for (let key in data) {
                        body.append(key, data[key])
                    }
                }
            }

            return callAjax(url, { headers, body, method }, this, this.error);
        }

    }
}