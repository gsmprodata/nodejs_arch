const userService = require("../services/user");
const marked = require("marked");
const pdf = require("html-pdf");
const fs = require("fs");
const jwtActual = require("jsonwebtoken");

/**
 *  Authentication Controllers
 */
const authenticate = (req, res, next) => {
  userService
    .authenticate(req.body)
    .then(user =>
      req.session.passport
        ? res.json({ user: req.session.passport.user })
        : user
          ? res.json({ user })
          : res.status(400).json({ message: "Username or Password is incorrect" })
    )
    .catch(err => res.redirect("/login"));
};

const ensureAuthenticated = (req, res, next) => {
  if (req.session.passport) next();
  if (!req.session.passport) res.redirect("/login");
};

const logout = (req, res, next) => {
  if (req.session.passport) {
    req.logout();
    res.redirect("/login");
  } else {
    res.redirect("/login");
  }
};

/**
 *  Registration Controllers
 */
const register = (req, res, next) => {
  userService
    .create(req.body)
    .then(() => res.redirect("/login?email=mailsent"))
    .catch(err => res.redirect("/register?error=registrationerror"));
};

const verifyEmail = (req, res, next) => {
  userService
    .verifyEmail(req.query.email, req.query.emailToken)
    .then(() =>
      res.render("emailVerification", {
        layout: false,
        verificationIsSuccessful: true
      })
    )
    .catch(err =>
      res.render("emailVerification", {
        layout: false,
        verificationIsNotSuccessful: true
      })
    );
};

/**
 *  Invitation Controllers
 */
const requestInvite = (req, res, next) => {
  userService
    .requestInviteEmail(req.body)
    .then(() => res.redirect("/?invitation=sent"))
    .catch(() => res.redirect("/?invitation=notsent"));
};

const sendInvite = (req, res, next) => {
  userService
    .sendInviteEmail(req.body)
    .then(() => res.json({ message: "Invite Sent" }))
    .catch(err => {
      console.log(err);
      res.status(400).json({ error: err });
    });
};

/**
 *  User Model CRUD Controllers
 */
const getAll = (req, res, next) => {
  userService
    .getAll()
    .then(users => {
      res.json({
        users,
        token: jwtActual.sign(
          { sub: req.user._id },
          process.env.USER_AUTH_SECRET,
          {
            expiresIn: "12h",
            algorithm: "HS512"
          }
        )
      });
    })
    .catch(err => res.status(400).json(err));
};

const getCurrent = (req, res, next) => {
  userService
    .getById(req.user._id)
    .then(user =>
      user
        ? res.json({
          id: user._id,
          token: jwtActual.sign(
            { sub: req.user._id },
            process.env.USER_AUTH_SECRET,
            {
              expiresIn: "12h",
              algorithm: "HS512"
            }
          )
        })
        : res.sendStatus(404)
    )
    .catch(err => res.status(400).json(err));
};

const getById = (req, res, next) => {
  userService
    .getById(req.params.id)
    .then(user => (user ? res.json({ user: user }) : res.sendStatus(404)))
    .catch(err => {
      // console.log(err);
      res.status(400).json(err);
    });
};

const update = (req, res, next) => {
  userService
    .update(req.params.id, req.body)
    .then(({ user, token }) => res.json({ user, token }))
    .catch(err => res.status(400).json(err));
};

const resetPassword = (req, res, next) => {
  userService
    .update(req.params.id, req.body)
    .then(({ user, token }) =>
      res.json({
        user,
        token
      })
    )
    .catch(err =>
      res.status(400).json({
        err
      })
    );
};

const sendResetPassword = (req, res, next) => {
  userService
    .sendResetPasswordEmail(req.body.email)
    .then(() => res.json({ message: "Password Reset Mail Sent" }))
    .catch(err => res.status(400).json(err));
};

const verifyResetPassword = (req, res, next) => {
  userService
    .verifyResetPasswordEmail(req.query)
    .then(({ id, token }) =>
      res.render("passwordReset", {
        layout: false,
        isVerified: true,
        token,
        id
      })
    )
    .catch(err =>
      res.render("passwordReset", {
        layout: false,
        passwordResetVerificationFailure: true
      })
    );
};

const _delete = (req, res, next) => {
  if (req.session.passport.user._id === req.params.id) {
    userService
      .delete(req.params.id)
      .then(() => res.json({ message: "User Deleted" }))
      .catch(err => res.status(400).json(err));
  } else {
    res.status(400).json({ err: "You are not allowed" });
  }
};

const _deactivate = (req, res, next) => {
  if (req.session.passport.user._id === req.params.id) {
    userService
      .deactivate(req.params.id)
      .then(() => res.json({ message: "User Deactivated" }))
      .catch(err => res.status(400).json(err));
  } else {
    res.status(400).json({ err: "You are not allowed" });
  }
};

const generateResume = (req, res, next) => {
  userService
    .getById(req.params.id)
    .then(user => {
      if (!user) throw "UserNotFound";

      let template = `
      <!DOCTYPE html>
<html lang="en" moznomarginboxes>
    <head>
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge;chrome=1" />
        <meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
        <meta name="google" content="notranslate" />
        <!-- Google Fonts, Normalize, and Font Awesome -->
        <link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Cardo|Montserrat:300,400,500&amp;subset=latin-ext" crossorigin="anonymous" />
        <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.0/normalize.min.css" integrity="sha256-oSrCnRYXvHG31SBifqP2PM1uje7SJUyX0nTwO2RJV54=" crossorigin="anonymous" />
        <link rel="stylesheet" type="text/css" href="https://use.fontawesome.com/releases/v5.1.0/css/all.css" integrity="sha384-lKuwvrZot6UHsBSfcMvOkWwlCMgc0TaWr+30HWe3a4ltaBwTZhyTEggF5tJv8tbt" crossorigin="anonymous" />
        <!-- Custom Styles -->
        <link rel="stylesheet" type="text/css" href="https://streethack.ghosh.pro/assets/resume/paper.css" />
        <link rel="stylesheet" type="text/css" href="https://streethack.ghosh.pro/assets/resume/styles.css" />
        <link rel="stylesheet" type="text/css" href="https://streethack.ghosh.pro/assets/resume/typography.css" />
        <link rel="stylesheet" type="text/css" media="screen" href="https://streethack.ghosh.pro/assets/resume/screen.css" />
        <link rel="stylesheet" type="text/css" media="print" href="https://streethack.ghosh.pro/assets/resume/print.css" />
    </head>
    <body class="A4">
        <section id="save">
            <section class="sheet">
                <aside>
                    <section class="contact">
                        <h6>Contact</h6>
                        <ul>
                            <!--<li>
                                <p><i class="fa fa-map-marker-alt" title="Location"></i> San Francisco, CA</p>
                            </li>
                            <li>
                                <p><i class="fa fa-phone" title="Cell phone"></i> <a href="tel:4153234000">(415) 323-4000</a></p>
                            </li>-->
                            ${
        user.email
          ? `
                            <li>
                                <p><i class="fa fa-envelope" title="Email"></i> <a href="mailto:${
          user.email
          }">${user.email}</a></p>
                            </li>`
          : null
        }
                            <!--<li>
                                <p><i class="fa fa-globe-americas" title="Website"></i> <a href="https://joesmith.site">joesmith.site</a></p>
                            </li>-->

                            ${
        user.githubUrl
          ? `
                            <li>
                                <p><i class="fab fa-github" title="GitHub"></i> <a href="${
          user.githubUrl
          }">${user.githubUsername}</a></p>
                            </li>`
          : null
        }
                        </ul>
                    </section>
                    <section class="skills">
                        <h6>Skills</h6>
                        <ul>
                            ${user.skills
          .sort((a, b) => a.length - b.length)
          .map(s => `<li><span>${s}</span></li>`)
          .join("")}
                        </ul>
                    </section>
                    <section class="skills">
                        <h6>Interests</h6>
                        <ul>
                            ${user.interests
          .map(s => `<li><span>${s}</span></li>`)
          .join("")}
                        </ul>
                    </section>
                    <section class="references">
                        <h6>References</h6>
                        <address>
                            Jane Doe<br />
                            Alphabet Inc.<br />
                            (413) 025-1900
                            jane@janedoe.site
                        </address>
                        <address>
                            Luke O'Connor<br />
                            Facebook<br />
                            (413) 125-1400
                            luke@facebook.site
                        </address>
                        <p>Typeset in HTML &amp; CSS<br />
                        See <a href="https://git.io/f4dXp">git.io/f4dXp</a></p>
                    </section>
                </aside>
                <section>
                    <header class="name" aria-label="Joe Smith">
                            <svg width="700px" height="65px" viewBox="0 0 700 65" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                                <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" font-family="Montserrat-Regular, Montserrat" font-size="48" font-weight="normal">
                                    <g id="A4" transform="translate(-54.000000, -140.000000)" fill="#484848">
                                        <text id="JOE-SMITH">
                                            <tspan x="54.728" y="190">${
        user.name
        }</tspan>
                                        </text>
                                    </g>
                                </g>
                            </svg>
                        <!--<h6>Software Engineer Extraordinaire</h6>-->
                        <hr />
                    </header>
                    <section>
                        <section class="summary">
                            <h6>About Me</h6>
                            <p>${user.about}</p>
                        </section>
                        <section class="experience">
                            <h6>Achievements</h6>
                            <ol>
                                ${
        user.achievements
          ? user.achievements
            .map(
              w => `
                                <li>
                                <header>
                                    <p class="sanserif">${w.title}</p>
                                    <time>${w.year}</time>
                                </header>
                                <span>${w.issuer}</span>
                                <p class="sanserif" style="text-align:justify">${
                w.description
                }</p>
                                <!--<ul>
                                    <li>Developed scalable database indexing technology</li>
                                    <li>Created GraphQL APIs for accessing Google Earth</li>
                                    <li>Leveraged Waymo datasets to double traffic statistics accuracy</li>
                                </ul>-->
                            </li>
                                `
            )
            .join("")
          : null
        }
                            </ol>
                        </section>
                        <section class="experience">
                            <h6>Projects</h6>
                            <ol>
                                ${
        user.projects
          ? user.projects
            .map(
              w => `
                                <li>
                                <header>
                                    <p class="sanserif">${w.title}</p>
                                    <time>${w.startYear} – ${w.endYear}</time>
                                </header>
                                <!--<span>${w.employer}</span>-->
                                <p class="sanserif" style="text-align:justify">${
                w.description
                }</p>
                                <!--<ul>
                                    <li>Developed scalable database indexing technology</li>
                                    <li>Created GraphQL APIs for accessing Google Earth</li>
                                    <li>Leveraged Waymo datasets to double traffic statistics accuracy</li>
                                </ul>-->
                            </li>
                                `
            )
            .join("")
          : null
        }
                            </ol>
                        </section>
                        <section class="experience">
                            <h6>Experience</h6>
                            <ol>
                                ${
        user.previousWorkExperience
          ? user.previousWorkExperience
            .map(
              w => `
                                <li>
                                <header>
                                    <p class="sanserif">${w.designation}</p>
                                    <time>${w.startYear} – ${w.endYear}</time>
                                </header>
                                <span>${w.employer}</span>
                                <p class="sanserif" style="text-align:justify">${
                w.description
                }</p>
                                <!--<ul>
                                    <li>Developed scalable database indexing technology</li>
                                    <li>Created GraphQL APIs for accessing Google Earth</li>
                                    <li>Leveraged Waymo datasets to double traffic statistics accuracy</li>
                                </ul>-->
                            </li>
                                `
            )
            .join("")
          : null
        }
                                ${
        user.previousInternships
          ? user.previousInternships
            .map(
              w => `
                                <li>
                                <header>
                                    <p class="sanserif">${w.designation}</p>
                                    <time>${w.startYear} – ${w.endYear}</time>
                                </header>
                                <span>${w.employer}</span>
                                <p class="sanserif" style="text-align:justify">${
                w.description
                }</p>
                                <!--<ul>
                                    <li>Developed scalable database indexing technology</li>
                                    <li>Created GraphQL APIs for accessing Google Earth</li>
                                    <li>Leveraged Waymo datasets to double traffic statistics accuracy</li>
                                </ul>-->
                            </li>
                                `
            )
            .join("")
          : null
        }
                            </ol>
                        </section>
                        <section class="education">
                            <h6>Education</h6>
                            <ol>
                                ${
        user.academicDetails
          ? user.academicDetails
            .map(
              a => `
                                <li>    
                                    <div>
                                        <p class="sanserif"><strong>${
                a.degree
                }</strong><br />${a.description}</p>
                                        <time>Batch of ${
                a.graduationYear
                }</time>
                                    </div>
                                    <div>
                                        <span>${a.institution}</span>
                                        <span></span>
                                    </div>
                                </li>
                                `
            )
            .join("")
          : null
        }
                            </ol>
                        </section>
                        <section class="experience">
                            <h6>Publications</h6>
                            <ol>
                                ${
        user.papersPublished
          ? user.papersPublished
            .map(
              w => `
                                <li>
                                <header>
                                    <p class="sanserif">${w.title}</p>
                                    <time>${w.year}</time>
                                </header>
                                <span>${w.publisher}</span>
                                <p class="sanserif" style="text-align:justify">${
                w.description
                }</p>
                                <!--<ul>
                                    <li>Developed scalable database indexing technology</li>
                                    <li>Created GraphQL APIs for accessing Google Earth</li>
                                    <li>Leveraged Waymo datasets to double traffic statistics accuracy</li>
                                </ul>-->
                            </li>
                                `
            )
            .join("")
          : null
        }
                            </ol>
                        </section>
                    </section>
                </section>
            </section>
        </section>
    </body>
</html>
`;
      pdf
        .create(template, {
          border: {
            top: "1cm",
            // right: "1cm",
            bottom: "1cm"
            // left: "1cm"
          }
        })
        .toStream((err, pdfStream) => {
          if (err) {
            console.log(err);
            return res.sendStatus(500);
          } else {
            res.statusCode = 200;
            pdfStream.on("end", () => res.end());
            pdfStream.pipe(res);
          }
        });
      // res.send(template);
    })
    .catch(err => res.status(400).json(err));
};

module.exports = {
  generateResume,
  authenticate,
  logout,
  register,
  sendInvite,
  verifyEmail,
  resetPassword,
  sendResetPassword,
  verifyResetPassword,
  ensureAuthenticated,
  requestInvite,
  getAll,
  getById,
  getCurrent,
  update,
  _delete,
  _deactivate
};
