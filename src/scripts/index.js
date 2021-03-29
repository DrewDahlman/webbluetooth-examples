import "regenerator-runtime/runtime";

const Bluetooth = {
  init: async () => {
    let device = null;

    device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true, // Connect to anything
    });
    console.log(device);
  },
};

document.querySelector("#ble-selector").addEventListener("click", () => {
  Bluetooth.init();
});
