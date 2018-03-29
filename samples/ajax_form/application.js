define(['chitu'], function (c) {
    let siteMap = {
        /**
         * 首页
         * @param {chitu.Page} page 
         */
        index(page) {
            page.element.innerHTML = `
            <div class="container" style="padding-top:10px">           
                <form>
                    <div class="form-group">
                        <label>用户名</label>
                        <input type="text" class="form-control" value="18562156216"/>
                    </div>
                    <div class="form-group">
                        <label>密码</label>
                        <input type="password" class="form-control" value="abcd"/>
                    </div>
                    <div class="form-group">
                        <button type="button" class="btn btn-primary btn-block">登录</button>
                    </div>
                </form>
            </div>
            `;

            var service = page.createService(chitu.Service);
            page.element.querySelector('button').onclick = function () {
                let url = "https://service.alinq.cn/user/login";
                let inputs = page.element.querySelectorAll('input');
                let username = inputs[0].value;
                let password = inputs[1].value;
                service.ajax(url, {
                    data: {
                        username,
                        password
                    },
                    method: 'post'
                })

            }
        }
    }
    let app = new chitu.Application(siteMap)
    app.error.add((sender, err) => {
        alert(err.message);
    })
    return app
})