// =============================================
// ELEMENTOS DEL DOM
// =============================================
const wordSearchGrid = document.getElementById('word-search-grid');
const wordList = document.getElementById('word-list');
const currentLevelElement = document.getElementById('current-level');
const levelThemeElement = document.getElementById('level-theme');
const completedLevelElement = document.getElementById('completed-level');
const levelProgressElement = document.getElementById('level-progress');
const prevLevelButton = document.getElementById('prev-level');
const nextLevelButton = document.getElementById('next-level');
const restartLevelButton = document.getElementById('restart-level');
const victoryModal = document.getElementById('victory-modal');
const nextLevelModalButton = document.getElementById('next-level-modal');
const tutorialModal = document.getElementById('tutorial-modal');
const startGameButton = document.getElementById('start-game');
const selectionLine = document.getElementById('selection-line');
const touchHint = document.getElementById('touch-hint');

function setTouchHint(msg) {
    if (!touchHint) return;
    if (msg) {
        touchHint.textContent = msg;
        touchHint.classList.add('visible');
    } else {
        touchHint.classList.remove('visible');
    }
}

// =============================================
// VARIABLES GLOBALES
// =============================================
let currentLevel = 1;
let selectedCells = [];
let foundWords = [];
let gridSize = 10;
let firstTimePlayer = true;

// Estado de selección táctil: toque en primera y última letra
let touchMode = false;       // true si estamos en modo táctil
let firstTouchCell = null;   // primera celda tocada
let isSelectingTouch = false; // si se está esperando segunda celda

// Estado de selección por mouse (arrastre)
let isDragging = false;
let dragStartCell = null;

// =============================================
// DATOS DE NIVELES
// =============================================
const levels = [
    // Nivel 1 - Frutas (10x10)
    {
        theme: "Frutas",
        words: ["MANZANA", "LULO", "NARANJA", "FRESA", "PERA", "UVA"],
        grid: [
            "MANZANAELH",
            "QWERTAPLUL",
            "GHUIOPRJLH",
            "FRASDFGLOK",
            "HJPERATRAG",
            "QWFRESAOYA",
            "YUIOPUVAUB",
            "ASDFGHJKLU",
            "NARANJAQWN",
            "QWERTYUIOA"
        ],
        bgClass: "level-bg-1"
    },
    // Nivel 2 - Animales
    {
        theme: "Animales",
        words: ["PERRO", "GATO", "LEON", "TIGRE", "OSO", "LOBO"],
        grid: [
            "ABCDEFGHID",
            "QPERROERTH",
            "GATOWEUYIA",
            "LKJHGFDSAO",
            "QWEOSORTYL",
            "POIUYTEOBT",
            "LKJHGOBOLC",
            "LEONZXCVBG",
            "TIGREASDFT",
            "ZXCVBNMLKO"
        ],
        bgClass: "level-bg-2"
    },
    // Nivel 3 - Colores
    {
        theme: "Colores",
        words: ["ROJO", "AZUL", "VERDE", "NEGRO", "BLANCO", "GRIS"],
        grid: [
            "QWERTYUIOR",
            "ASDFGHJKLE",
            "ZROJOXCVBB",
            "AZULQWEROV",
            "YUVERDEICA",
            "PASDFGHJNG",
            "LZXCVBNMAP",
            "NEGROQBLLV",
            "QWGRISDNBL",
            "ASDFGHJKOÑ"
        ],
        bgClass: "level-bg-3"
    },
    // Nivel 4 - Países
    {
        theme: "Países",
        words: ["ESPAÑA", "FRANCIA", "ITALIA", "CHINA", "BRASIL", "INDIA"],
        grid: [
            "QWERTYUIOF",
            "ESPAÑADFGT",
            "ASDFGHJKLL",
            "LKJFHSGFDI",
            "FRANCIAKZS",
            "XCVTBNIDQA",
            "CHINABDASR",
            "LKJHAFNLKB",
            "QWERTYIDIV",
            "ITALIASDQQ"
        ],
        bgClass: "level-bg-4"
    },
    // Nivel 5 - Astronomía
    {
        theme: "Astronomía",
        words: ["TIERRA", "MARTE", "VENUS", "JUPITER", "SATURNO", "URANO"],
        grid: [
            "JUPITERZXU",
            "QWERTYUIOC",
            "MARTEVCBNR",
            "LKJHGFDSAR",
            "TIERRAQWEI",
            "VENUSZXCVE",
            "BNMSATURNO",
            "QWERTYUIOM",
            "URANOLKJHO",
            "POIUYTREWQ"
        ],
        bgClass: "level-bg-5"
    },
    // Nivel 6 - Deportes
    {
        theme: "Deportes",
        words: ["FUTBOL", "TENIS", "GOLF", "BOXEO", "SURF", "JUDO"],
        grid: [
            "FUTBOLQWER",
            "AALMNCGTEN",
            "SALUJWREEX",
            "DALPKYANHG",
            "FAOITFIIDO",
            "GAQRNCSSGL",
            "HVOLAFADLF",
            "IWTKKSURFO",
            "JZQBMBOXEO",
            "JUDOXKJHGF"
        ],
        bgClass: "level-bg-6"
    },
    // Nivel 7 - Profesiones
    {
        theme: "Profesiones",
        words: ["DOCTOR", "MAESTRO", "ACTOR", "BOMBERO", "PILOTO", "COCINERO"],
        grid: [
            "DLMDEACTOR",
            "OLZOACGCRR",
            "CGMWTCVIOP",
            "TQEISOKBMB",
            "OBAWRRQOEO",
            "RMCETUCMER",
            "MAESTROBYT",
            "UJNIBVCEZD",
            "PILOTODRGA",
            "COCINEROLK"
        ],
        bgClass: "level-bg-7"
    },
    // Nivel 8 - Ropa
    {
        theme: "Ropa",
        words: ["CAMISA", "FALDA", "ZAPATOS", "ABRIGO", "GORRA", "VESTIDO"],
        grid: [
            "ZAPATOSLKA",
            "ARUHTYUIOB",
            "PGORRAQVER",
            "OLKMNJUEOI",
            "CAHJNKISOG",
            "AHFALDATXO",
            "MBRIGHJILO",
            "IQWERTYDIO",
            "CAMISAQOER",
            "ALKSJDHGFD"
        ],
        bgClass: "level-bg-8"
    },
    // Nivel 9 - Instrumentos
    {
        theme: "Instrumentos",
        words: ["PIANO", "VIOLIN", "FLAUTA", "TAMBOR", "BAJO", "ARPA"],
        grid: [
            "PFLAUTAZXQ",
            "IAXMVNBQWE",
            "AVZBCXMNPO",
            "NTAMBOREWU",
            "OBXQWTYUIO",
            "RLEISADFGH",
            "BVIOLINMNB",
            "AASDFGHJKL",
            "JQWEARPAIO",
            "OPIULKJHGF"
        ],
        bgClass: "level-bg-9"
    },
    // Nivel 10 - Muebles
    {
        theme: "Muebles",
        words: ["MESA", "SILLA", "SOFA", "CAMA", "ESPEJO", "LAMPARA"],
        grid: [
            "KVDAZXCVBN",
            "APLKMNBECX",
            "SILLARTSYU",
            "CLKAQWEPTY",
            "SOFAZXCEMN",
            "QWERTYUJOP",
            "MXTUJCJOAS",
            "ELAMPARAKL",
            "SVBCXMEMTY",
            "AASWEACAFR"
        ],
        bgClass: "level-bg-10"
    },
    // Nivel 11 - Flores
    {
        theme: "Flores",
        words: ["ROSA", "DALIA", "TULIPAN", "LIRIO", "JAZMIN", "ORQUIDEA"],
        grid: [
            "LKDOIRILNM",
            "QWAPLNIOAO",
            "PLLLBIEUFR",
            "OKIHGMDSAQ",
            "ZXAVBZMLRU",
            "TULIPANQOI",
            "AZXORJUISD",
            "POIUYTREAE",
            "LKJHGFDSAA",
            "JAZMINQWEK"
        ],
        bgClass: "level-bg-11"
    },
    // Nivel 12 - Partes de la casa
    {
        theme: "Partes de la casa",
        words: ["COCINA", "BALCON", "BAÑO", "SALA", "JARDIN", "GARAJE", "DORMITORIO"],
        grid: [
            "LKEBFDQWER",
            "ZXJVBASALA",
            "BNAKOORFJC",
            "DORMITORIO",
            "LKAHGFDSAC",
            "ASGFGHJKLI",
            "PÑGKJHGARN",
            "BAÑOZXCVBA",
            "QWENIDRAJP",
            "MNBALCONJH"
        ],
        bgClass: "level-bg-12"
    },
    // Nivel 13 - Medios de transporte
    {
        theme: "Medios de transporte",
        words: ["COCHE", "TREN", "AVION", "BARCO", "MOTO", "BICICLETA", "METRO"],
        grid: [
            "AVIONBUUFA",
            "LZXCVMOTOT",
            "BICICLETAR",
            "PLKMNBVCXE",
            "COCHEPLKMN",
            "QWERTBUIOP",
            "LKJHGADSMZ",
            "JGVMORWEOT",
            "METROCXCTB",
            "MNBVCOZLOJ"
        ],
        bgClass: "level-bg-13"
    },
    // Nivel 14 - Comidas
    {
        theme: "Comidas",
        words: ["ARROZ", "PIZZA", "ENSALADA", "SOPA", "GALLETAS", "TACO", "PASTA"],
        grid: [
            "LOFBDUJUFO",
            "QWERTYUIOP",
            "ENSALADAZX",
            "LKJHGFASAS",
            "TACOKHTAQO",
            "MNBVCXSLKP",
            "SATELLAGRA",
            "ZXCVBNPASD",
            "PIZZARROZL",
            "LKJHGFDSAQ"
        ],
        bgClass: "level-bg-14"
    },
    // Nivel 15 - Escuela
    {
        theme: "Escuela",
        words: ["LAPIZ", "CUADERNO", "BORRADOR", "REGLA", "MOCHILA", "TIZA", "COLOR"],
        grid: [
            "CUADERNOBB",
            "OQWERTYUOO",
            "LUISXARTRK",
            "PLMNBVEXRE",
            "LAPIZSGUAA",
            "JUGNKQLEDT",
            "MOCHILAZOT",
            "YTREWQTIRI",
            "ROLOCLAPOZ",
            "LKJHGFDSAA"
        ],
        bgClass: "level-bg-15"
    },
    // Nivel 16 - Clima
    {
        theme: "Clima",
        words: ["LLUVIA", "TORMENTA", "NIEVE", "VIENTO", "SOL", "NUBES", "GRANIZO"],
        grid: [
            "TORMENTAZA",
            "QWERTYUVIE",
            "SEBUNSEXCV",
            "QAZWSXGDCR",
            "LLUVIARWER",
            "MNBVCXAASD",
            "NIEVELNJHG",
            "YTREWQIKJL",
            "NUBAIZZQWO",
            "ZVIENTOFLS"
        ],
        bgClass: "level-bg-16"
    },
    // Nivel 17 - Cuentos de Hadas
    {
        theme: "Cuentos de Hadas",
        words: ["HADA", "DRAGON", "PRINCIPE", "HECHIZO", "CASTILLO", "MAGIA", "BRUJA"],
        grid: [
            "HUJKOLQDER",
            "MAGIAOLRJU",
            "QWERTYHADA",
            "ZXCASDFGHJ",
            "CASTILLONB",
            "YAIOPBRNJA",
            "LJJHECHIZO",
            "MUPRINCIPE",
            "ARDOZIHCEH",
            "PBIUYTREWA"
        ],
        bgClass: "level-bg-17"
    },
    // Nivel 18 - Ciencias
    {
        theme: "Ciencia",
        words: ["QUIMICA", "FISICA", "BIOLOGIA", "ATOMO", "CELULA", "GEN", "ENERGIA"],
        grid: [
            "ACIMIUQZRX",
            "XWXYLJXAXB",
            "FISICAKCAI",
            "XPZOBOLOIO",
            "CELULAHHGL",
            "ZBCNLTAORO",
            "YQAEXOLNEG",
            "LODGSMBFNI",
            "AFTEROYUEA",
            "YHLQMDLGKK"
        ],
        bgClass: "level-bg-18"
    },
    // Nivel 19 - Cine
    {
        theme: "Cine",
        words: ["PELICULA", "DIRECTOR", "ACTOR", "ESCENA", "CAMARA", "GUION", "CINE"],
        grid: [
            "LOCAMARAOP",
            "QWELDHJKLA",
            "ZXCUIUIONB",
            "YUICRACLON",
            "HJKIEXZFDO",
            "ECCLCACWEI",
            "OPCETRITYU",
            "CVBPOLNJHG",
            "ACTORNEASD",
            "TGBDANECSE"
        ],
        bgClass: "level-bg-19"
    },
    // Nivel 20 - Mitología Griega
    {
        theme: "Dioses Griegos",
        words: ["ZEUS", "HADES", "HERA", "POSEIDON", "ATENEA", "AFRODITA", "APOLO"],
        grid: [
            "ZSATIDORFA",
            "EESATGHJKL",
            "UDDFGHODAN",
            "SAEITAMNTO",
            "BHCVBNMZED",
            "NHATENEANI",
            "POLOPARSLE",
            "LKJHGFDSAS",
            "AKJOUHERTO",
            "MAREHZXCVP"
        ],
        bgClass: "level-bg-20"
    },
    // Nivel 21 - La Ciudad
    {
        theme: "La Ciudad",
        words: ["CALLE", "BANCO", "EDIFICIO", "PARQUE", "PLAZA", "MERCADO", "PUENTE"],
        grid: [
            "PAQUAQWERP",
            "LZXCVBNUOE",
            "AAOCNABTIU",
            "CSEMEFARCO",
            "LOIFLCNOIQ",
            "AYUILPCKFA",
            "MERCADOBIZ",
            "BVCXCLKJDA",
            "UYEUQRAPEL",
            "PUENTEJKLP"
        ],
        bgClass: "level-bg-21"
    },
    // Nivel 22 - Herramientas
    {
        theme: "Herramientas",
        words: ["MARTILLO", "LIMA", "SIERRA", "LLAVE", "TALADRO", "CLAVO", "TIJERAS"],
        grid: [
            "QWETALADRO",
            "ZXCIAVMLIK",
            "OVALCEALYU",
            "SSTIJERASU",
            "ILAVEXTVBN",
            "EGFDSAIEER",
            "RODKFJLJPO",
            "RBVCXZLKJH",
            "AIAMILOERS",
            "MIDLZXCVBN"
        ],
        bgClass: "level-bg-22"
    },
    // Nivel 23 - Cuerpo Humano
    {
        theme: "Cuerpo Humano",
        words: ["CABEZA", "PECHO", "PIERNA", "MANO", "OJO", "OREJA", "BRAZO"],
        grid: [
            "XZCLODGDFK",
            "QWEMRNOUDI",
            "ASDPECHOSB",
            "JAZWJXEDSC",
            "OIDCAGVFAA",
            "LKJOAFDSNB",
            "TYUJOLODRE",
            "MANOLÑMNEZ",
            "MNOJJXZQIA",
            "AOZARBDLPI"
        ],
        bgClass: "level-bg-23"
    },
    // Nivel 24 - Piratas
    {
        theme: "Piratas",
        words: ["BARCO", "TESORO", "MAPA", "ESPADA", "ISLA", "BRUJULA", "CAPITAN"],
        grid: [
            "BMAPAMKLIO",
            "AWECAPITAN",
            "ROROSETNOB",
            "CJKIOSAQWR",
            "OSLAVPRGTU",
            "ZXCVBAUJUJ",
            "QAZWSDEDCU",
            "POISLAREWL",
            "LKJHGFDSAA",
            "MNBCXZQWER"
        ],
        bgClass: "level-bg-24"
    },
    // Nivel 25 - Videojuegos
    {
        theme: "Videojuegos",
        words: ["MARIO", "ZELDA", "SONIC", "FORTNITE", "PACMAN", "TETRIS", "MINECRAFT"],
        grid: [
            "OIRAMPLKJH",
            "QETINTROFN",
            "ASDFNJSHAU",
            "ZXCVBNSQWE",
            "PLKEANITYA",
            "CNJKOURITD",
            "IONILGTJKL",
            "NAMCAPEDFE",
            "OOIUYTTEWZ",
            "STFARCENIM"
        ],
        bgClass: "level-bg-25"
    },
    // Nivel 26 - Medicina
    {
        theme: "Medicina",
        words: ["DOCTOR", "ENFERMERA", "HOSPITAL", "VACUNA", "JERINGA", "PASTILLA", "CURA"],
        grid: [
            "DOCTORQWEA",
            "LPASTILLAE",
            "OAGNIREJDN",
            "SDFGRTILLF",
            "HOSPITALYE",
            "JERINGÑBNR",
            "ZXCVBNMLKM",
            "QANUCAVIOE",
            "ASDFGHJKLR",
            "CURAZXCVBA"
        ],
        bgClass: "level-bg-26"
    },
    // Nivel 27 - Tecnología
    {
        theme: "Tecnología",
        words: ["COMPUTADOR", "INTERNET", "ROBOT", "SOFTWARE", "HARDWARE", "CABLE", "RED"],
        grid: [
            "IAMAFLYKIT",
            "AQWERTYUIE",
            "DHARDWAREN",
            "COMPUTADOR",
            "ZXCVBNMLKE",
            "QWSOGEERYT",
            "RTYUIOPADN",
            "FCABLENMEI",
            "GHJKTOBORT",
            "ZRERAWTFOS"
        ],
        bgClass: "level-bg-27"
    },
    // Nivel 28 - Mitología Nórdica
    {
        theme: "Mitología Nórdica",
        words: ["ODIN", "THOR", "LOKI", "VALHALLA", "RAGNAROK", "FREYA", "ASGARD"],
        grid: [
            "TNUYTFDRAS",
            "QROHTYUIOP",
            "VALHALLAUI",
            "ASDFGHJSLÑ",
            "ZXCVBNMGSD",
            "LIDFGTGAJA",
            "KORANGARMY",
            "QAZWSXEDCE",
            "ODINPLKJHR",
            "MNLOKIZQWF"
        ],
        bgClass: "level-bg-28"
    },
    // Nivel 29 - Inventos
    {
        theme: "Inventos",
        words: ["TELEFONO", "AVION", "IMPRENTA", "BOMBILLA", "RADIO", "TELEVISION", "RUEDA"],
        grid: [
            "RJSUASGSAT",
            "AWERTYUIOE",
            "DSOIDARKLL",
            "ISKAHJSJRE",
            "ALLIBMOBFF",
            "IMPRENTAHO",
            "QAZWSXEDCN",
            "RUEDADARGO",
            "PLMNONOIVA",
            "TELEVISION"
        ],
        bgClass: "level-bg-29"
    },
    // Nivel 30 - Océanos
    {
        theme: "Océanos",
        words: ["PACIFICO", "SALADO", "INDICO", "ARTICO", "ANTARTICO", "CORAL", "OLAS"],
        grid: [
            "PAPOIREIXA",
            "AOERTYUIOR",
            "CCDARTICOT",
            "IICOBNMNBI",
            "FTTCRTICOC",
            "IRJIGFDSAO",
            "CAODALASSN",
            "OTJNLCORAL",
            "QNZISWEDLV",
            "IAGERYYWOR"
        ],
        bgClass: "level-bg-30"
    },
    // Nivel 31 - Desastres Naturales (12x12)
    {
        theme: "Desastres Naturales",
        words: ["TERREMOTO", "TSUNAMI", "HURACAN", "TORNADO", "ERUPCION", "INUNDACION", "SEQUIA", "AVALANCHA", "INCENDIO"],
        grid: [
            "DTEAOSEQUIAS",
            "QEERTYUIOPLA",
            "ARDFGHJKDÑLX",
            "ZRCUARNDACON",
            "VENMASDFNHIO",
            "QMMSEQURRYCI",
            "POKJHGFDOAAC",
            "MTSUNAMITODP",
            "IOYTREWQASNU",
            "OPINCENDIOUR",
            "AHCNALAVAQNE",
            "HURACANMNBIC"
        ],
        bgClass: "level-bg-31"
    },
    // Nivel 32 - Energías Renovables
    {
        theme: "Energías Renovables",
        words: ["SOLAR", "EOLICA", "HIDRICA", "GEOTERMICA", "BIOMASA", "MARINA", "NUCLEAR", "RENOVABLE", "SALUD"],
        grid: [
            "ELBAVONERDIR",
            "QMARINALAVTA",
            "ASDHIDRICAUL",
            "ZXCGSALUDRMO",
            "ASAMOIBAOLKS",
            "TYURENLVABLC",
            "FGHMARONADFA",
            "QAZWSOSPROWC",
            "EOLICATGBHYU",
            "NUCLEAROPADD",
            "QWERTYUIOPLK",
            "GACIMRETOEGG"
        ],
        bgClass: "level-bg-32"
    },
    // Nivel 33 - Civilizaciones Antiguas
    {
        theme: "Civilizaciones Antiguas",
        words: ["EGIPCIA", "ROMANA", "GRIEGA", "MAYA", "AZTECA", "CHINA", "INCA", "MESOPOTAMIA", "VIKINGA"],
        grid: [
            "EGIPCIAROAAN",
            "QWERTYYIONAF",
            "SDFGHJALÑAFX",
            "CHINAMMEYMQV",
            "APTERACHIOAA",
            "ZXCVBNMIARAG",
            "MESOPOTAMIAN",
            "LKJHGFDZAZXI",
            "QAZWSXETCRFK",
            "TGBYHNUEMIKI",
            "AGEIRGUCSFYV",
            "LDSLUHIACNIV"
        ],
        bgClass: "level-bg-33"
    },
    // Nivel 34 - Monumentos Famosos
    {
        theme: "Monumentos Famosos",
        words: ["TORRE", "COLISEO", "TAJ", "MURALLA", "BIGBEN", "PIRAMIDE", "CRISTO", "PETRA", "PARTENON"],
        grid: [
            "TASDFWQERTYU",
            "QWECOLISEOIP",
            "ASDGSDOLOJHG",
            "ZXCMURALEABN",
            "BIGBENQWSRTY",
            "POEDIMARIPEU",
            "LKJHGTDSLCRT",
            "PETRAAXCOBNE",
            "QAZWSJEDCRFR",
            "TGBPARTENONR",
            "PLMALLARUMAO",
            "BVCRISTOQWET"
        ],
        bgClass: "level-bg-34"
    },
    // Nivel 35 - Tipos de Árboles
    {
        theme: "Tipos de Árboles",
        words: ["ROBLE", "PINO", "CEDRO", "ABETO", "SAUCE", "OLIVO", "PALMA", "EUCALIPTO", "CIPRES"],
        grid: [
            "QWERYAMLAPOD",
            "SDFGHJALÑZVD",
            "EXCVBNBASDIF",
            "UCEDROEDCRLJ",
            "COGBYHTUJMOT",
            "ANLPÑQOERTYB",
            "LIOPASDFGHJE",
            "IPZXCVBNMQAL",
            "PSXEDCRFVTGB",
            "TCIPRESIKOLO",
            "OÑROBLOXDIOR",
            "PAECUASEKLZW"
        ],
        bgClass: "level-bg-35"
    },
    // Nivel 36 - Minerales y Piedras Preciosas
    {
        theme: "Minerales y Piedras Preciosas",
        words: ["DIAMANTE", "ESMERALDA", "ZAFIRO", "RUBI", "AMATISTA", "CUARZO", "TOPACIO", "ORO", "TURMALINA"],
        grid: [
            "QWEATSITAMAF",
            "SDFGHJKLÑZXA",
            "ZXKUARDNSDFD",
            "QAZWSOZRAUCL",
            "VOICAPOTJMIA",
            "IOLPÑQWERTYR",
            "BIOPASDFGHJE",
            "UETNAMAIDAAM",
            "RSXEORIFAZGS",
            "BYHNUJMIKOLE",
            "TURMALINAKDA",
            "POROFGHJKLZY"
        ],
        bgClass: "level-bg-36"
    }
];

// =============================================
// FUNCIONES DE DIRECCIÓN (FUERA DE generateLevel)
// =============================================

/**
 * Calcula la dirección entre dos celdas (fila/col).
 * Devuelve {dr, dc} o null si no es una línea válida.
 */
function calculateDirection(startRow, startCol, endRow, endCol) {
    const dr = endRow - startRow;
    const dc = endCol - startCol;

    if (dr === 0 && dc === 0) return null;

    // Horizontal
    if (dr === 0) return { dr: 0, dc: dc > 0 ? 1 : -1 };
    // Vertical
    if (dc === 0) return { dr: dr > 0 ? 1 : -1, dc: 0 };
    // Diagonal (solo si ratio es ~1:1)
    if (Math.abs(dr) === Math.abs(dc)) {
        return { dr: dr > 0 ? 1 : -1, dc: dc > 0 ? 1 : -1 };
    }

    return null; // No es una línea válida
}

/**
 * Devuelve el array de elementos DOM de celda entre start y end en la dirección dada.
 */
function getCellsInLine(startRow, startCol, direction, steps) {
    const cells = [];
    for (let i = 0; i <= steps; i++) {
        const row = startRow + i * direction.dr;
        const col = startCol + i * direction.dc;
        const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
        if (cell) cells.push(cell);
    }
    return cells;
}

/**
 * Devuelve las celdas entre dos puntos de la cuadrícula, si forman una línea válida.
 */
function getCellsBetween(startCell, endCell) {
    const startRow = parseInt(startCell.dataset.row);
    const startCol = parseInt(startCell.dataset.col);
    const endRow = parseInt(endCell.dataset.row);
    const endCol = parseInt(endCell.dataset.col);

    const direction = calculateDirection(startRow, startCol, endRow, endCol);
    if (!direction) return [];

    const steps = Math.max(Math.abs(endRow - startRow), Math.abs(endCol - startCol));
    return getCellsInLine(startRow, startCol, direction, steps);
}

// =============================================
// INICIALIZACIÓN
// =============================================

function initGame() {
    loadLevel(currentLevel);
    setupEventListeners();

    if (firstTimePlayer) {
        setTimeout(showTutorial, 500);
    }
}

function loadLevel(levelIndex) {
    selectedCells = [];
    foundWords = [];
    firstTouchCell = null;
    isSelectingTouch = false;
    isDragging = false;
    dragStartCell = null;

    if (levelIndex <= 30) {
        gridSize = 10;
    } else if (levelIndex <= 70) {
        gridSize = 12;
    } else {
        gridSize = 15;
    }

    const level = levelIndex <= levels.length
        ? levels[levelIndex - 1]
        : generateLevel(levelIndex);

    currentLevelElement.textContent = levelIndex;
    completedLevelElement.textContent = levelIndex;
    document.body.className = level.bgClass || `level-bg-${(levelIndex % 100) + 1}`;
    levelThemeElement.textContent = level.theme;

    createGrid(level);
    displayWordList(level.words);
    updateProgressBar(0);

    prevLevelButton.disabled = levelIndex === 1;
    nextLevelButton.disabled = levelIndex === 100;

    // Limpiar línea de selección
    selectionLine.style.opacity = '0';
}

// =============================================
// CUADRÍCULA
// =============================================

function createGrid(level) {
    wordSearchGrid.innerHTML = '';
    wordSearchGrid.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = row;
            cell.dataset.col = col;

            if (level.grid && level.grid[row] && level.grid[row][col]) {
                cell.textContent = level.grid[row][col];
            } else {
                cell.textContent = getRandomLetter();
            }

            wordSearchGrid.appendChild(cell);
        }
    }
}

function displayWordList(words) {
    wordList.innerHTML = '';
    words.forEach(word => {
        const li = document.createElement('li');
        li.textContent = word;
        li.dataset.word = word;
        wordList.appendChild(li);
    });
}

// =============================================
// EVENTOS
// =============================================

function setupEventListeners() {
    // ---- MOUSE (arrastrar) ----
    wordSearchGrid.addEventListener('mousedown', onMouseDown);
    wordSearchGrid.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseup', onMouseUp);

    // ---- TOUCH (toque primera + última celda) ----
    wordSearchGrid.addEventListener('touchstart', onTouchStart, { passive: false });
    wordSearchGrid.addEventListener('touchmove', onTouchMove, { passive: false });
    wordSearchGrid.addEventListener('touchend', onTouchEnd, { passive: false });

    // ---- NAVEGACIÓN ----
    prevLevelButton.addEventListener('click', () => {
        if (currentLevel > 1) { currentLevel--; loadLevel(currentLevel); }
    });
    nextLevelButton.addEventListener('click', () => {
        if (currentLevel < 100) { currentLevel++; loadLevel(currentLevel); }
    });
    restartLevelButton.addEventListener('click', () => loadLevel(currentLevel));
    nextLevelModalButton.addEventListener('click', () => {
        hideVictoryModal();
        if (currentLevel < 100) { currentLevel++; loadLevel(currentLevel); }
    });
    startGameButton.addEventListener('click', hideTutorial);
}

// =============================================
// SELECCIÓN POR MOUSE (arrastre)
// =============================================

function onMouseDown(e) {
    const cell = e.target.closest('.cell');
    if (!cell) return;
    isDragging = true;
    dragStartCell = cell;
    touchMode = false;
    updateSelection([cell]);
}

function onMouseOver(e) {
    if (!isDragging || !dragStartCell) return;
    const cell = e.target.closest('.cell');
    if (!cell) return;

    const cells = getCellsBetween(dragStartCell, cell);
    if (cells.length > 0) {
        updateSelection(cells);
    }
}

function onMouseUp(e) {
    if (!isDragging) return;
    isDragging = false;

    if (selectedCells.length > 0) {
        checkSelectedWord();
    }

    clearSelectionVisuals();
    dragStartCell = null;
}

// =============================================
// SELECCIÓN POR TOQUE (primera + última celda)
// =============================================

function onTouchStart(e) {
    e.preventDefault();
    touchMode = true;

    const touch = e.touches[0];
    const cell = getCellFromPoint(touch.clientX, touch.clientY);
    if (!cell) return;

    if (!isSelectingTouch) {
        // Primera celda: iniciar selección
        firstTouchCell = cell;
        isSelectingTouch = true;
        updateSelection([cell]);
        cell.classList.add('touch-first');
        provideTactileFeedback('start');
        setTouchHint('Ahora toca la última letra');
    }
}

function onTouchMove(e) {
    e.preventDefault();
    if (!isSelectingTouch || !firstTouchCell) return;

    const touch = e.touches[0];
    const cell = getCellFromPoint(touch.clientX, touch.clientY);
    if (!cell) return;

    // Previsualizar la selección mientras se arrastra
    const cells = getCellsBetween(firstTouchCell, cell);
    if (cells.length > 0) {
        updateSelection(cells);
    } else {
        updateSelection([firstTouchCell]);
    }
}

function onTouchEnd(e) {
    e.preventDefault();
    if (!isSelectingTouch || !firstTouchCell) return;

    const touch = e.changedTouches[0];
    const cell = getCellFromPoint(touch.clientX, touch.clientY);

    if (cell && cell !== firstTouchCell) {
        // Segunda celda: confirmar selección
        const cells = getCellsBetween(firstTouchCell, cell);
        if (cells.length > 0) {
            updateSelection(cells);
            checkSelectedWord();
        } else {
            // No forma línea válida: mostrar error y reiniciar
            showInvalidSelection();
        }
    } else if (cell && cell === firstTouchCell) {
        // Toque en la misma celda: cancelar
        showInvalidSelection();
    }

    // Limpiar estado táctil
    clearTouchFirst();
    clearSelectionVisuals();
    firstTouchCell = null;
    isSelectingTouch = false;
    setTouchHint('Toca la primera letra de la palabra');
    setTimeout(() => setTouchHint(''), 1500);
}

function clearTouchFirst() {
    document.querySelectorAll('.touch-first').forEach(c => c.classList.remove('touch-first'));
}

function getCellFromPoint(x, y) {
    const el = document.elementFromPoint(x, y);
    return el && el.classList.contains('cell') ? el : (el && el.closest('.cell'));
}

// =============================================
// LÓGICA DE SELECCIÓN COMÚN
// =============================================

function updateSelection(cells) {
    // Limpiar selección visual previa (no celdas ya encontradas)
    clearHighlightedCells();
    selectedCells = cells;
    cells.forEach(cell => {
        if (!cell.classList.contains('found')) {
            cell.classList.add('selected');
        }
    });
    drawSelectionLine(cells);
}

function clearSelectionVisuals() {
    clearHighlightedCells();
    selectedCells = [];
    selectionLine.style.opacity = '0';
}

function clearHighlightedCells() {
    document.querySelectorAll('.cell.selected').forEach(cell => {
        cell.classList.remove('selected');
    });
}

function drawSelectionLine(cells) {
    if (cells.length < 2) {
        selectionLine.style.opacity = '0';
        return;
    }

    const firstRect = cells[0].getBoundingClientRect();
    const lastRect = cells[cells.length - 1].getBoundingClientRect();
    const gridRect = wordSearchGrid.getBoundingClientRect();

    const x1 = firstRect.left + firstRect.width / 2 - gridRect.left;
    const y1 = firstRect.top + firstRect.height / 2 - gridRect.top;
    const x2 = lastRect.left + lastRect.width / 2 - gridRect.left;
    const y2 = lastRect.top + lastRect.height / 2 - gridRect.top;

    const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

    selectionLine.style.width = `${length}px`;
    selectionLine.style.left = `${x1}px`;
    selectionLine.style.top = `${y1}px`;
    selectionLine.style.transform = `rotate(${angle}deg)`;
    selectionLine.style.opacity = '1';
}

// =============================================
// VERIFICACIÓN DE PALABRA
// =============================================

function checkSelectedWord() {
    if (selectedCells.length < 2) return;

    const selectedWord = selectedCells.map(cell => cell.textContent.trim()).join('');
    const level = currentLevel <= levels.length
        ? levels[currentLevel - 1]
        : generateLevel(currentLevel);

    if (level.words.includes(selectedWord) && !foundWords.includes(selectedWord)) {
        // ¡Palabra encontrada!
        provideTactileFeedback('found');

        selectedCells.forEach(cell => {
            cell.classList.remove('selected');
            cell.classList.add('found', 'celebrate');
            setTimeout(() => cell.classList.remove('celebrate'), 500);
        });

        foundWords.push(selectedWord);

        const wordEl = document.querySelector(`#word-list li[data-word="${selectedWord}"]`);
        if (wordEl) {
            wordEl.classList.add('found', 'pulse');
            setTimeout(() => wordEl.classList.remove('pulse'), 500);
        }

        updateProgressBar(foundWords.length / level.words.length * 100);
        checkLevelCompletion(level);
    } else {
        // Palabra no válida
        selectedCells.forEach(cell => {
            if (!cell.classList.contains('found')) {
                cell.classList.add('shake');
                setTimeout(() => cell.classList.remove('shake'), 300);
            }
        });
    }
}

function showInvalidSelection() {
    selectedCells.forEach(cell => {
        if (!cell.classList.contains('found')) {
            cell.classList.add('shake');
            setTimeout(() => cell.classList.remove('shake'), 300);
        }
    });
}

// =============================================
// PROGRESO Y VICTORIA
// =============================================

function updateProgressBar(percentage) {
    levelProgressElement.style.width = `${percentage}%`;
}

function checkLevelCompletion(level) {
    if (foundWords.length === level.words.length) {
        setTimeout(showVictoryModal, 800);
    }
}

function showVictoryModal() { victoryModal.classList.add('active'); }
function hideVictoryModal() { victoryModal.classList.remove('active'); }
function showTutorial() { tutorialModal.classList.add('active'); firstTimePlayer = false; }
function hideTutorial() { tutorialModal.classList.remove('active'); }

// =============================================
// FEEDBACK HÁPTICO
// =============================================

function provideTactileFeedback(type = 'light') {
    if (!navigator.vibrate) return;
    switch (type) {
        case 'start':  navigator.vibrate(30); break;
        case 'found':  navigator.vibrate([100, 50, 100]); break;
        default:       navigator.vibrate(20);
    }
}

// =============================================
// LETRAS ALEATORIAS
// =============================================

function getRandomLetter() {
    return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)];
}

// =============================================
// GENERACIÓN AUTOMÁTICA DE NIVELES (37-100)
// =============================================

function generateLevel(levelIndex) {
    let size, wordCount, wordDirections;

    if (levelIndex <= 30) {
        size = 10; wordCount = 6;
        wordDirections = ['horizontal', 'vertical'];
    } else if (levelIndex <= 70) {
        size = 12; wordCount = 9;
        wordDirections = levelIndex > 50
            ? ['horizontal', 'vertical', 'horizontalReverse', 'verticalReverse']
            : ['horizontal', 'vertical'];
    } else {
        size = 15; wordCount = 12;
        wordDirections = ['horizontal', 'vertical', 'horizontalReverse', 'verticalReverse'];
        if (levelIndex >= 60) wordDirections.push('diagonal');
    }

    const themes = [
        { name: "Frutas",        words: ["MANZANA","PLATANO","NARANJA","FRESA","PERA","UVA","MELON","SANDIA","KIWI","PIÑA","CEREZA","MANGO"] },
        { name: "Animales",      words: ["PERRO","GATO","LEON","TIGRE","OSO","LOBO","JIRAFA","ELEFANTE","CEBRA","MONO","ZORRO","AGUILA"] },
        { name: "Colores",       words: ["ROJO","AZUL","VERDE","NEGRO","BLANCO","GRIS","AMARILLO","NARANJA","MORADO","ROSA","MARRON","VIOLETA"] },
        { name: "Países",        words: ["ESPAÑA","FRANCIA","ITALIA","CHINA","BRASIL","INDIA","MEXICO","CANADA","JAPON","ALEMANIA","RUSIA","EGIPTO"] },
        { name: "Astronomía",    words: ["TIERRA","MARTE","VENUS","JUPITER","SATURNO","URANO","NEPTUNO","MERCURIO","PLUTON","LUNA","SOL","COMETA"] },
        { name: "Deportes",      words: ["FUTBOL","TENIS","BASKET","VOLEY","GOLF","RUGBY","NATACION","CICLISMO","BOXEO","KARATE","SURF","JUDO"] },
        { name: "Profesiones",   words: ["DOCTOR","MAESTRO","ABOGADO","POLICIA","BOMBERO","PILOTO","COCINERO","INGENIERO","DENTISTA","ESCRITOR","PINTOR","ACTOR"] },
        { name: "Ropa",          words: ["CAMISA","PANTALON","FALDA","ZAPATOS","SOMBRERO","ABRIGO","BUFANDA","GUANTES","GORRA","CALCETINES","CHAQUETA","VESTIDO"] },
        { name: "Instrumentos",  words: ["PIANO","GUITARRA","VIOLIN","BATERIA","FLAUTA","TROMPETA","SAXOFON","CLARINETE","ARPA","ACORDEON","BAJO","TAMBOR"] },
        { name: "Muebles",       words: ["MESA","SILLA","SOFA","CAMA","ARMARIO","ESTANTE","ESPEJO","LAMPARA","COMODA","ESCRITORIO","TABURETE","ALFOMBRA"] }
    ];

    const theme = themes[levelIndex % themes.length];
    const wordPool = [...theme.words];
    const selectedWords = [];

    for (let i = 0; i < wordCount && wordPool.length > 0; i++) {
        const idx = Math.floor(Math.random() * wordPool.length);
        selectedWords.push(wordPool.splice(idx, 1)[0]);
    }

    // Crear cuadrícula vacía
    const grid = Array.from({ length: size }, () => Array(size).fill(''));
    const positions = {};

    selectedWords.forEach(word => {
        let placed = false;
        let attempts = 0;

        while (!placed && attempts < 150) {
            attempts++;
            const direction = wordDirections[Math.floor(Math.random() * wordDirections.length)];
            let startRow, startCol;

            switch (direction) {
                case 'horizontal':
                    startRow = Math.floor(Math.random() * size);
                    startCol = Math.floor(Math.random() * (size - word.length + 1));
                    break;
                case 'vertical':
                    startRow = Math.floor(Math.random() * (size - word.length + 1));
                    startCol = Math.floor(Math.random() * size);
                    break;
                case 'horizontalReverse':
                    startRow = Math.floor(Math.random() * size);
                    startCol = Math.floor(Math.random() * (size - word.length + 1)) + word.length - 1;
                    break;
                case 'verticalReverse':
                    startRow = Math.floor(Math.random() * (size - word.length + 1)) + word.length - 1;
                    startCol = Math.floor(Math.random() * size);
                    break;
                case 'diagonal':
                    startRow = Math.floor(Math.random() * (size - word.length + 1));
                    startCol = Math.floor(Math.random() * (size - word.length + 1));
                    break;
                default:
                    continue;
            }

            const increments = {
                horizontal:        { dr: 0,  dc: 1  },
                vertical:          { dr: 1,  dc: 0  },
                horizontalReverse: { dr: 0,  dc: -1 },
                verticalReverse:   { dr: -1, dc: 0  },
                diagonal:          { dr: 1,  dc: 1  }
            };
            const { dr, dc } = increments[direction];

            let canPlace = true;
            const cellCoords = [];

            for (let i = 0; i < word.length; i++) {
                const r = startRow + i * dr;
                const c = startCol + i * dc;
                if (r < 0 || r >= size || c < 0 || c >= size) { canPlace = false; break; }
                if (grid[r][c] && grid[r][c] !== word[i]) { canPlace = false; break; }
                cellCoords.push({ r, c });
            }

            if (canPlace) {
                cellCoords.forEach(({ r, c }, i) => { grid[r][c] = word[i]; });
                positions[word] = { start: { row: startRow, col: startCol }, direction };
                placed = true;
            }
        }

        if (!placed) console.warn(`No se pudo colocar: ${word}`);
    });

    // Rellenar huecos con letras aleatorias
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (!grid[r][c]) grid[r][c] = getRandomLetter();
        }
    }

    return {
        theme: theme.name,
        words: selectedWords,
        grid: grid.map(row => row.join('')),
        positions,
        bgClass: `level-bg-${(levelIndex % 100) + 1}`
    };
}

// =============================================
// ARRANQUE
// =============================================
window.addEventListener('DOMContentLoaded', initGame);