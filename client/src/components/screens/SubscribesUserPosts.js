import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../App";
import { Link } from "react-router-dom";
const Home = () => {
  const [data, setData] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    fetch("/getsubpost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setData(result.posts);
      });
  }, []);

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

  const deletePost = (postid) => {
    fetch(`/deletepost/${postid}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = data.filter((item) => {
          return item._id !== result._id;
        });
        setData(newData);
      });
  };
  return (
    <div className="mainbody">
      <div className="wrapper">
        <div className="inlinearea blgs">
          <section className="colm blog_line">
            <div className="">
              {data.map((item) => {
                return (
                  <div className="blog_box" key={item._id}>
                    <section className="conts">
                      <div
                        className="imgs"
                        style={{
                          backgroundImage: "url(" + item.photo + ")",
                        }}
                      ></div>
                      {/* <h5 style={{ padding: "5px" }}>
                <Link
                  to={
                    item.postedBy._id !== state._id
                      ? "/profile/" + item.postedBy._id
                      : "/profile"
                  }
                >
                  {item.postedBy.name}
                </Link>{" "}
                {item.postedBy._id == state._id && (
                  <i
                    className="material-icons"
                    style={{
                      float: "right",
                    }}
                    onClick={() => deletePost(item._id)}
                  >
                    delete
                  </i>
                )}
              </h5>
 */}
                      <article className="cont_txt">
                        <div className="top_bar">
                          <div className="pstdtl">
                            {/* <div> */}
                            <div className="">
                              <span className="nms">
                                <img
                                  className="pfl_pic"
                                  src={item.postedBy.pic}
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
                              >
                                {item.postedBy._id === state._id && (
                                  <i
                                    className="material-icons"
                                    style={{
                                      float: "right",
                                    }}
                                    onClick={() => deletePost(item._id)}
                                  >
                                    Delete
                                  </i>
                                )}
                              </span>
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
                                            record.postedBy._id !== state._id
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
  );
};

export default Home;
