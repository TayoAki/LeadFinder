import { defineMiddlewares } from "@medusajs/medusa";

export default defineMiddlewares({
    routes: [
        // Printify webhooks are signed over the exact raw body (x-pfy-signature).
        { matcher: "/hooks/printify*", bodyParser: { preserveRawBody: true } },
    ],
});
