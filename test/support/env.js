process.env.NODE_ENV = 'test'

import chai from 'chai'
import sinonChai from 'sinon-chai'
import sinon from 'sinon'

chai.config.showDiff = false
global.should = chai.should()
chai.use(sinonChai)

function spyOnReactClass(reactClass, methodName) {
    var classProto = reactClassPrototype(reactClass)
    var spy = sinon.spy()

    if (classProto.__reactAutoBindMap) classProto.__reactAutoBindMap[methodName] = spy
    return spy
}

function reactClassPrototype(reactClass) {
    var ctor = reactClass.prototype && reactClass.prototype.constructor
    if (typeof ctor === 'undefinied')
        throw new Error('A component constructor could not be found for this class. Are you sure you passed in a React component?')

    return ctor.prototype
}

global.spyOnReactClass = spyOnReactClass
