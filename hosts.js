'use strict';

const netns = require("./lib/netns");
const virsh = require("./lib/virsh");

Promise.all([
  virsh(),
  netns()
])
.then(results => {
  const virshHosts = results[0];

  console.log("kvm");
  console.log(" ", virshHosts.filter(d => d.state === "running").map(domain => {
    return domain.name;
  }).join(", "));

  const netnsHosts = results[1];
  console.log("netns");
  console.log(" ", netnsHosts.join(", "));

});
