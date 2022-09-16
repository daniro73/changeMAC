const util = require("util");
const RandExp = require("randexp");
const exec = util.promisify(require("child_process").exec);

class MAC {
    static async get_random_mac() {
        return new RandExp(/^([0-0]{2}[:])([0-9a-f]{2}[:]){4}([0-9a-f]{2})$/).gen();
    }

    static async change_mac(_interface, mac_address) {
        try {
            if (_interface && mac_address) {
                const { stdout } = await exec(`sudo ip link set dev ${_interface} address ${mac_address}`);
                return (stdout || mac_address);
            }
            throw { message: "please inpute interface and mac address" };
        } catch (err) {
            if (err.code) console.log(err);
            throw err;
        }
    }

    static async auto_change_mac(_interface, mac_address) {
        try {
            mac_address = (mac_address || new RandExp(/^([0-0]{2}[:])([0-9a-f]{2}[:]){4}([0-9a-f]{2})$/).gen())
            if (_interface) {
                await exec(`sudo ip link set dev ${_interface} address ${mac_address}`);
                return mac_address;
            }
            throw { message: "please inpute interface" };
        } catch (err) {
            if (err.code) console.log(err);
            throw err;
        }
    }
}

module.exports = MAC;


async function test(_interface, mac_address) {

    require("dotenv").config();
    const { get_random_mac, change_mac, auto_change_mac } = MAC;
    _interface = (_interface || process.env.DEF_IFACE);
    mac_address = (mac_address || process.env.DEF_MAC);

    //uncomment each which want
    console.log(`mac generated: ${ await get_random_mac() }`);
    //console.log(`Interface name: ${_interface} - mac address:${ await auto_change_mac(_interface) }`);
    //console.log(await change_mac(process.env.DEF_IFACE, process.env.DEF_MAC));
    return "***** WELL DONE *****";
}

test().then(data => console.log(data)).catch(err => console.log(err));
//test("ens33", "00:12:4f:ea:36:02").then(data => console.log(data)).catch(err => console.log(err));