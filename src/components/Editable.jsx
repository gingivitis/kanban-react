import React, { Component, PropTypes } from 'react'

class Editable extends Component {
    constructor(props) {
        super(props)

        this.state = {
            editing: false
        }

        this.checkEnter = this.checkEnter.bind(this)
        this.checkEscape = this.checkEscape.bind(this)
        this.edit = this.edit.bind(this)
        this.finishEdit = this.finishEdit.bind(this)

        this.styles = {
            input: {
                color: '#333',
                width: '100%'
            }
        }
    }

    render() {
        const { onEdit, value, ...props } = this.props

        return (
            <div {...props}>
                {this.state.editing ? this.renderEdit() : this.renderValue()}
            </div>
        )
    }

    renderEdit() {
        if (this.props.type === 'textarea') {
            return this.renderTextArea()
        } else if (this.props.type === 'textfield') {
            return this.renderInput()
        }
    }

    renderTextArea() {
        return (
            <textarea
                autoFocus={true}
                defaultValue={this.props.value}
                onChange={this.checkEnter} 
                onKeyDown={this.checkEscape}
                onBlur={this.finishEdit}
                style={this.styles.input }/>
        )
    }

    renderInput() {
        return (
            <input type="text"
                autoFocus={true}
                placeholder={this.props.value}
                onKeyPress={this.checkEnter} 
                onKeyDown={this.checkEscape}
                onBlur={this.finishEdit}
                style={this.styles.input }/>
        )
    }

    renderValue() {
        return (
            <div onClick={this.edit} className="value">
                {this.props.value}
            </div>
        )
    }

    edit(e) { 
        this.setState({
            editing: true
        })
    }

    checkEnter(e) {
        if (e.key === 'Enter') {
            this.finishEdit(e)
        }
    }

    checkEscape(e) {
        if (e.key === 'Escape') {
            this.setState({
                editing: false
            })
        }
    }

    finishEdit(e) {
        if (e.target.value.trim() !== '') {
            this.props.onEdit(e.target.value)
        }

        this.setState({
            editing: false
        })
    }



}

export default Editable
