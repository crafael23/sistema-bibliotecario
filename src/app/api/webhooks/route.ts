import { Webhook } from "svix";
import { headers } from "next/headers";
import { type WebhookEvent } from "@clerk/nextjs/server";
import { env } from "~/env";
import { z } from "zod";
import {
  insertUsuarioSchema,
  type insertUsuarioType,
  usuario,
} from "~/server/db/schema";
import { db } from "~/server/db";

// Create a Zod schema for webhook event data validation
const WebhookEventSchema = z.object({
  data: z.object({
    id: z.string(),
    object: z.string(),
    created_at: z.number(),
    updated_at: z.number(),
    birthday: z.string().optional(),
    email_addresses: z.array(
      z.object({
        id: z.string(),
        email_address: z.string(),
        object: z.string(),
        linked_to: z.array(z.unknown()),
        verification: z.object({
          status: z.string(),
          strategy: z.string(),
        }),
      }),
    ),
    external_accounts: z.array(z.unknown()),
    external_id: z.string().optional().nullable(),
    first_name: z.string().optional(),
    gender: z.string().optional(),
    image_url: z.string().optional(),
    last_name: z.string().optional(),
    last_sign_in_at: z.number().optional().nullable(),
    password_enabled: z.boolean().optional(),
    phone_numbers: z.array(z.string()),
    primary_email_address_id: z.string().optional(),
    primary_phone_number_id: z.string().optional().nullable(),
    primary_web3_wallet_id: z.string().optional().nullable(),
    private_metadata: z.record(z.unknown()).optional(),
    profile_image_url: z.string().optional(),
    public_metadata: z.record(z.unknown()).optional(),
    two_factor_enabled: z.boolean().optional(),
    unsafe_metadata: z.record(z.unknown()).optional(),
    username: z.string().optional().nullable(),
    web3_wallets: z.array(z.unknown()),
  }),
  object: z.string(),
  type: z.string(),
  timestamp: z.number(),
  instance_id: z.string(),
});

export async function POST(req: Request) {
  console.log("\n\n\n\n\n\n\n\n\n\n\n\n");
  const SIGNING_SECRET = env.SIGNING_SECRET;

  console.log(SIGNING_SECRET);

  if (!SIGNING_SECRET) {
    throw new Error(
      "Error: Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local",
    );
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET);

  // Get headers
  const headersList = await headers();
  const svix_id = headersList.get("svix-id");
  const svix_timestamp = headersList.get("svix-timestamp");
  const svix_signature = headersList.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing Svix headers", {
      status: 400,
    });
  }

  // Get body
  const payload = (await req.json()) as Record<string, unknown>;
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (error) {
    console.error(
      "Error: Could not verify webhook:",
      error instanceof Error ? error.message : String(error),
    );
    return new Response("Error: Verification error", {
      status: 400,
    });
  }

  try {
    // Validate the webhook event with Zod
    const validatedEvent = WebhookEventSchema.safeParse(evt);

    if (validatedEvent.success === false) {
      console.log("Error: Invalid event data");
      console.log(validatedEvent.error);
      return new Response("Error: Invalid event data", {
        status: 400,
      });
    }

    const data = validatedEvent.data;

    // Process the webhook event based on its type
    const eventType = data.type;
    const eventData = data.data;

    console.log(
      `Received webhook with ID ${eventData.id ?? "unknown"} and event type of ${eventType}`,
    );

    switch (eventType) {
      case "user.created":
        // Handle user creation
        console.log("New user created:", eventData);
        const nuevoUsuario: insertUsuarioType = {
          clerkId: eventData.id,
          nombre: `${eventData.first_name} ${eventData.last_name}`,
          email: eventData.email_addresses[0]?.email_address ?? "",
          tipoDeUsuario: "externos",
          nuevo: true,
        };

        await db
          .insert(usuario)
          .values(insertUsuarioSchema.parse(nuevoUsuario));
        // Add your logic here to add user to your database
        break;

      case "user.updated":
        // Handle user update
        console.log("User updated:", eventData);
        // Add your logic here to update user in your database
        break;

      case "user.deleted":
        // Handle user deletion
        console.log("User deleted:", eventData);
        // Add your logic here to delete user from your database
        break;

      default:
        console.log("Unhandled webhook event type:", eventType);
    }

    return new Response("Webhook processed successfully", { status: 200 });
  } catch (error) {
    console.error(
      "Error processing webhook:",
      error instanceof Error ? error.message : String(error),
    );
    return new Response("Error processing webhook", { status: 500 });
  }
}
