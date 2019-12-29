import React from "react";
import "./Card.scss";

const Card = props => {
  return (
    <div className="card">
      {props.loading ? null : (
        <img
          src={props.imgUrl}
          alt={props.title}
          className="card-img-top responsive"
        />
      )}
      {props.loading ? (
        <div className="card-body">
          {/* <div className="registered_users">
            <i className="fas fa-users" />
            &nbsp;{props.registeredUsers}
          </div> */}
          {/* <h4 className="card-title">{props.title}</h4> */}
          <div className="container text-center loading">
            <i className="fas fa-cog fa-3x fa-spin" />
          </div>
          {/* <div
            className="btn-toolbar"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <button className="btn btn-danger">Register</button>
            <button className="btn btn-dark">Learn More</button>
          </div> */}
        </div>
      ) : (
        <div className="card-body">
          <div className="registered_users">
            <i className="fas fa-users" />
            &nbsp;{props.registeredUsers}
          </div>
          <h4 className="card-title">{props.title}</h4>
          <p className="card-text">{props.shortDesc}</p>
          <div
            className="btn-toolbar"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <button className="btn btn-danger">Register</button>
            <button className="btn btn-dark">Learn More</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;
