import type { Metadata } from "next";
import { getHomePageData, getSiteSettings } from "@/lib/content";
import { getAllPostsSafe } from "@/lib/posts";
import {
  alternates,
  graph,
  homeDescription,
  homeTitle,
  openGraph,
  personNode,
  profilePageNode,
  websiteNode,
} from "@/lib/seo";
import { absoluteUrl, tidy } from "@/lib/site";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Hero } from "@/components/site/Hero";
import { LatestPosts } from "@/components/site/LatestPosts";
import { About } from "@/components/site/About";
import { Experience } from "@/components/site/Experience";
import { Projects } from "@/components/site/Projects";
import { Skills } from "@/components/site/Skills";
import { Education } from "@/components/site/Education";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { JsonLd } from "@/components/ui/JsonLd";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const title = homeTitle(settings);
  const description = homeDescription(settings);

  return {
    title: { absolute: title },
    description,
    alternates: alternates(settings, "/"),
    openGraph: openGraph(settings, {
      type: "profile",
      url: absoluteUrl("/"),
      title,
      description,
      firstName: settings.firstName,
      lastName: settings.lastName,
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: title }],
    }),
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function HomePage() {
  const [{ settings, experience, projects, skills, education, socialLinks }, posts] =
    await Promise.all([getHomePageData(), getAllPostsSafe()]);

  return (
    <>
      <JsonLd
        data={graph(
          websiteNode(settings),
          personNode({ settings, socialLinks, experience, education, skills }),
          profilePageNode(settings)
        )}
      />

      <SiteHeader />

      <main id="main" className="flex-1">
        <Hero settings={settings} socialLinks={socialLinks} experience={experience} />
        <LatestPosts posts={posts.slice(0, 7)} totalCount={posts.length} />
        <About
          settings={settings}
          experience={experience}
          education={education}
          skills={skills}
          postCount={posts.length}
        />
        <Experience items={experience} />
        <Projects items={projects} />
        <Skills groups={skills} />
        <Education items={education} />
        <Contact email={settings.email} location={tidy(settings.location)} socialLinks={socialLinks} />
      </main>

      <Footer />
    </>
  );
}
