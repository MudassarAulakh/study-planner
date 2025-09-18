import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export const POST = async (request: NextRequest) => {
  try {
    const reqBody = await request.json();
    const { taskIndex, returnTasks } = reqBody;
    console.log(taskIndex);

    const cncodedTasks = encodeURIComponent(JSON.stringify(returnTasks));

    const customer = await stripe.customers.create({
      name: "John Doe",
      address: {
        line1: "123 Market St",
        postal_code: "94103",
        city: "San Francisco",
        state: "CA",
        country: "US",
      },
      email: "customer@example.com",
    });

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer: customer.id,
      mode: "payment",
      success_url: `http://localhost:3000/dashboard?tasks=${cncodedTasks}`,
      cancel_url: `http://localhost:3000/dashboard?tasks=${cncodedTasks}`,
      line_items: [
        {
          quantity: 1,
          price_data: {
            product_data: {
              name: "Mudassar",
            },
            currency: "USD",
            unit_amount: taskIndex * 100,
          },
        },
      ],
    });

    return NextResponse.json(
      {
        message: checkoutSession,
        url: checkoutSession.url,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
