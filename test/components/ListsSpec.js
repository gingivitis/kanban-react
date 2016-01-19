import React from 'react'
import { shallow, mount } from 'enzyme'
import { expect } from 'chai'
import { spy } from 'sinon'

import Lists from 'app/components/Lists'
import List from 'app/components/List'
import ListStore from 'app/stores/ListStore'
import { Modal } from 'react-bootstrap'

describe('Lists Component', () => {
    var wrapper, lists

    beforeEach(() => {
        lists = ListStore.getState().lists
        wrapper = shallow(<Lists lists={lists} />)
    })

    it('should initialize properly', () => {
        expect(wrapper.state()).to.eql({showAddTask: false, addList: null})
    })

    it('should contain 3 lists', () => {
        expect(wrapper.find(List)).to.have.length(3)
    })

    it('should not show modal when showAddTask false', () => {
        expect(wrapper.find(Modal)).to.have.length(0)
    })

    it('should open modal when showAddTask true', () => {
        wrapper.setState({
            showAddTask: true,
            addList: lists[0]
        })

        expect(wrapper.find(Modal)).to.have.length(1)
        expect(wrapper.find(Modal.Title).shallow().text()).to.match(new RegExp(lists[0].name))
    })

})
