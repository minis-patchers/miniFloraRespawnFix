/* global ngapp, xelib */
const sigs = ["TREE", "FLOR"];
let ensureVMAD = function(record, version = 5, format = 2) {
    let vmad = xelib.AddElement(record, 'VMAD');
    if (!vmad) throw new Error(`Failed to create VMAD element on record: ${xelib.LongName(record)}`);
    xelib.SetValue(vmad, 'Version', version.toString());
    xelib.SetValue(vmad, 'Object Format', format.toString());
};
let procBlock = function(sig) {
  return {
    load: () => {
      return {
        signature: sig
      }
    },
    patch: function (record, helpers, settings, locals) {
      ensureVMAD(record)
      if(!xelib.HasScript(record, "FloraRespawnScript")) {
        xelib.AddScript(record, "FloraRespawnScript");
        helpers.logMessage("Patched: "+sig + " : "+ xelib.FullName(record));
      }
    }
  }
};
registerPatcher({
    info: info,
    gameModes: [xelib.gmTES5, xelib.gmSSE],
    settings: {
      label: 'Respawn patcher',
      hide: true
    },
    execute: {
      process: sigs.map(procBlock)
    }
});
