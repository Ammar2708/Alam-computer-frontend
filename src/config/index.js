export const regiterFormConrol = [
    {
        name: "username",
        label: "User Name",
        placeholder: "Name",
        type: "text",        
        componentType: "input",
        },
        {
        name: "email",
        label: "Email",
        placeholder: "Email",
        type: "email",        
        componentType: "input",
        },
        {
        name: "password",
        label: "Password",
        placeholder: "Password",
        type: "password",        
        componentType: "input",
        },
]


export const loginFormConrol = [
    {
        name: "email",
        label: "Email",
        placeholder: "Email",
        type: "email",        
        componentType: "input",
        },
        {
        name: "password",
        label: "Password",
        placeholder: "Password",
        type: "password",        
        componentType: "input",
        },
]

export const productCategoryOptions = [
  { id: "Laptop", label: "Laptop" },
  { id: "Lcd", label: "Monitor / LCD" },
  { id: "Printer", label: "Printer" },
  { id: "Ink", label: "Ink" },
  { id: "HDD", label: "HDD" },
  { id: "SSD", label: "SSD" },
  { id: "Network", label: "Network" },
  { id: "All In One", label: "All In One" },
  { id: "Towner", label: "Toners" },
  { id: "accessories", label: "Accessories" },
];

export const addProductFormElement = [
    {
        name: "title",
        label: " Title",
        placeholder: "Enter product title",
        type: "text",        
        componentType: "input",
        },
        {
        name: "description",
        label: "Description",
        placeholder: "Enter product description",
              
        componentType: "textarea",
        },
        {
        name: "category",
        label: "Category",
        placeholder: "Enter product category",
        type: "text",        
        componentType: "select",
        options: productCategoryOptions
        },
        {
        name: "brand",
        label: "Brand",
        componentType: "select",
        options: [
            {id: "Dell", label: "Dell"},
            {id: "HP", label: "HP"},
            {id: "EPSON", label: "EPSON"},
            {id: "Lenovo", label: "Lenovo"},
            {id: "Amercian", label: "Amercian"},
            {id: "Acer", label: "Acer"},
            {id: "Apple", label: "Apple"},
            {id: "Cannon", label: "Cannon"},
            {id: "Tp-link", label: "Tp-link"},
            {id: "Toshiba", label: "Toshiba"},
            {id: "Seagate", label: "Seagate"},
            {id: "Intel", label: "Intel"},
            {id: "Samsung", label: "Samsung"},
            {id: "HGST", label: "HGST"},
            {id: "WD Black", label: "WD Black"},
            {id: "WD Blue", label: "WD Blue"},
            {id: "WD Purple", label: "WD Purple"},
            {id: "D-link", label: "D-link"},
            {id: "Edimax", label: "Edimax"},
            {id: "Others", label: "Others"},
        ]
        },
        {label: "Total Stock",
        name: "totalStock",
        componetsType: "input",
        type: "number",
        placeholder: "Enter total stock"
        },
        {
          label: "Price",
          name: "price",
          componetsType: "input",
          type: "number",
          placeholder: "Enter regular price",
    },
    ]

    export const filterOptions = {
  category: [
    ...productCategoryOptions.filter((option) => option.id !== "SSD"),
  ],
  brand: [
    { id: "HP", label: "HP" },
    { id: "EPSON", label: "EPSON" },
    { id: "Dell", label: "Dell" },
    { id: "Lenovo", label: "Lenovo" },
    { id: "Amercian", label: "Amercian" },
    { id: "Apple", label: "Apple" },
    { id: "lenovo", label: "Lenovo" },
    { id: "Acer", label: "Acer" },
    { id: "Cannon", label: "Cannon" },
    { id: "Tp-link", label: "Tp-link" },
    { id: "Toshiba", label: "Toshiba" },
    { id: "Seagate", label: "Seagate" },
    { id: "Intel", label: "Intel" },
    { id: "Samsung", label: "Samsung" },
    { id: "HGST", label: "HGST" },
    { id: "WD Black", label: "WD Black" },
    { id: "WD Blue", label: "WD Blue" },
    { id: "WD Purple", label: "WD Purple" },
    { id: "D-link", label: "D-link" },
    { id: "Edimax", label: "Edimax" },
    { id: "Others", label: "Others" },
  ],
};

export const sortOptions = [
  { id: "price-lowtohigh", label: "Price: Low to High" },
  { id: "price-hightolow", label: "Price: High to Low" },
  { id: "title-atoz", label: "Title: A to Z" },
  { id: "title-ztoa", label: "Title: Z to A" },
];
        

    export const shoppingViewHeaderMenuItems = [
        {
            id: "home",
            label: "Home",
            path: "/shop/home",
        },
        {
            id: "products",
            label: "Products",
            path: "/shop/listing",
        },
        {
            id: "men",
            label: "men",
            path: "/shop/listing",
        },
        {
            id: "women",
            label: "women",
            path: "/shop/listing",
        },
        {
            id: "kids",
            label: "kids",
            path: "/shop/listing",
        },
        {
            id: "search",
            label: "Search",
            path: "/shop/search",
        }
    ]



    export const categoryOptionsMap = {
  Laptop: "Laptop",
  Printer: "Printer",
  Ink: "Ink",
  HDD: "HDD",
  SSD: "SSD",
  Network: "Network",
  LCD: "Monitor / LCD",
  Lcd: "Monitor / LCD",
  accessories: "Accessories",
  "All In One": "All In One",
  AllInOne: "All In One",
  Towner: "Toners",
  Toner: "Toners",
  Toners: "Toners",
};

export const brandOptionsMap = {
  HP: "HP",
  Hp: "HP",
  EPSON: "EPSON",
  Epson: "EPSON",
  epson: "EPSON",
  Dell: "Dell",
  Lenovo: "Lenovo",
  Amercian: "Amercian",
  Apple: "Apple",
  lenovo: "Lenovo",
  Acer: "Acer",
  Cannon: "Cannon",
  "Tp-link": "Tp-link",
  Toshiba: "Toshiba",
  Seagate: "Seagate",
  Intel: "Intel",
  Samsung: "Samsung",
  HGST: "HGST",
  "WD Black": "WD Black",
  "WD Blue": "WD Blue",
  "WD Purple": "WD Purple",
  "D-link": "D-link",
  Edimax: "Edimax",
  Others: "Others",
};
            

        
