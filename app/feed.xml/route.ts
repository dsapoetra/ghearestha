import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Get Medium RSS URL from environment variable
    const mediumRssUrl =
      process.env.MEDIUM_RSS_URL || "https://medium.com/feed/@yourusername"

    const response = await fetch(mediumRssUrl, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      throw new Error("Failed to fetch Medium RSS feed")
    }

    const xml = await response.text()

    // Return the RSS XML directly
    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    })
  } catch (error) {
    console.error("Error fetching RSS feed:", error)

    // Return a minimal valid RSS feed on error
    const errorFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Blog RSS Feed</title>
    <description>RSS feed temporarily unavailable</description>
    <link>${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}</link>
  </channel>
</rss>`

    return new NextResponse(errorFeed, {
      headers: {
        "Content-Type": "application/xml",
      },
      status: 500,
    })
  }
}
