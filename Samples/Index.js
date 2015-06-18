﻿require.config({
    baseUrl: 'Scripts',
    paths: {
        jquery: 'jquery-2.1.1.min',
        crossroads: 'crossroads'
    }
});
requirejs(['chitu'], function () {
    var app = new chitu.Application(function (options) {
        //options.actionPath = '../Modules/{controller}/{action}';
        //options.viewPath = '../Modules/{controller}/{action}.html';
        //options.actionPath = '/Modules/{controller}/{action}';
        //options.viewPath = '/Modules/{controller}/{action}.html';
        options.actionPath = 'http://localhost:62632/Modules/{controller}/{action}.js';
        options.viewPath = 'http://localhost:62632/Modules/{controller}/{action}.html';

        options.routes.mapRoute({
            name: 'default',
            url: '{controller}/{action}'
        });

        options.routes.mapRoute({
            name: 'remote',
            url: '{controller}/{action}',
            rules: {
                controller: ['Remote']
            },
            viewPath: 'http://localhost:62632/{controller}_{action}.html',
            actionPath: 'http://localhost:62632/{controller}_{action}.js'
        });

    });

    app.run();
});