import React from 'react';
import styles from './checkbox.module.scss';

const Checkbox = ({ name, innerRef, children }) => (
  <div className="custom-control custom-checkbox custom-control-inline pl-0">
    <input type="checkbox" className="custom-control-input" name={name} id={name} ref={innerRef} />
    <label className={`custom-control-label ${styles.customControlLabel}`} htmlFor={name}>
      <span className="ml-2 pl-2">{children}</span>
    </label>
  </div>
);

export default Checkbox;
