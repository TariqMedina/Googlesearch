import React from "react";
import { Link } from "react-router-dom";

function Nav() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <a className="navbar-brand" href="/">
        Google Book Search
      </a>
      <div class="collapse navbar-collapse">
        <ul class="nav navbar-nav navbar-left">
          <li><Link to={"/search"}><span style={{ color: "white" }}>Search</span></Link></li> | 
          <li><Link to={"/saved"}><span style={{ color: "white" }}>Saved</span></Link></li>
        </ul>
      </div>
    </nav>
  );
}

export default Nav;
