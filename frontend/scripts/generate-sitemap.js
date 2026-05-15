import fs from "fs";
import path from "path";
import { SitemapStream, streamToPromise } from "sitemap";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = "https://www.reportinshort.com";

const routes = [
  "/",
  "/about",
  "/how-it-works",
  "/pricing",
  "/contact",
  "/blog",
  "/team",
  "/privacy-policy",
  "/terms",
  "/data-policy",
  "/gdpr",
  "/payment-refund",
];

async function generateSitemap() {
  try {
    const sitemap = new SitemapStream({
      hostname: BASE_URL,
    });

    routes.forEach((route) => {
      sitemap.write({
        url: route,
        changefreq: "weekly",
        priority: route === "/" ? 1.0 : 0.8,
        lastmod: new Date().toISOString(),
      });
    });

    sitemap.end();

    const sitemapOutput = await streamToPromise(sitemap);

    fs.writeFileSync(
      path.resolve(__dirname, "../public/sitemap.xml"),
      sitemapOutput.toString()
    );

    console.log("sitemap.xml generated");
  } catch (error) {
    console.log("Error generating sitemap:", error);
  }
}

generateSitemap();