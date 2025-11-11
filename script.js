// Elementos del DOM
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

// Variables globales
let currentLevel = 1;
let selectedCells = [];
let foundWords = [];
let gridSize = 10; // Tamaño inicial para los niveles 1-30
let touchStarted = false;
let firstTimePlayer = true;

// Estructura para almacenar la información de cada nivel
const levels = [
    // Niveles 1-30: 10x10, 6 palabras, horizontal y vertical
    // Nivel 1 - Frutas
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
        positions: {
            "MANZANA": {start: {row: 0, col: 0}, end: {row: 0, col: 6}, direction: "horizontal"},
            "PLATANO": {start: {row: 1, col: 5}, end: {row: 7, col: 5}, direction: "vertical"},
            "NARANJA": {start: {row: 8, col: 0}, end: {row: 8, col: 6}, direction: "horizontal"},
            "FRESA": {start: {row: 5, col: 2}, end: {row: 5, col: 6}, direction: "horizontal"},
            "PERA": {start: {row: 4, col: 2}, end: {row: 4, col: 5}, direction: "horizontal"},
            "UVA": {start: {row: 6, col: 5}, end: {row: 6, col: 7}, direction: "horizontal"}
        },
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
        positions: {
            "PERRO": {start: {row: 1, col: 1}, end: {row: 1, col: 5}, direction: "horizontal"},
            "GATO": {start: {row: 2, col: 0}, end: {row: 2, col: 3}, direction: "horizontal"},
            "LEON": {start: {row: 7, col: 0}, end: {row: 7, col: 3}, direction: "horizontal"},
            "TIGRE": {start: {row: 8, col: 0}, end: {row: 8, col: 4}, direction: "horizontal"},
            "OSO": {start: {row: 4, col: 3}, end: {row: 4, col: 5}, direction: "horizontal"},
            "LOBO": {start: {row: 6, col: 6}, end: {row: 3, col: 6}, direction: "vertical"}
        },
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
        positions: {
            "ROJO": {start: {row: 2, col: 1}, end: {row: 2, col: 4}, direction: "horizontal"},
            "AZUL": {start: {row: 3, col: 0}, end: {row: 3, col: 3}, direction: "horizontal"},
            "VERDE": {start: {row: 4, col: 2}, end: {row: 4, col: 6}, direction: "horizontal"},
            "NEGRO": {start: {row: 7, col: 0}, end: {row: 7, col: 4}, direction: "horizontal"},
            "BLANCO": {start: {row: 7, col: 5}, end: {row: 7, col: 9}, direction: "vertical"},
            "GRIS": {start: {row: 8, col: 2}, end: {row: 8, col: 5}, direction: "horizontal"}
        },
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
        positions: {
            "ESPAÑA": {start: {row: 1, col: 0}, end: {row: 1, col: 5}, direction: "horizontal"},
            "FRANCIA": {start: {row: 4, col: 0}, end: {row: 4, col: 6}, direction: "horizontal"},
            "ITALIA": {start: {row: 9, col: 0}, end: {row: 9, col: 5}, direction: "horizontal"},
            "CHINA": {start: {row: 6, col: 0}, end: {row: 6, col: 4}, direction: "horizontal"},
            "BRASIL": {start: {row: 6, col: 5}, end: {row: 6, col: 9}, direction: "horizontal"},
            "INDIA": {start: {row: 8, col: 6}, end: {row: 8, col: 9}, direction: "horizontal"}
        },
        bgClass: "level-bg-4"
    },
    // Nivel 5 - Planetas
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
        positions: {
            "TIERRA": {start: {row: 4, col: 0}, end: {row: 4, col: 5}, direction: "horizontal"},
            "MARTE": {start: {row: 2, col: 0}, end: {row: 2, col: 4}, direction: "horizontal"},
            "VENUS": {start: {row: 5, col: 0}, end: {row: 5, col: 4}, direction: "horizontal"},
            "JUPITER": {start: {row: 0, col: 0}, end: {row: 0, col: 6}, direction: "horizontal"},
            "SATURNO": {start: {row: 6, col: 3}, end: {row: 6, col: 9}, direction: "horizontal"},
            "URANO": {start: {row: 8, col: 0}, end: {row: 8, col: 4}, direction: "horizontal"}
        },
        bgClass: "level-bg-5"
    },
    // Nivel 6
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
    positions: {
        "FUTBOL": {start: {row: 0, col: 0}, end: {row: 0, col: 5}, direction: "horizontal"},
        "TENIS": {start: {row: 1, col: 8}, end: {row: 5, col: 8}, direction: "vertical"},
        "GOLF": {start: {row: 6, col: 2}, end: {row: 9, col: 2}, direction: "vertical"},
        "SURF": {start: {row: 7, col: 6}, end: {row: 7, col: 9}, direction: "horizontal"},
        "BOXEO": {start: {row: 8, col: 5}, end: {row: 8, col: 9}, direction: "horizontal"},
        "JUDO": {start: {row: 9, col: 0}, end: {row: 9, col: 3}, direction: "horizontal"}
    },
    bgClass: "level-bg-9"
},
 // Nivel 7 - Profesiones
{
    theme: "Profesiones",
    words: ["DOCTOR", "MAESTRO", "ACTOR", "BOMBERO", "PILOTO", "COCINERO"],
    grid: [
        "DLMDEACTOR",  // ACTOR empieza vertical en col 5
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
    positions: {
        "DOCTOR":   {start: {row: 0, col: 0}, end: {row: 5, col: 0}, direction: "vertical"},
        "ACTOR":    {start: {row: 0, col: 5}, end: {row: 4, col: 5}, direction: "vertical"},
        "MAESTRO":  {start: {row: 6, col: 0}, end: {row: 6, col: 6}, direction: "horizontal"},
        "BOMBERO":  {start: {row: 3, col: 9}, end: {row: 9, col: 9}, direction: "vertical"},
        "PILOTO":   {start: {row: 8, col: 0}, end: {row: 8, col: 5}, direction: "horizontal"},
        "COCINERO": {start: {row: 9, col: 0}, end: {row: 9, col: 7}, direction: "horizontal"}
    },
    bgClass: "level-bg-7"
},
    
// Nivel 8 - Ropa
{
  theme: "Ropa",
  words: ["CAMISA", "FALDA", "ZAPATOS", "ABRIGO", "GORRA", "VESTIDO"],
  grid: [
    "ZAPATOSLKA",  // ZAPATOS horizontal
    "ARUHTYUIOB",
    "PGORRAQVER",  // GORRA vertical desde (2,1) a (6,1)
    "OLKMNJUEOI",
    "CAHJNKISOG",  // VESTIDO horizontal
    "AHFALDATXO",  // FALDA horizontal
    "MBRIGHJILO",  // ABRIGO vertical desde (6,1)
    "IQWERTYDIO",
    "CAMISAQOER",  // CAMISA horizontal
    "ALKSJDHGFD"
  ],
  positions: {
    "CAMISA":   {start: {row: 8, col: 1}, end: {row: 8, col: 6}, direction: "horizontal"},
    "FALDA":    {start: {row: 5, col: 2}, end: {row: 5, col: 6}, direction: "horizontal"},
    "ZAPATOS":  {start: {row: 0, col: 0}, end: {row: 0, col: 6}, direction: "horizontal"},
    "ABRIGO":   {start: {row: 6, col: 1}, end: {row: 1, col: 1}, direction: "vertical"},
    "GORRA":    {start: {row: 2, col: 1}, end: {row: 6, col: 1}, direction: "vertical"},
    "VESTIDO":  {start: {row: 4, col: 2}, end: {row: 4, col: 8}, direction: "horizontal"}
  },
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
  positions: {
    "PIANO":   {start: {row: 0, col: 0}, end: {row: 0, col: 4}, direction: "vertical"},
    "FLAUTA": {start: {row: 0, col: 1}, end: {row: 0, col: 6}, direction: "horizontal"},
    "VIOLIN": {start: {row: 6, col: 1}, end: {row: 6, col: 6}, direction: "horizontal"},
    "TAMBOR": {start: {row: 0, col: 0}, end: {row: 5, col: 0}, direction: "horizontal"},
    "BAJO":   {start: {row: 7, col: 0}, end: {row: 7, col: 3}, direction: "Vertical"},
    "ARPA":   {start: {row: 8, col: 5}, end: {row: 8, col: 8}, direction: "horizontal"},
  },
  bgClass: "level-bg-9"
},

// Nivel 10 - Muebles
{
  theme: "Muebles",
  words: ["MESA", "SILLA", "SOFA", "CAMA", "ESPEJO", "LAMPARA"],
  grid: [
    "KVDAZXCVBN",  // MESA horizontal (col 0)
    "APLKMNBECX",
    "SILLARTSYU",  // SILLA horizontal (col 0)
    "CLKAQWEPTY",  // CAMA horizontal (col 0)
    "SOFAZXCEMN",  // SOFA horizontal (col 0)
    "QWERTYUJOP",
    "MXTUJCJOAS",  // ESPEJO horizontal (col 2)
    "ELAMPARAKL",  // LAMPARA horizontal (col 1)
    "SVBCXMEMTY",
    "AASWEACAFR"
  ],
  positions: {
    "MESA":    {start: {row: 0, col: 0}, end: {row: 0, col: 3}, direction: "horizontal"},
    "SILLA":   {start: {row: 2, col: 0}, end: {row: 2, col: 4}, direction: "horizontal"},
    "SOFA":    {start: {row: 4, col: 0}, end: {row: 4, col: 3}, direction: "horizontal"},
    "CAMA":    {start: {row: 3, col: 0}, end: {row: 3, col: 3}, direction: "horizontal"},
    "ESPEJO":  {start: {row: 6, col: 2}, end: {row: 6, col: 7}, direction: "horizontal"},
    "LAMPARA": {start: {row: 7, col: 1}, end: {row: 7, col: 7}, direction: "horizontal"}
  },
  bgClass: "level-bg-10"
},

// Nivel 11 - Flores
{
  theme: "Flores",
  words: ["ROSA", "DALIA", "TULIPAN", "LIRIO", "MARGARITA", "JAZMIN", "ORQUIDEA"],
  grid: [
    "LKDOIRILNM",    // ROSA horizontal
    "QWAPLNIOAO",    // LIRIO horizontal
    "PLLLBIEUFR",    // MARGARITA horizontal
    "OKIHGMDSAQ",
    "ZXAVBZMLRU",
    "TULIPANQOI",    // TULIPAN horizontal
    "AZXORJUISD",    // ORQUIDEA horizontal (col 3)
    "POIUYTREAE",
    "LKJHGFDSAA",
    "MARGARITAK"     // JAZMIN horizontal
  ],
  positions: {
    "ROSA":      {start: {row: 0, col: 0}, end: {row: 0, col: 3}, direction: "horizontal"},
    "LIRIO":     {start: {row: 1, col: 3}, end: {row: 1, col: 7}, direction: "horizontal"},
    "MARGARITA": {start: {row: 2, col: 2}, end: {row: 2, col: 11}, direction: "horizontal"},
    "TULIPAN":   {start: {row: 5, col: 0}, end: {row: 5, col: 6}, direction: "horizontal"},
    "ORQUIDEA":  {start: {row: 6, col: 3}, end: {row: 6, col: 10}, direction: "horizontal"},
    "JAZMIN":    {start: {row: 9, col: 1}, end: {row: 9, col: 6}, direction: "horizontal"}
  },
  bgClass: "level-bg-11"
},

// Nivel 12 - Partes de la casa
{
  theme: "Partes de la casa",
  words: ["COCINA", "BALCON", "BAÑO", "SALA", "JARDIN", "GARAJE", "DORMITORIO"],
  grid: [
    "LKEBFDQWER",     // COCINA horizontal
    "ZXJVBASALA",     // SALA horizontal (col 6)
    "BNAKOORFJC",     // JARDIN horizontal (col 3)
    "DORMITORIO",     // DORMITORIO horizontal
    "LKAHGFDSAC",
    "ASGFGHJKLI",
    "PÑGKJHGARN",     // GARAJE horizontal (col 6)
    "BAÑOZXCVBA",     // BAÑO horizontal
    "QWENIDRAJP",
    "MNBALCONJH"
  ],
  positions: {
    "COCINA":     {start: {row: 0, col: 0}, end: {row: 0, col: 5}, direction: "horizontal"},
    "SALA":       {start: {row: 1, col: 6}, end: {row: 1, col: 9}, direction: "horizontal"},
    "JARDIN":     {start: {row: 2, col: 3}, end: {row: 2, col: 8}, direction: "horizontal"},
    "DORMITORIO": {start: {row: 3, col: 0}, end: {row: 3, col: 9}, direction: "horizontal"},
    "GARAJE":     {start: {row: 6, col: 6}, end: {row: 6, col: 11}, direction: "horizontal"},
    "BAÑO":       {start: {row: 7, col: 0}, end: {row: 7, col: 3}, direction: "horizontal"}
  },
  bgClass: "level-bg-12"
},

// Nivel 13 - Medios de transporte
{
  theme: "Medios de transporte",
  words: ["COCHE", "TREN", "AVION", "BARCO", "MOTO", "BICICLETA", "METRO"],
  grid: [
    "AVIONBUUFA",     // AVION (col 0), TREN (col 5)
    "LZXCVMOTOT",     // MOTO (col 5)
    "BICICLETAR",     // BICICLETA (col 0)
    "PLKMNBVCXE",
    "COCHEPLKMN",     // COCHE (col 0)
    "QWERTBUIOP",
    "LKJHGADSMZ",
    "JGVMORWEOT",     // BARCO (col 0)
    "METROCXCTB",     // METRO (col 0)
    "MNBVCOZLOJ"
  ],
  positions: {
    "COCHE":     {start: {row: 4, col: 0}, end: {row: 4, col: 4}, direction: "horizontal"},
    "TREN":      {start: {row: 0, col: 5}, end: {row: 0, col: 8}, direction: "horizontal"},
    "AVION":     {start: {row: 0, col: 0}, end: {row: 0, col: 4}, direction: "horizontal"},
    "BARCO":     {start: {row: 7, col: 0}, end: {row: 7, col: 4}, direction: "horizontal"},
    "MOTO":      {start: {row: 1, col: 5}, end: {row: 1, col: 8}, direction: "horizontal"},
    "BICICLETA": {start: {row: 2, col: 0}, end: {row: 2, col: 8}, direction: "horizontal"},
    "METRO":     {start: {row: 8, col: 0}, end: {row: 8, col: 4}, direction: "horizontal"}
  },
  bgClass: "level-bg-13"
},
// Nivel 14 - Comidas
{
  theme: "Comidas",
  words: ["ARROZ", "PIZZA", "ENSALADA", "SOPA", "GALLETAS", "TACO", "PASTA"],
  grid: [
    "LOFBDUJUFO",   // HAMBURGUESA (col 0)
    "QWERTYUIOP",
    "ENSALADAZX",    // ENSALADA (col 0)
    "LKJHGFASAS",
    "TACOKHTAQO",    // TACO (col 0), SOPA (col 4)
    "MNBVCXSLKP",
    "SATELLAGRA",    // PASTA (col 0)
    "ZXCVBNPASD",
    "PIZZARROZL",    // PIZZA (col 0), ARROZ (col 5)
    "LKJHGFDSAQ"
  ],
  positions: {
    "HAMBURGUESA": {start: {row: 0, col: 0}, end: {row: 0, col: 10}, direction: "horizontal"},
    "ENSALADA":    {start: {row: 2, col: 0}, end: {row: 2, col: 7}, direction: "horizontal"},
    "TACO":        {start: {row: 4, col: 0}, end: {row: 4, col: 3}, direction: "horizontal"},
    "SOPA":        {start: {row: 4, col: 4}, end: {row: 4, col: 7}, direction: "horizontal"},
    "PASTA":       {start: {row: 6, col: 0}, end: {row: 6, col: 4}, direction: "horizontal"},
    "PIZZA":       {start: {row: 8, col: 0}, end: {row: 8, col: 4}, direction: "horizontal"},
    "ARROZ":       {start: {row: 8, col: 5}, end: {row: 8, col: 9}, direction: "horizontal"}
  },
  bgClass: "level-bg-14"
},
// Nivel 15 - Escuela
{
  theme: "Escuela",
  words: ["LAPIZ", "CUADERNO", "BORRADOR", "REGLA", "MOCHILA", "TIZA", "COLOR"],
  grid: [
    "CUADERNOBB",    // CUADERNO (col 0)
    "OQWERTYUOO",
    "LUISXARTRK",    // BORRADOR (col 0)
    "PLMNBVEXRE",
    "LAPIZSGUAA",    // LAPIZ (col 0)
    "JUGNKQLEDT",    // REGLA (col 0)
    "MOCHILAZOT",    // MOCHILA (col 0)
    "YTREWQTIRI",    // TIZA (col 7)
    "ROLOCLAPOZ",    // ESCRITORIO (col 0)
    "LKJHGFDSAA"
  ],
  positions: {
    "CUADERNO":   {start: {row: 0, col: 0}, end: {row: 0, col: 7}, direction: "horizontal"},
    "BORRADOR":   {start: {row: 2, col: 0}, end: {row: 2, col: 7}, direction: "horizontal"},
    "LAPIZ":      {start: {row: 4, col: 0}, end: {row: 4, col: 4}, direction: "horizontal"},
    "REGLA":      {start: {row: 5, col: 0}, end: {row: 5, col: 4}, direction: "horizontal"},
    "MOCHILA":    {start: {row: 6, col: 0}, end: {row: 6, col: 6}, direction: "horizontal"},
    "TIZA":       {start: {row: 7, col: 7}, end: {row: 7, col: 10}, direction: "horizontal"},
    "ESCRITORIO": {start: {row: 8, col: 0}, end: {row: 8, col: 9}, direction: "horizontal"}
  },
  bgClass: "level-bg-15"
},

// Nivel 16 - Clima
{
  theme: "Clima",
  words: ["LLUVIA", "TORMENTA", "NIEVE", "VIENTO", "SOL", "NUBES", "GRANIZO"],
  grid: [
    "TORMENTAZA",   // TORMENTA (fila 0, col 0 a 7)
    "QWERTYUVIE",   // VIENTO (vertical)
    "SEBUNSEXCV",   // NUBLADO (fila 2)
    "QAZWSXGDCR",
    "LLUVIARWER",   // LLUVIA (fila 4)
    "MNBVCXAASD",
    "NIEVELNJHG",   // NIEVE (fila 6)
    "YTREWQIKJL",
    "NUBAIZZQWO",   // GRANIZO (fila 8)
    "ZVIENTOFLS"    // SOL (fila 9, col 6 a 8)
  ],
  positions: {
    "TORMENTA": {start: {row: 0, col: 0}, end: {row: 0, col: 7}, direction: "horizontal"},
    "VIENTO":   {start: {row: 1, col: 8}, end: {row: 6, col: 8}, direction: "vertical"},
    "NUBLADO":  {start: {row: 2, col: 0}, end: {row: 2, col: 6}, direction: "horizontal"},
    "LLUVIA":   {start: {row: 4, col: 0}, end: {row: 4, col: 5}, direction: "horizontal"},
    "NIEVE":    {start: {row: 6, col: 0}, end: {row: 6, col: 4}, direction: "horizontal"},
    "GRANIZO":  {start: {row: 8, col: 0}, end: {row: 8, col: 6}, direction: "horizontal"},
    "SOL":      {start: {row: 9, col: 6}, end: {row: 9, col: 8}, direction: "horizontal"}
  },
  bgClass: "level-bg-16"
},

// Nivel 17 - Cuentos de Hadas
{
  theme: "Cuentos de Hadas",
  words: ["HADA", "DRAGON", "PRINCIPE", "HECHIZO", "CASTILLO", "MAGIA", "BRUJA"],
  grid: [
    "HUJKOLQDER",   // DRAGON (fila 0, horizontal)
    "MAGIAOLRJU",   // MAGIA (fila 1)
    "QWERTYHADA",   // HADA (fila 2, col 6 a 9)
    "ZXCASDFGHJ",
    "CASTILLONB",   // CASTILLO (fila 4)
    "YAIOPBRNJA",   // BRUJA (fila 5, col 5 a 9)
    "LJJHECHIZO",   // HECHIZO (fila 6, col 3 a 9)
    "MUPRINCIPE",   // PRINCIPE (fila 7, col 2 a 9)
    "ARDOZIHCEH",
    "PBIUYTREWA"
  ],
  positions: {
    "DRAGON":   {start: {row: 0, col: 0}, end: {row: 0, col: 5}, direction: "horizontal"},
    "MAGIA":    {start: {row: 1, col: 0}, end: {row: 1, col: 4}, direction: "horizontal"},
    "HADA":     {start: {row: 2, col: 6}, end: {row: 2, col: 9}, direction: "horizontal"},
    "CASTILLO": {start: {row: 4, col: 0}, end: {row: 4, col: 7}, direction: "horizontal"},
    "BRUJA":    {start: {row: 5, col: 5}, end: {row: 5, col: 9}, direction: "horizontal"},
    "HECHIZO":  {start: {row: 6, col: 3}, end: {row: 6, col: 9}, direction: "horizontal"},
    "PRINCIPE": {start: {row: 7, col: 2}, end: {row: 7, col: 9}, direction: "horizontal"}
  },
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
    positions: {
        "QUIMICA": {start: {row: 0, col: 0}, end: {row: 0, col: 6}, direction: "horizontal"},
        "FISICA": {start: {row: 2, col: 0}, end: {row: 2, col: 5}, direction: "horizontal"},
        "BIOLOGIA": {start: {row: 7, col: 0}, end: {row: 7, col: 7}, direction: "horizontal"},
        "ATOMO": {start: {row: 3, col: 5}, end: {row: 3, col: 9}, direction: "horizontal"},
        "CELULA": {start: {row: 4, col: 0}, end: {row: 4, col: 5}, direction: "horizontal"},
        "LABORATORIO": {start: {row: 9, col: 0}, end: {row: 9, col: 10}, direction: "horizontal"},
        "ENERGIA": {start: {row: 8, col: 2}, end: {row: 8, col: 8}, direction: "horizontal"}
    },
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
    positions: {
        "PELICULA": {start: {row: 0, col: 4}, end: {row: 0, col: 11}, direction: "horizontal"},
        "GUION": {start: {row: 2, col: 4}, end: {row: 2, col: 8}, direction: "horizontal"},
        "ACTOR": {start: {row: 3, col: 6}, end: {row: 3, col: 10}, direction: "horizontal"},
        "ESCENA": {start: {row: 5, col: 0}, end: {row: 5, col: 5}, direction: "horizontal"},
        "CAMARA": {start: {row: 1, col: 3}, end: {row: 6, col: 3}, direction: "vertical"},
        "CINE": {start: {row: 8, col: 3}, end: {row: 8, col: 6}, direction: "horizontal"},
        "DIRECTOR": {start: {row: 9, col: 3}, end: {row: 9, col: 11}, direction: "horizontal"}
    },
    bgClass: "level-bg-19"
},
// Nivel 20 - Mitología
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
    positions: {
        "ZEUS": {start: {row: 4, col: 7}, end: {row: 4, col: 10}, direction: "horizontal"},
        "HADES": {start: {row: 9, col: 0}, end: {row: 9, col: 4}, direction: "horizontal"},
        "ODIN": {start: {row: 2, col: 6}, end: {row: 2, col: 9}, direction: "horizontal"},
        "THOR": {start: {row: 3, col: 0}, end: {row: 3, col: 3}, direction: "horizontal"},
        "ANUBIS": {start: {row: 5, col: 0}, end: {row: 5, col: 5}, direction: "horizontal"},
        "AFRODITA": {start: {row: 0, col: 4}, end: {row: 0, col: 11}, direction: "horizontal"},
        "APOLO": {start: {row: 8, col: 0}, end: {row: 8, col: 4}, direction: "horizontal"}
    },
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
    positions: {
        "PLAZA": {start: {row: 0, col: 0}, end: {row: 0, col: 4}, direction: "horizontal"},
        "SEMÁFORO": {start: {row: 3, col: 1}, end: {row: 3, col: 8}, direction: "horizontal"},
        "EDIFICIO": {start: {row: 4, col: 0}, end: {row: 4, col: 7}, direction: "horizontal"},
        "MERCADO": {start: {row: 6, col: 0}, end: {row: 6, col: 6}, direction: "horizontal"},
        "PUENTE": {start: {row: 9, col: 0}, end: {row: 9, col: 5}, direction: "horizontal"},
        "PARQUE": {start: {row: 2, col: 0}, end: {row: 7, col: 0}, direction: "vertical"},
        "CALLE": {start: {row: 0, col: 1}, end: {row: 4, col: 1}, direction: "vertical"}
    },
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
    positions: {
        "TALADRO": {start: {row: 0, col: 3}, end: {row: 0, col: 9}, direction: "horizontal"},
        "CLAVO": {start: {row: 2, col: 0}, end: {row: 2, col: 4}, direction: "horizontal"},
        "LLAVE": {start: {row: 4, col: 0}, end: {row: 4, col: 4}, direction: "horizontal"},
        "MARTILLO": {start: {row: 6, col: 0}, end: {row: 6, col: 8}, direction: "horizontal"},
        "TIJERAS": {start: {row: 8, col: 4}, end: {row: 8, col: 11}, direction: "horizontal"},
        "SIERRA": {start: {row: 0, col: 2}, end: {row: 5, col: 2}, direction: "vertical"},
        "LIMA": {start: {row: 9, col: 0}, end: {row: 6, col: 0}, direction: "vertical"}
    },
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
    positions: {
        "CABEZA": {start: {row: 0, col: 3}, end: {row: 5, col: 3}, direction: "vertical"},
        "CORAZON": {start: {row: 9, col: 0}, end: {row: 9, col: 6}, direction: "horizontal"},
        "PIERNA": {start: {row: 4, col: 0}, end: {row: 4, col: 5}, direction: "horizontal"},
        "MANO": {start: {row: 1, col: 3}, end: {row: 1, col: 6}, direction: "horizontal"},
        "OJO": {start: {row: 2, col: 4}, end: {row: 2, col: 6}, direction: "horizontal"},
        "HUESO": {start: {row: 6, col: 5}, end: {row: 6, col: 9}, direction: "horizontal"},
        "BRAZO": {start: {row: 0, col: 3}, end: {row: 0, col: 7}, direction: "horizontal"}
    },
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
    positions: {
        "BARCO": {start: {row: 2, col: 0}, end: {row: 2, col: 4}, direction: "horizontal"},
        "TESORO": {start: {row: 0, col: 4}, end: {row: 0, col: 9}, direction: "horizontal"},
        "MAPA": {start: {row: 0, col: 1}, end: {row: 0, col: 4}, direction: "horizontal"},
        "ESPADA": {start: {row: 3, col: 0}, end: {row: 3, col: 5}, direction: "horizontal"},
        "ISLA": {start: {row: 4, col: 0}, end: {row: 4, col: 3}, direction: "horizontal"},
        "BRUJULA": {start: {row: 5, col: 3}, end: {row: 5, col: 9}, direction: "horizontal"},
        "CAPITAN": {start: {row: 1, col: 3}, end: {row: 1, col: 9}, direction: "horizontal"}
    },
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
    positions: {
        "MARIO": {start: {row: 0, col: 0}, end: {row: 0, col: 4}, direction: "horizontal"},
        "ZELDA": {start: {row: 2, col: 4}, end: {row: 2, col: 8}, direction: "horizontal"},
        "SONIC": {start: {row: 6, col: 0}, end: {row: 6, col: 4}, direction: "horizontal"},
        "FORTNITE": {start: {row: 1, col: 2}, end: {row: 1, col: 9}, direction: "horizontal"},
        "PACMAN": {start: {row: 4, col: 0}, end: {row: 4, col: 5}, direction: "horizontal"},
        "TETRIS": {start: {row: 1, col: 3}, end: {row: 1, col: 8}, direction: "horizontal"},
        "MINECRAFT": {start: {row: 5, col: 0}, end: {row: 5, col: 8}, direction: "horizontal"}
    },
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
    positions: {
        "DOCTOR": {start: {row: 0, col: 0}, end: {row: 0, col: 5}, direction: "horizontal"},
        "ENFERMERA": {start: {row: 2, col: 2}, end: {row: 2, col: 10}, direction: "horizontal"},
        "HOSPITAL": {start: {row: 4, col: 0}, end: {row: 4, col: 7}, direction: "horizontal"},
        "VACUNA": {start: {row: 1, col: 4}, end: {row: 1, col: 9}, direction: "horizontal"},
        "JERINGA": {start: {row: 5, col: 0}, end: {row: 5, col: 6}, direction: "horizontal"},
        "PASTILLA": {start: {row: 3, col: 2}, end: {row: 3, col: 9}, direction: "horizontal"},
        "CURA": {start: {row: 9, col: 0}, end: {row: 9, col: 3}, direction: "horizontal"}
    },
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
    positions: {
        "COMPUTADOR": {start: {row: 0, col: 0}, end: {row: 0, col: 9}, direction: "horizontal"},
        "INTERNET": {start: {row: 1, col: 1}, end: {row: 8, col: 1}, direction: "vertical"},
        "ROBOT": {start: {row: 2, col: 1}, end: {row: 2, col: 5}, direction: "horizontal"},
        "SOFTWARE": {start: {row: 5, col: 2}, end: {row: 5, col: 9}, direction: "horizontal"},
        "HARDWARE": {start: {row: 3, col: 3}, end: {row: 3, col: 10}, direction: "horizontal"},
        "CABLE": {start: {row: 7, col: 1}, end: {row: 7, col: 5}, direction: "horizontal"},
        "RED": {start: {row: 9, col: 1}, end: {row: 9, col: 3}, direction: "horizontal"}
    },
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
    positions: {
        "ODIN": {start: {row: 8, col: 0}, end: {row: 8, col: 3}, direction: "horizontal"},
        "THOR": {start: {row: 0, col: 0}, end: {row: 0, col: 3}, direction: "horizontal"},
        "LOKI": {start: {row: 0, col: 4}, end: {row: 0, col: 7}, direction: "horizontal"},
        "VALHALLA": {start: {row: 2, col: 0}, end: {row: 2, col: 7}, direction: "horizontal"},
        "RAGNAROK": {start: {row: 6, col: 0}, end: {row: 6, col: 7}, direction: "horizontal"},
        "FREYA": {start: {row: 5, col: 0}, end: {row: 5, col: 4}, direction: "horizontal"},
        "ASGARD": {start: {row: 4, col: 2}, end: {row: 4, col: 7}, direction: "horizontal"}
    },
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
    positions: {
        "TELEFONO": {start: {row: 0, col: 0}, end: {row: 0, col: 7}, direction: "horizontal"},
        "AVION": {start: {row: 1, col: 0}, end: {row: 1, col: 4}, direction: "horizontal"},
        "IMPRENTA": {start: {row: 5, col: 0}, end: {row: 5, col: 7}, direction: "horizontal"},
        "BOMBILLA": {start: {row: 3, col: 0}, end: {row: 3, col: 7}, direction: "horizontal"},
        "RADIO": {start: {row: 3, col: 8}, end: {row: 3, col: 4}, direction: "reverse-horizontal"},
        "TELEVISION": {start: {row: 9, col: 0}, end: {row: 9, col: 9}, direction: "horizontal"},
        "COMPUTADOR": {start: {row: 7, col: 0}, end: {row: 7, col: 9}, direction: "horizontal"}
    },
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
    positions: {
        "PACIFICO": {start: {row: 0, col: 0}, end: {row: 0, col: 7}, direction: "horizontal"},
        "ATLANTICO": {start: {row: 9, col: 0}, end: {row: 9, col: 8}, direction: "horizontal"},
        "INDICO": {start: {row: 1, col: 2}, end: {row: 6, col: 2}, direction: "vertical"},
        "ARTICO": {start: {row: 2, col: 3}, end: {row: 2, col: 8}, direction: "horizontal"},
        "ANTARTICO": {start: {row: 4, col: 0}, end: {row: 4, col: 8}, direction: "horizontal"},
        "CORAL": {start: {row: 7, col: 5}, end: {row: 7, col: 9}, direction: "horizontal"},
        "OLAS": {start: {row: 6, col: 5}, end: {row: 6, col: 8}, direction: "horizontal"}
    },
    bgClass: "level-bg-30"
}







    // Continuarían los niveles 6 al 100...
    // Los primeros 30 niveles: 10x10, 6 palabras
    // Del nivel 31 al 70: 12x12, 9 palabras
    // Del nivel 71 al 100: 15x15, 12 palabras
];

// Funciones para manejar el juego
function initGame() {
    loadLevel(currentLevel);
    setupEventListeners();
    
    // Mostrar tutorial la primera vez
    if (firstTimePlayer) {
        setTimeout(() => {
            showTutorial();
        }, 500);
    }
}

function loadLevel(levelIndex) {
    // Restablecer el estado
    selectedCells = [];
    foundWords = [];
    
    // Ajustar tamaño de la cuadrícula según el nivel
    if (levelIndex <= 30) {
        gridSize = 10;
    } else if (levelIndex <= 70) {
        gridSize = 12;
    } else {
        gridSize = 15;
    }
    
    // Si no tenemos este nivel en nuestra estructura, creamos uno automáticamente
    // (Para este ejemplo, solo tenemos los primeros 5 niveles definidos)
    const level = levelIndex <= levels.length ? levels[levelIndex - 1] : generateLevel(levelIndex);
    
    // Actualizar información del nivel
    currentLevelElement.textContent = levelIndex;
    completedLevelElement.textContent = levelIndex;
    document.body.className = level.bgClass || `level-bg-${(levelIndex % 20) + 1}`;
    
    // Mostrar el tema
    levelThemeElement.textContent = level.theme;
    
    // Generar la cuadrícula
    createGrid(level);
    
    // Mostrar la lista de palabras
    displayWordList(level.words);
    
    // Actualizar barra de progreso
    updateProgressBar(0);
    
    // Actualizar estado de los botones
    prevLevelButton.disabled = levelIndex === 1;
    nextLevelButton.disabled = levelIndex === 100;
}

function createGrid(level) {
    wordSearchGrid.innerHTML = '';
    wordSearchGrid.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    
    // Crear celdas de la cuadrícula
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            
            // Obtener la letra de la cuadrícula del nivel
            if (level.grid && level.grid[row] && level.grid[row][col]) {
                cell.textContent = level.grid[row][col];
            } else {
                // Si no hay letra definida, usar una aleatoria (para niveles generados)
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

function setupEventListeners() {
    // Eventos de mouse
    wordSearchGrid.addEventListener('mousedown', handleSelectionStart);
    wordSearchGrid.addEventListener('mouseover', handleSelectionMove);
    document.addEventListener('mouseup', handleSelectionEnd);
    
    // Eventos de toque para móviles
    wordSearchGrid.addEventListener('touchstart', handleTouchStart);
    wordSearchGrid.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
    
    // Botones de navegación entre niveles
    prevLevelButton.addEventListener('click', () => {
        if (currentLevel > 1) {
            currentLevel--;
            loadLevel(currentLevel);
        }
    });
    
    nextLevelButton.addEventListener('click', () => {
        if (currentLevel < 100) {
            currentLevel++;
            loadLevel(currentLevel);
        }
    });
    
    restartLevelButton.addEventListener('click', () => {
        loadLevel(currentLevel);
    });
    
    // Modal de victoria
    nextLevelModalButton.addEventListener('click', () => {
        hideVictoryModal();
        if (currentLevel < 100) {
            currentLevel++;
            loadLevel(currentLevel);
        }
    });
    
    // Tutorial
    startGameButton.addEventListener('click', hideTutorial);
}

function handleSelectionStart(event) {
    if (event.target.classList.contains('cell')) {
        selectedCells = [event.target];
        highlightSelectedCells();
        updateSelectionLine();
    }
}

function handleSelectionMove(event) {
    if (event.buttons !== 1 || !selectedCells.length) return;
    
    if (event.target.classList.contains('cell') && !selectedCells.includes(event.target)) {
        // Verificar si la celda es adyacente a la última seleccionada
        const lastCell = selectedCells[selectedCells.length - 1];
        const lastRow = parseInt(lastCell.dataset.row);
        const lastCol = parseInt(lastCell.dataset.col);
        const currentRow = parseInt(event.target.dataset.row);
        const currentCol = parseInt(event.target.dataset.col);
        
        // Calcular diferencia
        const rowDiff = Math.abs(currentRow - lastRow);
        const colDiff = Math.abs(currentCol - lastCol);
        
        // Verificar si es adyacente y en línea recta
        if (
            (rowDiff === 0 && colDiff === 1) || // Horizontal
            (rowDiff === 1 && colDiff === 0) || // Vertical
            (rowDiff === 1 && colDiff === 1 && currentLevel > 59) // Diagonal (solo para niveles 60+)
        ) {
            // Asegurarse de que la dirección se mantiene
            if (selectedCells.length > 1) {
                const prevRow = parseInt(selectedCells[selectedCells.length - 2].dataset.row);
                const prevCol = parseInt(selectedCells[selectedCells.length - 2].dataset.col);
                
                const currentDirection = {
                    rowDir: lastRow - prevRow,
                    colDir: lastCol - prevCol
                };
                
                const newDirection = {
                    rowDir: currentRow - lastRow,
                    colDir: currentCol - lastCol
                };
                
                // Si la dirección cambia, no permitir la selección
                if (currentDirection.rowDir !== newDirection.rowDir || 
                    currentDirection.colDir !== newDirection.colDir) {
                    return;
                }
            }
            
            selectedCells.push(event.target);
            highlightSelectedCells();
            updateSelectionLine();
        }
    }
}

function handleSelectionEnd() {
    if (selectedCells.length > 0) {
        checkSelectedWord();
        
        // Ocultar la línea de selección con un retraso para efecto visual
        setTimeout(() => {
            selectionLine.style.opacity = '0';
        }, 200);
        
        selectedCells = [];
        clearHighlightedCells();
    }
}

function handleTouchStart(event) {
    event.preventDefault();
    touchStarted = true;
    const touch = event.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    
    if (element && element.classList.contains('cell')) {
        selectedCells = [element];
        highlightSelectedCells();
        updateSelectionLine();
    }
}

function handleTouchMove(event) {
    if (!touchStarted) return;
    event.preventDefault();
    
    const touch = event.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    
    if (element && element.classList.contains('cell') && !selectedCells.includes(element)) {
        // Verificar si la celda es adyacente a la última seleccionada
        const lastCell = selectedCells[selectedCells.length - 1];
        const lastRow = parseInt(lastCell.dataset.row);
        const lastCol = parseInt(lastCell.dataset.col);
        const currentRow = parseInt(element.dataset.row);
        const currentCol = parseInt(element.dataset.col);
        
        // Calcular diferencia
        const rowDiff = Math.abs(currentRow - lastRow);
        const colDiff = Math.abs(currentCol - lastCol);
        
        // Verificar si es adyacente y en línea recta
        if (
            (rowDiff === 0 && colDiff === 1) || // Horizontal
            (rowDiff === 1 && colDiff === 0) || // Vertical
            (rowDiff === 1 && colDiff === 1 && currentLevel > 59) // Diagonal (solo para niveles 60+)
        ) {
            // Asegurarse de que la dirección se mantiene
            if (selectedCells.length > 1) {
                const prevRow = parseInt(selectedCells[selectedCells.length - 2].dataset.row);
                const prevCol = parseInt(selectedCells[selectedCells.length - 2].dataset.col);
                
                const currentDirection = {
                    rowDir: lastRow - prevRow,
                    colDir: lastCol - prevCol
                };
                
                const newDirection = {
                    rowDir: currentRow - lastRow,
                    colDir: currentCol - lastCol
                };
                
                // Si la dirección cambia, no permitir la selección
                if (currentDirection.rowDir !== newDirection.rowDir || 
                    currentDirection.colDir !== newDirection.colDir) {
                    return;
                }
            }
            
            selectedCells.push(element);
            highlightSelectedCells();
            updateSelectionLine();
        }
    }
}

function handleTouchEnd(event) {
    if (touchStarted) {
        event.preventDefault();
        touchStarted = false;
        
        if (selectedCells.length > 0) {
            checkSelectedWord();
            
            // Ocultar la línea de selección con un retraso para efecto visual
            setTimeout(() => {
                selectionLine.style.opacity = '0';
            }, 200);
            
            selectedCells = [];
            clearHighlightedCells();
        }
    }
}

function updateSelectionLine() {
    if (selectedCells.length < 2) {
        selectionLine.style.opacity = '0';
        return;
    }
    
    const firstCell = selectedCells[0];
    const lastCell = selectedCells[selectedCells.length - 1];
    
    // Obtener las coordenadas del centro de las celdas
    const firstRect = firstCell.getBoundingClientRect();
    const lastRect = lastCell.getBoundingClientRect();
    
    const gridRect = wordSearchGrid.getBoundingClientRect();
    
    const x1 = firstRect.left + firstRect.width / 2 - gridRect.left;
    const y1 = firstRect.top + firstRect.height / 2 - gridRect.top;
    const x2 = lastRect.left + lastRect.width / 2 - gridRect.left;
    const y2 = lastRect.top + lastRect.height / 2 - gridRect.top;
    
    // Calcular la longitud y el ángulo de la línea
    const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
    
    // Aplicar estilos a la línea
    selectionLine.style.width = `${length}px`;
    selectionLine.style.left = `${x1}px`;
    selectionLine.style.top = `${y1}px`;
    selectionLine.style.transform = `rotate(${angle}deg)`;
    selectionLine.style.opacity = '1';
}

function highlightSelectedCells() {
    // Quitar resaltado de todas las celdas
    clearHighlightedCells();
    
    // Resaltar celdas seleccionadas
    selectedCells.forEach(cell => {
        cell.classList.add('selected');
    });
}

function clearHighlightedCells() {
    document.querySelectorAll('.cell.selected').forEach(cell => {
        cell.classList.remove('selected');
    });
}

function checkSelectedWord() {
    if (selectedCells.length < 3) return; // Palabras muy cortas no cuentan
    
    // Obtener la palabra formada
    const selectedWord = selectedCells.map(cell => cell.textContent).join('');
    
    // Obtener el nivel actual
    const level = currentLevel <= levels.length ? levels[currentLevel - 1] : generateLevel(currentLevel);
    
    // Verificar si la palabra está en la lista
    if (level.words.includes(selectedWord) && !foundWords.includes(selectedWord)) {
        // Efecto de celebración
        selectedCells.forEach(cell => {
            cell.classList.add('celebrate');
            setTimeout(() => cell.classList.remove('celebrate'), 500);
        });
        
        foundWords.push(selectedWord);
        
        // Marcar celdas como encontradas
        selectedCells.forEach(cell => {
            cell.classList.add('found');
        });
        
        // Marcar palabra como encontrada en la lista
        const wordElement = document.querySelector(`#word-list li[data-word="${selectedWord}"]`);
        if (wordElement) {
            wordElement.classList.add('found');
            wordElement.classList.add('pulse');
            setTimeout(() => wordElement.classList.remove('pulse'), 500);
        }
        
        // Actualizar barra de progreso
        updateProgressBar(foundWords.length / level.words.length * 100);
        
        // Verificar si se completó el nivel
        checkLevelCompletion(level);
    } else {
        // Efecto de error
        selectedCells.forEach(cell => {
            cell.classList.add('shake');
            setTimeout(() => cell.classList.remove('shake'), 300);
        });
    }
}

function updateProgressBar(percentage) {
    levelProgressElement.style.width = `${percentage}%`;
}

function checkLevelCompletion(level) {
    if (foundWords.length === level.words.length) {
        setTimeout(() => {
            showVictoryModal();
        }, 800);
    }
}

function showVictoryModal() {
    victoryModal.classList.add('active');
}

function hideVictoryModal() {
    victoryModal.classList.remove('active');
}

function showTutorial() {
    tutorialModal.classList.add('active');
    firstTimePlayer = false;
}

function hideTutorial() {
    tutorialModal.classList.remove('active');
}

function getRandomLetter() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return letters[Math.floor(Math.random() * letters.length)];
}

// Función para generar niveles automáticamente (para los que no están definidos)
function generateLevel(levelIndex) {
    // Determinar el tamaño de la cuadrícula y número de palabras según el nivel
    let size, wordCount;
    let wordDirections = [];
    
    if (levelIndex <= 30) {
        size = 10;
        wordCount = 6;
        wordDirections = ['horizontal', 'vertical'];
    } else if (levelIndex <= 70) {
        size = 12;
        wordCount = 9;
        if (levelIndex > 50) {
            wordDirections = ['horizontal', 'vertical', 'horizontalReverse', 'verticalReverse'];
        } else {
            wordDirections = ['horizontal', 'vertical'];
        }
    } else {
        size = 15;
        wordCount = 12;
        wordDirections = ['horizontal', 'vertical', 'horizontalReverse', 'verticalReverse'];
        if (levelIndex >= 60) {
            wordDirections.push('diagonal');
        }
    }
    
   // Aquí iban las lineas que borré
   // Generar temática según el nivel
    const themes = [
        {name: "Frutas", words: ["MANZANA", "PLATANO", "NARANJA", "FRESA", "PERA", "UVA", "MELON", "SANDIA", "KIWI", "PIÑA", "CEREZA", "MANGO"]},
        {name: "Animales", words: ["PERRO", "GATO", "LEON", "TIGRE", "OSO", "LOBO", "JIRAFA", "ELEFANTE", "CEBRA", "MONO", "ZORRO", "AGUILA"]},
        {name: "Colores", words: ["ROJO", "AZUL", "VERDE", "NEGRO", "BLANCO", "GRIS", "AMARILLO", "NARANJA", "MORADO", "ROSA", "MARRON", "VIOLETA"]},
        {name: "Países", words: ["ESPAÑA", "FRANCIA", "ITALIA", "CHINA", "BRASIL", "INDIA", "MEXICO", "CANADA", "JAPON", "ALEMANIA", "RUSIA", "EGIPTO"]},
        {name: "Astronomia", words: ["TIERRA", "MARTE", "VENUS", "JUPITER", "SATURNO", "URANO", "NEPTUNO", "MERCURIO", "PLUTON", "LUNA", "SOL", "COMETA"]},
        {name: "Deportes", words: ["FUTBOL", "TENIS", "BASKET", "VOLEY", "GOLF", "RUGBY", "NATACION", "CICLISMO", "BOXEO", "KARATE", "SURF", "JUDO"]},
        {name: "Profesiones", words: ["DOCTOR", "MAESTRO", "ABOGADO", "POLICIA", "BOMBERO", "PILOTO", "COCINERO", "INGENIERO", "DENTISTA", "ESCRITOR", "PINTOR", "ACTOR"]},
        {name: "Ropa", words: ["CAMISA", "PANTALON", "FALDA", "ZAPATOS", "SOMBRERO", "ABRIGO", "BUFANDA", "GUANTES", "GORRA", "CALCETINES", "CHAQUETA", "VESTIDO"]},
        {name: "Instrumentos", words: ["PIANO", "GUITARRA", "VIOLIN", "BATERIA", "FLAUTA", "TROMPETA", "SAXOFON", "CLARINETE", "ARPA", "ACORDEON", "BAJO", "TAMBOR"]},
        {name: "Muebles", words: ["MESA", "SILLA", "SOFA", "CAMA", "ARMARIO", "ESTANTE", "ESPEJO", "LAMPARA", "COMODA", "ESCRITORIO", "TABURETE", "ALFOMBRA"]}
    ];
    
    // Seleccionar tema basado en el nivel
    const theme = themes[levelIndex % themes.length];
    
    // Seleccionar palabras aleatorias de la temática
    const selectedWords = [];
    const wordPool = [...theme.words];
    
    for (let i = 0; i < wordCount; i++) {
        if (wordPool.length > 0) {
            const randomIndex = Math.floor(Math.random() * wordPool.length);
            selectedWords.push(wordPool[randomIndex]);
            wordPool.splice(randomIndex, 1);
        }
    }
    
    // Crear una cuadrícula vacía
    const grid = Array(size).fill().map(() => Array(size).fill(''));
    
    // Posiciones de las palabras
    const positions = {};
    
    // Intentar colocar cada palabra
    selectedWords.forEach(word => {
        let placed = false;
        let attempts = 0;
        const maxAttempts = 100;
        
        while (!placed && attempts < maxAttempts) {
            attempts++;
            
            // Elegir dirección aleatoria
            const direction = wordDirections[Math.floor(Math.random() * wordDirections.length)];
            
            // Determinar posición inicial y final según la dirección
            let startRow, startCol, endRow, endCol;
            
            switch (direction) {
                case 'horizontal':
                    startRow = Math.floor(Math.random() * size);
                    startCol = Math.floor(Math.random() * (size - word.length + 1));
                    endRow = startRow;
                    endCol = startCol + word.length - 1;
                    break;
                    
                case 'vertical':
                    startRow = Math.floor(Math.random() * (size - word.length + 1));
                    startCol = Math.floor(Math.random() * size);
                    endRow = startRow + word.length - 1;
                    endCol = startCol;
                    break;
                    
                case 'horizontalReverse':
                    startRow = Math.floor(Math.random() * size);
                    startCol = Math.floor(Math.random() * (size - word.length + 1)) + word.length - 1;
                    endRow = startRow;
                    endCol = startCol - (word.length - 1);
                    break;
                    
                case 'verticalReverse':
                    startRow = Math.floor(Math.random() * (size - word.length + 1)) + word.length - 1;
                    startCol = Math.floor(Math.random() * size);
                    endRow = startRow - (word.length - 1);
                    endCol = startCol;
                    break;
                    
                case 'diagonal':
                    startRow = Math.floor(Math.random() * (size - word.length + 1));
                    startCol = Math.floor(Math.random() * (size - word.length + 1));
                    endRow = startRow + word.length - 1;
                    endCol = startCol + word.length - 1;
                    break;
            }
            
            // Verificar si la palabra cabe sin superponerse
            let canPlace = true;
            const cells = [];
            


            //Intento de mejora
            // Configuración para mejor detección diagonal

// Función para calcular dirección con tolerancia diagonal
function calculateDirection(deltaRow, deltaCol) {
    const absRow = Math.abs(deltaRow);
    const absCol = Math.abs(deltaCol);
    
    // Si no hay movimiento significativo
    if (absRow <= 1 && absCol <= 1) {
        return [0, 0];
    }

    // Detección de dirección con tolerancia mejorada
    if (absRow === 0) {
        // Horizontal
        return [0, deltaCol > 0 ? 1 : -1];
    } else if (absCol === 0) {
        // Vertical
        return [deltaRow > 0 ? 1 : -1, 0];
    } else {
        // Diagonal - con tolerancia mejorada
        const ratio = absRow / absCol;
        
        if (ratio >= (1 - DIAGONAL_TOLERANCE) && ratio <= (1 + DIAGONAL_TOLERANCE)) {
            // Es una diagonal válida
            return [
                deltaRow > 0 ? 1 : -1,
                deltaCol > 0 ? 1 : -1
            ];
        } else if (ratio < 0.5) {
            // Más horizontal que diagonal - snap a horizontal
            return [0, deltaCol > 0 ? 1 : -1];
        } else if (ratio > 2) {
            // Más vertical que diagonal - snap a vertical
            return [deltaRow > 0 ? 1 : -1, 0];
        }
    }
    
    return null;
}

// Función para obtener selección linear con snapping
function getLinearSelection(startRow, startCol, endRow, endCol, direction) {
    const cells = [];
    const [dirRow, dirCol] = direction;
    
    if (dirRow === 0 && dirCol === 0) {
        return [grid[startRow][startCol]]; // Cambia 'grid' por tu variable de grid
    }

    let currentRow = startRow;
    let currentCol = startCol;
    
    // Calcular la distancia máxima en la dirección dada
    let maxSteps = Math.max(
        Math.abs(endRow - startRow),
        Math.abs(endCol - startCol)
    );

    for (let i = 0; i <= maxSteps; i++) {
        if (currentRow >= 0 && currentRow < gridSize && // Cambia 'gridSize' por tu variable
            currentCol >= 0 && currentCol < gridSize) {
            cells.push(grid[currentRow][currentCol]);
        }
        
        currentRow += dirRow;
        currentCol += dirCol;
        
        // Verificar si hemos llegado cerca del objetivo
        if (Math.abs(currentRow - endRow) <= 1 && Math.abs(currentCol - endCol) <= 1) {
            break;
        }
    }

    return cells;
}

// Función mejorada para manejar el movimiento de selección
function handleSelectionMoveImproved(currentCell) {
    if (!isSelecting || !startCell) return;

    // Limpiar selección anterior
    selectedCells.forEach(cell => {
        if (!cell.classList.contains('found')) {
            cell.classList.remove('selecting');
        }
    });

    // Calcular dirección con tolerancia mejorada
    const startRow = parseInt(startCell.dataset.row);
    const startCol = parseInt(startCell.dataset.col);
    const currentRow = parseInt(currentCell.dataset.row);
    const currentCol = parseInt(currentCell.dataset.col);

    const deltaRow = currentRow - startRow;
    const deltaCol = currentCol - startCol;

    // Determinar dirección con tolerancia diagonal mejorada
    let direction = calculateDirection(deltaRow, deltaCol);
    
    if (direction) {
        selectedCells = getLinearSelection(
            startRow, startCol, 
            currentRow, currentCol, 
            direction
        );

        // Aplicar estilo de selección
        selectedCells.forEach(cell => {
            if (!cell.classList.contains('found')) {
                cell.classList.add('selecting');
            }
        });
    }
}

//FIN INTENTO DE MEJORA
//INICIO SEGUNDA MEJORA
// Configuración mejorada
const DIAGONAL_TOLERANCE = 0.4; // Aumentar tolerancia al 40%
const CELL_PADDING = 8; // Padding extra para cada celda (píxeles)

// Función para expandir el área de detección de cada celda
function expandCellHitArea() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.style.padding = `${CELL_PADDING}px`;
        cell.style.margin = `-${CELL_PADDING/2}px`;
        cell.style.boxSizing = 'border-box';
    });
}

// ==============================================
// MEJORA 2: PREDICCIÓN DE DIRECCIÓN INTELIGENTE
// ==============================================

let lastDirection = null;
let directionHistory = [];

function predictDirection(deltaRow, deltaCol) {
    const absRow = Math.abs(deltaRow);
    const absCol = Math.abs(deltaCol);
    
    // Mantener historial de direcciones
    if (absRow > 0 || absCol > 0) {
        const currentDir = [
            deltaRow > 0 ? 1 : deltaRow < 0 ? -1 : 0,
            deltaCol > 0 ? 1 : deltaCol < 0 ? -1 : 0
        ];
        directionHistory.push(currentDir);
        
        // Mantener solo las últimas 3 direcciones
        if (directionHistory.length > 3) {
            directionHistory.shift();
        }
    }
    
    // Si hay un patrón consistente, usarlo
    if (directionHistory.length >= 2) {
        const avgDirRow = directionHistory.reduce((sum, dir) => sum + dir[0], 0) / directionHistory.length;
        const avgDirCol = directionHistory.reduce((sum, dir) => sum + dir[1], 0) / directionHistory.length;
        
        if (Math.abs(avgDirRow) > 0.3 || Math.abs(avgDirCol) > 0.3) {
            return [
                avgDirRow > 0.3 ? 1 : avgDirRow < -0.3 ? -1 : 0,
                avgDirCol > 0.3 ? 1 : avgDirCol < -0.3 ? -1 : 0
            ];
        }
    }
    
    // Fallback a cálculo normal
    return calculateDirection(deltaRow, deltaCol);
}

// ==============================================
// MEJORA 3: VIBRACIÓN Y FEEDBACK HÁPTICO
// ==============================================

function provideTactileFeedback(type = 'light') {
    // Vibración en móviles
    if (navigator.vibrate) {
        switch(type) {
            case 'start':
                navigator.vibrate(50); // Vibración corta al iniciar
                break;
            case 'diagonal':
                navigator.vibrate([30, 10, 30]); // Patrón para diagonal
                break;
            case 'found':
                navigator.vibrate([100, 50, 100, 50, 100]); // Patrón para palabra encontrada
                break;
            default:
                navigator.vibrate(20);
        }
    }
}

// ==============================================
// MEJORA 4: LÍNEA DE SELECCIÓN VISUAL
// ==============================================

let selectionLine = null;

function createSelectionLine() {
    if (!selectionLine) {
        selectionLine = document.createElement('div');
        selectionLine.className = 'selection-line';
        selectionLine.style.cssText = `
            position: absolute;
            background: rgba(33, 150, 243, 0.7);
            height: 4px;
            border-radius: 2px;
            pointer-events: none;
            z-index: 1000;
            transform-origin: left center;
            box-shadow: 0 0 10px rgba(33, 150, 243, 0.5);
            transition: all 0.1s ease;
        `;
        document.body.appendChild(selectionLine);
    }
}

function updateSelectionLine(startCell, endCell) {
    if (!selectionLine || !startCell || !endCell) return;
    
    const startRect = startCell.getBoundingClientRect();
    const endRect = endCell.getBoundingClientRect();
    
    const startX = startRect.left + startRect.width / 2;
    const startY = startRect.top + startRect.height / 2;
    const endX = endRect.left + endRect.width / 2;
    const endY = endRect.top + endRect.height / 2;
    
    const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
    const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;
    
    selectionLine.style.left = startX + 'px';
    selectionLine.style.top = startY + 'px';
    selectionLine.style.width = length + 'px';
    selectionLine.style.transform = `rotate(${angle}deg)`;
    selectionLine.style.display = 'block';
}

function hideSelectionLine() {
    if (selectionLine) {
        selectionLine.style.display = 'none';
    }
}
//FIN SEGUNDA MEJORA
            // Calcular incrementos según la dirección
            let rowIncrement = 0;
            let colIncrement = 0;
            
            switch (direction) {
                case 'horizontal':
                    colIncrement = 1;
                    break;
                case 'vertical':
                    rowIncrement = 1;
                    break;
                case 'horizontalReverse':
                    colIncrement = -1;
                    break;
                case 'verticalReverse':
                    rowIncrement = -1;
                    break;
                case 'diagonal':
                    rowIncrement = 1;
                    colIncrement = 1;
                    break;
            }
            
            // Verificar cada celda
            for (let i = 0; i < word.length; i++) {
                const row = startRow + (i * rowIncrement);
                const col = startCol + (i * colIncrement);
                cells.push({row, col});
                
                // Si la celda ya está ocupada, verificar si es con la misma letra
                if (grid[row][col] && grid[row][col] !== word[i]) {
                    canPlace = false;
                    break;
                }
            }
            
            // Si se puede colocar, añadir la palabra a la cuadrícula
            if (canPlace) {
                for (let i = 0; i < word.length; i++) {
                    const {row, col} = cells[i];
                    grid[row][col] = word[i];
                }
                
                // Guardar la posición
                positions[word] = {
                    start: {row: startRow, col: startCol},
                    end: {row: endRow, col: endCol},
                    direction
                };
                
                placed = true;
            }
        }
        
        // Si no se pudo colocar después de muchos intentos, reducir el tamaño de la palabra
        if (!placed) {
            console.warn(`No se pudo colocar la palabra: ${word}`);
        }
    });
    
    // Rellenar espacios vacíos con letras aleatorias
    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            if (!grid[row][col]) {
                grid[row][col] = getRandomLetter();
            }
        }
    }
    
    // Convertir la matriz en un arreglo de strings
    const gridStrings = grid.map(row => row.join(''));
    
    return {
        theme: theme.name,
        words: selectedWords,
        grid: gridStrings,
        positions,
        bgClass: `level-bg-${(levelIndex % 20) + 1}`
    };
}

window.addEventListener('DOMContentLoaded', initGame);