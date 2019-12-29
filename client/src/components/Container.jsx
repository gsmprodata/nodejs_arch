import React from "react";

const Container = props => {
  return (
    <div
      className="container text-justify"
      style={{ backgroundColor: props.backgroundColor, width: props.width }}
    >
      {props.children}
    </div>
  );
};

export default Container;
