import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Editor from "../Editor";

export default function EditPost() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [previousPosts, setPreviousPosts] = useState(
    JSON.parse(localStorage.getItem("previousPosts")) || []
  );

  useEffect(() => {
    fetch("http://localhost:4000/post/" + id).then((response) => {
      response.json().then((postInfo) => {
        setTitle(postInfo.title);
        setSummary(postInfo.summary);
      });
    });
  }, []);

  async function updatePost(ev) {
    ev.preventDefault();
    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("id", id);

    const response = await fetch("http://localhost:4000/post", {
      method: "PUT",
      body: data,
      credentials: "include",
    });
    if (response.ok) {
      // setRedirect(false);
      handleRecord(ev);
    }
  }

  // もしメインページに戻りたい場合setRedirectと一緒に使用
  if (redirect) {
    return <Navigate to={"/post/" + id} />;
  }

  function handleRecord() {
    const newPost = {
      id: id,
      title: title,
      summary: summary,
    };
    setPreviousPosts([...previousPosts, newPost]);
    localStorage.setItem(
      "previousPosts",
      JSON.stringify([...previousPosts, newPost])
    );
  }

  return (
    <form onSubmit={updatePost}>
      <input
        type="title"
        placeholder={"Edit"}
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />
      <input
        type="summary"
        placeholder={"Edit"}
        value={summary}
        onChange={(ev) => setSummary(ev.target.value)}
      />
      <button style={{ marginTop: "5px" }}>Make</button>
      <div style={{ marginTop: "60px" }}>
        {previousPosts
          .filter((post) => post.id === id)
          .map((post, index) => (
            <div
              key={index}
              className="modeltexts"
              style={{ marginTop: "6px" }}>
              <h3>{post.title}</h3>
              <h3>{post.summary}</h3>
            </div>
          ))}
      </div>
    </form>
  );
}
