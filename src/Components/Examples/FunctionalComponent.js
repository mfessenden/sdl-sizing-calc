import { Component } from 'react';

// from:
// https://react.dev/reference/react/Component#alternatives
// This is the current way

export default class Counter extends Component {
    state = {
        name: 'Taylor',
        age: 42,
    };

    handleNameChange = (e) => {
        this.setState({
            name: e.target.value
        });
    }

    handleAgeChange = (e) => {
        this.setState({
            age: this.state.age + 1
        });
    };

    render() {
        return (
            <>
                <input
                    value={this.state.name}
                    onChange={this.handleNameChange}
                />
                <button onClick={this.handleAgeChange}>
                    Increment age
                </button>
                <p>Hello, {this.state.name}. You are {this.state.age}.</p>
            </>
        );
    }
}