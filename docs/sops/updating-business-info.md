# SOP: Updating Business Info (phone, cities, email, socials)

Single source of truth: **`lib/business-info.ts`**. Everything imports from it.

## Owner-confirmation gates (AGENTS.md — do not skip)
- **Phone number**: only on explicit owner instruction ("update the phone number to…").
- **Service-area cities**: only with owner confirmation.
- Logo files: never touched under this SOP or any other.

## Procedure
1. Edit the value in `lib/business-info.ts` (`phoneDisplay` + `phoneE164` + `telHref` together for phone; `cities` array; `email` + `mailtoHref`; social URLs).
2. Grep to confirm nothing hardcoded crept back in:
   - phone: `14076000301` and the display format
   - cities: `Porterdale` (rare word — good canary)
   - email: `lawnmastersv5@gmail.com`
   Only `lib/business-info.ts` (and doc files) should match.
3. Check derived copy that embeds values in prose: `lib/spring-rush-content.ts` and `lib/summer-content.ts` use template literals from BUSINESS — they update automatically, but eyeball the rendered strings.
4. Off-site consistency (owner): a phone/address change must also hit Google Business Profile, citations (Yelp/Angi/etc.), Instagram bio, and any printed door hangers — code is the easy part.
5. Cypress → commit → push. Update BUSINESS_PLAYBOOK.md facts table if it changed.
