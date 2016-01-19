import React from 'react'
import { shallow, mount } from 'enzyme'
import { expect } from 'chai'
import { spy } from 'sinon'

import Editable from 'app/components/Editable'

describe('Editable', () => {

    it('renders value', () => {
        const value   = 'Sed do eiusmod tempor incididunt'
        const wrapper = shallow(<Editable value={value} type="textfield" />)
        expect(wrapper.find('.value').text()).to.eql(value)
    })

    it('type textfield should create input field', () => {
        const value = 'Consectetur adipisicing elit'
        const wrapper = shallow(<Editable value={value} type="textfield" />)
        expect(wrapper.state('editing')).to.be.false

        const valueField = wrapper.find('.value')
        valueField.simulate('click')

        const input = wrapper.find('input')
        expect(input.length).to.eql(1)

        expect(input.props().placeholder).to.eql(value)
        expect(wrapper.state('editing')).to.be.true
    })

    it('type textarea should create textarea field', () => {
        const value = 'Ut enim ad minim veniam, quis nostrud exercitation'
        const wrapper = shallow(<Editable value={value} type="textarea" />)

        expect(wrapper.state('editing')).to.be.false

        const valueField = wrapper.find('.value')
        valueField.simulate('click')

        const textArea = wrapper.find('textarea')
        expect(textArea.length).to.eql(1)

        expect(textArea.props()).to.have.property('defaultValue', value)
    })

    it('should trigger onEdit on blur', () => {
        const onEdit = spy()
        const newValue = 'Lorem ipsum dolor sit amet'
        const wrapper = shallow(<Editable value={newValue} type="textfield" onEdit={onEdit} />)

        const valueComponent = wrapper.find('.value')
        valueComponent.simulate('click')

        const inputField = wrapper.find('input')
        inputField.at(0).simulate('blur', { target: { value: newValue }})

        onEdit.should.be.called.once
        onEdit.should.have.been.calledWith(newValue)
    })

    it('should trigger onEdit after Enter', () => {
        const onEdit = spy()
        const newValue = 'Sunt in culpa qui officia'

        const wrapper = shallow(
            <Editable
               value={'hello world'}
               onEdit={onEdit}
               type="textfield" />
        )

        const valueComponent = wrapper.find('.value')
        valueComponent.simulate('click')

        const inputField = wrapper.find('input')

        inputField.simulate('keyPress', {
            key: 'Enter',
            target: {
                value: newValue
            }
        })

        onEdit.should.be.called.once
        onEdit.should.be.calledWith(newValue)
    })

    it('should not trigger onEdit after Escape', () => {
        const onEdit = spy()
        const newValue = 'Sunt in culpa qui officia'

        const wrapper = shallow(
            <Editable
               value={'hello world'}
               onEdit={onEdit}
               type="textfield" />
        )

        const valueComponent = wrapper.find('.value')
        valueComponent.simulate('click')

        const inputField = wrapper.find('input')

        inputField.simulate('keyDown', {
            key: 'Escape'
        })

        expect(wrapper.state('editing')).to.be.false
        expect(onEdit).to.not.be.called
    })

    it('should not trigger onEdit if invalid', () => {
        const onEdit = spy()
        const newValue = " \n \t"

        const wrapper = shallow(
            <Editable
                value={'hello world'}
                onEdit={onEdit}
                type="textfield" />
        )

        const valueComponent = wrapper.find('.value')
        valueComponent.simulate('click')

        const inputField = wrapper.find('input')

        inputField.simulate('keyPress', {
            key: 'Enter',
            target: {
                value: newValue
            }
        })

        expect(onEdit).to.not.have.been.called
    })

})
