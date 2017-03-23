'use stirct';

const exec = require("child-process-promise").exec;

const netns = require("./lib/netns");
const brctl = require("./lib/brctl");
const ovs = require("./lib/ovs");
const virsh = require("./lib/virsh");
const vethPeer = require("./lib/veth-peer");


Promise.all([
  vethPeer(),
  virsh()
])
.then(results => {
  const peerList = results[0];


  results[1].forEach(domain => {

    console.log(domain.name);
    domain.ifList.forEach(ifInfo => {

      if(ifInfo.type === "direct") {
        console.log(`  ${ifInfo.name} => ${ifInfo.source} <-> ${peerList[ifInfo.source]}`);
      }
      else {
        console.log(`  ${ifInfo.name} -> ${ifInfo.source}`);
      }


    });

  });

});




