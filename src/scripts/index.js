import "regenerator-runtime/runtime";

const handleNotifications = (event) => {
  const value = event.target.value;
  const utf8decoder = new TextDecoder();

  console.log(value);

  // 1. Convert & parse
  // Result: Gibberish & nonsense
  // if( value.byteLength == 8 ){
  //     const eventInt8Array = new Int8Array(value.buffer);
  //     const eventData = utf8decoder.decode(eventInt8Array);
  //     console.log(eventData);
  //     console.log(value.getUint8(0))
  // }

  // 2. Try decode method
  // let a = [];
  // for (let i = 0; i < value.byteLength; i++) {
  //     let val = ("00" + value.getUint8(i).toString(16)).slice(-2);
  //     a.push(val);
  // }
  // console.log(`Length: ${value.byteLength}`);
  // console.log(`Name Hex: ${a.join(" ")}`);
};

const Bluetooth = {
  init: async () => {
    const serviceUUID = "a7a473e9-19c6-491b-aea6-7ea92b8f043a";
    const characteristicUUID = "a7a48322-19c6-491b-aea6-7ea92b8f043a";
    const device = await navigator.bluetooth.requestDevice({
      filters: [{ namePrefix: "Galaxy Buds Live" }],
      optionalServices: [serviceUUID],
    });

    const server = await device.gatt.connect();
    const service = await server.getPrimaryService(serviceUUID);
    const characteristic = await service.getCharacteristic(characteristicUUID);

    await characteristic.startNotifications();
    console.log("Starting Notifications");

    characteristic.addEventListener(
      "characteristicvaluechanged",
      handleNotifications
    );
  },
};

document.querySelector("#ble-selector").addEventListener("click", () => {
  Bluetooth.init();
});
