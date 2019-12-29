import React from "react";
import Card from "./Card";
import Carousel from "nuka-carousel";
import "./Slider.scss";

const SliderComponent = props => {
  let cardList =
    props.data.length > 4
      ? props.data.map((h, i) => (
          <Card
            key={i}
            imgUrl={h.imgUrl}
            title={h.title}
            shortDesc={h.shortDesc}
            registeredUsers={Math.floor(h.registeredUsers)}
          />
        ))
      : props.data.map((h, i) => <Card key={i} loading={true} />);
  return (
    <React.Fragment>
      <h3 className="text-muted">
        {props.title}
        <span className="badge badge-secondary mx-4">{props.data.length}</span>
      </h3>
      <Carousel
        enableKeyboardControls={false}
        cellAlign="left"
        slideWidth="265px"
        wrapAround={true}
        renderBottomCenterControls={null}
        transitionMode="scroll"
        width="94%"
        renderCenterLeftControls={({ previousSlide }) => (
          <button
            onClick={previousSlide}
            className="btn btn-light slider-arrow slider-arrow-left"
          >
            <i className="fas fa-chevron-left" />
          </button>
        )}
        renderCenterRightControls={({ nextSlide }) => (
          <button
            onClick={nextSlide}
            className="btn btn-light slider-arrow slider-arrow-right"
          >
            <i className="fas fa-chevron-right" />
          </button>
        )}
      >
        {cardList}
      </Carousel>
    </React.Fragment>
  );
};

export default SliderComponent;
