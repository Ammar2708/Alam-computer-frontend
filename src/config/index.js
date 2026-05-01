import { Laptop, Printer } from "lucide-react";

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
        options: [
            {id: "Laptop", label: "Laptop"},
            {id: "Printer", label: "Printer"},
            {id: "LCD", label: "LCD"},
            {id: "accessories", label: "Accessories"},
            {id: "All In One", label: "All In One"},

        ]
        },
        {
        name: "brand",
        label: "Brand",
        componentType: "select",
        options: [
            {id: "Dell", label: "Dell"},
            {id: "HP", label: "HP"},
            {id: "Lenovo", label: "Lenovo"},
            {id: "Acer", label: "Acer"},
            {id: "Apple", label: "Apple"},
            {id: "Cannon", label: "Cannon"},
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
    { id: "Laptop", label: "Laptop" },
    { id: "Printer", label: "Printer" },
    { id: "Lcd", label: "LCD" },
    { id: "accessories", label: "Accessories" },
    { id: "All In One", label: "All In One" },
  ],
  brand: [
    { id: "HP", label: "HP" },
    { id: "Dell", label: "Dell" },
    { id: "Apple", label: "Apple" },
    { id: "lenovo", label: "Lenovo" },
    { id: "Acer", label: "Acer" },
    { id: "Cannon", label: "Cannon" },
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
  LCD: "LCD",
  accessories: "Accessories",
  AllInOne: "All In One",
};

export const brandOptionsMap = {
  Hp: "HP",
  Dell: "Dell",
  Apple: "Apple",
  lenovo: "Lenovo",
  Acer: "Acer",
  Cannon: "Cannon",
};
            

        