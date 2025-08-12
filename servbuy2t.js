/** @param {NS} ns */
export async function main ( ns )
{
  const ram = 1048576;
  let i = ns.getPurchasedServers ( ).length;
  
  while ( i < ns.getPurchasedServerLimit ( ) )
  {
    if ( ns.getServerMoneyAvailable ( "home" ) > ns.getPurchasedServerCost ( ram ) )
    {
      let hostname = ns.purchaseServer ( "pserv-" + i, ram );
      if ( hostname !== "" )
      {
        ns.scp ( "early-hack-template.js", hostname );
        ns.scp ( "bin.hk.js", hostname );
        ns.scp ( "bin.gr.js", hostname );
        ns.scp ( "bin.wk.js", hostname );
        ns.exec ( "early-hack-template.js", hostname, 374491 );
      }
      ++i;
    }

    await ns.sleep ( 1000 );
  }
}
