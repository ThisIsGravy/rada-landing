import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import CheckoutSuccess, { parseCheckoutQuery } from "./CheckoutSuccess";

// Creem appends these to success_url after payment:
//   checkout_id, order_id | subscription_id, customer_id, product_id,
//   request_id, signature (docs.creem.io). The page must cope with exactly
// that set — it must not depend on params Creem never sends.
const CREEM_SUBSCRIPTION_REDIRECT =
  "?checkout_id=ch_123&subscription_id=sub_456&customer_id=cust_789&product_id=prod_abc&request_id=req_1&signature=deadbeef";
const CREEM_ONETIME_REDIRECT =
  "?checkout_id=ch_123&order_id=ord_456&customer_id=cust_789&product_id=prod_abc&request_id=req_1&signature=deadbeef";

afterEach(() => {
  window.history.replaceState(null, "", "/");
});

describe("parseCheckoutQuery", () => {
  it("reads Creem's real redirect params for a subscription", () => {
    expect(parseCheckoutQuery(CREEM_SUBSCRIPTION_REDIRECT)).toEqual({
      checkoutId: "ch_123",
      orderId: null,
      subscriptionId: "sub_456",
      tier: null,
    });
  });

  it("reads order_id for a one-time purchase", () => {
    expect(parseCheckoutQuery(CREEM_ONETIME_REDIRECT).orderId).toBe("ord_456");
  });

  it("accepts an optional app-supplied tier hint on the success_url", () => {
    expect(parseCheckoutQuery("?tier=pro_annual&checkout_id=ch_1").tier).toBe("Pro");
    expect(parseCheckoutQuery("?tier=ultra&checkout_id=ch_1").tier).toBe("Ultra");
    expect(parseCheckoutQuery("?tier=ultra_lifetime").tier).toBe("Lifetime");
    expect(parseCheckoutQuery("?tier=bogus").tier).toBeNull();
  });
});

describe("CheckoutSuccess", () => {
  it("renders the Creem ids and a webhook-pending tier without a tier hint", () => {
    window.history.replaceState(null, "", `/checkout/success${CREEM_SUBSCRIPTION_REDIRECT}`);
    render(<CheckoutSuccess />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Welcome to Rada.");
    expect(screen.getByText("ch_123")).toBeInTheDocument();
    expect(screen.getByText("Subscription ID")).toBeInTheDocument();
    expect(screen.getByText("sub_456")).toBeInTheDocument();
    expect(screen.getByText("Awaiting webhook")).toBeInTheDocument();
  });

  it("still reads params from the legacy hash form", () => {
    window.history.replaceState(null, "", `/#/checkout/success${CREEM_ONETIME_REDIRECT}`);
    render(<CheckoutSuccess />);
    expect(screen.getByText("ch_123")).toBeInTheDocument();
    expect(screen.getByText("Order ID")).toBeInTheDocument();
    expect(screen.getByText("ord_456")).toBeInTheDocument();
  });
});
