import React, { Component } from 'react';
import {TestTemplate, Create, Test} from 'components'

class TestPage extends Component {
  render() {
    return (
      <div>
        <TestTemplate
          firstDiv={<Create/>}
          secondDiv={<Test/>}
          thirdDiv={<Test/>}
        >
        <Test />
        </TestTemplate>
      </div>
    );
  }
}

export default TestPage;