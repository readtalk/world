import { issuer } from "@openauthjs/openauth"
import {
  CloudflareStorage,
  type CloudflareStorageOptions,
} from "@openauthjs/openauth/storage/cloudflare"
import { PasswordProvider } from "@openauthjs/openauth/provider/password"
import { PasswordUI } from "@openauthjs/openauth/ui/password"
import { subjects } from "./subjects"

export default {
  fetch(request: Request, env: CloudflareEnv, ctx: ExecutionContext) {
    return issuer({
      storage: CloudflareStorage({
        namespace: env.AUTH_KV as CloudflareStorageOptions["namespace"],
      }),
      subjects,
      providers: {
        password: PasswordProvider(
          PasswordUI({
            sendCode: async (email, code) => {
              console.log(`Sending code ${code} to ${email}`)
            },
          }),
        ),
      },
      success: async (ctx, value) => {
        return ctx.subject("user", {
          id: await getOrCreateUser(env, value.email),
        })
      },
    }).fetch(request, env, ctx)
  },
} satisfies ExportedHandler<CloudflareEnv>

async function getOrCreateUser(env: CloudflareEnv, email: string): Promise<string> {
  const result = await env.AUTH_DB.prepare(
    `INSERT INTO user (email) VALUES (?)
     ON CONFLICT (email) DO UPDATE SET email = email
     RETURNING id;`
  ).bind(email).first<{ id: string }>()
  if (!result) throw new Error(`Unable to process user: ${email}`)
  return result.id
}
