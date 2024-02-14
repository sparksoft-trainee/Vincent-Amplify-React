import React from "react";
import { Link } from "@aws-amplify/ui-react";
import { signOut } from "@aws-amplify/auth";

function Navbar() {
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <div>
      <nav className="flex justify-center pt-5 pb-5 space-x-4 border-b bg-cyan-500 border-gray-300">
        <Link href="/">
          <span className={classLink}>Home</span>
        </Link>
        <Link href="/create-post">
          <span className={classLink}>Create Post</span>
        </Link>
        <Link href="/profile">
          <span className={classLink}>Profile</span>
        </Link>
        <button onClick={handleSignOut}>Sign out</button>
      </nav>
    </div>
  );
}

const classLink =
  "rounded-lg px-3 py-2 text-slate-700 font-medium hover:bg-slage-100 hover:text-slate-900";

export default Navbar;
