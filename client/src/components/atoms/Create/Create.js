import React, { Component } from 'react';
import axios from 'axios';

class Create extends Component {
  constructor() {
    super();
    this.state = {
      contents:''  
    }
    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }
  
  onChange = (e) => {
    const state = this.state
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  onSubmit = (e) => {
    e.preventDefault();
    const { contents } = this.state;
    axios.get('/api/test', { contents })
      .then((result) => {
        console.log(result)
      });
  }
  
  render() {
    const { contents } = this.state;

    return (
      <div>
        <form onSubmit={this.onSubmit}>
          Create Data : <input type="text" name="contents" value={contents} onChange={this.onChange} /><br />
          <button type="submit">Create</button>
        </form>
      </div>
    );
  }
}

export default Create;