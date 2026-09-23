import { getHomePageData } from "@/lib/content";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { About } from "@/components/site/About";
import { Experience } from "@/components/site/Experience";
import { Projects } from "@/components/site/Projects";
import { Skills } from "@/components/site/Skills";
import { Education } from "@/components/site/Education";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { settings, experience, projects, skills, education } =
    await getHomePageData();

  return (
    <>
      <Nav />

      <main className="flex-1">
        <Hero
          firstName={settings.firstName}
          lastName={settings.lastName}
          roleTitle={settings.roleTitle}
          tagline={settings.tagline}
          bio={settings.bio}
          statYearsLabel={settings.statYearsLabel}
          statYearsValue={settings.statYearsValue}
          statProjLabel={settings.statProjLabel}
          statProjValue={settings.statProjValue}
          statLocLabel={settings.statLocLabel}
          location={settings.location}
          profileImage={settings.profileImage}
        />
        <About bio={settings.bio} />
        <Experience items={experience} />
        <Projects items={projects} />
        <Skills groups={skills} />
        <Education items={education} />
        <Contact
          email={settings.email}
          githubUrl={settings.githubUrl}
          linkedinUrl={settings.linkedinUrl}
          location={settings.location}
        />
      </main>

      <Footer
        firstName={settings.firstName}
        lastName={settings.lastName}
        footerNote={settings.footerNote}
      />
    </>
  );
}
