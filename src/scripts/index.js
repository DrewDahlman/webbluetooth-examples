import "regenerator-runtime/runtime";

const Bluetooth = {
  init: async () => {
    let device = null;

    // Define service
    const batteryServiceUUID = "0000180f-0000-1000-8000-00805f9b34fb";
    const batteryCharacteristicUUID = "00002a19-0000-1000-8000-00805f9b34fb";

    // https://developer.mozilla.org/en-US/docs/Web/API/Bluetooth/requestDevice
    // Make use of filters to select specific device(s)
    device = await navigator.bluetooth.requestDevice({
      filters: [{ name: "iPad" }], // Filter by name
      optionalServices: [batteryServiceUUID], // Specify services
    });

    // Connect to gatt server
    const server = await device.gatt.connect();
    console.log("Connected to server");

    // Get a service
    const batteryService = await server.getPrimaryService(batteryServiceUUID);
    console.log(batteryService);

    // Get charactistics
    const batteryCharacteristic = await batteryService.getCharacteristic(
      batteryCharacteristicUUID
    );

    // Read the characteristic
    const batteryValue = await batteryCharacteristic.readValue();

    // Read the value & Log
    console.log("> Battery Level is " + batteryValue.getUint8(0) + "%");

    // If we wanted to we could listen to the battery
    batteryCharacteristic.addEventListener(
      "characteristicvaluechanged",
      (event) => {
        const value = event.target.value;
        console.log("> Battery Level is " + batteryValue.getUint8(0) + "%");
      }
    );
  },
};

// User action required to make request
document.querySelector("#ble-selector").addEventListener("click", () => {
  Bluetooth.init();
});
