let scr = "";
let characteristic; // Declare the characteristic in a broader scope
let cd; // Declare the connectedDevice in a broader scope


const popup = document.getElementById("popup");
const yesButton = document.getElementById("yesButton");
const noButton = document.getElementById("noButton");
let connectBtn = document.getElementById("connectBtn");
let connected = false;

// Function to change button color to green when connected
function setButtonConnected() {
    connectBtn.innerText = "Connected";
    connectBtn.style.color = "#0a0";
    connectBtn.style.border = "2px solid #0a0";
    connected = true;
}
// Function to reset button color
function resetButtonColor() {
    connectBtn.innerText = "Connect";
    connectBtn.style.color = "rgba(255, 255, 255, 0.3)";
    connectBtn.style.border = "2px solid rgba(255, 255, 255, 0.3)";
}

yesButton.addEventListener("click", () => {
    // Disconnect the cube and set the connected variable to false
    disconnectFromBluetoothDevice(cd);
    resetButtonColor();
    characteristic = null; // Clear the characteristic reference
    cd = null; // Clear the connectedDevice reference
    // Close the popup
    popup.style.display = "none";
});

noButton.addEventListener("click", () => {
    // Simply close the popup without disconnecting the cube
    popup.style.display = "none";
});

const decryptionKey = new Uint8Array([176, 81, 104, 224, 86, 137, 237, 119, 38, 26, 193, 161, 210, 126, 150, 81, 93, 13, 236, 249, 89, 235, 88, 24, 113, 81, 214, 131, 130, 199, 2, 169, 39, 165, 171, 41]);
const solvedState = new Uint8Array([0x12, 0x34, 0x56, 0x78, 0x33, 0x33, 0x33, 0x33, 0x12, 0x34, 0x56, 0x78, 0x9a, 0xbc, 0x00, 0x00]);

const isEncrypted = (data) => {
    return data[18].toString(16) === 'a7';
};

/*const toBin = (dec) => {
return (dec >>> 0).toString(2);
};*/

const getNibble = (val, i) => {
    if (i % 2 === 1) {
        return val[(i / 2) | 0] % 16;
    }
    return 0 | (val[(i / 2) | 0] / 16);
};

const decrypt = (data) => {
    if (!isEncrypted(data)) return data;
    let offset1 = getNibble(data, 38);
    let offset2 = getNibble(data, 39);
    for (let i = 0; i < 20; i++) {
        // Apply the offset to each value in the data
        data[i] += (decryptionKey[offset1 + i] + decryptionKey[offset2 + i]);
    }
    return data;
};

const getMove = (data) => {
    let lastMoveFace = getNibble(data, 32);
    let lastMoveDirection = getNibble(data, 33);
    // for white side facing user, with red on top
    let faceNames = ["L", "B", "D", "F", "U", "R"];

    return `${faceNames[lastMoveFace - 1]}${lastMoveDirection === 1 ? '' : '\''}`;
};

const getState = (data) => {
    let state = '';
    for (let i = 0; i < 16; i++) {
        state += data[i].toString(16);
    }
    return state;
};


// Helper functions and constants (similar to React hooks)
let device = null;

function setDevice(connectedDevice) {
    device = connectedDevice;
}

function useEffect(callback) {
    // This implementation ignores the dependency array for simplicity
    // A more advanced implementation should handle dependencies.
    callback();
}

// Constants
const SERVICE_UUID = '0000aadb-0000-1000-8000-00805f9b34fb';
const CHARACTERISTIC_UUID = '0000aadc-0000-1000-8000-00805f9b34fb';

const isWebBluetoothSupported = 'bluetooth' in navigator;

const connectToBluetoothDevice = () => {
    return navigator.bluetooth
        .requestDevice({
            acceptAllDevices: true,
            optionalServices: [SERVICE_UUID],
        })
        .then((device) =>
            device.gatt.connect().then((server) => {
                window.mdevice = device;
                window.mserver = server;
                return { device, server };
            })
        );
};

const startNotifications = (server) =>
    server.getPrimaryService(SERVICE_UUID).then((service) => {
        window.mservice = service;
        return service.getCharacteristic(CHARACTERISTIC_UUID).then((characteristic) => {
            window.mcharacteristic = characteristic;
            characteristic.startNotifications();
            return characteristic;
        });
    });

const disconnectFromBluetoothDevice = (device) => {
    if (!device || !device.gatt.connected) return Promise.resolve();
    return device.gatt.disconnect();
};

// Event listener function for the "Connect" button
const onClickHandler = async () => {
    // a quick check for bluetooth support in the browser
    if (!isWebBluetoothSupported) {
        alert('Browser does not support bluetooth');
        return;
    }

    if (!connected) {
        try {
            const { server, device: connectedDevice } = await connectToBluetoothDevice();
            document.getElementsByClassName("loader-wrapper")[0].style.display = "block";
            cd = connectedDevice;
            setDevice(connectedDevice);

            characteristic = await startNotifications(server);
            setButtonConnected();

            setScramble();
            scr = "";
            document.getElementsByClassName("loader-wrapper")[0].style.display = "none";
            characteristic.addEventListener('characteristicvaluechanged', (event) => {
                const { value } = event.target; // 20 bytes sent by the cube
                const uint8array = decrypt(new Uint8Array(value.buffer));
                const state = getState(uint8array);
                //console.log(state);
                //console.log(`Move: ${getMove(uint8array)}`);
                if (!countdownRunning && !timerRunning) {
                    scr += getMove(uint8array) + " ";
                    scr = compactCubeMoves(scr);
                    if (document.getElementById("scramble-text").textContent === scr.slice(0, -1)) {
                        // issue: if fail when scrambling the cube, even if correct the move, this condition don't happen
                        document.getElementById("scramble-text").textContent = "";
                        toggleTimer();
                    }
                }
                else if (countdownRunning) {
                    toggleTimer();
                }
                switch (getMove(uint8array)) {
                    case "R":
                        cube.twistQueue.add('R');
                        break;
                    case "R'":
                        cube.twistQueue.add('r');
                        break;
                    case "L":
                        cube.twistQueue.add('L');
                        break;
                    case "L'":
                        cube.twistQueue.add('l');
                        break;
                    case "U":
                        cube.twistQueue.add('U');
                        break;
                    case "U'":
                        cube.twistQueue.add('u');
                        break;
                    case "D":
                        cube.twistQueue.add('D');
                        break;
                    case "D'":
                        cube.twistQueue.add('d');
                        break;
                    case "F":
                        cube.twistQueue.add('F');
                        break;
                    case "F'":
                        cube.twistQueue.add('f');
                        break;
                    case "B":
                        cube.twistQueue.add('B');
                        break;
                    case "B'":
                        cube.twistQueue.add('b');
                        break;
                    default:
                        break;
                }
            });

            connectedDevice.addEventListener('gattserverdisconnected', () => {
                disconnectFromBluetoothDevice(connectedDevice);
                resetButtonColor();
            });
        } catch (error) {
            console.error('Error:', error);
            resetButtonColor();
        }
    } else {
        popup.style.display = "block";
    }

};
// Add the event listener to the "Connect" button
document.getElementById('connectBtn').addEventListener('click', onClickHandler);

function compactCubeMoves(scr) {
    // Split the input string into an array of moves
    const moves = scr.split(' ');
    // Initialize variables to store the compacted sequence
    let compactedScr = '';
    // Loop through the moves
    for (let i = 0; i < moves.length; i++) {
        const move = moves[i];
        // Initialize variables to track the current move and count
        let currentMove = move;
        let moveCount = 1;
        // Check for repeated moves
        while (i < moves.length - 1 && moves[i + 1] === currentMove) {
            moveCount++;
            i++;
        }
        // Append the move to the compacted sequence along with its count if it's greater than 1
        compactedScr += currentMove;
        if (moveCount > 1) {
            if (compactedScr.slice(-1) === "'") {
                compactedScr = compactedScr.slice(0, -1);
            }
        compactedScr += (moveCount === 2) ? '2' : moveCount;
        }
        // Add a space unless it's the last move
        if (i < moves.length - 1) {
            compactedScr += ' ';
        }
    }
    return compactedScr;
}