import React from 'react';
import style from './style.css'

const TestTemplate = ({ children, firstDiv, secondDiv, thirdDiv }) => {
  return (
    <div className={style.bigDiv}>
      <div className={style.firstDiv}>{firstDiv}</div>
      <div className={style.secondDiv}>{secondDiv}</div>
      <div className={style.thirdDiv}>{thirdDiv}</div>
        {children}
    </div>
  )
};

export default TestTemplate;