import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      firstName: "Adınız",
      lastName: "Soyadınız",
      roleTitle: "Full-Stack Developer",
      tagline: "Fikirleri üretime hazır ürünlere dönüştürüyorum.",
      bio: "Modern web teknolojileriyle ölçeklenebilir ve bakımı kolay ürünler geliştiren bir mühendisim. Detaylara önem veririm ve temiz kod yazarım.",
      statYearsLabel: "Yıl Deneyim",
      statYearsValue: "5+",
      statProjLabel: "Proje",
      statProjValue: "20+",
      statLocLabel: "Lokasyon",
      location: "İstanbul, Türkiye",
      profileImage: "",
      email: "merhaba@example.com",
      githubUrl: "https://github.com/",
      linkedinUrl: "https://linkedin.com/",
      footerNote: "Built with Next.js",
    },
  });

  console.log("Seed tamamlandı.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
