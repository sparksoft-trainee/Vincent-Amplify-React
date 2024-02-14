import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import AboutUs from "../pages/AboutUsPage";
import ContactUs from "../pages/ContactUsPage";
import CreatePost from "../pages/CreatePostPage";
import Profile from "../pages/ProfilePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/about",
    element: <AboutUs />,
  },
  {
    path: "/contact",
    element: <ContactUs />,
  },
  {
    path: "/create-post",
    element: <CreatePost />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
]);
