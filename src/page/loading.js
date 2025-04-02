import React, { useEffect } from "react";

const Loading = () => {
  useEffect(() => {
      window.location.href = "/login";
  }, []);

  return <div>
    <h1>Loading...</h1>
    <p>Please wait while we redirect you to the login page.</p>
  </div>;
};

export default Loading;
