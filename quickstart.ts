import {
    T3nClient,
    loadWasmComponent,
    setEnvironment,
    createEthAuthInput,
    eth_get_address,
    metamask_sign,
  } from "@terminal3/t3n-sdk";
  
  setEnvironment("sandbox");
  
  const key = process.env.T3N_API_KEY!;
  const address = eth_get_address(key);
  
  const t3n = new T3nClient({
  wasmComponent: await loadWasmComponent(),
  handlers: { EthSign: metamask_sign(address, undefined, key) },
  trustAnchor: { unsafe_trust_server: true },
});
  
  await t3n.handshake();
  const did = await t3n.authenticate(createEthAuthInput(address));
  const tenantDid = did.value;
  console.log("tenantDid:", tenantDid);
  
  const { balance } = await t3n.getUsage();
  console.log(`Credits available: ${balance.available}`);
import { TenantClient, getNodeUrl } from "@terminal3/t3n-sdk";

const tenant = new TenantClient({
  t3n,
  baseUrl: getNodeUrl(),
  tenantDid,
});

// await tenant.tenant.me(); // BUG: SDK 4.40.0 — RPC error "missing field `script_name`", request_id de6f6481-dd69-421b-821a-3269e2a739d6
console.log("TenantClient ready (me() check skipped due to SDK bug).");
import { readFile } from "fs/promises";

const WASM_PATH = "../z-tenant-flight/target/wasm32-wasip2/release/z_tenant_flight.wasm";
const CONTRACT_TAIL = "travel-contracts";
const CONTRACT_VERSION = "0.1.0";

const wasmBytes = await readFile(WASM_PATH);

const result = await tenant.contracts.publish({
  tail: CONTRACT_TAIL,
  version: CONTRACT_VERSION,
  wasm: wasmBytes,
});

const contractId = result.contract_id;
const tenantId = tenantDid.slice("did:t3n:".length);
const TENANT_SCRIPT = `z:${tenantId}:${CONTRACT_TAIL}`;
console.log(`registered ${TENANT_SCRIPT} as contract id ${contractId}`);