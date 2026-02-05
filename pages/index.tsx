import React, { Component } from "react";
import { AuthContext } from "../context/AuthContext";
import Router from "next/router";
import Navbar from "../components/Navbar";

export default class Home extends Component {
  static contextType = AuthContext;

  componentDidMount() {
    const auth = this.context as any;

    if (!auth || !auth.isAuthenticated) {
      Router.push("/login");
    }
  }

render() {
  const auth = this.context as any;

  if (auth.loading) {
    return <p>Checking authentication...</p>;
  }

  if (!auth.isAuthenticated) {
    Router.push("/login");
    return null;
  }

  return (
    <div>
      <Navbar />
      <div style={{ padding: 20 }}>
        <h1>Welcome</h1>
      </div>
    </div>
  );
}

}
