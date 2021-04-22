import React from 'react';

const Checkbox = ({ name, innerRef, children }) => (
  <div className="custom-control custom-toggle pl-0 my-2">
    <input name={name} type="checkbox" className="custom-control-input" id={name} ref={innerRef} />
    <label className="custom-control-label" htmlFor={name}>
      <span className="ml-4 pl-3">{children}</span>
    </label>
  </div>
);

export default Checkbox;
