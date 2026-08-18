Terminal3 ADK Community Testnet — Submission

Submitter: Web3theo

Date: Repo:https://github.com/Theophilus2003/t3n-adk-bounty

Summary

I completed signup, the Quickstart, and full dev environment setup (Rust + wasm32-wasip2 toolchain), then wrote and successfully built the z-tenant-flight reference contract to a working WASM component (z_tenant_flight.wasm, 197,968 bytes — build log and file confirmed in screenshots). I was unable to complete contract registration due to a reproducible SDK bug: both tenant.contracts.register() and tenant.contracts.publish() fail with a missing field script_name RPC error on the current npm-installed SDK version (4.40.0), reproduced three times with distinct request IDs. Downgrading to SDK 3.11.0 avoids that error but breaks earlier in the flow with a session-sealing mismatch, suggesting the two SDK major versions aren't cross-compatible with the current docs. Full repro steps, request IDs, and two additional smaller doc/SDK mismatches (an undocumented required trustAnchor config, and tenant.me() actually living at tenant.tenant.me()) are documented in BUGS.md in the linked repo. I reported the blocking issue in the developer Telegram with all request IDs. 

steps completed

Signup + DID/API key claim — screenshot: screenshots/01-signup.png

Quickstart auth + credit check — screenshot: screenshots/02-quickstart.png

Dev env setup (Rust + wasm32-wasip2, TenantClient) — screenshot: screenshots/03-devenv.png

Contract build (cargo build --release) — screenshot: screenshots/04-build.png

Contract registration — screenshot: screenshots/05-register.png

Agent + user auth, grant, invoke (search → book) — screenshot: screenshots/06-invoke.png

Bugs found

See BUGS.md for the full log.
