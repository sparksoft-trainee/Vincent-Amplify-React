import React from "react";
import { withAuthenticator } from "@aws-amplify/ui-react";

function Profile() {
  return <h1>Profile</h1>;
}

export default withAuthenticator(Profile);
