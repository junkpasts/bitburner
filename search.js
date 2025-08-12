const findPath = (ns, target, serverName, serverList, ignore, isFound) => {
	ignore.push(serverName);
	let scanResults = ns.scan(serverName);
	for (let server of scanResults) {
		if (ignore.includes(server)) {
			continue;
		}
		if (server === target) {
			serverList.push(server);
			return [serverList, true];
		}
		serverList.push(server);
		[serverList, isFound] = findPath(ns, target, server, serverList, ignore, isFound);
		if (isFound) {
			return [serverList, isFound];
		}
		serverList.pop();
	}
	return [serverList, false];
}

/** @param {NS} ns **/
export async function main(ns) {
  /* search for a hostname and trace path to it*/

  function trace(target) {
    let startServer = ns.getHostname();
    let [results, isFound] = findPath(ns, target, startServer, [], [], false);
    if (!isFound) {
      ns.alert('Procede all special characters with a backslash, eg: \.');
    } else {
      ns.tprint(results.join(' --> '));
    }
  }

  const args = ns.flags([["help", false]]);
	if (args.help || args._.length < 1) {
		ns.tprint("This script searches for and shows path to a host.");
		ns.tprint(`Usage: run ${ns.getScriptName()} SEARCHTERM`);
		ns.tprint("Example:");
		ns.tprint(`> run ${ns.getScriptName()} csec`);
		return;
	}

	const term = args._[0];

	var hostname = 'home';
	
	let scanned = [hostname];
	let scanner2 = [];
	let scanner3 = [];
	let scanner = ns.scan(hostname);
	let checkme = 1;

  ns.tprint("Searching for hosts conaing "+term)

	/* As long as there's something to scan, scan*/
	while (checkme > 0) {
		/* Loop through the SCANNER object, scanning identified servers..*/
		for (let i = 0; i < scanner.length; i++) {

      scanner2 = (ns.scan(scanner[i]));
      /* Scan Deeper */
      for (let i2 = 0; i2 < scanner2.length; i2++) {
        if (scanned.indexOf(scanner2[i2]) == -1) {
          scanner3.push(scanner2[i2]);
        }
      }
      scanned.push(scanner[i]);

		}
		scanner = scanner3;
		scanner3 = [];
		checkme = scanner.length;

	}
  let found = false;
	for (let i = 0; i < scanned.length; i++) {
    let text = scanned[i].toLowerCase();
    if(text.search(term.toLowerCase()) != -1){
      ns.tprint("Found: "+scanned[i]);
      trace(scanned[i]);
      found = true;
    }
  }
  if(!found) ns.tprint("No resutls for "+term);

}
