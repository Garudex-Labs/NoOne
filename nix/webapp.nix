# The Webapp: the Desktop renderer built for a browser. pnpmConfigHook has
# already installed the locked workspace (without lifecycle scripts, so no
# native module and no Electron binary), so it compiles there, with no
# private workspace.
{ hermesNpmLib, ... }:
hermesNpmLib.buildPnpmPackage {
  dirs = [
    "apps/desktop"
    "apps/shared"
    "apps/ui"
    "agent_cli/data/ui"
    "agent_cli/data/application_identity.json"
    "scripts/build/application-identity.mjs"
    "scripts/build/application-identity.d.mts"
    "scripts/build/webapp.mjs"
    "scripts/build/node-deps.mjs"
    "scripts/build/node-deps-lock.mjs"
    "scripts/build/node-deps-heartbeat.mjs"
    "scripts/build/node-deps-watcher.mjs"
    "scripts/build/node-deps-relay.mjs"
    "scripts/build/freshness.mjs"
    "scripts/build/frontend-common.mjs"
  ];
  pname = "agent-webapp";

  doCheck = false;

  buildPhase = ''
    runHook preBuild
    node scripts/build/webapp.mjs --source "$PWD" --out "$TMPDIR/webapp-product"
    runHook postBuild
  '';

  installPhase = ''
    runHook preInstall
    mkdir -p $out
    cp -r "$TMPDIR/webapp-product/." $out/
    runHook postInstall
  '';
}
