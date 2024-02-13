import "./App.css";
import { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/api";
import { createPost } from "./graphql/mutations";
import { listPosts } from "./graphql/queries";
import { withAuthenticator, Button, Heading } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

const initialState = { title: "", content: "" };
const client = generateClient();

const App = ({ signOut, user }) => {
  const [formState, setFormState] = useState(initialState);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const postData = await client.graphql({
        query: listPosts,
      });
      const posts = postData.data.listPosts.items;
      setPosts(posts);
    } catch (err) {
      console.log("error fetching posts:", err);
    }
  }

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value });
  }

  async function addPost() {
    try {
      if (!formState.title || !formState.content) return;
      const post = { ...formState };
      setPosts([...posts, post]);
      setFormState(initialState);
      await client.graphql({
        query: createPost,
        variables: {
          input: post,
        },
      });
    } catch (err) {
      console.log("error creating post:", err);
    }
  }

  return (
    <div style={styles.container}>
      <Heading level={1}>Hello {user.username}</Heading>
      <Button onClick={signOut}>Sign out</Button>
      <h2>Amplify Posts</h2>
      <input
        onChange={(event) => setInput("title", event.target.value)}
        style={styles.input}
        value={formState.title}
        placeholder="Title"
      />
      <input
        onChange={(event) => setInput("content", event.target.value)}
        style={styles.input}
        value={formState.content}
        placeholder="Content"
      />
      <button style={styles.button} onClick={addPost}>
        Create Post
      </button>
      {[...posts].reverse().map((post, index) => (
        <div key={post.id ? post.id : index} style={styles.todo}>
          <p style={styles.todoName}>{post.title}</p>
          <p style={styles.todoDescription}>{post.content}</p>
        </div>
      ))}
    </div>
  );
};

const styles = {
  container: {
    width: 400,
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: 20,
  },
  todo: { marginBottom: 15 },
  input: {
    border: "none",
    backgroundColor: "#ddd",
    marginBottom: 10,
    padding: 8,
    fontSize: 18,
  },
  todoName: { fontSize: 20, fontWeight: "bold" },
  todoDescription: { marginBottom: 0 },
  button: {
    backgroundColor: "black",
    color: "white",
    outline: "none",
    fontSize: 18,
    padding: "12px 0px",
  },
};

export default withAuthenticator(App);
