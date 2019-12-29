import React from "react";

const Leaderboard = props => {
  return (
    <table className="table table-borderless text-center">
      <tbody>
        {props.leaderboard.sort().map(e => (
          <tr key={e.position}>
            <th scope="row">{e.position}</th>
            <td style={{ textAlign: "left" }}>
              {e.position <= 3 ? (
                <React.Fragment>
                  {e.name}{" "}
                  <i
                    className="fas fa-medal"
                    style={{
                      color:
                        e.position == 1
                          ? "gold"
                          : e.position == 2
                          ? "silver"
                          : e.position == 3
                          ? "brown"
                          : "white"
                    }}
                  />
                </React.Fragment>
              ) : (
                e.name
              )}
            </td>
            <td>{e.points} XP</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Leaderboard;
