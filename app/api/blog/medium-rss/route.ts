import { NextResponse } from "next/server"

interface MediumPost {
  title: string
  link: string
  pubDate: string
  description: string
  thumbnail?: string
  categories: string[]
}

export async function GET() {
  try {
    // You can configure this via environment variable
    const mediumRssUrl =
      process.env.MEDIUM_RSS_URL || "https://medium.com/feed/@yourusername"

    const response = await fetch(mediumRssUrl, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      throw new Error("Failed to fetch Medium RSS feed")
    }

    const xml = await response.text()

    // Parse RSS XML to extract posts
    const posts = parseRssFeed(xml)

    return NextResponse.json(posts)
  } catch (error) {
    console.error("Error fetching Medium RSS:", error)
    return NextResponse.json(
      { error: "Failed to fetch Medium posts", posts: [] },
      { status: 500 }
    )
  }
}

function parseRssFeed(xml: string): MediumPost[] {
  const posts: MediumPost[] = []

  // Extract items from RSS feed
  const itemRegex = /<item>([\s\S]*?)<\/item>/g
  const items = xml.match(itemRegex) || []

  for (const item of items) {
    try {
      const title = extractTag(item, "title")
      const link = extractTag(item, "link")
      const pubDate = extractTag(item, "pubDate")
      const description = extractTag(item, "description")
      const content = extractTag(item, "content:encoded") || description

      // Extract thumbnail from content
      const imgMatch = content.match(/<img[^>]+src="([^">]+)"/)
      const thumbnail = imgMatch ? imgMatch[1] : undefined

      // Extract categories
      const categoryRegex = /<category>(.*?)<\/category>/g
      const categories: string[] = []
      let categoryMatch
      while ((categoryMatch = categoryRegex.exec(item))) {
        categories.push(categoryMatch[1])
      }

      // Create excerpt from description (strip HTML and truncate)
      const excerpt = stripHtml(description).substring(0, 200) + "..."

      posts.push({
        title: decodeHtml(title),
        link,
        pubDate,
        description: excerpt,
        thumbnail,
        categories,
      })
    } catch (error) {
      console.error("Error parsing RSS item:", error)
    }
  }

  return posts
}

function extractTag(xml: string, tagName: string): string {
  const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)</${tagName}>`)
  const match = xml.match(regex)
  return match ? match[1].trim() : ""
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim()
}

function decodeHtml(html: string): string {
  return html
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
}
