define(['chitu'], function (c) {
    let app = new chitu.Application({
        siteMap: {
            index(page) {
                let callbacks = chitu.Callbacks()
                callbacks.add((sender, msg) => {
                    alert(`来自 ${sender.name} 的消息：${msg}`)
                })

                let btn = document.createElement('button')
                btn.innerHTML = '点击这里触发事件'
                btn.name = 'button1'
                page.element.appendChild(btn)
                btn.onclick = function () {
                    callbacks.fire(btn, 'hello~~~')
                }
            }
        }
    })

    return app;
});