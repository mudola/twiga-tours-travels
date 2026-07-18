import { motion } from 'framer-motion'
import { Layout } from '@/components/layout/Layout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, ArrowRight, BookOpen, User } from 'lucide-react'

interface Post {
  slug: string
  title: string
  excerpt: string
  category: string
  author: string
  date: string
  readTime: string
  image: string
}

const POSTS: Post[] = [
  {
    slug: 'great-migration-guide',
    title: "The Ultimate Guide to Kenya's Great Migration",
    excerpt:
      "Witness one of nature's most dramatic spectacles — over 1.5 million wildebeest, zebras, and gazelles thundering across the Mara River. Here's everything you need to plan the perfect migration safari.",
    category: 'Safari Tips',
    author: 'James Kamau',
    date: 'June 12, 2026',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&q=80&fit=crop',
  },
  {
    slug: 'diani-beach-hidden-gems',
    title: "10 Hidden Gems Along Kenya's Diani Coast",
    excerpt:
      'Beyond the postcard beaches, Diani hides extraordinary snorkelling reefs, mangrove forest kayaking, and ancient Swahili ruins waiting to be discovered by the curious traveller.',
    category: 'Coastal',
    author: 'Aisha Mwende',
    date: 'May 28, 2026',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=800&q=80&fit=crop',
  },
  {
    slug: 'packing-list-kenya-safari',
    title: 'The Perfect Kenya Safari Packing List',
    excerpt:
      'Packing for a safari requires balancing practicality with weight limits. Our experienced guides share what to bring, what to leave at home, and the one item most travellers forget.',
    category: 'Travel Tips',
    author: 'Samuel Odhiambo',
    date: 'May 10, 2026',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&q=80&fit=crop',
  },
  {
    slug: 'amboseli-elephants',
    title: "Amboseli's Giants: An Elephant Researcher's View",
    excerpt:
      "Dr. Cynthia Moss has studied Amboseli's elephant families for over 50 years. We sat down with her to understand the science, the stories, and why protecting these animals matters now more than ever.",
    category: 'Wildlife',
    author: 'Leah Njeri',
    date: 'April 22, 2026',
    readTime: '10 min read',
    image: 'https://images.unsplash.com/photo-1551966775-a4ddc8df052b?w=800&q=80&fit=crop',
  },
  {
    slug: 'maasai-culture',
    title: 'Understanding Maasai Culture: A Respectful Guide',
    excerpt:
      "The Maasai people are central to Kenya's cultural identity. Learn how to engage respectfully with communities, support authentic village visits, and avoid the pitfalls of performative tourism.",
    category: 'Culture',
    author: 'Faith Kosgei',
    date: 'March 15, 2026',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1434394354979-a235cd36269d?w=800&q=80&fit=crop',
  },
  {
    slug: 'solo-travel-kenya',
    title: 'Solo Travel in Kenya: What No One Tells You',
    excerpt:
      "Solo safari travel is on the rise — and Kenya is one of the best destinations for it. From group join-in tours to private experiences, here's how to make the most of going it alone.",
    category: 'Solo Travel',
    author: 'Priya Sharma',
    date: 'February 8, 2026',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1621414050946-1e7e1f854774?w=800&q=80&fit=crop',
  },
]

const CATEGORIES = ['All', 'Safari Tips', 'Coastal', 'Travel Tips', 'Wildlife', 'Culture', 'Solo Travel']

export default function Blog() {
  return (
    <Layout>
      {/* Header */}
      <div className="pt-28 pb-14 bg-card border-b">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-2 text-primary text-sm font-semibold uppercase tracking-widest mb-4">
              <BookOpen size={14} />
              Travel Journal
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 leading-tight">
              Stories, Tips &<br />Safari Insights
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Expert guides, wildlife researchers, and seasoned travellers share their
              knowledge of East Africa's most remarkable places.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="py-16 container mx-auto px-4 md:px-6">
        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-12">
          {CATEGORIES.map((cat, i) => (
            <button
              key={cat}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                i === 0
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured post */}
        <motion.article
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="group relative rounded-3xl overflow-hidden mb-10 cursor-pointer shadow-xl hover:shadow-2xl transition-shadow duration-400"
        >
          <div className="aspect-[21/9] bg-muted overflow-hidden">
            <img
              src={POSTS[0].image}
              alt={POSTS[0].title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-0 inset-x-0 p-6 md:p-10 text-white">
            <Badge className="bg-primary/90 text-xs mb-3">{POSTS[0].category}</Badge>
            <h2 className="font-serif text-2xl md:text-4xl font-bold leading-tight mb-3 max-w-2xl">
              {POSTS[0].title}
            </h2>
            <p className="text-white/75 text-sm md:text-base max-w-xl line-clamp-2 mb-4">
              {POSTS[0].excerpt}
            </p>
            <div className="flex items-center gap-5 text-white/60 text-xs">
              <span className="flex items-center gap-1.5"><User size={11} /> {POSTS[0].author}</span>
              <span className="flex items-center gap-1.5"><Calendar size={11} /> {POSTS[0].date}</span>
              <span className="flex items-center gap-1.5"><Clock size={11} /> {POSTS[0].readTime}</span>
            </div>
          </div>
        </motion.article>

        {/* Article grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {POSTS.slice(1).map((post, i) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: i * 0.07 }}
              className="group bg-card border rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-400 cursor-pointer flex flex-col"
            >
              <div className="aspect-[16/9] overflow-hidden bg-muted">
                <img
                  src={post.image}
                  alt={post.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-600 ease-out"
                />
              </div>
              <div className="p-5 flex flex-col flex-1">
                <Badge
                  variant="secondary"
                  className="w-fit text-[11px] mb-3 bg-primary/10 text-primary border-transparent"
                >
                  {post.category}
                </Badge>
                <h3 className="font-serif font-bold text-lg leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-5 flex-1">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between pt-4 border-t text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={11} /> {post.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={11} /> {post.readTime}
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Load more */}
        <div className="text-center mt-14">
          <Button variant="outline" size="lg" className="rounded-full gap-2 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all">
            Load More Articles <ArrowRight size={15} />
          </Button>
        </div>
      </div>
    </Layout>
  )
}
