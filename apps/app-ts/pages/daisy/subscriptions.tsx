import { Button } from "daisy-ts";
import { GetServerSideProps } from "next";
import { requester } from "simple-ts-utils";

import { protectRoute } from "../../lib/authenticate";
import { getUser } from "../../lib/prisma/models/user";
import {
  getCustomerSubscription,
  getSubscriptions,
  Subscription
} from "../../lib/stripe";

interface SubscriptionsPageProps {
  subscription: Subscription;
  subscriptions: Subscription[];
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // If not signed in, redirect to login
  const serverAuthentication = await protectRoute(context);
  if (serverAuthentication.redirect) return serverAuthentication.redirect;

  const user = await getUser({ id: serverAuthentication.session.id as string });
  const subscription = await getCustomerSubscription(user.customerId);
  const subscriptions = await getSubscriptions();
  return { props: { subscription, subscriptions } };
};

const SubscriptionsPage = ({
  subscription,
  subscriptions
}: SubscriptionsPageProps) => {
  /**
   * Request a GET to api/subscriptions/<priceId> to retrieve appropriate Stripe portal URL
   * If User has a Subscription, return URL to Billing Portal
   * Else, return URL to Stripe Checkout for specified Subscription
   * If successful, redirect user to Stripe portal
   */
  const handleSubscriptionPortal = async (priceId: string) => {
    const request = await requester(
      `/api/subscriptions?priceId=${priceId}`,
      "GET"
    );
    if (request.status === 200)
      window.location.href = (await request.json()).url;
  };

  return (
    <>
      <div>subscriptions</div>

      {subscriptions.map((s) => (
        <div key={s.price.id}>
          <h4>{s.product.name}</h4>

          <span>{s.price.unit_amount / 100}</span>

          <Button onClick={() => handleSubscriptionPortal(s.price.id)}>
            {subscription && s.price.id === subscription.price.id
              ? "Manage "
              : subscription
              ? "Switch to "
              : "Upgrade to "}
            {s.product.name}
          </Button>
        </div>
      ))}
    </>
  );
};

export default SubscriptionsPage;
