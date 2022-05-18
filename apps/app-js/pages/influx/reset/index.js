import { Button, Form, Input } from "influx-js";
import Link from "next/link";
import { useState } from "react";
import { requester } from "simple-ts-utils";

import { publicRedirectIfAuthenticatedRoute } from "../../../lib/authenticate";

export const getServerSideProps = async (context) => {
  // If signed in, redirect to the dashboard
  const redirect = await publicRedirectIfAuthenticatedRoute(context);
  if (redirect) return redirect;
  return { props: {} };
};

const CreateResetPage = () => {
  const [email, setEmail] = useState("");

  /**
   * Request a POST to api/reset with given email to create a Reset
   * If successful, an email will be sent
   * @param event Form Event
   */
  const handleCreateReset = async (event) => {
    event.preventDefault();
    const request = await requester("/api/reset", "POST", { email });
    if (request.status === 200) setEmail("");
  };

  return (
    <>
      <main className="flex-col min-h-screen space-y-8 main main-centered">
        <Form onSubmit={handleCreateReset}>
          <Input
            label="Email Address"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email Address"
            required
            type="email"
            value={email}
          />

          <Button className="!mt-6" type="submit">
            Send Password Reset
          </Button>
        </Form>

        <Link href="/login">
          <a className="link-text">Login</a>
        </Link>
      </main>
    </>
  );
};

export default CreateResetPage;
