import React from "react";

const PageNotFound = () => {
  return (
    <section className="min-h-screen flex items-center justify-center flex-col gap-4">
      <p className=" text-6xl font-semibold text-red-500 ">
      404 Page not found
        </p>
      <a href="/" className="underline text-blue-500">Return to home page</a>
    </section>
  );
};

export default PageNotFound;
