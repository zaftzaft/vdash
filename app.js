'use stirct';

const exec = require("child-process-promise").exec;

const netns = require("./lib/netns");
const brctl = require("./lib/brctl");
const ovs = require("./lib/ovs");
const virsh = require("./lib/virsh");
const vethPeer = require("./lib/veth-peer");


let ifDatabase = {};

const ifAdd = name => {
  if(!ifDatabase[name]) {
    ifDatabase[name] = {};
  }
};



Promise.all([
  vethPeer(),
  virsh()
])
.then(results => {

  Object.keys(results[0]).forEach(key => {
    ifAdd(key);
    ifDatabase[key].peer = results[0][key];
  });

  results[1].forEach(domain => {
    domain.ifList.forEach(ifInfo => {
      ifAdd(ifInfo.name);
      ifDatabase[ifInfo.name].host = "kvm";
      ifDatabase[ifInfo.name].hostname = domain.name;
      ifDatabase[ifInfo.name].source = ifInfo.source;
      ifDatabase[ifInfo.name].type = ifInfo.type;

      if(ifInfo.type === "direct") {
        ifAdd(ifInfo.source);
        ifDatabase[ifInfo.source].source = ifInfo.name;
      }

    });
  });


  //console.log(ifDatabase);

  results[1].forEach(domain => {
    console.log(domain.name);
    domain.ifList.forEach(ifInfo => {

      if(ifInfo.type === "direct") {
        let link = ifDatabase[ifDatabase[ifInfo.name].source];
        let peer = ifDatabase[link.peer];
        let peerHost = ifDatabase[peer.source];


        console.log(`  ${ifInfo.name} => ${ifInfo.source} <> ${link.peer} => ${peer.source} (${peerHost.hostname})`);
      }
      else {
        console.log(`  ${ifInfo.name} -> ${ifInfo.source}`);
      }


    });
  });




});
