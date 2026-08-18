\# Bug Log — Terminal3 ADK Walkthrough



\## Headline finding: contracts.register / contracts.publish unusable on latest npm install (BLOCKING)



Severity: Blocking — prevents completing the walkthrough past contract build.

Where: Register your TEE contract (tenant.contracts.register / .publish)

SDK version: @terminal3/t3n-sdk@4.40.0 (the version npm install installs by default)



Repro steps:

1\. Complete Quickstart + Set Up Dev Env (with workarounds below applied).

2\. Build z-tenant-flight per the docs — succeeds cleanly, produces a valid .wasm.

3\. Call either tenant.contracts.register({tail, version, wasm}) or tenant.contracts.publish({tail, version, wasm}).



Expected: Contract registers, returns a contract\_id.



Actual: Both throw the identical error from the identical internal call stack:

RpcError: RPC Error: Invalid action request: missing field `script\_name`

code: RPC\_ERROR, httpStatus: -32602



Reproduced 3 times — request\_ids: 51c8c82b-916a-406f-8708-4c262ad999b8, 64b9ac2d-e743-4d72-9859-1d8503838346, and de6f6481-dd69-421b-821a-3269e2a739d6 (from tenant.tenant.me(), same underlying code path).



Root cause (best guess): TenantClientConfig declares an optional tenantContractId field in the SDK's TypeScript types, but it's not referenced anywhere else in the shipped code — looks like it was meant to populate script\_name and never got wired up.



Attempted fix: Downgraded to @terminal3/t3n-sdk@3.11.0. Avoided this error but broke earlier instead — getUsage() failed with "token.get-usage: request params must be sealed to this session key" (request\_id 6d82904b-bb77-4dbc-bc27-82a5c5167861). The 3.x and 4.x SDKs don't appear cross-compatible.



Impact: Could not complete Register / Invoke / Test steps due to this blocker. Everything through a successful WASM build was completed and verified.



\## Other confirmed doc-vs-SDK mismatches (4.40.0)



1\. T3nClient constructor requires an undocumented trustAnchor field (docs only reference SDK 3.5.2/3.9.0/3.11.0). Worked around with trustAnchor: { unsafe\_trust\_server: true } (sandbox only).

2\. Docs show tenant.me(); actual method is tenant.tenant.me().

3\. tenant.tenant.me() itself throws the same "missing field script\_name" error as the registration bug above.



\## Environment/setup friction (non-blocking)



\- No Windows/cmd.exe-specific guidance in the Quickstart (touch, curl | sh don't work there).

\- T3N\_API\_KEY set via `set` in cmd.exe doesn't persist across terminal sessions — easy to hit confusing "Invalid Ethereum private key" errors after just reopening a terminal.



\## Docs-flagged edge cases not tested (blocked by registration bug)



\- Version-shadowing on re-registration — blocked

\- Long tail rejected downstream — blocked

\- host/http.egress\_denied without a grant — blocked

\- book-offer PII rejection at parse time — blocked

