import React, { Component, Fragment } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Container from "../../components/Container";
import FileSaver from "file-saver";
import "./Profile.scss";
import Loader from "../../components/Loader";

class Profile extends Component {
  state = {
    user: {},
    requestedUser: {
      _id: null,
      profileImageUrl: null,
      facebookId: null,
      facebookUrl: null,
      githubId: null,
      githubUrl: null,
      achievements: [],
      interests: [],
      papersPublished: [],
      previousInternships: [],
      previousWorkExperience: [],
      projects: [],
      skills: [],
      academicDetails: []
    },
    renderChild: true
  };
  componentDidMount() {
    axios
      .get("https://streethack.ghosh.pro/api/users/current")
      // .get("https://jsonplaceholder.typicode.com/users/1")
      .then(d => {
        // if (d.data) this.setState({ user: { _id: d.data.id } });
        if (d.data.user) this.setState({ user: d.data.user });
        // if (!d.data.id) window.location.href = "/login";
        localStorage.setItem("token", d.data.token);
        axios
          .get("https://streethack.ghosh.pro/api/users/" + d.data.id, {
            headers: { Authorization: "bearer " + d.data.token }
          })
          .then(d => {
            if (d.data.user) this.setState({ user: d.data.user });
            localStorage.setItem("user", JSON.stringify(d.data.user));
            console.log(this.state.user.name);
            // localStorage.setItem("token", d.data.token);
            // if (!this.state.user.name) window.location.href = "/login";
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));

    axios
      .get("https://streethack.ghosh.pro/api/users/" + this.props.match.params.id)
      .then(d => {
        if (d.data) this.setState({ requestedUser: d.data.user });
        this.setState({ renderChild: false });
        // localStorage.setItem("user", JSON.stringify(d.data.user));
        // localStorage.setItem("token", d.data.token);
        // if (!this.state.user.name) window.location.href = "/login";
      })
      .catch(err => console.log(err));
  }
  redirectPost = (url, data) => {
    var form = document.createElement("form");
    document.body.appendChild(form);
    form.method = "post";
    form.action = url;
    for (var name in data) {
      var input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      input.value = data[name];
      form.appendChild(input);
    }
    form.submit();
  };
  handleEditProfile = () => {
    this.redirectPost("/buildProfile", { user: this.state.user._id });
  };
  handleExportData = () => {
    var fileToSave = new Blob([JSON.stringify(this.state.user)], {
      type: "application/json",
      name: `${this.state.user._id}.json`
    });

    FileSaver.saveAs(fileToSave, `${this.state.user._id}.json`);
  };
  handleDeleteAccount = () => {
    axios
      .delete("https://streethack.ghosh.pro/api/users/" + this.props.match.params.id, {
        headers: {
          Authorization: "Bearer" + String(localStorage.getItem("token"))
        }
      })
      .then(d => {
        window.location.href = "/";
      })
      .catch(err => console.log(err));
  };
  handleDeactivateAccount = () => {
    axios
      .get(
        "https://streethack.ghosh.pro/api/users/deactivate/" +
          this.props.match.params.id,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        }
      )
      .then(d => {
        window.location.href = "/";
      })
      .catch(err => console.log(err));
  };
  render() {
    // if (
    //   this.state.user._id === this.state.requestedUser._id &&
    //   (this.state.user.interests.length <= 0 ||
    //     this.state.user.skills.length <= 0 ||
    //     this.state.user.academicDetails <= 0)
    // ) {
    //   window.location.href = "/buildProfile";
    // }
    return (
      <Fragment>
        <Navbar user={this.state.user} />
        {this.state.renderChild ? (
          <Loader unmount={this.handleChildUnmount} />
        ) : null}
        <Container>
          <div
            className="row mt-4 profile-container"
            style={{
              width: "100%",
              margin: "auto"
            }}
          >
            <div
              className="col-12"
              style={{
                height: "200px",
                borderTopLeftRadius: "10px",
                borderTopRightRadius: "10px",
                backgroundAttachment: "fixed",
                // boxShadow: " 0px 3px 20px -2px rgba(0,0,0,0.5)",
                backgroundSize: "cover",
                filter: "grayscale(1) contrast(1.5)",
                backgroundImage: `url("https://streethack.ghosh.pro/assets/img/coverImageDefault.jpeg")`,
                zIndex: "-200"
              }}
            />
            <div
              className="col-12"
              style={{
                backgroundColor: "#f8f9fa",
                borderBottomLeftRadius: "10px",
                borderBottomRightRadius: "10px"
                // boxShadow: " 0px 3px 20px -2px rgba(0,0,0,0.5)"
              }}
            >
              <div className="row pb-2">
                <div className="col-md-2 col-sm-12 text-center-sm">
                  <img
                    src={
                      this.state.requestedUser.profileImageUrl
                        ? this.state.requestedUser.profileImageUrl
                        : "http://arabellamc.com/arabella/themes/images/default-user.png"
                    }
                    alt="user"
                    style={{
                      borderRadius: "50%",
                      width: "150px",
                      height: "150px",
                      margin: "auto",
                      marginTop: "-4rem",
                      position: "relative",
                      border: "5px solid black",
                      backgroundColor: "#fff",
                      padding: ".25rem"
                    }}
                  />
                </div>
                <div className="col-md-10 col-sm-12 text-center-sm user-details-sm">
                  <div className="col-12 text-center-sm">
                    <h1 className="social-name">
                      {this.state.requestedUser.name}
                    </h1>
                    <div className="social-buttons">
                      {this.state.requestedUser.githubId ? (
                        <Fragment>
                          <a href={this.state.requestedUser.githubUrl}>
                            <i className="fab fa-github " />
                          </a>
                          &nbsp;
                        </Fragment>
                      ) : null}
                      {this.state.requestedUser.linkedinUrl ? (
                        <Fragment>
                          <a href={this.state.requestedUser.linkedinUrl}>
                            <i className="fab fa-linkedin " />
                          </a>
                          &nbsp;
                        </Fragment>
                      ) : null}
                      {/* {this.state.requestedUser.googleId ? (
                      <a href="">
                        <i className="fab fa-google " />
                      </a>
                    ) : null}
                    &nbsp; */}
                      {this.state.requestedUser.facebookId ? (
                        <Fragment>
                          <a href={this.state.requestedUser.facebookUrl}>
                            <i className="fab fa-facebook" />
                          </a>
                        </Fragment>
                      ) : null}
                    </div>
                    {this.state.requestedUser.interests ? (
                      <div className="interests">
                        {this.state.requestedUser.interests.map(
                          (interest, i) => (
                            <span
                              key={i}
                              className="badge badge-pill badge-dark"
                            >
                              {interest}
                            </span>
                          )
                        )}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="container">
            <div className="row py-4 user-exp-row d-flex justify-content-around">
              <div className="user-exp-details col-12">
                {this.state.requestedUser.skills.length > 0 ? (
                  <Fragment>
                    <h3 className="text-center-sm">Skills</h3>
                    <hr />
                    <ul
                      className="d-flex flex-wrap"
                      style={{ paddingInlineStart: "0" }}
                    >
                      {this.state.requestedUser.skills
                        ? this.state.requestedUser.skills
                            .sort((a, b) => b.length - a.length)
                            .map((s, i) => (
                              <li
                                className="badge badge-dark mb-2 skill-badge"
                                key={i}
                              >
                                {s}
                              </li>
                            ))
                        : null}
                    </ul>
                  </Fragment>
                ) : null}
                {this.state.requestedUser.projects.length > 0 ? (
                  <div>
                    <h3 className="text-center-sm">Projects</h3>
                    <hr />
                    {this.state.requestedUser.projects.map(p => (
                      <div className="project py-1 text-center-sm" key={p.id}>
                        <h4>{p.title}</h4>
                        <span>{p.startYear}</span> - <span>{p.endYear}</span>
                        <p className="text-justify py-1 project-description">
                          {p.description}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : null}
                {this.state.requestedUser.previousInternships.length > 0 ? (
                  <div>
                    <h3 className="text-center-sm">Internships</h3>
                    <hr />
                    {this.state.requestedUser.previousInternships.map(p => (
                      <div className="project py-1 text-center-sm" key={p.id}>
                        <h4>
                          {p.designation} @ {p.employer}
                        </h4>
                        <span>{p.startYear}</span> - <span>{p.endYear}</span>
                        <p className="text-justify py-1 project-description">
                          {p.description}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : null}
                {this.state.requestedUser.previousWorkExperience.length > 0 ? (
                  <div>
                    <h3 className="text-center-sm">Work Experience</h3>
                    <hr />
                    {this.state.requestedUser.previousWorkExperience.map(p => (
                      <div className="project py-1 text-center-sm" key={p.id}>
                        <h4>
                          {p.designation} @ {p.employer}
                        </h4>
                        <span>{p.startYear}</span> - <span>{p.endYear}</span>
                        <p className="text-justify py-1 project-description">
                          {p.description}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : null}
                {this.state.requestedUser.achievements.length > 0 ? (
                  <div>
                    <h3 className="text-center-sm">Achievements</h3>
                    <hr />
                    {this.state.requestedUser.achievements.map(p => (
                      <div className="project py-1 text-center-sm" key={p.id}>
                        <h4>{p.title}</h4>
                        <span>{p.issuer}</span>
                        <span>, {p.year}</span>
                        <p className="text-justify py-1 project-description">
                          {p.description}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : null}
                {this.state.requestedUser.academicDetails.length > 0 ? (
                  <div>
                    <h3 className="text-center-sm">Academic Details</h3>
                    <hr />
                    {this.state.requestedUser.academicDetails.map(p => (
                      <div className="project py-1 text-center-sm" key={p.id}>
                        <h4>{p.degree}</h4>
                        <span>{p.institution}</span>
                        <span>, {p.graduationYear}</span>
                        <p className="text-center-sm py-1 project-description">
                          {p.description}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : null}
                {this.state.requestedUser.papersPublished.length > 0 ? (
                  <div>
                    <h3 className="text-center-sm">Papers Published</h3>
                    <hr />
                    {this.state.requestedUser.papersPublished.map(p => (
                      <div className="project py-1 text-center-sm" key={p.id}>
                        <h4>{p.title}</h4>
                        <span>{p.publisher}</span>
                        <span>, {p.year}</span>
                        <p className="text-justify py-1 project-description">
                          {p.description}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          <div className="col-12">
            {this.state.requestedUser._id === this.state.user._id ? (
              <div className="text-center d-flex justify-content-between mb-4">
                <button
                  className="btn btn-info"
                  style={{ marginTop: "-10px", marginBottom: "10px" }}
                  onClick={this.handleEditProfile}
                >
                  Edit
                </button>
                <button
                  className="btn btn-dark"
                  style={{ marginTop: "-10px", marginBottom: "10px" }}
                  onClick={() =>
                    window.open(`/api/resume/${this.state.user._id}`, "_blank")
                  }
                >
                  PDF
                </button>
                <button
                  className="btn btn-info"
                  style={{ marginTop: "-10px", marginBottom: "10px" }}
                  onClick={this.handleExportData}
                >
                  Export
                </button>
                <button
                  onClick={this.handleDeactivateAccount}
                  className="btn btn-warning"
                  style={{ marginTop: "-10px", marginBottom: "10px" }}
                >
                  Deactivate
                </button>
                <button
                  onClick={this.handleDeleteAccount}
                  className="btn btn-danger"
                  style={{ marginTop: "-10px", marginBottom: "10px" }}
                >
                  Delete
                </button>
              </div>
            ) : null}
          </div>
        </Container>
        <Footer />
      </Fragment>
    );
  }
}

export default Profile;
