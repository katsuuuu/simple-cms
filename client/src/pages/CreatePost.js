import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Navigate } from "react-router-dom";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [redirect, setRedirect] = useState(false);
  // Data typeを定義
  const [dataType, setDataType] = useState("string");

  async function createNewPost(ev) {
    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);

    ev.preventDefault();
    const response = await fetch("http://localhost:4000/post", {
      method: "POST",
      body: data,
      credentials: "include",
    });

    if (response.ok) {
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <form onSubmit={createNewPost}>
      <input
        type="type"
        placeholder={"Text or Number"}
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />
      <input
        type="summary"
        placeholder={"Text or Number"}
        value={summary}
        onChange={(ev) => setSummary(ev.target.value)}
      />
      <button style={{ marginTop: "5px" }}>Create</button>
    </form>
  );
}

// Inside createNewPost function
// if (title === "1") {
//   // Input is a number
//   const numericValue = parseInt(titleInputValue, 10);
//   // Do something with numericValue
// } else {
//   // Input is text
//   // Do something with titleInputValue
// }

// if (summary === "1") {
//   // Input is a number
//   const numericValue = parseInt(summaryInputValue, 10);
//   // Do something with numericValue
// } else {
//   // Input is text
//   // Do something with summaryInputValue
// }

// Dropdown形式
{
  /* <form onSubmit={createNewPost}>
  <select id="title" value={title} onChange={(ev) => setTitle(ev.target.value)}>
    <option value="">-- Select number or text --</option>
    <option value="1">Number</option>
    <option value="string">Text</option>
  </select>

  <select
    id="summary"
    value={summary}
    onChange={(ev) => setSummary(ev.target.value)}>
    <option value="">-- Select number or text --</option>
    <option value="1">Number</option>
    <option value="string">Text</option>
  </select>

  <button style={{ marginTop: "5px" }}>Create</button>
</form>; */
}
