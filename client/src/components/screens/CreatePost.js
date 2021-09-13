import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import M from "materialize-css";
import "./../../App.css";
// import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoffee } from "@fortawesome/free-solid-svg-icons";
import { UserContext } from "../../App";

const CreatePost = () => {
  const history = useHistory();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    if (url) {
      fetch("/createpost", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          title,
          body,
          pic: url,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            M.toast({ html: data.error, classes: "#c62828 red darken-3" });
          } else {
            M.toast({
              html: "Created post Successfully",
              classes: "#43a047 green darken-1",
            });

            history.push("/");
            setBody("");
            setImage("");
            setTitle("");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [url]);

  const postDetails = () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "blog_post");
    data.append("cloud_name", "saikatcloud");
    fetch("https://api.cloudinary.com/v1_1/saikatcloud/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setUrl(data.url);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="blog_box postar">
      <section className="conts">
        <article className="cont_txt">
          <div className="mdl_bar">
            <div className="tablearea vtop">
              <div className="cell pht">
                {state ? (
                  <img className="pfl_pic" src={state.pic}></img>
                ) : (
                  <img className="pfl_pic" src=""></img>
                )}
              </div>
              <div className="cell cnt">
                <input
                  className="inputareaTitle"
                  placeholder="Title "
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <input
                  className="inputareaStory"
                  placeholder="Share your story..."
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="btm_bar">
            <div className="tablearea">
              <div className="fl_l">
                <div className="custombrowse">
                  <label>
                    <input
                      type="file"
                      onChange={(e) => setImage(e.target.files[0])}
                    />
                    <div className="attachbtn">
                      <i className="fas fa-images"></i>
                    </div>
                  </label>
                </div>
              </div>
              <div className="fl_r">
                <button
                  type="submit"
                  className="btns"
                  onClick={() => postDetails()}
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
};

export default CreatePost;
