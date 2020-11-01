const path = require('path');
const root = path.resolve(__dirname, '..');

const paths = {
    root,
    src: root + '/src',
    build: root + '/build',
    resources: root + '/src/resources',
    webrix: path.resolve(__dirname, '../../webrix'),
    node_modules: root + '/node_modules',
}

module.exports = {paths};