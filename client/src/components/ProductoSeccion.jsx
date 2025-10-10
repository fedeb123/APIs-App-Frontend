import { Card } from "./ui/Card"


// esto es un placeholder
const products = [
  {
    id: "food",
    title: "Food",
    description: "Nutritious and delicious food for your furry friend.",
    image: "/bowl-of-premium-pet-food-kibble-on-teal-background.jpg",
    bgColor: "bg-[oklch(0.55_0.12_195)]",
  },
  {
    id: "toys",
    title: "Toys",
    description: "Fun and engaging toys for hours of playtime.",
    image: "/colorful-pet-toys-rope-balls-on-light-blue-backgro.jpg",
    bgColor: "bg-[oklch(0.75_0.08_210)]",
  },
  {
    id: "accessories",
    title: "Accessories",
    description: "Stylish and comfortable accessories for every occasion.",
    image: "/blue-leather-pet-collar-on-light-gray-background-p.jpg",
    bgColor: "bg-[oklch(0.90_0.01_85)]",
  },
]

export function ProductoSeccion() {
  return (
    <section className="container mx-auto px-4 py-12 md:px-6 md:py-16">
      <h2 className="mb-10 text-3xl font-bold md:text-4xl">Nuestra Seleccion de Productos</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card
            key={product.id}
            className={`group overflow-hidden rounded-3xl border-0 ${product.bgColor} transition-transform hover:scale-[1.02]`}
          >
            <div className="aspect-square p-8">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.title}
                className="h-full w-full object-contain"
              />
            </div>
            <div className="bg-background p-6">
              <h3 className="mb-2 text-xl font-bold">{product.title}</h3>
              <p className="text-sm text-muted-foreground">{product.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}
