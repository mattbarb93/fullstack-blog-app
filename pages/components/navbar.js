import Link from "next/Link";
import React from "react";
import "../../configureAmplify";
import { useState, useEffect } from "react";
import { Auth, Hub } from "aws-amplify";

const Navbar = () => {
  const [signedUser, setSignedUser] = useState(false);
  useEffect(() => {
    authListener();
  });

  async function authListener() {
    Hub.listen("auth", (data) => {
      switch (data.payload.event) {
        case "signIn":
          return setSignedUser(true);
        case "signOut":
          return setSignedUser(false);
      }
    });
    try {
      await Auth.currentAuthenticatedUser();
      setSignedUser(true);
    } catch (err) {}
  }

  return (
    <nav className="flex justify-center pt-3 pb3 space-x-4 border-b bg-cyan-500 border-gray-300">
      {[
        ["Home", "/"],
        ["Create Post", "/create-post"],
        ["Profile", "/profile"],
      ].map(([title, url], index) => (
        <Link legacyBehavior href={url} key={index}>
          <a
            className="rounded-lg px-3 py-2 
          text-slate-700 
          font-medium hover:bg0-slage-100 hover:text-slate-900"
          >
            {title}
          </a>
        </Link>
      ))}

      {signedUser && (
        <Link legacyBehavior href="/my-posts">
          <a
            className="rounded-lg px-3 py-2 
            text-slate-700 
            font-medium hover:bg0-slage-100 hover:text-slate-900"
          >
            My Posts
          </a>
        </Link>
      )}
    </nav>
  );
};

export default Navbar;
