var context = require.context('./test', true, /.+Spec\.js$/)

require('core-js/es5')

context.keys().forEach(context)
module.exports = context
