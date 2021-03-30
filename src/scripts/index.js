import "regenerator-runtime/runtime";

const Bluetooth = {
  init: async () => {
    let device = null;

    // Define service
    const unknownServiceServiceUUID = "0000180a-0000-1000-8000-00805f9b34fb";
    const unknownServiceCharacteristicUUID =
      "00002a24-0000-1000-8000-00805f9b34fb";

    // https://developer.mozilla.org/en-US/docs/Web/API/Bluetooth/requestDevice
    // Make use of filters to select specific device(s)
    device = await navigator.bluetooth.requestDevice({
      filters: [{ name: "iPad" }], // Filter by name
      optionalServices: [unknownServiceServiceUUID], // Specify services
    });

    // Connect to gatt server
    const server = await device.gatt.connect();
    console.log("Connected to server");

    // Get a service
    const unknownServiceService = await server.getPrimaryService(
      unknownServiceServiceUUID
    );
    console.log(unknownServiceService);

    // Get charactistics
    const unknownServiceCharacteristic = await unknownServiceService.getCharacteristic(
      unknownServiceCharacteristicUUID
    );

    // Read the characteristic
    const unknownServiceValue = await unknownServiceCharacteristic.readValue();

    // Parse the unknownServiceValue
    console.log(unknownServiceValue);

    // 1. Read the byteLength
    // console.log(`Length: ${unknownServiceValue.byteLength}`); // Result: 8

    // 2. Create a textDecoder
    // https://developer.mozilla.org/en-US/docs/Web/API/TextDecoder
    // const utf8decoder = new TextDecoder();

    // 3. Convert to an Int8Array ( 8bytes )
    // const unknownServiceIntArray = new Int8Array(unknownServiceValue.buffer);
    // console.log(unknownServiceIntArray);

    // 4. Decode the Int8Array to utf8
    // const unknownService = utf8decoder.decode(unknownServiceIntArray);
    // console.log(unknownService);
  },
};

// User action required to make request
document.querySelector("#ble-selector").addEventListener("click", () => {
  Bluetooth.init();
});
