import "./App.css";
import { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/api";
import { createPost, deletePost } from "./graphql/mutations";
import { listPosts } from "./graphql/queries";
import { withAuthenticator, Heading, Button } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import PropTypes from "prop-types";

const initialState = { title: "", content: "" };
const client = generateClient();

const App = ({ user }) => {
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
      let posts = postData.data.listPosts.items;
      posts = posts.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
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
      const result = await client.graphql({
        query: createPost,
        variables: {
          input: post,
        },
      });
      setPosts([result.data.createPost, ...posts]);
      setFormState(initialState);
    } catch (err) {
      console.log("error creating post:", err);
    }
  }

  async function handleDelete(postId) {
    try {
      await client.graphql({
        query: deletePost,
        variables: { input: { id: postId } },
      });
      fetchPosts(); // refresh the list after deleting
    } catch (err) {
      console.log("error deleting post:", err);
    }
  }

  return (
    <div style={styles.container}>
      <Heading level={1}>Hello {user.username}</Heading>
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
      <Button style={styles.button} onClick={addPost}>
        Create Post
      </Button>
      {posts.map((post, index) => (
        <div key={post.id ? post.id : index} style={styles.todo}>
          <p style={styles.todoName}>{post.title}</p>
          <p style={styles.todoDescription}>{post.content}</p>
          <Button onClick={() => handleDelete(post.id)}>Delete</Button>
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

App.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string,
  }).isRequired,
};

export default withAuthenticator(App);
