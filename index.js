#!/usr/bin/env node
const fs = require('fs');
const readline = require('readline');
const promisify = require('util').promisify

const rl = readline.createInterface(process.stdin, process.stdout);
const input = promisify(rl.question).bind(rl);

const indexTemplate = (name, description) => `const component = module.exports = require('@webfocus/component')("${name}","${description}");

// use component.app.get to register middlewares. e.g:
//
// component.app.get('/', (req, res, next) => {
// res.json("Hello World!");
// })

`

const indexPugTemplate = `extends /layouts/main

block head
  script.
    console.log('Hello Component!')
block main
    p Hello Component!
`

const packageTemplateObj = {
    "name": "",
    "version": "0.0.1",
    "description": "",
    "main": "index.js",
    "keywords": [],
    "author": "",
    "license": "ISC"
};
input("Component Name: ").then(async name => {
    let description = await input('Component Description: ')
    
    // Create index.js file
    fs.writeFileSync('index.js', indexTemplate(name, description), {flag:'wx'});
    
    // Create package.js file
    packageTemplateObj.name = name.toLowerCase().split(' ').join('-');
    fs.writeFileSync('package.json', JSON.stringify(packageTemplateObj, null, '  '), {flag:'wx'});
    
    // Create index.pug file
    fs.writeFileSync('index.pug', indexPugTemplate, {flag:'wx'})

    // Install dependencies
    child_process.execSync('npm install @webfocus/component')
    return 0;
})
.catch(e => {console.error(e); return 1})
.finally(r => process.exit(r))
