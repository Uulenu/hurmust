# HURMUST release audit

Audit completed against the production build; legal-source snapshot: 2026-10-06. Public beta limitations are shown in the app and README.

## Verified implementation

- Lint, strict TypeScript, legal-data/matcher/storage/AI-parser checks and production build.
- 69 excerpts matched to saved official source evidence across ten current laws; repealed Child Protection Act excluded. This verifies source consistency, not professional interpretation.
- Browser functional checks cover Chrome, Firefox, WebKit/Safari and emulated iPhone/Pixel. Routes, Cyrillic search, filters, bookmarks, six-step validation, safety state, saved progress including unchecking the last step, download, all five examples and local advisor.
- Responsive width checks: 320, 390, 768, 1024 and 1440 pixels. Representative pages audited with axe WCAG 2 A/AA and 2.1 AA rules, keyboard skip link and reduced-motion setting. Automated checks are not a complete accessibility certification.
- Actual Supabase email/password login, snapshot upload, restore in a separate browser context and cloud deletion tested with fictional, disposable data. No real incident used.
- Transactional SQL checks prove owner CRUD, cross-account isolation, anonymous denial, no ownership reassignment, private counter denial and ten-per-hour quota. Test fixtures rolled back.
- Supabase security and performance advisors: zero notices.
- Actual authenticated xKiro response accepted only as a vetted clarification question; legal citations remain deterministic. Non-JSON/errors return JSON and local fallback.
- Server-only AI secret and sessionStorage authentication; explicit consent before cloud/AI transmission. Public repository excludes environment files and test credentials.

## Findings fixed

Raw HTML-to-JSON advisor error; saved final-checkbox persistence; advisor-to-plan context transfer; invalid route handling; missing cloud authentication/storage; ownership policies and request quota; unverified contact URL; low-contrast text; Safari keyboard-mode test handling. Link prefetching is disabled to avoid unnecessary speculative requests and Safari prefetch failures; normal client navigation remains available.

## Dependency audit

Production dependency audit: zero known vulnerabilities at audit time. Development toolchain: nine advisories (seven high, two moderate), including the unpatched braces advisory [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm). No patched release was available in the audit result. These parsers run on developer/build patterns, not user incident input. A forced major upgrade was not used as a substitute for an available fix. Recheck and update when patches ship.

## Release boundaries

1. **Email delivery:** custom SMTP is absent, confirmed in the Supabase dashboard. The user accepted this beta limitation. Registration confirmation/recovery may not reach public users. Existing confirmed accounts can sign in; browsing/local guidance does not require login. Configure a verified sender and custom SMTP before broad cloud-account rollout. Email confirmation remains enabled.
2. **Legal/privacy review:** independent Mongolian professional review is outstanding; do not advertise legally certified results. Matcher scores are relevance categories, not verdicts or probabilities.
3. **AI retention:** xKiro retention has not been independently verified. Explicit warning/consent, no app narrative logs, and vetted-question-only output reduce exposure but do not establish provider retention.
4. **Operations:** appoint an operator/contact, decide retention and deletion/backup policy, verify restore procedures and set production alerting before broad rollout.
5. **Device coverage:** browser engines and mobile emulation are tested; physical-device keyboards, assistive technology and real-user usability sessions remain useful. No claim of flawless support on every device.
6. **Deliberate scope:** snapshots are manual and last-save-wins, with 100-plan/500-bookmark/1 MiB limits. No account merge, file upload, complaint submission or lawyer assignment. Do not add these before operational/privacy essentials.

## Next useful additions

First: reliable email, operator support and source-update ownership. Then user-tested copy/navigation, optional account data expiry and legal-source change detection. Evidence uploads or more free-form AI require a separate privacy/security design.
