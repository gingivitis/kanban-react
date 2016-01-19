require('core-js/es5')
require('./test/support/env')

var context = require.context('./test/', true, /.+Spec\.js$/)
context.keys().forEach(context)
