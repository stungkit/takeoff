import Link from "next/link";
import { Button } from "ui";

import { APP_URL } from "../lib";

const HomePage = () => {
  return (
    <Link href={APP_URL}>
      <a>
        <Button>Get Started</Button>
      </a>
    </Link>
  );
};

export default HomePage;
