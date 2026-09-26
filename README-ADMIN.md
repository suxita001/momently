# MOMENTLY admin panel

Edit the site's texts, prices, portfolio and contact details, and manage contact-form
requests, **without redeploying**. Everything runs on Vercel Functions (`/api`) and
Vercel Blob. There is no database and there are no third-party services.

- Admin panel: `https://<your-domain>/admin`. It isn't linked anywhere and is marked `noindex`.
- Saved changes appear on the public site within about **30 seconds**.

---

## One-time setup in the Vercel dashboard

Vercel sets public or private access **per Blob store**, not per file. That's why you need **two stores**:

| Store | Access | Holds |
|---|---|---|
| `momently-public` | Public | `content.json` (site content) and uploaded images |
| `momently-private` | Private | `orders.json` (contact requests) and the login-attempt counter |

1. **Deploy this code once.** It includes `package.json`, `vercel.json`, `api/` and the admin files.
2. **Create the public store:** Project → **Storage** → **Create Database** → **Blob**.
   - Name it `momently-public` and set the access to **Public**.
   - **Connect it to this project** for Production (and Preview if you use it).
   - Vercel then adds the store's credentials (`BLOB_STORE_ID` / `BLOB_READ_WRITE_TOKEN`) to the project automatically.
3. **Create the private store:** Blob → name `momently-private`, access **Private**.
   - **Do not connect it to the project.** Connecting would replace the public store's automatic credentials.
   - Open the store and copy its **read-write token**. It starts with `vercel_blob_rw_`.
   - CLI alternative: `vercel blob create-store momently-private --access private`.
4. **Add the environment variables:** Project → **Settings** → **Environment Variables**, environment **Production**, each marked **Sensitive**.

   | Name | Value |
   |---|---|
   | `ADMIN_PASSWORD` | Your admin password. At least 8 characters; 16+ recommended. |
   | `SESSION_SECRET` | A random string of at least 32 characters. It signs the login cookie. |
   | `PRIVATE_BLOB_READ_WRITE_TOKEN` | The read-write token of `momently-private` from step 3. |

   To generate a `SESSION_SECRET`, run either of these:

   ```
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   ```powershell
   -join ((1..48) | % { [char](Get-Random -Min 97 -Max 123) })
   ```

   Also check the list: if `BLOB_READ_WRITE_TOKEN` exists, it must belong to the **public** store.
5. **Redeploy once.** Environment variables only take effect after a new deployment.
6. **Check that it works:**
   1. Open `/admin` and log in.
   2. Change the hero headline, click **Save**, then reload the site.
   3. Send a test request through the contact form. It should appear in **Orders**.

   If the Orders tab says *"Private storage is not configured"*, step 3 or 4 is missing.

After this, every edit is made in `/admin`. No more deployments are needed.

---

## Using the panel

- **Log in** with `ADMIN_PASSWORD`. The session lasts 7 days on that device.
- **Content tabs:** Hero, Services, Pricing, Our Work and Contact.
  - Each text has a Georgian and an English field.
  - **Save** publishes only the tab you're on.
  - A dot on a tab means it has unsaved changes. The browser also warns you before you close the page.
  - **Reset to defaults** loads the original texts into the form. Nothing changes on the site until you click **Save**.
- **Services:** a *starting price* shows as a small tag on the card. Leave it empty to hide the tag.
- **Pricing:** set the name, price and features, and choose which plan is **Most Popular**.
- **Our Work:**
  - Add, edit, delete and reorder (↑ ↓) the cards.
  - Each card has a demo link, a phone-screen colour theme, an optional price and an optional photo (JPG, PNG or WebP, max 3 MB).
  - In the screen title, a new line becomes a line break, and ♥ and & are shown in the accent colour.
- **Contact:** WhatsApp number, email, Instagram, TikTok and the pre-filled WhatsApp message.
  - Empty fields fall back to the values in `config.js`.
  - The WhatsApp number is also used by the demo pages.
- **Orders:** contact-form requests, newest first.
  - Change the status (new / in progress / paid / done), reply on WhatsApp, or delete a request.

---

## How it works

| File | Purpose |
|---|---|
| `content.default.json` | The shipped content. Used whenever nothing has been saved yet or storage is unreachable. |
| `api/content.js` | `GET` serves the saved content, or the defaults. `PUT` saves (admin only). |
| `api/order.js` | Public contact-form endpoint: validation, honeypot and a per-IP rate limit. |
| `api/orders.js` | List, change the status of, or delete orders (admin only). |
| `api/login.js`, `logout.js`, `session.js` | Password login, signed session cookie and session check. |
| `api/upload.js` | Image upload to the public store (admin only). |
| `api/_lib/*` | Shared helpers. The underscore folder is not deployed as routes. |
| `admin.html`, `admin.css`, `admin.js` | The panel. |
| `config.js` / `script.js` | Load `/api/content` and apply it on top of the page. If the request fails, the page keeps its built-in texts. |

The texts for hero, services, pricing, work and the WhatsApp message now come from
`content.default.json` or `/admin`. Editing them in `translations.js` has no effect
once the API is live.

## Security notes

- The password and secrets exist only as Vercel environment variables. Nothing secret is in the repository or the browser.
- **Login:**
  - The password check is timing-safe.
  - 5 failed attempts per IP lock logins for 15 minutes, and every failure is slowed down.
  - The session cookie is `HttpOnly`, `Secure`, `SameSite=Strict`, HMAC-SHA256-signed and expires after 7 days.
- **Admin API:** every admin route checks the session on the server and returns 401 without one. State-changing requests must be JSON (or an image) from the same origin.
- **Saved content:** it is rebuilt from a strict schema.
  - It checks length limits, https-only links, and that images come from your own Blob store.
  - Unknown fields are dropped.
  - The site and the panel insert all text with `textContent`, never as HTML.
- **Headers:** `vercel.json` adds security headers and a strict Content-Security-Policy for `/admin`, and `no-store` caching for the auth routes.
- **Limits you should know about:**
  - **Log out everywhere:** *Log out* removes the cookie on that device. To end every session at once, change `SESSION_SECRET` and redeploy.
  - **Rate limits:** the order rate limit is per server instance, so it's best effort.
  - **Order storage:** `orders.json` keeps the latest 2,000 requests.
  - **Photos are public:** uploaded photos have public URLs. Don't upload anything private.

## Local development (optional)

The Vercel CLI isn't needed. A small local server runs the site, the API and the admin,
storing data in `./.local-blob` instead of Blob:

```powershell
npm install
$env:ADMIN_PASSWORD="choose-a-password"; $env:SESSION_SECRET="at-least-32-random-characters-here!!"; npm run local
# open http://localhost:4321 and http://localhost:4321/admin
```

With the Vercel CLI installed you can also use `vercel dev` after `vercel env pull`.
