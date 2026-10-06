# HURMUST

Mongolian human-rights information and preparation app. This is a public **beta**, not a legal opinion or complaint-submission service.

## 1. What was built

Responsive rights and legal libraries, Cyrillic search and filters, source-linked detail pages, a six-step incident wizard, contextual results and duties, safety contacts, organization directory, NHRC complaint guide, five examples, local plans/bookmarks/drafts, plain-text download, optional authenticated Supabase cloud snapshots, and an xKiro clarification endpoint.

## 2. Routes

`/`, `/rights`, `/rights/[topic]`, `/laws`, `/laws/[provision]`, `/search`, `/help`, `/help/result`, `/advisor`, `/organizations`, `/guides/nhrc-complaint`, `/saved`, `/demo`, `/safety`, `/privacy`; `POST /api/advisor`. Unknown pages return 404. Incident narratives are not placed in URLs.

## 3. Architecture

Next.js App Router + React + strict TypeScript, Tailwind/CSS, Lucide and a shadcn-style button. The page shell renders through one route dispatcher; browser interactions use shared components. No animation framework or file-upload service. Supabase Auth supplies identity; the database enforces ownership with RLS. A public GitHub repository contains code and public legal evidence, never incident data or private keys.

## 4. Legal data structure

`src/data/legal-provisions.json` records law name, article/paragraph/subparagraph, reference label, rule type, short official excerpt, separate plain-language summary, topics, context and child-only restrictions, status, Legalinfo URL and verification date. `legal-source-evidence.json` records the corresponding full source paragraph and source-file SHA-256. The source snapshot date is **2026-10-06**. Changes in law require a new review; the verification badge is not government certification.

## 5. Laws added

| Law | Provisions |
| --- | ---: |
| Монгол Улсын Үндсэн хууль | 9 |
| Боловсролын ерөнхий хууль | 8 |
| Хөдөлмөрийн тухай хууль | 7 |
| Хүүхдийн эрхийн тухай хууль | 6 |
| Хүний хувийн мэдээлэл хамгаалах тухай хууль | 8 |
| Хүүхэд хамгааллын тухай хууль (2024) | 6 |
| Гэр бүлийн хүчирхийлэлтэй тэмцэх тухай хууль | 5 |
| Монгол Улсын Хүний эрхийн Үндэсний Комиссын тухай хууль | 17 |
| Эрүүгийн хууль | 2 |
| Зөрчлийн тухай хууль | 1 |

## 6. Verified provision count

69 selected source-backed provisions. Runnable data checks require a matching source record and exact excerpt for every provision. The former Child Protection Law is not used. Source consistency is checked; independent professional review of interpretation is still required.

## 7. Official and other data

Official excerpts, references and source URLs come from the consolidated Legalinfo pages. Plain-language summaries, examples and preparation steps are HURMUST editorial material. Contact sources are attached to records; organization hours/addresses and local school/HR contacts are explicitly unknown. The child-agency website was omitted because it could not be verified; the verified 108 phone remains.

## 8. What is simulated / not available

The local advisor uses templates and the actual deterministic matcher; it is not a remote LLM. Example incidents are fictional. There is no automatic complaint filing, lawyer assignment, evidence upload, or end-to-end encryption. Cloud synchronization is an explicit snapshot operation, not background autosave or a multi-device merge.

## 9. Legal matcher

Client-side keyword/topic scoring plus location and age gates. Repealed/unverified/no-source entries are excluded. Child-only provisions require a child age selection. Workplace, education and domestic contexts are restricted. Criminal/violation matches are low-confidence leads requiring authority review. Top 12 results share the same matcher with the advisor. Labels are relevance categories, not probabilities; keyword matching can miss nuance.

## 10. Advisor and xKiro

Local mode sends no narrative to the application backend. Live mode requires Supabase login and explicit consent. A server-only `XKIRO_API_KEY` calls the user's existing xKiro Responses endpoint. xKiro selects one vetted clarifying question; arbitrary model-generated legal citations or conclusions are rejected. Legal cards continue to come from the reviewed dataset. A private database counter caps requests at 10 per user per clock hour, including failed attempts. Timeout and non-JSON upstream responses produce Mongolian JSON errors with local fallback. Narratives are not intentionally logged or stored in Supabase. The provider's retention period is not independently confirmed and the UI states that limitation.

## 11. Run locally and verify

Node 22+ (production uses Node 24):

```sh
npm ci
cp .env.example .env.local
# Set public Supabase URL/publishable key; server-only xKiro key if live mode is needed.
npm run dev
npm run check
npx playwright install chromium firefox webkit
npm run test:browser
```

The browser suite starts its own production server on port 3100; run a build first. `TEST_BASE_URL=https://your-site` tests an existing deployment. Cloud integration testing is opt-in with `TEST_QA_FILE` pointing to a disposable account JSON containing email/password outside the repository. SQL ownership/quota checks live in `tests/security.sql` and roll back all fixtures. GitHub Actions runs code, data, build and browser checks; it skips the disposable-account integration check when credentials are absent.

Supabase: project `ztapmvrerbmiqcthpvij`, Tokyo region. Apply the committed SQL migrations to a fresh project. Never put service-role or xKiro keys in `NEXT_PUBLIC_` variables. Configure the Auth Site URL and exact `/saved` redirect URLs for your own production/local domains. Production registration/recovery needs a configured custom SMTP service; default Supabase mail is limited and not a production delivery guarantee.

## 12. Privacy, limits and readiness

- Device draft/plan/bookmark data is in localStorage, unencrypted by the app. Closing a tab does not erase it.
- Cloud upload is opt-in, signed in, manual, and replaces the previous account snapshot. Download explicitly replaces local data. Maximum 100 plans / 500 bookmarks / 1 MiB cloud payload. Last saved snapshot wins; no merge.
- RLS permits only the account owner to access a snapshot. Project administrators can access data. This is not end-to-end encryption.
- Supabase Auth session tokens use sessionStorage. Sign-out removes the tab's login; local drafts remain.
- Cloud and local deletion are separate. Downloaded files remain outside app control. Cloud deletion removes the live row; backup/Auth retention is separate. There is no automatic retention expiry.
- The AI counter contains user ID, clock hour and request count, not narrative. Old counter rows are trimmed on that user's later requests.
- Remaining unverified provision IDs in the accepted dataset: **none**. That does not certify legal applicability. Contact addresses/hours, local institution contacts, and xKiro retention remain unverified.
- Browser engine/device emulation checks are not a promise for every physical device. Real iOS keyboard, assistive-technology and user usability sessions remain advisable.
- Before broad public rollout: professional Mongolian legal/privacy review, authenticated email delivery, operational owner/contact, retention policy, backup/restore verification, and error/uptime monitoring. No speculative product features are needed before these essentials.

See `AUDIT.md` for the exact measured verification outcomes and remaining release limits.
