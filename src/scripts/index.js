import "regenerator-runtime/runtime";

const Bluetooth = {
  init: async () => {
    let device = null;
    let characteristic = null;

    device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
    });
    console.log(device);
  },
};

document.querySelector("#ble-selector").addEventListener("click", () => {
  Bluetooth.init();
});
