import React from "react";
import "./Footer.scss";

const Footer = () => {
  return (
    <footer className="page-footer font-small bg-secondary">
      <div className="bg-light">
        <div className="ml-1 mr-2 bg-light">
          <div className="row py-4 d-flex mx-0">
            <div className="col-md-6 col-lg-6 text-center mb-4 mb-md-0 social-links">
              <h6 className="mb-0">
                Get connected with us on social networks!
              </h6>
            </div>

            <div className="col-md-6 col-lg-6 text-center mb-4 mb-md-0 social-icons">
              <a className="fb-ic">
                <i className="fab fa-facebook-f white-text mr-4"> </i>
              </a>
              <a className="tw-ic">
                <i className="fab fa-twitter white-text mr-4"> </i>
              </a>
              <a className="gplus-ic">
                <i className="fab fa-google-plus-g white-text mr-4"> </i>
              </a>
              <a className="li-ic">
                <i className="fab fa-linkedin-in white-text mr-4"> </i>
              </a>
              <a className="ins-ic">
                <i className="fab fa-instagram white-text"> </i>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="container text-center text-md-left mt-5 bg-secondary text-white">
        <div className="row mt-3">
          <div className="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4 footer-about">
            <h6 className="text-uppercase font-weight-bold">StreetHack</h6>
            <hr />
            <p>
              StreetHack is a community enabler for Enterprises and Institutions. We believe self-sustainble communities are long living.
            </p>
          </div>

          <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
            <h6 className="text-uppercase font-weight-bold">Resources</h6>
            <hr />
            <p>
              <a href="https://streethack.org/enterprise.html" className="text-light">
                Enterprise
              </a>
            </p>
            <p>
              <a href="https://streethack.org/uhack.html" className="text-light">
                University
              </a>
            </p>
            <p>
              <a href="https://streethack.org/uhack.html" className="text-light">
                Community
              </a>
            </p>
            <p>
              <a href="https://stackq.in/" className="text-light">
                StackQ
              </a>
            </p>
          </div>

          <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
            <h6 className="text-uppercase font-weight-bold">Useful Links</h6>
            <hr />
            <p>
              <a href="#!" className="text-light">
                Your Account
              </a>
            </p>
            <p>
              <a href="https://angel.co/streethack/jobs" className="text-light">
                Jobs
              </a>
            </p>
            <p>
              <a href="#!" className="text-light">
                FAQ
              </a>
            </p>
            <p>
              <a href="#!" className="text-light">
                Help
              </a>
            </p>
          </div>

          <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
            <h6 className="text-uppercase font-weight-bold">Contact</h6>
            <hr />
            <p>
              91 Springboard, C2, Sector 1<br />
              Noida, Uttar Pradesh, India
            </p>
            <p>
              NSRCEL, IIM-B, Billekhalli
              <br />
              Bangalore, Karnataka, India
            </p>
            <p>
              <i className="fas fa-envelope mr-3" /> info@streethack.org
            </p>
          </div>
        </div>
      </div>

      <div className="footer-copyright text-center py-3 bg-dark text-light">
        © 2019 Copyright
        <a href="https://streethack.org" className="text-light">
          {" "}
          StreetHack
        </a>
      </div>
    </footer>
  );
};

export default Footer;
