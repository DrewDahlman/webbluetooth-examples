import "regenerator-runtime/runtime";

const handleNotifications = (event) => {
  const value = event.target.value;

  // 1. Look at messages again
  // Put Length & hex on same line for easy parsing
  let a = [];
  for (let i = 0; i < value.byteLength; i++) {
    let val = ("00" + value.getUint8(i).toString(16)).slice(-2);
    a.push(val);
  }
  console.log(`${value.byteLength}: ${a.join(" ")}`);

  // 2. Find patterns
  // Single Tap
  // 32: fd 1c d0 2d 00 01 01 01 64 00 00 00 00 2c 13 20 20 01 64 01 c9 04 3c 00 00 00 00 00 00 b7 b1 dd
  // 32: fd 1c 10 2d 00 01 01 00 a8 00 00 00 00 2c 13 20 20 01 64 01 f7 03 3c 00 00 00 00 00 00 55 19 dd

  // Double Tap
  // 32: fd 1c 90 2d 00 02 01 01 09 00 00 00 00 2c 13 40 20 02 64 02 3a 03 3c f8 03 36 00 00 00 0d 06 dd
  // 32: fd 1c d0 2d 00 02 01 00 6d 00 00 00 00 2c 13 40 20 02 64 02 31 02 3c 68 02 2d 00 00 00 86 38 dd

  // Triple Tap
  // 32: fd 1c 10 2d 00 03 01 00 b0 01 4d 01 7c 2c 13 60 60 03 64 03 f1 01 3c 84 01 35 52 06 33 da a2 dd
  // 32: fd 1c 50 2d 00 03 01 00 b3 01 1d 01 58 2c 13 60 60 03 64 03 b0 01 3c aa 01 31 9e 02 30 d3 26 dd

  // Long Hold Start
  // 32: fd 1c d0 2d 00 04 01 da 1f 45 3a 20 e4 2c 13 a0 00 41 70 00 00 13 05 01 43 00 01 00 00 23 82 dd
  // 32: fd 1c 50 2d 00 04 01 da 1f 45 3a 20 e4 2c 13 a0 00 22 00 00 00 a8 e3 31 00 61 98 05 00 f7 bd dd

  // Message
  // 8: fd 04 00 9b 01 30 d4 dd
  // 8: fd 04 80 9b 01 30 d4 dd

  // Long Hold End
  // 32: fd 1c 50 2d 00 05 01 da 1f 45 3a 20 e4 2c 13 80 00 41 70 00 00 13 05 01 43 00 01 00 00 ef 28 dd
  // 32: fd 1c d0 2d 00 05 01 da 1f 45 3a 20 e4 2c 13 80 00 41 70 00 00 13 05 01 43 00 01 00 00 ef 28 dd

  // Long Hold StartB
  // 32: fd 1c 90 2d 00 04 01 da 1f 45 3a e4 e3 2c 13 a0 00 22 00 00 00 f8 e3 31 00 61 98 05 00 1a e8 dd
  // 32: fd 1c 10 2d 00 04 01 da 1f 45 3a e4 e3 2c 13 a0 00 22 00 00 00 f8 e3 31 00 61 98 05 00 1a e8 dd

  // Message
  // 8: fd 04 c0 9b 00 11 c4 dd
  // 8: fd 04 40 9b 00 11 c4 dd

  // Long Hold EndB
  // 32: fd 1c 10 2d 00 05 01 da 1f 45 3a e4 e3 2c 13 80 00 41 70 00 00 13 05 01 43 00 01 00 00 66 b6 dd
  // 32: fd 1c 90 2d 00 05 01 da 1f 45 3a e4 e3 2c 13 80 00 41 70 00 00 13 05 01 43 00 01 00 00 66 b6 dd

  // 3. Trim to match patterns
  // For 8 our patterns start at index 5, so splice everything from 5 to the end
  // For 32 the pattern starts at index 13, so cut from 13 + 3
  let output;
  if (a.length == 8) output = a.splice(5, a.length - 1).join("");
  if (a.length == 32) output = a.splice(13, 3).join("");

  switch (output) {
    case "30d4dd":
      console.log("Noise Canceling Enabled");
      break;
    case "11c4dd":
      console.log("Noise Canceling Disabled");
      break;
    case "2c1320":
      console.log("Right ear Single tap");
      break;
    case "2c1340":
      console.log("Right ear double tap");
      break;
    case "2c1360":
      console.log("Right ear tripple tap");
      break;
    case "2c1380":
      console.log("Right ear long hold complete");
      break;
    case "2c13a0":
      console.log("Right ear long hold start");
      break;
    default:
      console.log(`Unknown command: ${output}`);
      break;
  }
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
