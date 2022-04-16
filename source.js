// ==UserScript==
// @name         Xydar Trainer
// @version      0.1
// @author       Xydar
// @match        https://kogama.com.br/page/webgl-frame/*
// @match        https://www.kogama.com/page/webgl-frame/*
// @match        https://friends.kogama.com/page/webgl-frame/*
// @require
// ==/UserScript==

WebAssembly.Memory.prototype.scan = function(AOB){
    let result = []
    let bytes = AOB.split(" ")
    new Uint8Array(this.buffer).forEach((array)=>{
        array.forEach((byte, i)=>{
            if(byte == bytes[i]){
                result.push(byte)
            }
        })
    })
    return result.toString().replaceAll(",", " ")
}
WebAssembly.Memory.prototype._grow = WebAssembly.Memory.prototype.grow
WebAssembly.Memory.prototype.grow = function(){
    top.memory = new Uint8Array(this.buffer)
    this._grow(...arguments)
}
let ws = WebSocket.prototype
ws._send = ws.send
ws.socket = null
ws.send = function(data) {
    if (!this._onmessage) {
        this._onmessage = this.onmessage
        this.onmessage = function(message) {
            _this = this
            let Data = new Uint8Array(message.data)
            if (CheatAPI.SERVER_BLOCKS.indexOf(Data[2]) != -1) {
                return;
            }
            let DecodedData = CheatAPI.FUNCTIONS.DECODE_TEXT([...Data])
            if (window.socks) {
                console.log(Data + "\n" + DecodedData)
            }
            if (Data[2] == 63) {
                window.kogamaload = true
            }
            if (Data[2] == 61) {
                let json = CheatAPI.FUNCTIONS.GET_JSON(DecodedData)
                CheatAPI.PLAYER.WOID = json[0].spawnRoleAvatarIds[0]
                for (var i = 0; i < json.length; i++) {
                    if (json[i].hasOwnProperty("UserName")) {
                        let player = {
                            USERNAME: json[i].UserName,
                            WOID: json[i + 2].activeSpawnRole
                        }
                        CheatAPI.PLAYERS.push(player)
                    }
                }
                let ints = CheatAPI.FUNCTIONS.GET_INTS(Data)
                console.log(ints)
                let actorNumbers = []
                let firstActorNumber = 0
                ints.forEach((int, index)=>{//+3
                    if(index == 0){
                        actorNumbers.push(int)
                    }else{
                        if(actorNumbers.length <= CheatAPI.PLAYERS.length && int <= 999 && int >= 1 && actorNumbers.indexOf(int) == -1){
                            actorNumbers.push(int)
                        }
                    }
                })
                console.log(actorNumbers)
            }
            if (Data[2] == 16){
                let ints = CheatAPI.FUNCTIONS.GET_INTS([...Data])
                CheatAPI.FRIENDSHIP_INFOS = {
                    FriendshipID: ints[0],
                    ID: ints[1],
                    FriendID: ints[2]
                }
            }
            if (Data[2] == 255) {
                if (!window.first) {
                    CheatAPI.PLAYER.ACTORNR = CheatAPI.FUNCTIONS.GET_INTS(Data)[0]
                    window.first = true
                } else {
                    let json = CheatAPI.FUNCTIONS.GET_JSON(DecodedData)
                    let player = {
                        USERNAME: json[0].UserName,
                        WOID: 0
                    }
                    CheatAPI.PLAYERS.push(player)
                }
            }
            if (Data[2] == 104) {
                let json = CheatAPI.FUNCTIONS.GET_JSON(DecodedData)
                CheatAPI.PLAYERS[CheatAPI.PLAYERS.length - 1].WOID = json[0].SpawnRolesRuntimeData.spawnRoleAvatarIds[0]
                if(window.kogamaload){
                    let players = []
                    CheatAPI.PLAYERS.forEach((player)=>{
                        players.push(player.USERNAME)
                    })
                    window["Crash Player"].updateOptions(players)
                }
            }
            if (Data[2] == 71) {
                let json = CheatAPI.FUNCTIONS.GET_JSON(DecodedData)
                json.forEach((acessory)=>{
                    if(acessory.hasOwnProperty("url")){
                        let name = acessory.name
                        delete acessory.name
                        CheatAPI.ACESSORIES[name] = acessory
                    }
                })
            }
            if (Data[2] == 6) {
                let woid = CheatAPI.FUNCTIONS.GET_INTS(Data)[0]
                for (var i = 0; i < CheatAPI.PLAYERS.length; i++) {
                    if (CheatAPI.PLAYERS[i].WOID == woid) {
                        CheatAPI.PLAYERS.splice(i, i - 1)
                    }
                }
                if(window.kogamaload){
                    let players = []
                    CheatAPI.PLAYERS.forEach((player)=>{
                        players.push(player.USERNAME)
                    })
                    window["Crash Player"].updateOptions(players)
                }
            }
            if (Data[2] == 29 && CheatAPI.FUNCTIONS.GET_INTS(Data)[0] != CheatAPI.PLAYER.WOID && window.freezeplayers){
                return
            }
            if (Data[2] == 31 && window.aimbot && CheatAPI.FUNCTIONS.GET_INTS(Data)[0] == CheatAPI.PLAYER.WOID)
                return
            if (Data[2] == 29){
                if(window.aimbot){
                    return
                }
                CheatAPI.PLAYERS.forEach((player, index)=>{
                    if(player.WOID == CheatAPI.FUNCTIONS.GET_INTS(Data)[0]){
                        let floats = CheatAPI.FUNCTIONS.GET_FLOATS([...Data])
                        if(window.aimbot && index == 1){
                            CheatAPI.SEND_SOCKET(243,4,31,0,8,22,105,...CheatAPI.FUNCTIONS.TO_BYTE_32(CheatAPI.PLAYER.WOID),74,102,...CheatAPI.FUNCTIONS.TO_FLOAT_32(floats[0]),75,102,...CheatAPI.FUNCTIONS.TO_FLOAT_32(floats[1]),76,102,...CheatAPI.FUNCTIONS.TO_FLOAT_32(floats[2]),77,102,...CheatAPI.FUNCTIONS.TO_FLOAT_32(floats[0]),78,102,...CheatAPI.FUNCTIONS.TO_FLOAT_32(floats[1]),79,102,...CheatAPI.FUNCTIONS.TO_FLOAT_32(floats[0]),254,105,0,0,0,0)
                        }
                        player.POS = {
                            X: floats[0],
                            Y: floats[1],
                            Z: floats[2]
                        }
                    }
                })

            }
            this._onmessage(message)
        }
        this.socket = this
        _this = this
    }
    let Data = new Uint8Array(data)
    let DecodedData = CheatAPI.FUNCTIONS.DECODE_TEXT([...Data])
    if (window.socks) {
        console.log(Data + "\n" + DecodedData)
    }
    if (CheatAPI.CLIENT_BLOCKS.indexOf(Data[2]) != -1) {
        return;
    }
    if (Data[2] == 2) {
        let floats = CheatAPI.FUNCTIONS.GET_FLOATS([...Data])
        let pos = {
            X: floats[0],
            Y: floats[1],
            Z: floats[2]
        }
        CheatAPI.PLAYER.POS = pos
        if(window["X: 0"] && window["Y: 0"] && window["Z: 0"]){
            window["X: 0"].textContent = `⠀⠀X: ${pos.X}`
            window["Y: 0"].textContent = `⠀⠀Y: ${pos.Y}`
            window["Z: 0"].textContent = `⠀⠀Z: ${pos.Z}`
        }
        if(window.surf){
            window.lastPos = {
                X: pos.X,
                Y: pos.Y,
                Z: pos.Z
            }
            if(window.lastSurf){
                let lastSurf = window.lastSurf
                let checkDistance = setInterval(()=>{
                    let distanceX = window.lastPos.X - pos.X
                    let distanceY = window.lastPos.Y - pos.Y
                    let distanceZ = window.lastPos.Z - pos.Z
                    let distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY + distanceZ * distanceZ)
                    if(distance > 10){
                        clearInterval(checkDistance)
                        lastSurf.forEach((position)=>{
                            CheatAPI.CHEATS.REMOVE_CUBE(position.x, position.y, position.z, "BOTH")
                        })
                    }
                }, 1000)
            }
            window.lastSurf = []
            for(var x = pos.X-5; x <= pos.X+5; x++){
                for(var z = pos.Z-5; z <= pos.Z+5; z++){
                    CheatAPI.CHEATS.PLACE_CUBE(x+1, window.shift ? pos.Y-1 : pos.Y, z+1, window.material? window.material : CheatAPI.MATERIAL_IDS.Khaki, "BOTH")
                    window.lastSurf.push({
                        x: x+1,
                        y: window.shift ? pos.Y-1 : pos.Y,
                        z: z+1
                    })
                }
            }
        }
    }
    if (Data[2] == 7) {
        CheatAPI.CUBE_ID = CheatAPI.FUNCTIONS.TO_NUM_32(Data.slice(7, 10+1))
        if(window.twinbuildings){
            let position = {
                X: CheatAPI.FUNCTIONS.TO_NUM_16([Data[18], Data[19]]),
                Y: CheatAPI.FUNCTIONS.TO_NUM_16([Data[20], Data[21]]),
                Z: CheatAPI.FUNCTIONS.TO_NUM_16([Data[22], Data[23]])
            }
            CheatAPI.CHEATS.PLACE_CUBE(position.X+10, position.Y, position.Z, window.material ? window.material : CheatAPI.MATERIAL_IDS.Khaki, "BOTH")
        }
    }
    if (Data[2] == 26 && window.aimbot){
        return
    }
    this._send(...arguments)
}

window.CheatAPI = top.CheatAPI = {
    FUNCTIONS: {
        SLEEP: function(MS) {
            return new Promise(resolve => setTimeout(resolve, MS));
        },
        GET_JSON: function(TXT) {
            let POS = 0,
                left = 0,
                i = 0,
                arr = [];
            while (i++ < TXT.length) {
                if (TXT[i] == '{' && TXT[i + 1] == '"') {
                    if (!left) POS = i;
                    left++;
                }
                if (TXT[i] == '}') {
                    if (left > 0) {
                        left--;
                        if (!left) arr.push(TXT.slice(POS, i + 1));
                    }
                }
            }
            return arr.map(a => JSON.parse(a));
        },
        ENCODE_TEXT: function(TEXT) {
            let encoded = []
            TEXT.split("").forEach((char) => {
                encoded.push(char.charCodeAt(0))
            })
            return encoded
        },
        DECODE_TEXT: function(TEXT) {
            return String.fromCharCode(...TEXT)
        },
        TO_FLOAT_32: function(NUM) {
            return new Uint8Array(new Float32Array([NUM]).buffer).reverse()
        },
        TO_BYTE_32: function(NUM) {
            return new Uint8Array(new Uint32Array([NUM]).buffer).reverse()
        },
        TO_BYTE_16: function(NUM) {
            return new Uint8Array(new Uint16Array([NUM]).buffer).reverse()
        },
        UNSIGN_16: function(NUM) {
            return new Uint16Array([NUM])[0]
        },
        TO_NUM_32: function(ARR) {
            return ((ARR[0] << 8 | ARR[1]) << 8 | ARR[2]) << 8 | ARR[3]
        },
        TO_NUM_16: function(ARR) {
            return new Int16Array(new Uint8Array(ARR).reverse().buffer)[0]
        },
        GET_INTS: function(ARR) {
            let ints = []
            for (var i = 0; i < ARR.length; i++) {
                if (ARR[i - 4] == 105) {
                    let bytes = [ARR[i - 3], ARR[i - 2], ARR[i - 1], ARR[i]]
                    let int = CheatAPI.FUNCTIONS.TO_NUM_32(bytes)
                    if(int < 999999999){
                        ints.push(int)
                    }
                }
            }
            return ints
        },
        GET_FLOATS: function(BYTES) {
            let index = 0;
            let floats = [];
            while ((index = BYTES.indexOf(102)) != -1) {
                let data = BYTES.splice(index, 5);
                data.splice(0, 1);
                floats.push(new Float32Array(new Uint8Array(data.reverse()).buffer)[0])
            }
            return floats;
        }
    },
    SEND_SOCKET: function(...SOCKET) {
        if (SOCKET[1] == 2 || SOCKET[1] == 6) {
            _this._send(new Uint8Array([...SOCKET]))
        } else if (SOCKET[1] == 4 || SOCKET[1] == 7 || SOCKET[1] == 3) {
            _this._onmessage({
                data: new Uint8Array([...SOCKET]).buffer
            })
        }
    },
    SERVER_BLOCKS: [],
    CLIENT_BLOCKS: [],
    ITEM_IDS: {
        CenterGun: 1,
        ImpulseGun: 2,
        Bazooka: 4,
        Hand: 5,
        RailGun: 6,
        Sword: 8,
        Shotgun: 9,
        Flamethrower: 10,
        CubeGun: 11,
        GrowthGun: 62,
        MouseGun: 60,
        Shuriken: 45,
        MultipleShurikens: 46,
        Revolver: 12,
        DoubleRevolvers: 13,
        HealRay: 70,
        SlapGun: 65
    },
    TESTE: function(){
        var m_permutation = [151, 160, 137, 91, 90, 15,
                             131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23,
                             190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33,
                             88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166,
                             77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244,
                             102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196,
                             135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123,
                             5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42,
                             223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9,
                             129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228,
                             251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107,
                             49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254,
                             138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180];


        function RemapClamp_01(x) {
            if (x <= -1.0) {
                return 0.0;
            }
            else if (1.0 <= x) {
                return 1.0;
            }
            return (x * 0.5 + 0.5);
        }

        function Remap_01(x) {
            return (x * 0.5 + 0.5);
        }
        function Fade(t) {
            return t * t * t * (t * (t * 6 - 15) + 10);
        }

        function Lerp(a, b, t) {
            return (a + (b - a) * t);
        }

        function Grad(hash, x, y, z) {
            let h = hash & 15;

            let u = h < 8 ? x : y,
                v = h < 4 ? y : h == 12 || h == 14 ? x : z;

            return ((h & 1) == 0 ? u : -u) + ((h & 2) == 0 ? v : -v);
        }

        function Octave3D(x, y, z, octaves, persistence) {
            let result = 0;
            let amplitude = 1;

            for (let i = 0; i < octaves; i++) {
                result += (noise3d(x, y, z) * amplitude);
                x *= 2;
                y *= 2;
                z *= 2;
                amplitude *= persistence;
            }
            return result;
        }

        function noise3d(x, y, z) {
            let _x = Math.floor(x);
            let _y = Math.floor(y);
            let _z = Math.floor(z);

            let ix = _x & 255;
            let iy = _y & 255;
            let iz = _z & 255;

            let fx = (x - _x);
            let fy = (y - _y);
            let fz = (z - _z);

            let u = Fade(fx);
            let v = Fade(fy);
            let w = Fade(fz);

            let A = (m_permutation[ix & 255] + iy) & 255;
            let B = (m_permutation[(ix + 1) & 255] + iy) & 255;

            let AA = (m_permutation[A] + iz) & 255;
            let AB = (m_permutation[(A + 1) & 255] + iz) & 255;

            let BA = (m_permutation[B] + iz) & 255;
            let BB = (m_permutation[(B + 1) & 255] + iz) & 255;

            let p0 = Grad(m_permutation[AA], fx, fy, fz);
            let p1 = Grad(m_permutation[BA], fx - 1, fy, fz);
            let p2 = Grad(m_permutation[AB], fx, fy - 1, fz);
            let p3 = Grad(m_permutation[BB], fx - 1, fy - 1, fz);
            let p4 = Grad(m_permutation[(AA + 1) & 255], fx, fy, fz - 1);
            let p5 = Grad(m_permutation[(BA + 1) & 255], fx - 1, fy, fz - 1);
            let p6 = Grad(m_permutation[(AB + 1) & 255], fx, fy - 1, fz - 1);
            let p7 = Grad(m_permutation[(BB + 1) & 255], fx - 1, fy - 1, fz - 1);

            let q0 = Lerp(p0, p1, u);
            let q1 = Lerp(p2, p3, u);
            let q2 = Lerp(p4, p5, u);
            let q3 = Lerp(p6, p7, u);

            let r0 = Lerp(q0, q1, v);
            let r1 = Lerp(q2, q3, v);

            return Lerp(r0, r1, w);
        }

        function noise3D_01(x, y, z) {
            return Remap_01(noise3d(x, y, z));
        }

        function octave3D(x, y, z, octaves, persistence) {
            return Octave3D(x, y, z, octaves, persistence);
        }

        function octave3D_01(x, y, z, octaves, persistence) {
            return RemapClamp_01(octave3D(x, y, z, octaves, persistence));
        }

        function MaxAmplitude(octaves, persistence) {
            let result = 0;
            let amplitude = 1;

            for (let i = 0; i < octaves; i++) {
                result += amplitude;
                amplitude *= persistence;
            }
            return result;
        }

        function normalizedOctave3D(x, y, z, octaves, persistence) {
            return (octave3D(x, y, z, octaves, persistence) / MaxAmplitude(octaves, persistence));
        }
        function normalizedOctave3D_01(x, y, z, octaves, persistence) {
            return Remap_01(normalizedOctave3D(x, y, z, octaves, persistence));
        }

        function BiomColor(val)
        {
            if (val < 0.32)
            {
                return CheatAPI.MATERIAL_IDS.DarkBlue;
            }
            else if (val < 0.40)
            {
                return CheatAPI.MATERIAL_IDS.Blue;
            }
            else if (val < 0.45)
            {
                return CheatAPI.MATERIAL_IDS.Orange;
            }
            else if (val < 0.47)
            {
                return CheatAPI.MATERIAL_IDS.BrightOrange;
            }
            else if (val < 0.49)
            {
                return CheatAPI.MATERIAL_IDS.Khaki;
            }
            else if (val < 0.55)
            {
                return CheatAPI.MATERIAL_IDS.Green;
            }
            else if (val < 0.62)
            {
                return CheatAPI.MATERIAL_IDS.DarkGreen;
            }
            else if (val < 0.66)
            {
                return CheatAPI.MATERIAL_IDS.DarkGreen;
            }
            else if (val < 0.68)
            {
                return CheatAPI.MATERIAL_IDS.Concrete;
            }
            else if (val < 0.74)
            {
                return CheatAPI.MATERIAL_IDS.Concrete;
            }
            else if (val < 0.80)
            {
                return CheatAPI.MATERIAL_IDS.Concrete;
            }
            else if (val < 0.86)
            {
                return CheatAPI.MATERIAL_IDS.LightConcrete;
            }
            else
            {
                return CheatAPI.MATERIAL_IDS.LightConcrete;
            }
        }

        var maximo = 256;

        var i, arr = [];
        for (i = 0; i < maximo; i++) {
            arr[i] = i + 1;
        }

        var p, n, tmp;
        for (p = arr.length; p;) {
            n = Math.random() * p-- | 0;
            tmp = arr[n];
            arr[n] = arr[p];
            arr[p] = tmp;
        }
        m_permutation = arr;
        //let z_ = 0;
        let posx = CheatAPI.PLAYER.POS.X
        let posy = CheatAPI.PLAYER.POS.Y
        let posz = CheatAPI.PLAYER.POS.Z
        async function createMap(){
            for (let x = 0; x < 512; x++)
            {
                    for(let z = 0; z < 512; z++){
                        let width = 512;
                        let h = normalizedOctave3D_01((x * 0.01), (z * 0.01), (1 * 0.01), 8, 0.55);
                        CheatAPI.CHEATS.PLACE_CUBE(x+posx, posy+h*50, z+posz, BiomColor(h), "BOTH")
                        if(((z + x*width)%3000) == 0){
                            await CheatAPI.FUNCTIONS.SLEEP(700)
                        }
                    }
            }
        }
        setTimeout(createMap, 0)
    },
    EFFECT_NAMES: ["Fire", "Mutant", "Poison", "Frozen", "NinjaRun", "Shrunken", "Enlarged", "Shielded", "SpawnProtection"],
    SPAWN_WOIDS: [75580, 258666, 258665, 258652, 258670, 258662, 265392, 268346, 258874, 258875, 258652],
    MESSAGE_TYPE: {
        Admin: 3,
        All: 7,
        Team: 8,
        Says: 9,
        Warning: 11
    },
    TEAM_IDS: {
        Blue: 0,
        Red: 1,
        Green: 2,
        Yellow: 3,
        White: 5,
        Server: 6
    },
    CUBE_ID: 0,
    CUBES: [],
    MATERIAL_IDS: {
        BrightRed: 0,
        Red: 1,
        DarkRed: 2,
        Sand: 3,
        LightPurpleFabric: 4,
        BrightBlue: 5,
        Blue: 6,
        DarkBlue: 7,
        Caramel: 8,
        PurpleFabric: 9,
        BrightGreen: 10,
        Green: 11,
        DarkGreen: 12,
        Ceramic: 13,
        DarkPurpleFabric: 14,
        Yellow: 15,
        BrightOrange: 16,
        Orange: 17,
        Butter: 18,
        Sandstone: 19,
        LightConcrete: 20,
        Concrete: 21,
        DarkConcrete: 22,
        BlackConcrete: 23,
        Khaki: 24,
        Ice: 25,
        Lava: 26,
        Bouncy: 27,
        Poison: 28,
        Parkour: 29,
        Bricks: 30,
        LightWood: 31,
        Cobblestone: 32,
        Cement: 33,
        Camouflage: 34,
        GreenPavement: 35,
        AncientCobblestone: 36,
        RedBricks: 37,
        YellowBricks: 38,
        Zigzag: 39,
        MetalPattern: 40,
        Metal: 41,
        Mushroom: 42,
        BlackIce: 43,
        PinkFabric: 44,
        RedGrid: 45,
        GreenGrid: 46,
        Circuit: 47,
        GreyBricks: 48,
        Spotty: 49,
        MetalScraps: 50,
        Slime: 51,
        WrappingPaper: 52,
        DarkWood: 53,
        SuperBouncy: 54,
        Cloud: 55,
        SoftDestructible: 56,
        MediumDestructible: 57,
        HardDestructible: 58,
        CrackedIce: 59,
        StripedCement: 60,
        Machinery: 61,
        EmbossedMetal: 62,
        Scrolling: 63,
        Kill: 64,
        Heal: 65,
        Slow: 66,
        Speed: 67,
        Crumble: 68
    },
    ACESSORIES: {},
    FRIENDSHIP_INFOS: {},
    WORLD_OBJECTS: { //Not finished.
        CubeModelPrototypeTerrain: 75579,
        Spawn: 75580,
        SpawnGreen: 258626,
        Group: 75578,
		SpawnPointGreen: 258626,
		CubeModel: 258613,
		SpawnPointYellow: 258625,
		SpawnPointRed: 258627,
		SpawnPointBlue: 258628,
        PickupItemSpawner: 258629,
        PickupItemSpawner2: 258630,
        PickupItemSpawer3: 258631,
        PickupItemSpawner4: 258633,
        PickupItemSpawner5: 262109,
        PickupItemSpawner6: 258635,
        PickupItemSpawner7: 258637,
        PickupItemSpawner8: 258639,
        PickupItemSpawner9: 258640,
        PickupItemSpawner10: 258641,
        PickupItemSpawner11: 258642,
        PickupItemSpawner12: 258643,
        CubeModel: 262113,
        PickupItemSpawner13: 258645,
        PickupItemSpawner14: 258647,
        PickupItemSpawner15: 258648,
        PickupItemSpawner16: 258650,
        PickupItemSpawner17: 258651,
        PickupItemSpawner18: 258652,
        PickupItemSpawner19: 258653,
        PickupItemSpawner20: 258654
    },
    PLAYERS: [],
    PLAYER: {
        USERNAME: top.document.getElementsByClassName("_4RanE")[0].textContent,
        WOID: 0,
        POS: {},
        ACTORNR: 0
    },
    CHEATS: {
        PLACE_CUBE: function(X, Y, Z, MATERIAL, FLAG) {
            FLAG ? FLAG = FLAG.toUpperCase() : FLAG = "BOTH"
            if(FLAG == "CLIENT"){
                CheatAPI.SEND_SOCKET(243,2,7,0,2,47,105,...CheatAPI.FUNCTIONS.TO_BYTE_32(CheatAPI.CUBE_ID),49,120,0,0,0,(MATERIAL>-1?9:7),(MATERIAL>-1?2:0),...CheatAPI.FUNCTIONS.TO_BYTE_16(X),...CheatAPI.FUNCTIONS.TO_BYTE_16(Y),...CheatAPI.FUNCTIONS.TO_BYTE_16(Z),...(MATERIAL?[7,MATERIAL]:[]))
            }else if(FLAG == "SERVER"){
                CheatAPI.SEND_SOCKET(243,4,10,0,3,47,105,...CheatAPI.FUNCTIONS.TO_BYTE_32(CheatAPI.CUBE_ID),49,120,0,0,0,(MATERIAL>-1?9:7),(MATERIAL>-1?2:0),...CheatAPI.FUNCTIONS.TO_BYTE_16(X),...CheatAPI.FUNCTIONS.TO_BYTE_16(Y),...CheatAPI.FUNCTIONS.TO_BYTE_16(Z),...(MATERIAL?[7,MATERIAL]:[]),254,105,0,0,0,0)
            }else if(FLAG == "BOTH"){
                CheatAPI.SEND_SOCKET(243,2,7,0,2,47,105,...CheatAPI.FUNCTIONS.TO_BYTE_32(CheatAPI.CUBE_ID),49,120,0,0,0,(MATERIAL>-1?9:7),(MATERIAL>-1?2:0),...CheatAPI.FUNCTIONS.TO_BYTE_16(X),...CheatAPI.FUNCTIONS.TO_BYTE_16(Y),...CheatAPI.FUNCTIONS.TO_BYTE_16(Z),...(MATERIAL?[7,MATERIAL]:[]))
                CheatAPI.SEND_SOCKET(243,4,10,0,3,47,105,...CheatAPI.FUNCTIONS.TO_BYTE_32(CheatAPI.CUBE_ID),49,120,0,0,0,(MATERIAL>-1?9:7),(MATERIAL>-1?2:0),...CheatAPI.FUNCTIONS.TO_BYTE_16(X),...CheatAPI.FUNCTIONS.TO_BYTE_16(Y),...CheatAPI.FUNCTIONS.TO_BYTE_16(Z),...(MATERIAL?[7,MATERIAL]:[]),254,105,0,0,0,0)
            }
        },
        REMOVE_CUBE: function(X, Y, Z, FLAG){
            FLAG ? FLAG = FLAG.toUpperCase() : FLAG = "BOTH"
            if(FLAG == "CLIENT"){
                CheatAPI.SEND_SOCKET(243,2,7,0,2,47,105,...CheatAPI.FUNCTIONS.TO_BYTE_32(CheatAPI.CUBE_ID),49,120,0,0,0,7,0,...CheatAPI.FUNCTIONS.TO_BYTE_16(X),...CheatAPI.FUNCTIONS.TO_BYTE_16(Y),...CheatAPI.FUNCTIONS.TO_BYTE_16(Z))
            }else if(FLAG == "SERVER"){
                CheatAPI.SEND_SOCKET(243,4,10,0,3,47,105,...CheatAPI.FUNCTIONS.TO_BYTE_32(CheatAPI.CUBE_ID),49,120,0,0,0,7,0,...CheatAPI.FUNCTIONS.TO_BYTE_16(X),...CheatAPI.FUNCTIONS.TO_BYTE_16(Y),...CheatAPI.FUNCTIONS.TO_BYTE_16(Z),254,105,...CheatAPI.FUNCTIONS.TO_BYTE_32(CheatAPI.PLAYER.ACTORNR))
            }else if(FLAG == "BOTH"){
                CheatAPI.SEND_SOCKET(243,2,7,0,2,47,105,...CheatAPI.FUNCTIONS.TO_BYTE_32(CheatAPI.CUBE_ID),49,120,0,0,0,7,0,...CheatAPI.FUNCTIONS.TO_BYTE_16(X),...CheatAPI.FUNCTIONS.TO_BYTE_16(Y),...CheatAPI.FUNCTIONS.TO_BYTE_16(Z))
                CheatAPI.SEND_SOCKET(243,4,10,0,3,47,105,...CheatAPI.FUNCTIONS.TO_BYTE_32(CheatAPI.CUBE_ID),49,120,0,0,0,7,0,...CheatAPI.FUNCTIONS.TO_BYTE_16(X),...CheatAPI.FUNCTIONS.TO_BYTE_16(Y),...CheatAPI.FUNCTIONS.TO_BYTE_16(Z),254,105,...CheatAPI.FUNCTIONS.TO_BYTE_32(CheatAPI.PLAYER.ACTORNR))
            }
        },
        TEXT_TO_CUBES: function(text, font){
            function getTextWidth(){
                let canvas = document.createElement("canvas")
                top.document.body.appendChild(canvas)
                canvas.style.display = "none"
                let ctx = canvas.getContext("2d")
                ctx.font = font
                let width = ctx.measureText(text).width
                canvas.remove()
                return width
            }
            let canvas = document.createElement("canvas")
            canvas.width = getTextWidth() + 25
            canvas.height = parseInt(font.split("px")[0]) + 25
            let ctx = canvas.getContext("2d")
            top.document.body.appendChild(canvas)
            canvas.style.display = "none"
            ctx.fillStyle = "black"
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            ctx.textBaseLine = "middle"
            ctx.textAlign = "center"
            ctx.fillStyle = "white"
            ctx.font = font
            ctx.fillText(text, canvas.width / 2, canvas.height / 2)
            async function placeCubes(){
                let posx = CheatAPI.PLAYER.POS.X + 10
                let posy = CheatAPI.PLAYER.POS.Y
                let posz = CheatAPI.PLAYER.POS.Z
                for(var x = canvas.width; x != 1; x--){
                    for(var y = canvas.height; y != 1; y--){
                    let color = ctx.getImageData(x, y, 1, 1).data
                    if(color.toString() == "0,0,0,255"){
                        CheatAPI.CHEATS.PLACE_CUBE((posx + canvas.width) - x, (posy + canvas.height) - y, posz, CheatAPI.MATERIAL_IDS.BlackConcrete, "BOTH")
                    }else{
                        CheatAPI.CHEATS.PLACE_CUBE((posx + canvas.width) - x, (posy + canvas.height) - y, posz, CheatAPI.MATERIAL_IDS.Cloud, "BOTH")
                    }
                        if(((y + x * canvas.width) % 3000) == 0){
                            await CheatAPI.FUNCTIONS.SLEEP(500)
                        }
                    }
                }
            }
            setTimeout(placeCubes, 0)
            canvas.remove()
        },
        IMAGE_TO_CUBES: function(imageSrc){
            let image = new Image()
            image.src = imageSrc
            image.onload = function(){
                let canvas = document.createElement("canvas")
                canvas.width = image.width
                canvas.height = image.height
                let ctx = canvas.getContext("2d")
                canvas.style.display = "none"
                ctx.drawImage(image, 0, 0)
                top.document.body.appendChild(canvas)
                function getCubeID([r,g,b]) {
                    let colors = [
                        [179,  52,  42],[134,  37,  30],[ 90,  15,   8],[216, 168, 111],[162, 137, 175],
                        [ 63, 149, 226],[ 41,  86, 151],[  0,  44, 100],[160,  79,   4],[115,  94, 137],
                        [109, 131,  21],[ 77,  91,   8],[ 40,  56,   2],[101,  42,   5],[ 66,  51,  90],
                        [218, 124,  12],[192,  94,   0],[159,  61,   0],[253, 206, 102],[182, 144,  67],
                        [168, 168, 165],[131, 130, 131],[ 88,  87,  87],[ 34,  34,  34],[116, 100,  66],
                        [124, 197, 237],[ 51,  32,  24],[ 95,  32,  25],[170, 223,   0],[131, 131, 133],
                        [120,  69,  38],[112,  81,  41],[ 74,  85,  89],[114, 113, 112],[135, 121,  72],
                        [ 49,  83,  73],[108,  85,  26],[ 98,  24,  24],[166, 121,  21],[108, 108, 108],
                        [ 75,  70,  66],[ 83,  77,  73],[231, 152, 152],[ 44,  57,  83],[252,  53, 160],
                        [ 74,  12,   8],[ 38,  53,  31],[ 17,  57,  82],[ 94,  85,  85],[124, 168, 106],
                        [115, 115, 116],[ 67, 116,  29],[131,   4,  37],[ 49,  28,   2],[146,  66,   4],
                        [204, 230, 235],[ 79,  88,  24],[175, 138,  64],[126, 125, 126],[173, 220, 243],
                        [ 82,  81,  80],[ 39, 115, 158],[ 65,  82, 102]
                    ];
                    const distances = colors.map(
                        ([r1, g1, b1], id) => [id, Math.sqrt(Math.pow(r1 - r, 2) + Math.pow(g1 - g, 2) + Math.pow(b1 - b, 2))]
                    );
                    const [ id ] = distances.reduce(
                        (d1, d2) => d1[1] > d2[1]? d2 : d1
                    );
                    return id
                }
                async function placeCubes(){
                    let posx = CheatAPI.PLAYER.POS.X + 10
                    let posy = CheatAPI.PLAYER.POS.Y
                    let posz = CheatAPI.PLAYER.POS.Z
                    for(var x = canvas.width; x != 1; x--){
                        for(var y = canvas.height; y != 1; y--){
                            let pixelColor = ctx.getImageData(x, y, 1, 1).data
                            //(posx + canvas.width) - x, (posy + canvas.height) - y, posz
                            /*let distances = []
                            colors.forEach((color)=>{
                                distances.push(Math.abs(color[0] - pixelColor[0]) + Math.abs(color[1] - pixelColor[1]) + Math.abs(color[2] - pixelColor[2]))
                            })
                            let block = Object.values(CheatAPI.MATERIAL_IDS)[distances.indexOf(Math.min.apply(Math, distances))]*/
                            let block = getCubeID(pixelColor)
                            CheatAPI.CHEATS.PLACE_CUBE((posx + canvas.width) - x, (posy + canvas.height) - y, posz, block ? block : CheatAPI.MATERIAL_IDS.BlackConcrete, "BOTH")
                            if(((y + x * canvas.width) % 3000) == 0){
                                await CheatAPI.FUNCTIONS.SLEEP(700)
                            }
                        }
                    }
                }
                setTimeout(placeCubes, 0)
                canvas.remove()
            }
        },
        SET_HEALTH: function(WOID, HEALTH) {
            CheatAPI.SEND_SOCKET(243, 2, 25, 0, 2, 22, 105, ...CheatAPI.FUNCTIONS.TO_BYTE_32(WOID), 70, 68, 0, 0, 0, 1, 115, 0, 6, 104, 101, 97, 108, 116, 104, 102, ...CheatAPI.FUNCTIONS.TO_FLOAT_32(HEALTH))
            CheatAPI.SEND_SOCKET(243, 4, 29, 0, 3, 22, 105, ...CheatAPI.FUNCTIONS.TO_BYTE_32(WOID), 70, 68, 0, 0, 0, 1, 115, 0, 6, 104, 101, 97, 108, 116, 104, 102, ...CheatAPI.FUNCTIONS.TO_FLOAT_32(HEALTH), 254, 105, 0, 0, 0, 0)
        },
        SET_MAX_HEALTH: function(WOID, HEALTH) {
            CheatAPI.SEND_SOCKET(243, 2, 25, 0, 2, 22, 105, ...CheatAPI.FUNCTIONS.TO_BYTE_32(WOID), 70, 68, 0, 0, 0, 1, 115, 0, 9, 109, 97, 120, 72, 101, 97, 108, 116, 104, 105, ...CheatAPI.FUNCTIONS.TO_BYTE_32(HEALTH))
            CheatAPI.SEND_SOCKET(243, 4, 29, 0, 3, 22, 105, ...CheatAPI.FUNCTIONS.TO_BYTE_32(WOID), 70, 68, 0, 0, 0, 1, 115, 0, 9, 109, 97, 120, 72, 101, 97, 108, 116, 104, 105, ...CheatAPI.FUNCTIONS.TO_BYTE_32(HEALTH), 254, 105, 0, 0, 0, 0)
        },
        SET_SIZE: function(WOID, SIZE, FLAG) {
            FLAG ? FLAG = FLAG.toUpperCase() : FLAG = "BOTH"
            if(FLAG == "CLIENT"){
                CheatAPI.SEND_SOCKET(243, 2, 25, 0, 2, 22, 105, ...CheatAPI.FUNCTIONS.TO_BYTE_32(WOID), 70, 68, 0, 0, 0, 1, 115, 0, 4, 115, 105, 122, 101, 102, ...CheatAPI.FUNCTIONS.TO_FLOAT_32(SIZE))
            }else if(FLAG == "SERVER"){
                CheatAPI.SEND_SOCKET(243, 4, 29, 0, 3, 22, 105, ...CheatAPI.FUNCTIONS.TO_BYTE_32(WOID), 70, 68, 0, 0, 0, 1, 115, 0, 4, 115, 105, 122, 101, 102, ...CheatAPI.FUNCTIONS.TO_FLOAT_32(SIZE), 254, 105, 0, 0, 0, 0)
            }else if(FLAG == "BOTH"){
                CheatAPI.SEND_SOCKET(243, 2, 25, 0, 2, 22, 105, ...CheatAPI.FUNCTIONS.TO_BYTE_32(WOID), 70, 68, 0, 0, 0, 1, 115, 0, 4, 115, 105, 122, 101, 102, ...CheatAPI.FUNCTIONS.TO_FLOAT_32(SIZE))
                CheatAPI.SEND_SOCKET(243, 4, 29, 0, 3, 22, 105, ...CheatAPI.FUNCTIONS.TO_BYTE_32(WOID), 70, 68, 0, 0, 0, 1, 115, 0, 4, 115, 105, 122, 101, 102, ...CheatAPI.FUNCTIONS.TO_FLOAT_32(SIZE), 254, 105, 0, 0, 0, 0)
            }
        },
        SET_LEVEL: function(LEVEL, FLAG) {
            FLAG ? FLAG =  FLAG.toUpperCase() : FLAG = "BOTH"
            if(FLAG == "CLIENT"){
                CheatAPI.SEND_SOCKET(243,2,56,0,1,169,105,...CheatAPI.FUNCTIONS.TO_BYTE_32(LEVEL))
            }else if(FLAG == "SERVER"){
                CheatAPI.SEND_SOCKET(243,4,55,0,2,169,105,...CheatAPI.FUNCTIONS.TO_BYTE_32(LEVEL),254,105,...CheatAPI.FUNCTIONS.TO_BYTE_32(CheatAPI.PLAYER.ACTORNR))
            }else if(FLAG == "BOTH"){
                CheatAPI.SEND_SOCKET(243,2,56,0,1,169,105,...CheatAPI.FUNCTIONS.TO_BYTE_32(LEVEL))
                CheatAPI.SEND_SOCKET(243,4,55,0,2,169,105,...CheatAPI.FUNCTIONS.TO_BYTE_32(LEVEL),254,105,...CheatAPI.FUNCTIONS.TO_BYTE_32(CheatAPI.PLAYER.ACTORNR))
            }
        },
        IMPULSE: function(WOID) {
            CheatAPI.SEND_SOCKET(243, 4, 32, 0, 3, 22, 105, ...CheatAPI.FUNCTIONS.TO_BYTE_32(WOID), 83, 68, 0, 0, 0, 1, 98, 0, 120, 0, 0, 0, 14, 5, 2, 65, 153, 217, 226, 68, 170, 143, 159, 64, 156, 229, 197, 254, 105, ...CheatAPI.FUNCTIONS.TO_BYTE_32(CheatAPI.PLAYER.ACTORNR))
        },
        REQUEST_FRIENDSHIP: function(ID) {
            CheatAPI.SEND_SOCKET(243,2,15,0,1,53,105,...CheatAPI.FUNCTIONS.TO_BYTE_32(ID))
        },
        ACCEPT_FRIENDSHIP: function(REQUEST_ID, ID, FRIEND_ID){
            CheatAPI.SEND_SOCKET(243,4,16,0,4,52,105,...CheatAPI.FUNCTIONS.TO_BYTE_32(REQUEST_ID),11,105,...CheatAPI.FUNCTIONS.TO_BYTE_32(ID),53,105,...CheatAPI.FUNCTIONS.TO_BYTE_32(FRIEND_ID),254,105,0,0,0,0)
        },
        IS_FIRING: function(IS_FIRING) {
            CheatAPI.SEND_SOCKET(243, 4, 29, 0, 3, 22, 105, ...CheatAPI.FUNCTIONS.TO_BYTE_32(CheatAPI.PLAYER.WOID), 70, 68, 0, 0, 0, 1, 115, 0, 8, 105, 115, 70, 105, 114, 105, 110, 103, 111, IS_FIRING, 254, 105, 0, 0, 0, 0)
        },
        SPAWN_ITEM: function(ITEM_ID) {
            CheatAPI.SEND_SOCKET(243, 4, 29, 0, 3, 22, 105, ...CheatAPI.FUNCTIONS.TO_BYTE_32(CheatAPI.PLAYER.WOID), 70, 68, 0, 0, 0, 1, 115, 0, 11, 99, 117, 114, 114, 101, 110, 116, 73, 116, 101, 109, 68, 0, 0, 0, 4, 115, 0, 4, 116, 121, 112, 101, 105, 0, 0, 0, ITEM_ID, 115, 0, 9, 118, 97, 114, 105, 97, 110, 116, 73, 100, 105, 0, 0, 0, 0, 115, 0, 15, 117, 112, 100, 97, 116, 101, 73, 116, 101, 109, 83, 116, 97, 116, 101, 105, 0, 0, 0, 4, 115, 0, 8, 105, 116, 101, 109, 68, 97, 116, 97, 68, 0, 0, 0, 1, 115, 0, 8, 109, 97, 116, 101, 114, 105, 97, 108, 98, 20, 254, 105, 0, 0, 0, 0)
        },
        SPAWN_EFFECT: function(WOID, EFFECT) {
            let effect = CheatAPI.FUNCTIONS.ENCODE_TEXT(EFFECT)
            CheatAPI.SEND_SOCKET(243, 4, 29, 0, 3, 22, 105, ...CheatAPI.FUNCTIONS.TO_BYTE_32(WOID), 70, 68, 0, 0, 0, 1, 115, 0, 9, 109, 111, 100, 105, 102, 105, 101, 114, 115, 68, 0, 0, 0, 1, 115, 0, effect.length, 95, ...effect, 98, 0, 254, 105, 0, 0, 0, 0)
        },
        CLONE_OBJECT: function(WOID, X, Y, Z, FLAG){
            FLAG ? FLAG = FLAG.toUpperCase() : FLAG = "BOTH"
            if(FLAG == "CLIENT"){
                CheatAPI.SEND_SOCKET(243, 2, 65, 0, 12, 22, 105, ...CheatAPI.FUNCTIONS.TO_BYTE_32(WOID), 20, 105,  ...CheatAPI.FUNCTIONS.TO_BYTE_32(CheatAPI.PLAYER.ACTORNR), 101, 111, 0, 127, 111, 0, 203, 111, 1, 24, 102, ...CheatAPI.FUNCTIONS.TO_FLOAT_32(X), 25, 102, ...CheatAPI.FUNCTIONS.TO_FLOAT_32(Y), 26, 102, ...CheatAPI.FUNCTIONS.TO_FLOAT_32(Z), 27, 102, ...CheatAPI.FUNCTIONS.TO_FLOAT_32(0), 28, 102, ...CheatAPI.FUNCTIONS.TO_FLOAT_32(0), 29, 102, ...CheatAPI.FUNCTIONS.TO_FLOAT_32(0), 30, 102, ...CheatAPI.FUNCTIONS.TO_FLOAT_32(0))
            }else if(FLAG == "SERVER"){
                CheatAPI.SEND_SOCKET(243,4,79,0,14,24,102,...CheatAPI.FUNCTIONS.TO_FLOAT_32(X),25,102,...CheatAPI.FUNCTIONS.TO_FLOAT_32(Y),26,102,...CheatAPI.FUNCTIONS.TO_FLOAT_32(Z),27,102,0,0,0,0,28,102,0,0,0,0,29,102,0,0,0,0,30,102,0,0,0,0,72,121,0,3,105,...CheatAPI.FUNCTIONS.TO_BYTE_32(WOID),0,0,0,0,255,255,255,255,101,111,0,20,105,0,0,0,0,128,105,0,0,0,1,58,105,255,255,255,255,92,105,255,255,255,255,254,105,0,0,0,0)
            }else if(FLAG == "BOTH"){
                CheatAPI.SEND_SOCKET(243, 2, 65, 0, 12, 22, 105, ...CheatAPI.FUNCTIONS.TO_BYTE_32(WOID), 20, 105,  ...CheatAPI.FUNCTIONS.TO_BYTE_32(CheatAPI.PLAYER.ACTORNR), 101, 111, 1, 127, 111, 0, 203, 111, 0, 24, 102, ...CheatAPI.FUNCTIONS.TO_FLOAT_32(X), 25, 102, ...CheatAPI.FUNCTIONS.TO_FLOAT_32(Y), 26, 102, ...CheatAPI.FUNCTIONS.TO_FLOAT_32(Z), 27, 102, ...CheatAPI.FUNCTIONS.TO_FLOAT_32(0), 28, 102, ...CheatAPI.FUNCTIONS.TO_FLOAT_32(0), 29, 102, ...CheatAPI.FUNCTIONS.TO_FLOAT_32(0), 30, 102, ...CheatAPI.FUNCTIONS.TO_FLOAT_32(0))
                CheatAPI.SEND_SOCKET(243,4,79,0,14,24,102,...CheatAPI.FUNCTIONS.TO_FLOAT_32(X),25,102,...CheatAPI.FUNCTIONS.TO_FLOAT_32(Y),26,102,...CheatAPI.FUNCTIONS.TO_FLOAT_32(Z),27,102,0,0,0,0,28,102,0,0,0,0,29,102,0,0,0,0,30,102,0,0,0,0,72,121,0,3,105,...CheatAPI.FUNCTIONS.TO_BYTE_32(WOID),0,0,0,0,255,255,255,255,101,111,1,20,105,0,0,0,0,128,105,0,0,0,0,58,105,255,255,255,255,92,105,255,255,255,255,254,105,0,0,0,0)
            }
        },
        EQUIP_ACESSORY: function(FLAG){
            let url = CheatAPI.FUNCTIONS.ENCODE_TEXT(CheatAPI.ACESSORIES['Arachnid Legs'].url)
            if(FLAG == "SERVER"){
                CheatAPI.SEND_SOCKET(243,4,4,0,3,18,68,0,0,0,1,115,0,13,66,108,117,101,112,114,105,110,116,68,97,116,97,68,0,0,0,1,115,0,1,52,68,0,0,0,1,115,0,1,CheatAPI.ACESSORIES['Arachnid Legs'].cat,68,0,0,0,5,115,0,1,50,105,0,0,0,3,115,0,1,49,105,...CheatAPI.FUNCTIONS.TO_BYTE_32(CheatAPI.ACESSORIES['Arachnid Legs'].sAID),115,0,1,51,102,0,0,0,0,115,0,1,52,115,0,url.length,...url,115,0,1,53,102,63,128,0,0,22,105,...CheatAPI.FUNCTIONS.TO_BYTE_32(CheatAPI.PLAYER.WOID),254,105,0,0,0,0)
            }
        },
        RESET_TERRAIN: function(){
            CheatAPI.SEND_SOCKET(243,4,51,0,1,0,0,0,0,254,0,0,0,0)
        },
        CAPTURE_FLAG: function(){
            CheatAPI.SEND_SOCKET(243,2,23,0,1,191,105,...CheatAPI.FUNCTIONS.TO_BYTE_32(CheatAPI.PLAYER.WOID))
        },
        CHANGE_TEAM: function(TEAM_ID){
            CheatAPI.SEND_SOCKET(243, 2, 29, 0, 1, 89, 105, 0, 0, 0, TEAM_ID)
        },
        SEND_CHAT_MESSAGE: function(MESSAGETYPE, ACTORNR, MESSAGE){
            let encodedMessage = CheatAPI.FUNCTIONS.ENCODE_TEXT(MESSAGE)
            CheatAPI.SEND_SOCKET(243, 2, 88, 0, 2, 87, 105, 0, 0, 0, MESSAGETYPE, 88, 68, 0, 0, 0, 2, 98, 0, 105, ...CheatAPI.FUNCTIONS.TO_BYTE_32(ACTORNR), 98, 5, 115, 0, encodedMessage.length, ...encodedMessage)
        }
    }
}

let menu = document.createElement("div")
menu.className = "CheatMenu"
top.document.body.appendChild(menu)

let head = document.createElement("div")
head.className = "CheatHead"
menu.appendChild(head)

let minimize = document.createElement("input")
minimize.className = "CheatMinimize"
minimize.type = "button"
minimize.value = "—"
minimize.onclick = function(){
    menu.style.display = "none"
    let open = document.createElement("div")
    open.className = "CheatOpen"
    open.onclick = function(){
        open.remove()
        menu.style.display = "block"
    }
    top.document.body.appendChild(open)
}
head.appendChild(minimize)

let close = document.createElement("input")
close.className = "CheatClose"
close.type = "button"
close.value = "X"
close.onclick = function() {
    if(window.kogamaload){
    Object.values(interface.tabsContent).forEach((tabContent)=>{
        tabContent.childNodes.forEach((node)=>{
            if(node.defaultState){
                node.defaultState()
            }
        })
    })
    }
    menu.remove()
}
head.appendChild(close)

top.document.addEventListener("auxclick", function() {
    menu.style.display = "block"
})

let title = document.createElement("p")
title.className = "CheatTitle"
title.textContent = "Xydar Trainer"
head.appendChild(title)

top.document.addEventListener('mouseup', e => {
    if (menu.movement) {
        menu.movement = false;
        e.preventDefault();
        e.stopPropagation();
    }
})
top.document.addEventListener('mousemove', e => {
    if (menu.movement) {
        menu.style.left = (menu.startpos.x + e.x - menu.startpos.mx) + 'px';
        menu.style.top = (menu.startpos.y + e.y - menu.startpos.my) + 'px';
        if (menu.offsetTop < 0) menu.style.top = '0px';
        e.preventDefault();
        e.stopPropagation();
    }
});
head.addEventListener('mousedown', e => {
    menu.movement = true;
    menu.startpos = {
        x: menu.offsetLeft,
        y: menu.offsetTop,
        mx: e.x,
        my: e.y
    };
    e.preventDefault();
    e.stopPropagation();
});

let tabs = document.createElement("div")
tabs.className = "CheatTabs"
menu.appendChild(tabs)

let reset = document.createElement("input")
reset.className = "CheatButton"
reset.style = `
position: absolute;
top: 90%;
left: 50%;
transform: translate(-50%, -50%);
`;
reset.type = "button"
reset.value = "Reset"
reset.onclick = function(){
    if(window.kogamaload){
    Object.values(interface.tabsContent).forEach((tabContent)=>{
        tabContent.childNodes.forEach((node)=>{
            if(node.defaultState){
                node.defaultState()
            }
        })
    })
    }
}
menu.appendChild(reset)

let credits = document.createElement("h1")
credits.className = "CheatCredits"
credits.textContent = "Developed by Xydar"
menu.appendChild(credits)

let interface = {
    config: {
        color: "#ff370f",
        bodyColor: "#1c1b1b"
    },
    tabs: {},
    tabsContent: {},
    addTab: function(txt){
        let tab = document.createElement("input")
        tab.className = "CheatTab"
        tab.type = "button"
        tab.value = txt
        tabs.appendChild(tab)
        let content = document.createElement("div")
        content.className = "CheatTabContent"
        menu.appendChild(content)
        if(Object.values(interface.tabs).length == 0){
            tab.style.borderBottom = `2px solid ${interface.config.color}`
        }
        tab.onclick = function(){
            tab.style.borderBottom = `2px solid ${interface.config.color}`
            interface.tabsContent[txt].style.display = "block"
            Object.values(interface.tabs).forEach((Tab)=>{
                if(Tab != tab){
                    Tab.style.borderBottom = "2px solid #959596"
                }
            })
            Object.values(interface.tabsContent).forEach((Content)=>{
                if(Content != content){
                Content.style.display = "none"
                }
            })
        }
        interface.tabs[txt] = tab
        interface.tabsContent[txt] = content
    },
    addLine: function(visible, margin, tab) {
            let line = document.createElement("hr")
            if (!visible) {
                line.style.border = "none"
            }else{
                line.style.border = `1px solid ${interface.config.color}`
            }
            line.style.marginTop = `${margin/2}px`
            line.style.marginBottom = `${margin/2}px`
            interface.tabsContent[tab].appendChild(line)
        },
        addText: function(txt, tab) {
            interface.addLine(false, 30, tab)
            let text = document.createElement("p")
            text.className = "CheatText"
            text.textContent = `⠀⠀${txt}`
            window[txt] = text
            interface.tabsContent[tab].appendChild(text)
        },
        addCheckBox: function(txt, tab) {
            interface.addLine(false, 30, tab)
            let input = document.createElement("input")
            input.type = "checkbox"
            input.id = "CheatCheckBox"
            input.defaultState = function(){
                input.checked = false
            }
            let label = document.createElement("label")
            label.for = "CheatCheckBox"
            label.textContent = `${txt}⠀`
            label.className = "CheatLabel"
            input.onmouseover = function() {
                this.style.opacity = "1"
                label.style.opacity = "1"
            }
            input.onmouseout = function() {
                this.style.opacity = "0.7"
                label.style.opacity = "0.7"
            }
            label.onmouseover = function() {
                this.style.opacity = "1"
                input.style.opacity = "1"
            }
            label.onmouseout = function() {
                this.style.opacity = "0.7"
                input.style.opacity = "0.7"
            }
            interface.tabsContent[tab].appendChild(label)
            interface.tabsContent[tab].appendChild(input)
            window[txt] = input
        },
        addButton: function(txt, tab) {
            interface.addLine(false, 30, tab)
            let input = document.createElement("input")
            input.className = "CheatButton"
            input.type = "button"
            input.value = txt
            if(txt.length > 16){
                input.style.width = `${txt.length*txt.length/2}px`
            }
            interface.tabsContent[tab].appendChild(input)
            window[txt] = input
        },
        addRange: function(txt, tab) {
            interface.addLine(false, 30, tab)
            let div = document.createElement("div")
            div.className = "CheatRangeDiv"
            interface.tabsContent[tab].appendChild(div)
            let input = document.createElement("input")
            input.type = "range"
            input.id = "CheatRange"
            let label = document.createElement("label")
            label.for = "CheatRange"
            label.textContent = txt
            label.className = "CheatLabel"
            input.onmouseover = function() {
                label.style.opacity = "1"
            }
            input.onmouseout = function() {
                label.style.opacity = "0.7"
            }
            div.appendChild(label)
            div.appendChild(input)
            div.defaultState = function(){
                input.value = input.min
                input.onchange()
                label.textContent = txt
            }
            window[txt] = {
                input: input,
                label: label
            }
        },
        addSelect(txt, options, tab, confirm) {
            interface.addLine(false, 30, tab)
            let div = document.createElement("div")
            div.className = "CheatSelectDiv"
            let select = document.createElement("select")
            select.className = "CheatSelect"
            select.defaultState = function(){
                select.options[0].selected = true
            }
            select.updateOptions = function(options){
                select.options.length = 0
                let option = document.createElement("option")
                option.textContent = txt
                option.disabled = true
                option.selected = true
                select.appendChild(option)
                options.forEach((opt)=>{
                    let option = document.createElement("option")
                    option.textContent = opt
                    select.appendChild(option)
                })
            }
            let option = document.createElement("option")
            option.selected = true
            option.disabled = true
            option.textContent = txt
            select.appendChild(option)
            options.forEach((opt) => {
                let option = document.createElement("option")
                option.textContent = opt
                select.appendChild(option)
            })
            let input = document.createElement("input")
            input.className = "CheatButton"
            input.style = `
            height: 40px;
            width: 40px;
            margin-left: 10px;
            `
            input.type = "button"
            input.value = "✓"
            input.onclick = confirm
            div.appendChild(select)
            div.appendChild(input)
            interface.tabsContent[tab].appendChild(div)
            window[txt] = select
        },
        addTextField: function(txt, tab){
            interface.addLine(false, 30, tab)
            let input = document.createElement("input")
            input.className = "CheatButton"
            input.type = "text"
            input.placeholder = txt
            input.defaultState = function(){
                input.value = ""
                input.disabled = true
            }
            interface.tabsContent[tab].appendChild(input)
            window[txt] = input
        },
    addFileInput: function(name, tab){
        interface.addLine(false, 30, tab)
        let input = document.createElement("input")
        input.type = "file"
        interface.tabsContent[tab].appendChild(input)
        window[name] = input
    },
}

let css = document.createElement("style")
css.textContent = `
@charset "UTF-8";
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300&display=swap');
.CheatWaitingText {
margin-top: 150px;
color: #959596;
user-select: none;
font-family: Quicksand;
font-size: 50px;
}
.CheatOpen {
position: fixed;
z-index: 9999;
top: 0%;
left: 50%;
transform: translate(-50%, -50%);
background-color: ${interface.config.color};
height: 60px;
width: 60px;
box-shadow: 0 0 20px black;
border-radius: 50%;
-webkit-transition: box-shadow 0.5s;
transition: box-shadow 0.5s;
}
.CheatOpen:hover {
box-shadow: 0 0 40px black;
}
.CheatMenu {
position: fixed;
z-index: 9999;
top: 100px;
left: 300px;
height: 400px;
width: 650px;
background-color: ${interface.config.bodyColor ? interface.config.bodyColor : "#1c1b1b"};
border-top: 5px solid ${interface.config.color};
opacity: 95%;
animation: borderAnim 8s infinite;
box-shadow: 0 0 20px black;
font-family: Quicksand;
scrollbar-color: white #1c1b1b;
text-align: center;
justify-content: center;
}
::-webkit-scrollbar {
width: 10px;
-webkit-transition: all 0.5s;
transition: all 0.5s;
}
::-webkit-scrollbar-track {
border-radius: 10px;
}
::-webkit-scrollbar-thumb {
background: white;
border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
background: grey;
}
.CheatHead {
position: fixed;
z-index: 9999;
width: 650px;
display: flex;
justify-content: right;
align-items: right;
}
.CheatClose {
background-color: transparent;
color: white;
border: none;
height: 30px;
width: 50px;
-webkit-transition: background-color 0.5s;
transition: background-color 0.5s;
}
.CheatClose:hover {
background-color: ${interface.config.color};;
}
.CheatMinimize {
background-color: transparent;
color: white;
border: none;
height: 30px;
width: 50px;
-webkit-transition: all 0.5s;
transition: all 0.5s;
}
.CheatMinimize:hover {
background-color: white;
color: black;
}
.CheatTitle {
position: absolute;
top: 80%;
left: 50%;
transform: translate(-50%, -50%);
color: white;
font-size: 30px;
user-select: none;
}
.CheatTabs {
display: none;
position: absolute;
top: 60px;
height: 30px;
width: 100%;
}
.CheatTab {
height: 30px;
width: 70px;
color: ${interface.config.color};;
background-color: #1c1b1b;
border: none;
border-bottom: 2px solid #959596;
}
.CheatTabContent {
display: none;
position: absolute;
top: 55%;
left: 50%;
padding: 10px;
transform: translate(-50%, -50%);
text-align: left;
align-items: left;
justify-content: left;
height: 215px;
width: 600px;
overflow-y: auto;
border: 1px solid #333;
}
.CheatCredits {
user-select: none;
color: #959596;
position: absolute;
top: 90%;
left: 80%;
transform: translate(-50%, -50%);
font-size: 15px;
}
.CheatText {
color: ${interface.config.color};
font-size: 15px;
user-select: none;
}
.CheatMenu input[type="checkbox"]{
width: 13px !important;
height: 13px !important;
-webkit-appearance: none;
-moz-appearance: none;
-o-appearance: none;
appearance:none;
outline: 2px solid white;
box-shadow: none;
opacity: 0.7;
-webkit-transition: all 0.5s;
transition: all 0.5s;
}
.CheatMenu input[type="checkbox"]:checked {
background-color: ${interface.config.color};
box-sizing: border-box;
-moz-box-sizing: border-box;
-webkit-box-sizing: border-box;
border: 2px solid black;
}
.CheatLabel {
pointer-events: none;
z-index: 9999;
color: ${interface.config.color};
user-select: none;
opacity: 0.7;
-webkit-transition: all 0.5s;
transition: all 0.5s;
}
.CheatButton {
border: none;
background-color: #262626;
color: ${interface.config.color};
height: 40px;
width: 140px;
text-align: center;
box-sizing: border-box;
-moz-box-sizing: border-box;
-webkit-box-sizing: border-box;
border: 2px solid #454545;
outline: none;
opacity: 0.7;
-webkit-transition: all 0.5s;
transition: all 0.5s;
}
.CheatButton:hover {
opacity: 1;
}
.CheatRangeDiv {
width: 190px;
display: flex;
align-items: center;
justify-content: center;
}
#CheatRange {
-webkit-appearance: none;
position: absolute;
appearance: none;
background: #262626;
height: 25px;
outline: none;
opacity: 0.7;
-webkit-transition: all 0.5s;
transition: all 0.5s;
cursor: e-resize;
}
#CheatRange:hover {
opacity: 1;
}
#CheatRange::-webkit-slider-thumb {
-webkit-appearance: none;
appearance: none;
width: 10px;
height: 20px;
border: none;
background: ${interface.config.color};
}

#CheatRange::-moz-range-thumb {
background: ${interface.config.color};
width: 10px;
height: 20px;
border: none;
}
.CheatSelect {
background-color: #262626;
color: ${interface.config.color};
height: 40px;
box-sizing: border-box;
-moz-box-sizing: border-box;
-webkit-box-sizing: border-box;
border: 2px solid #454545;
opacity: 0.7;
-webkit-transition: all 0.5s;
transition: all 0.5s;
font-family: Quicksand;
}
.CheatSelect:hover {
opacity: 1;
}
`
top.document.head.appendChild(css)

top.deleteSkin = function(){
    let posx = CheatAPI.PLAYER.POS.X
    let posy = CheatAPI.PLAYER.POS.Y
    let posz = CheatAPI.PLAYER.POS.Z
    for(var x = 0; x < 10; x++){
        for(var y = 0; y < 10; y++){
            for(var z = 0; z < 10; z++){
                CheatAPI.CHEATS.REMOVE_CUBE(posx+x, posy+y, posz+z, "BOTH")
            }
        }
    }
}
document.onkeydown = function(e) {
    if (e.key == " " && window.fly) {
        for (var i = 0; i < window.fly; i++) {
            CheatAPI.CHEATS.IMPULSE(CheatAPI.PLAYER.WOID)
        }
    } else if (e.key == "1" && window.freezeplayerskey) {
        window.freezeplayers = true
    } else if (e.key == "2" && window.freezeplayerskey) {
        window.freezeplayers = false
    } else if(e.key == "3" && window.aimhelperkey) {
        CheatAPI.PLAYERS.forEach((player)=>{
            if(player.WOID != CheatAPI.PLAYER.WOID)
                CheatAPI.CHEATS.SET_SIZE(player.WOID, 5, "SERVER")
        })
    } else if(e.key == "4" && window.aimhelperkey) {
        CheatAPI.PLAYERS.forEach((player)=>{
            if(player.WOID != CheatAPI.PLAYER.WOID)
                CheatAPI.CHEATS.SET_SIZE(player.WOID, 1, "SERVER")
        })
    } else if (e.key == "]") {
        window.socks ? window.socks = false : window.socks = true
    } /*else if (e.key == "b") {
        window.aimbot ? window.aimbot = false : window.aimbot = true
        CheatAPI.SEND_SOCKET(243,4,31,0,8,22,105,...CheatAPI.FUNCTIONS.TO_BYTE_32(CheatAPI.PLAYER.WOID),74,102,67,15,107,122,75,102,66,15,82,206,76,102,194,83,165,7,77,102,191,122,94,34,78,102,62,29,121,30,79,102,190,19,31,189,254,105,0,0,0,0)
        console.log("RailBug Macro test")
        CheatAPI.SEND_SOCKET(243,4,29,0,3,22,105,...CheatAPI.FUNCTIONS.TO_BYTE_32(CheatAPI.PLAYER.WOID),70, 68, 0, 0, 0, 1, 115, 0, 11, 99, 117, 114, 114, 101, 110, 116, 73, 116, 101, 109, 68, 0, 0, 0, 3, 115, 0, 4, 116, 121, 112, 101, 105, 0, 0, 0, 1, 115, 0, 9, 118, 97, 114, 105, 97, 110, 116, 73, 100, 105, 0, 0, 0, 0, 115, 0, 15, 117, 112, 100, 97, 116, 101, 73, 116, 101, 109, 83, 116, 97, 116, 101, 105, 0, 0, 0, 4, 254, 105, 0, 0, 0, 0)
        setTimeout(()=>{
            CheatAPI.SEND_SOCKET(243,2,25,0,2,22,105,...CheatAPI.FUNCTIONS.TO_BYTE_32(CheatAPI.PLAYER.WOID),70,68,0,0,0,1,115,0,8,105,115,70,105,114,105,110,103,111,0)
        }, 50)
    }*/
}

interface.addTab("Player")
interface.addTab("Weapon")
interface.addTab("Effect")
interface.addTab("Team")
interface.addTab("Chat")
interface.addTab("Cube")
interface.addTab("Crash")
interface.addTab("Other")
interface.addCheckBox("Immortality", "Player")
window["Immortality"].onchange = function() {
    if (this.checked) {
        let woid = CheatAPI.PLAYER.WOID
        CheatAPI.CHEATS.SET_HEALTH(woid, 99999999)
        CheatAPI.CHEATS.SET_MAX_HEALTH(woid, 99999999)
        CheatAPI.SERVER_BLOCKS.push(32)
    } else {
        let woid = CheatAPI.PLAYER.WOID
        CheatAPI.CHEATS.SET_HEALTH(woid, 100)
        CheatAPI.CHEATS.SET_MAX_HEALTH(woid, 100)
        let index = CheatAPI.SERVER_BLOCKS.indexOf(32)
        CheatAPI.SERVER_BLOCKS.splice(index, index - 1)
    }
}
interface.addSelect("Change Team", Object.keys(CheatAPI.TEAM_IDS), "Team", function(){
    CheatAPI.CHEATS.CHANGE_TEAM(CheatAPI.TEAM_IDS[window["Change Team"].options[window["Change Team"].selectedIndex].textContent])
})
interface.addRange("Fly(0)", "Player")
window["Fly(0)"].input.min = 0
window["Fly(0)"].input.max = 10
window["Fly(0)"].input.value = 0
window["Fly(0)"].input.onchange = function(e) {
    window["Fly(0)"].label.textContent = `Fly(${window["Fly(0)"].input.value})`
    window.fly = parseInt(window["Fly(0)"].input.value)
}
interface.addRange("Player Size(1)", "Player")
window["Player Size(1)"].input.min = 1
window["Player Size(1)"].input.max = 100
window["Player Size(1)"].input.value = 1
window["Player Size(1)"].input.onchange = function() {
    window["Player Size(1)"].label.textContent = `Player Size(${window["Player Size(1)"].input.value})`
    CheatAPI.CHEATS.SET_SIZE(CheatAPI.PLAYER.WOID, parseInt(window["Player Size(1)"].input.value), "BOTH")
}
interface.addRange("Player Level(1)", "Player")
window["Player Level(1)"].input.min = 1
window["Player Level(1)"].input.max = 50
window["Player Level(1)"].input.value = 1
window["Player Level(1)"].input.onchange = function(){
    window["Player Level(1)"].label.textContent = `Player Level(${window["Player Level(1)"].input.value})`
    CheatAPI.CHEATS.SET_LEVEL(parseInt(window["Player Level(1)"].input.value))
}
interface.addSelect("Spawn Effect", CheatAPI.EFFECT_NAMES, "Effect", function(){
    CheatAPI.CHEATS.SPAWN_EFFECT(CheatAPI.PLAYER.WOID, CheatAPI.EFFECT_NAMES[window["Spawn Effect"].selectedIndex - 1])
})
interface.addCheckBox("Auto Fire", "Weapon")
window["Auto Fire"].onchange = function() {
    if (this.checked) {
        window.autofire = setInterval(() => {
            CheatAPI.CHEATS.IS_FIRING(0)
            CheatAPI.CHEATS.IS_FIRING(1)
        }, 5)
    } else {
        clearInterval(window.autofire)
        window.rapidfire = null
    }
}
interface.addSelect("Weapon", Object.keys(CheatAPI.ITEM_IDS), "Weapon", function(){
    CheatAPI.CHEATS.SPAWN_ITEM(CheatAPI.ITEM_IDS[window["Weapon"].options[window["Weapon"].selectedIndex].textContent])
})
interface.addSelect("Message Type", Object.keys(CheatAPI.MESSAGE_TYPE), "Chat", function(){
    window["Enter Message"].disabled = false
})
interface.addTextField("Enter Message", "Chat")
window["Enter Message"].disabled = true
window["Enter Message"].maxLength = 254
window["Enter Message"].addEventListener("keydown", function(e){
    window["Auto Spam"].disabled = false
    if(e.key == "Enter"){
        CheatAPI.CHEATS.SEND_CHAT_MESSAGE(CheatAPI.MESSAGE_TYPE[window["Message Type"].options[window["Message Type"].selectedIndex].textContent], CheatAPI.PLAYER.ACTORNR, window["Enter Message"].value)
        window["Enter Message"].value = ""
    }
})
interface.addCheckBox("Auto Spam", "Chat")
window["Auto Spam"].disabled = true
window["Auto Spam"].onchange = function(){
    if(this.checked){
        window.spam = setInterval(()=>{
        CheatAPI.CHEATS.SEND_CHAT_MESSAGE(CheatAPI.MESSAGE_TYPE[window["Message Type"].options[window["Message Type"].selectedIndex].value], CheatAPI.PLAYER.ACTORNR, window["Enter Message"].value)
        }, 100)
    }else{
        clearInterval(window.spam)
    }
}
interface.addSelect("Clone Object", Object.keys(CheatAPI.WORLD_OBJECTS), "Other", function(){
    CheatAPI.CHEATS.CLONE_OBJECT(CheatAPI.WORLD_OBJECTS[window["Clone Object"].options[window["Clone Object"].selectedIndex].textContent], CheatAPI.PLAYER.POS.X, CheatAPI.PLAYER.POS.Y, CheatAPI.PLAYER.POS.Z, "BOTH")
})
interface.addLine(true, 30, "Other")
interface.addCheckBox("Freeze Players(1 | 2)", "Other")
window["Freeze Players(1 | 2)"].onchange = function(){
    window.freezeplayers = this.checked
    window.freezeplayerskey = this.checked
}
interface.addCheckBox("Aim Helper(3 | 4)", "Other")
window["Aim Helper(3 | 4)"].onchange = function(){
    CheatAPI.PLAYERS.forEach((player)=>{
        if(player.WOID != CheatAPI.PLAYER.WOID)
            CheatAPI.CHEATS.SET_SIZE(player.WOID, this.checked ? 5 : 1, "SERVER")
    })
    window.aimhelperkey = this.checked
}
interface.addButton("Reset Terrain", "Other")
window["Reset Terrain"].onclick = function(){
    CheatAPI.CHEATS.RESET_TERRAIN()
}
interface.addButton("Capture Flag", "Other")
window["Capture Flag"].onclick = function(){
    CheatAPI.CHEATS.CAPTURE_FLAG()
}
interface.addButton("Generate World Cube", "Other")
window["Generate World Cube"].onclick = function(){
    CheatAPI.TESTE()
}
interface.addLine(true, 30, "Other")
interface.addTextField("Profile ID", "Other")
window["Profile ID"].onchange = function(){
    window["Force Friendship"].disabled = false
}
interface.addButton("Force Friendship", "Other")
window["Force Friendship"].disabled = true
window["Force Friendship"].onclick = function(){
    CheatAPI.CHEATS.REQUEST_FRIENDSHIP(parseInt(window["Profile ID"].value))
    setTimeout(()=>{
        let friendship = CheatAPI.FRIENDSHIP_INFOS
        if(friendship){
            CheatAPI.CHEATS.ACCEPT_FRIENDSHIP(friendship.FriendshipID, friendship.ID, friendship.FriendID)
        }
    }, 5000)
}
interface.addSelect("Material", Object.keys(CheatAPI.MATERIAL_IDS), "Cube", function(){
    window.material = CheatAPI.MATERIAL_IDS[window["Material"].options[window["Material"].selectedIndex].textContent]
    window["Surf"].disabled = false
})
interface.addCheckBox("Surf", "Cube")
window["Surf"].disabled = true
window["Surf"].onchange = function(){
    window.surf = this.checked
}
interface.addLine(true, 30, "Cube")
interface.addCheckBox("Twin Building", "Cube")
window["Twin Building"].onchange = function(){
    window.twinbuildings = this.checked
}
interface.addLine(true, 30, "Cube")
interface.addTextField("Text to Cubes", "Cube")
window["Text to Cubes"].onkeydown = function(e){
    if(e.key == "Enter"){
        CheatAPI.CHEATS.TEXT_TO_CUBES(this.value, "25px sans-serif")
    }
}
interface.addFileInput("Image to Cubes", "Cube")
window["Image to Cubes"].onchange = function(){
    CheatAPI.CHEATS.IMAGE_TO_CUBES(URL.createObjectURL(this.files[0]))
}
interface.addSelect("Crash Player", [], "Crash", function(){
    let WoIds = []
    CheatAPI.PLAYERS.forEach((player)=>{
        WoIds.push(player.WOID)
    })
    CheatAPI.CHEATS.CLONE_OBJECT(WoIds[window["Crash Player"].selectedIndex - 1]+2, -3.402823466E+38, -3.402823466E+38, -3.402823466E+38, "CLIENT")
})
interface.addButton("Crash All", "Crash")
window["Crash All"].onclick = function(){
    CheatAPI.PLAYERS.forEach((player)=>{
        CheatAPI.CHEATS.CLONE_OBJECT(player.WOID+2, -3.402823466E+38, -3.402823466E+38, -3.402823466E+38, "CLIENT")
    })
}
interface.addButton("Instant WebGL Crash", "Crash")
window["Instant WebGL Crash"].onclick = function(){
    CheatAPI.CHEATS.SET_SIZE(CheatAPI.PLAYER.WOID, 9999999999999999999999999999999999, "CLIENT")
    setTimeout(()=>{
        CheatAPI.CHEATS.SET_SIZE(CheatAPI.PLAYER.WOID, 1, "CLIENT")
    }, 5000)
}
interface.addCheckBox("Anti Crash", "Crash")
window["Anti Crash"].onchange = function() {
    if (this.checked) {
        CheatAPI.SERVER_BLOCKS.push(79)
        CheatAPI.SERVER_BLOCKS.push(57)
    } else {
        let index = [CheatAPI.SERVER_BLOCKS.indexOf(79), CheatAPI.SERVER_BLOCKS.indexOf(57)]
        CheatAPI.SERVER_BLOCKS.splice(index[0], index[0] - 1)
        CheatAPI.SERVER_BLOCKS.splice(index[1], index[1] - 1)
    }
}

let waitingText = document.createElement("h1")
waitingText.className = "CheatWaitingText"
waitingText.textContent = "Waiting KoGaMa..."
menu.appendChild(waitingText)

let check = setInterval(() => {
    if (window.kogamaload) {
        waitingText.remove()
        tabs.style.display = "block"
        interface.addLine(true, 30, "Other")
        interface.addText(`User Name: ${CheatAPI.PLAYER.USERNAME}`, "Other")
        interface.addText(`World Object ID: ${CheatAPI.PLAYER.WOID}`, "Other")
        interface.addText(`Actor Number: ${CheatAPI.PLAYER.ACTORNR}`, "Other")
        interface.addText("X: 0", "Other")
        interface.addText("Y: 0", "Other")
        interface.addText("Z: 0", "Other")
        Object.values(interface.tabs)[0].click()
        let players = []
        CheatAPI.PLAYERS.forEach((player)=>{
            players.push(player.USERNAME)
        })
        window["Crash Player"].updateOptions(players)
        clearInterval(check)
    }
}, 1000)
