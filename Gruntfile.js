module.exports = function (grunt) {
    // ��Ŀ����
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            //options: { separator: ';' },
            dist: {
                src: ['ChiTu/ScriptBegin.txt', 'ChiTu/Utility.js', 'ChiTu/Error.js', 'ChiTu/Extends.js', 'ChiTu/PageContainer.js',
                      'ChiTu/Page.js', 'ChiTu/ControllerModule.js', 'ChiTu/RouteModule.js', 'ChiTu/Application.js', 'ChiTu/ScriptEnd.txt'],
                dest: 'Build/chitu.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! Author: Shu Mai, Contact: ansiboy@163.com */\n'
            },
            build: {
                src: 'Build/chitu.js',
                dest: 'Build/chitu.min.js'
            }
        }
    });
    // �����ṩ"uglify"����Ĳ��
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    // Ĭ������
    grunt.registerTask('default', ['concat', 'uglify']);
}