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
  //   console.log(`${value.byteLength}: ${a.join(" ")}`);

  // 2. Find patterns
  // Single Tap
  // Double Tap
  // Triple Tap
  // Long Hold Start
  // Message
  // Long Hold End
  // Long Hold StartB
  // Message
  // Long Hold EndB

  // 3. Trim to match patterns
  // For 8 our patterns start at index 5, so splice everything from 5 to the end
  // For 32 the pattern starts at index 13, so cut from 13 + 3
  // let output;
  // if (a.length == 8) output = a.splice(5, a.length - 1).join("");
  // if (a.length == 32) output = a.splice(13, 3).join("");

  // switch (output) {
  //   case "30d4dd":
  //     console.log("Noise Canceling Enabled");
  //     break;
  //   case "11c4dd":
  //     console.log("Noise Canceling Disabled");
  //     break;
  //   case "2c1320":
  //     console.log("Right ear Single tap");
  //     break;
  //   case "2c1340":
  //     console.log("Right ear double tap");
  //     break;
  //   case "2c1360":
  //     console.log("Right ear tripple tap");
  //     break;
  //   case "2c1380":
  //     console.log("Right ear long hold complete");
  //     break;
  //   case "2c13a0":
  //     console.log("Right ear long hold start");
  //     break;
  //   default:
  //     console.log(`Unknown command: ${output}`);
  //     break;
  // }
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
