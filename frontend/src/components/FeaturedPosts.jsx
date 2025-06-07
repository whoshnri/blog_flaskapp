

// Sample blog post data
const posts = [
  {
    id: 1,
    title: "The Future of Web Design",
    excerpt: "Exploring upcoming trends and technologies shaping the web design landscape.",
    image: "/placeholder.svg?height=400&width=600",
    date: "May 28, 2024",
  },
  {
    id: 2,
    title: "Minimalism in UI Design",
    excerpt: "How less can be more when creating intuitive user interfaces.",
    image: "/placeholder.svg?height=400&width=600",
    date: "May 24, 2024",
  },
  {
    id: 3,
    title: "Typography Trends for 2024",
    excerpt: "The most impactful font choices and pairings for modern websites.",
    image: "/placeholder.svg?height=400&width=600",
    date: "May 20, 2024",
  },
  {
    id: 4,
    title: "Color Psychology in Marketing",
    excerpt: "How color choices influence user perception and brand messaging.",
    image: "/placeholder.svg?height=400&width=600",
    date: "May 16, 2024",
  },
  {
    id: 5,
    title: "Responsive Design Best Practices",
    excerpt: "Creating seamless experiences across all device sizes.",
    image: "/placeholder.svg?height=400&width=600",
    date: "May 12, 2024",
  },
]

function FeaturedPosts() {
  return (
    <section id="featured-posts" className="py-16 px-6 md:px-12 bg-secondary/30">
      <h2 className="text-3xl font-bold mb-10">Featured Posts</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post, index) => (
          <div
            key={post.id}
            className={`overflow-hidden transition-all hover:shadow-lg ${
              index === 3 || index === 4 ? "lg:col-span-1" : ""
            }`}
          >
            <div className="aspect-[16/9] relative">
              <image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">{post.title}</h3>
            </div>
            <div>
              <p className="text-muted-foreground">{post.excerpt}</p>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">{post.date}</span>
              <a href={`/blog/${post.id}`} className="text-sm font-medium hover:underline">
                Read more
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default FeaturedPosts
