import { Link } from "react-router-dom";
const categories = [
  {
    id: 1,
    name: "Fashion",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 2,
    name: "Electronics",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 3,
    name: "Home",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 4,
    name: "Beauty",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 5,
    name: "Sports",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 6,
    name: "Groceries",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 7,
    name: "Books",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 8,
    name: "Toys",
    image: "/placeholder.svg?height=80&width=80",
  },
];

export default function CategoryImages() {
  return (
    <div className="w-full overflow-hidden  flex items-center justify-center ">
      <div className="flex overflow-x-auto gap-4 p-4 no-scrollbar ">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/category/${category.id}`}
            className="flex flex-col items-center  flex-shrink-0 w-16 gap-1"
          >
            <div className="relative w-16 h-16 rounded-full overflow-hidden bg-neutral-200">
              <img
                src={category.image || "/placeholder.svg"}
                alt={category.name}
                fill
                className="object-cover text-xs  text-gray-600 flex items-center justify-center"
              />
            </div>
            <span className="text-xs text-center text-gray-600">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
