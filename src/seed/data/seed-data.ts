interface SeedCategory {
    name: string;
    description: string;
}

interface SeedProduct {
    name: string;
    price: number;
    description: string;
    stock: number;
    tags: string[];
    images: object[];
    models: object[];
    categoryId: number;
}

interface SeedDataProduct {
    categories: SeedCategory[];
    products: SeedProduct[];
}
export const initialData: SeedDataProduct = {
    categories: [
        {
            name: "Hornos Convencionales",
            description: "Utilizan calor seco para cocinar alimentos y son ideales para hornear pasteles, panes, asar aves, entre otros.",
        },
        {
            name: "Hornos de Convección",
            description: "Incorporan un ventilador que distribuye el calor de manera uniforme, acelerando el proceso de cocción y proporcionando resultados más consistentes.",
        },
        {
            name: "Planchas de Cocina",
            description: "Superficies lisas y planas que se calientan para cocinar alimentos como hamburguesas, panqueques, y vegetales.",
        },
        {
            name: "Parrillas",
            description: "Utilizadas para cocinar carnes, pescados y vegetales mediante la aplicación de calor directo de una fuente de combustible como carbón, gas o electricidad.",
        },
        {
            name: "Freidoras de Inmersión",
            description: "Sumergen los alimentos en aceite caliente para freírlos hasta que estén crujientes.",
        },
        {
            name: "Freidoras de Aire",
            description: "Utilizan aire caliente en lugar de aceite para cocinar alimentos de manera más saludable y baja en grasa.",
        },
    ],

    products: [
        {
            name: "Hornallas",
            price: 500,
            description: "6 hornallas Cocinas industriales en acero inoxidable. modulo de hierro fundido 40x40. quemadores industriales",
            stock: 7,
            tags: ['hornallas', 'quemadores industriales', 'acero inoxidable'],
            images: [{ "url": "https://scontent.fsrz1-2.fna.fbcdn.net/v/t39.30808-6/439676880_862747335891336_2504946197843638808_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=5f2048&_nc_ohc=le7VXcrxDt0Q7kNvgH4tGpJ&_nc_ht=scontent.fsrz1-2.fna&oh=00_AfAGMmEKxn6ech8UTC5wbPoyL6pXeOAi9zJkVoV6VyU21g&oe=664181C2", "type": "image" },],
            "models": [
                { "url": "http://model1.to", "format": ".3ds", "price": 25.0 }
            ],
            categoryId: 2
        },
        {
            name: "Hornallas",
            price: 200,
            description: "4 Hornallas largas. Cocinas industriales en acero inoxidable.",
            stock: 5,
            tags: ['hornallas', 'quemadores industriales', 'acero inoxidable'],
            images: [{ "url": "https://scontent.fsrz1-1.fna.fbcdn.net/v/t39.30808-6/440767756_862747309224672_1675088932799776308_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_ohc=pMUpwCNxjloQ7kNvgEraF69&_nc_ht=scontent.fsrz1-1.fna&oh=00_AfCuFVWIe1bTJrMlVMM_DuMZqFfEFAhamzWNnr3ti6hboA&oe=6641812C", "type": "image" },],
            "models": [
                { "url": "http://model2.to", "format": ".3ds", "price": 25.0 }
            ],
            categoryId: 2
        },
    ]
}