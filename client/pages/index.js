import buildClient from "../api/build-client";

export const LandingPage = ({ currentUser }) => {
  const text = currentUser ? "You are signed in" : "You are not signed in";
  return <h1>{text}</h1>;
};

LandingPage.getInitialProps = async ({ req }) => {
  console.log("Landing page");
  const client = buildClient(req);
  const { data } = await client.get("/api/users/currentuser");

  return data;
};

export default LandingPage;
