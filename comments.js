// Create web server
const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');

const template = {
    HTML: function (title, list, body, control) {
        return `
        <!doctype html>
        <html>
        <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
        </head>
        <body>
            <h1><a href="/">WEB</a></h1>
            ${list}
            ${control}
            ${body}
        </body>
        </html>
        `;
    },
    List: function (filelist) {
        let list = '<ul>';
        let i = 0;
        while (i < filelist.length) {
            list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
            i = i + 1;
        }
        list = list + '</ul>';
        return list;
    }
}

const app = http.createServer(function (request, response) {
    const _url = request.url;
    const queryData = url.parse(_url, true).query;
    const pathname = url.parse(_url, true).pathname;

    if (pathname === '/') {
        if (queryData.id === undefined) {
            fs.readdir('./data', function (error, filelist) {
                const title = 'Welcome';
                const description = 'Hello, Node.js';
                const list = template.List(filelist);
                const html = template.HTML(title, list, `<h2>${title}</h2>${description}`, `<a href="/create">create</a>`);
                response.writeHead(200);
                response.end(html);
            });
        } else {
            fs.readdir('./data', function (error, filelist) {
                fs.readFile(`data/${queryData.id}`, 'utf8', function (err, description) {
                    const title = queryData.id;
                    const list = template.List(filelist);
                    const html = template.HTML(title, list, `<h2>${title}</h2>${description}`, `
                    <a href="/create">create</a>
                    <a href="/update?id=${title}">update</a>
                    <form action="delete_process" method="post">
                        <input type="hidden" name="id" value="${title}">
                        <input