/* eslint-disable */
const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const config = require('./config')
const baseDir = path.join(__dirname, config.path.pages + '/')
let pages = process.argv.slice(2)
pages = pages.join('')
if (pages == '' || pages == null || pages == undefined) {
  console.log('请输入页面名称')
  return
}
let hasPage = fs.existsSync(baseDir + pages)
if (hasPage == true) {
  console.log('该页面已经存在')
  return
}
try {
  mkdirp.sync(baseDir + pages)
  console.log(pages + '目录创建成功')
} catch (error) {
  console.log(pages + '目录创建失败', error)
}
// page
try {
  mkdirp.sync(baseDir + pages + '/' + config.exclude.assets)
  console.log(pages + '/' + config.exclude.assets + '目录创建成功')
} catch (error) {
  console.log(pages + '/' + config.exclude.assets + '目录创建失败', error)
}
// html
try {
  const htmlTemplate = await readFile(
    resolve(__dirname, '../template/web-page/index.html'),
    'utf8'
  )
  fs.writeFileSync(
    baseDir + pages + '/index.html',
    htmlTemplate.replace(/###_page-name_###/g, ucFirst(pages))
  )
  console.log(pages + '/index.html创建成功')
} catch (error) {
  console.log(pages + '/index.html创建失败')
}
// js
try {
  const jsTemplate = await readFile(
    resolve(__dirname, '../template/web-page/index.html'),
    'utf8'
  )
  fs.writeFileSync(
    baseDir + pages + '/index.js',
    jsTemplate.replace(/###_page-name_###/g, ucFirst(pages))
  )
  console.log(pages + '/index.js创建成功')
} catch (error) {
  console.log(pages + '/index.js创建失败')
}
// scss
try {
  const cssTemplate = await readFile(
    resolve(__dirname, '../template/web-page/index.html'),
    'utf8'
  )
  fs.writeFileSync(
    baseDir + pages + '/index.scss',
    cssTemplate.replace(/###_page-name_###/g, ucFirst(pages))
  )
  console.log(pages + '/index.scss创建成功')
} catch (error) {
  console.log(pages + '/index.scss创建失败')
}
// _assets/tpls

try {
  const assetsTemplate = await readFile(
    resolve(__dirname, '../template/web-page/_assets/tpls/menu.html'),
    'utf8'
  )
  fs.writeFileSync(
    baseDir + pages + '/_assets/tpls/menu.html',
    assetsTemplate.replace(/###_page-name_###/g, ucFirst(pages))
  )
  console.log(pages + '/_assets/tpls/menu.html创建成功')
} catch (error) {
  console.log(pages + '/_assets/tpls/menu.html创建失败')
}
// 首字母大写
function ucFirst(str) {
  return str
  // return str.replace(/^([a-z])(.+)/, (m, m1, m2) => m1.toUpperCase() + m2)
}
