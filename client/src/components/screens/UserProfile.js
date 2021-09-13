import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";
import { Link, useParams } from "react-router-dom";
const Profile = () => {
  const [userProfile, setProfile] = useState(null);
  const [data, setData] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const { userid } = useParams();
  const [showfollow, setShowFollow] = useState(
    state ? !state.following.includes(userid) : true
  );
  useEffect(() => {
    fetch(`/user/${userid}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setProfile(result);
        console.log(userProfile);
      });
  }, []);

  const followUser = () => {
    fetch("/follow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: userid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem("user", JSON.stringify(data));
        setProfile((prevState) => {
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: [...prevState.user.followers, data._id],
            },
          };
        });
        setShowFollow(false);
      });
  };
  const unfollowUser = () => {
    fetch("/unfollow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        unfollowId: userid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem("user", JSON.stringify(data));

        setProfile((prevState) => {
          const newFollower = prevState.user.followers.filter(
            (item) => item !== data._id
          );
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: newFollower,
            },
          };
        });
        setShowFollow(true);
      });
  };
  const makeComment = (text, postId) => {
    fetch("/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId,
        text,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
      {userProfile ? (
        <div className="mainbody">
          <div className="wrapper">
            <div className="inlinearea blgs">
              <section className="colm blog_line">
                <div className="inlinearea prfl">
                  <div className="colm prflsdtl">
                    <div className="pfl-pnl">
                      <img
                        className="prfl_pic_others"
                        src={userProfile.user.pic}
                      ></img>
                      <h1>{userProfile.user.name}</h1>
                    </div>
                  </div>
                  <div className="colm rgtcont">
                    <div className="flows">
                      <div className="tablearea">
                        <div className="cell">
                          <p>
                            <strong>Posts</strong>
                          </p>
                          <p>{userProfile.posts.length}</p>
                        </div>
                        <div className="cell">
                          <p>
                            <strong>Following </strong>
                          </p>
                          <p>{userProfile.user.following.length}</p>
                        </div>
                        <div className="cell">
                          <p>
                            <strong>Followers</strong>
                          </p>
                          <p>{userProfile.user.followers.length}</p>
                        </div>
                      </div>
                    </div>
                    {showfollow ? (
                      <button
                        style={{
                          margin: "10px",
                        }}
                        className="btn waves-effect waves-light #64b5f6 blue darken-1"
                        onClick={() => followUser()}
                      >
                        Follow
                      </button>
                    ) : (
                      <button
                        style={{
                          margin: "10px",
                        }}
                        className="btn waves-effect waves-light #64b5f6 blue darken-1"
                        onClick={() => unfollowUser()}
                      >
                        UnFollow
                      </button>
                    )}
                  </div>
                </div>
                <div className="">
                  {userProfile.posts.map((item) => {
                    console.log(item);
                    return (
                      <div className="blog_box" key={item._id}>
                        <section className="conts">
                          <div
                            className="imgs"
                            style={
                              {
                                // backgroundImage: "url(" + item.postedBy.pic + ")",
                              }
                            }
                          ></div>

                          <article className="cont_txt">
                            <div className="top_bar">
                              <div className="pstdtl">
                                <div className="">
                                  <span className="nms">
                                    <img
                                      className="pfl_pic"
                                      src={userProfile.user.pic}
                                    ></img>
                                    <Link
                                      to={
                                        item.postedBy._id !== state._id
                                          ? "/profile/" + item.postedBy._id
                                          : "/profile"
                                      }
                                    >
                                      {item.postedBy.name}
                                    </Link>
                                  </span>
                                  <span className="tms">
                                    <i className="far fa-calendar-alt"></i>{" "}
                                    {item.updatedAt}
                                  </span>
                                  <span
                                    style={{
                                      alignItems: "flex-end",
                                    }}
                                  ></span>
                                </div>
                              </div>
                            </div>

                            <div className="mdl_bar">
                              <h4>{item.title}</h4>
                              <br />
                              <p>{item.body}</p>
                            </div>
                            <div className="btm_bar">
                              <section className="cmtlist">
                                {item.comments.map((record) => {
                                  console.log(record);
                                  return (
                                    <div className="tablearea vtop">
                                      <div className="cell pht">
                                        <img
                                          className="pfl_pic"
                                          src={record.postedBy.pic}
                                        ></img>
                                      </div>
                                      <div className="cell cnt">
                                        <div className="pstdtl">
                                          <span className="nms">
                                            <Link
                                              to={
                                                record.postedBy._id !==
                                                state._id
                                                  ? "/profile/" +
                                                    record.postedBy._id
                                                  : "/profile"
                                              }
                                            >
                                              {record.postedBy.name}
                                            </Link>
                                          </span>
                                          <span className="tms">
                                            {record.createdAt}
                                          </span>
                                        </div>
                                        <p>{record.text}</p>
                                      </div>
                                    </div>
                                  );
                                })}
                              </section>
                              <div className="cell cnt">
                                <form
                                  onSubmit={(e) => {
                                    e.preventDefault();
                                    makeComment(e.target[0].value, item._id);
                                    e.target[0].value = "";
                                  }}
                                >
                                  <input
                                    type="text"
                                    className="inputareaComment"
                                    placeholder="add a comment"
                                  />
                                  <button type="submit">
                                    <i className="far fa-paper-plane"></i>
                                  </button>
                                </form>
                              </div>
                            </div>
                          </article>
                        </section>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>
          </div>
        </div>
      ) : (
        <h2>loading...!</h2>
      )}
    </>
  );
};

export default Profile;
