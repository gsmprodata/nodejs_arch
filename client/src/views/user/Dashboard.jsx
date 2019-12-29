import axios from "axios";
import React, { Component } from "react";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import Container from "../../components/Container";
import Slider from "../../components/Slider";
import Loader from "../../components/Loader";
import Leaderboard from "../../components/Leaderboard";
class Dashboard extends Component {
  state = {
    user: {},
    hackathons: [{}, {}, {}, {}],
    leaderboard: [],
    renderChild: true
  };
  onLoad() { }
  componentDidMount() {
    /**
     * Request backend for current user's id
     * Save the JWT token in the localStorage
     * Request the entire user profile using
     * and JWT authenticated route and store
     * it in the state
     */
    axios
      .get("http://localhost:5011/api/users/current")
      .then(d => {
        if (d.data) this.setState({ user: { _id: d.data.id } });
        if (!d.data.id) window.location.href = "/login";
        localStorage.setItem("token", d.data.token);
        axios
          .get("http://localhost:5011/api/users/" + d.data.id, {
            headers: { Authorization: "bearer " + d.data.token }
          })
          .then(d => {
            if (d.data) this.setState({ user: d.data.user });
            localStorage.setItem("user", JSON.stringify(d.data.user));
            console.log(this.state.user.name);
            if (!this.state.user.name) window.location.href = "/login";
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));

    /**
     * Request backend for list for hackathons
     * and store them in the state.
     * Unload the Loader once data is received
     */
    axios
      .get("http://localhost:5011/api/hackathons")
      .then(d => {
        this.setState({ hackathons: d.data });
        this.setState({ renderChild: false });
      })
      .catch(err => console.log(err));

    /**
     * Get Leaderboard data and save them in
     * the state
     */
    axios
      .get("http://localhost:5011/api/leaderboard")
      .then(d => this.setState({ leaderboard: d.data }))
      .catch(err => console.log(err));
  }
  divStyle = {
    backgroundColor: "#ffffff",
    padding: "2em"
  };
  handleChildUnmount() {
    this.setState({ renderChild: false });
  }
  handleInviteFriends = () => {
    const email = document.getElementById("inviteemail").value;
    axios({
      method: "post",
      url: "http://localhost:5011/api/users/invite",
      data: {
        existentUser: this.state.user.email,
        email
      },
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    })
      .then(d => {
        console.log("invite sent");
        let alert = document.createElement("div");
        alert.classList.add("btn");
        alert.classList.add("btn-success");
        alert.classList.add("btn-block");
        alert.classList.add("mb-4");
        alert.appendChild(document.createTextNode("Invite Sent"));
        document.getElementById("inviteHeading").insertBefore(alert, document.getElementById("inviteHeading").firstChild);
        setTimeout(() => alert.parentNode.removeChild(alert), 2000);
      })
      .catch(err => {
        console.log(err);
        let alert = document.createElement("div");
        alert.classList.add("btn");
        alert.classList.add("btn-danger");
        alert.classList.add("btn-block");
        alert.classList.add("mb-4");
        alert.appendChild(document.createTextNode("Error"));
        document.getElementById("inviteHeading").insertBefore(alert, document.getElementById("inviteHeading").firstChild);
        setTimeout(() => alert.parentNode.removeChild(alert), 2000);
      });
  };
  render() {
    return (
      <React.Fragment>
        {this.state.renderChild ? (
          <Loader unmount={this.handleChildUnmount} />
        ) : null}
        <Navbar user={this.state.user} active="challenges" />
        <Container backgroundColor="#ffffff" width="92%">
          <div className="row" style={{ margin: 0 }}>
            <div
              style={{ ...this.divStyle, border: "1px black" }}
              className="col-md-9 col-sm-12"
            >
              <h2>Challenges</h2>
              <hr />
              <Slider title="Live Challenges" data={this.state.hackathons} />
              <Slider title="Past Challenges" data={this.state.hackathons} />
            </div>
            <div style={this.divStyle} className="col-md-3 col-sm-12">
              <h2>Leaderboard</h2>
              <hr />
              {this.state.leaderboard.length > 3 ? (
                <Leaderboard leaderboard={this.state.leaderboard} />
              ) : (
                  <div className="container text-center py-4 pb-5">
                    <i className="fas fa-cog fa-spin fa-3x" />
                  </div>
                )}
              <h2 id="inviteHeading">Invite Friends</h2>
              <hr />
              <div className="form-group">
                <div className="form-group">
                  <label className="sr-only" htmlFor="email">
                    Email Address:
                  </label>
                  <input
                    type="email"
                    className="form-control text-center"
                    id="inviteemail"
                    placeholder="enter an email address"
                  />
                </div>
                <button
                  type="submit"
                  onClick={this.handleInviteFriends}
                  className="btn btn-dark btn-block"
                >
                  Send Invite
                </button>
              </div>
            </div>
          </div>
        </Container>
        <Footer />
      </React.Fragment>
    );
  }
}

export default Dashboard;
