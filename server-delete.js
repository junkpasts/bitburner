/** @param {NS} ns */
export async function main(ns) {
  var pservers;
  var pserver;

  pservers = ns.getPurchasedServers();

  for (pserver of pservers) {
    ns.killall(pserver);
    ns.deleteServer(pserver);
  }
}
