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
      footerNote: "Built with Next.js",
    },
  });

  if ((await prisma.socialLink.count()) === 0) {
    await prisma.socialLink.createMany({
      data: [
        { order: 0, platform: "GitHub", url: "https://github.com/" },
        { order: 1, platform: "LinkedIn", url: "https://linkedin.com/" },
      ],
    });
  }

  if ((await prisma.experience.count()) === 0) {
    await prisma.experience.create({
      data: {
        order: 0,
        role: "Full-Stack Developer",
        company: "Örnek Şirket",
        employment: "Tam Zamanlı",
        startDate: "01/2023",
        endDate: "Günümüz",
        description:
          "Next.js ve Node.js ile ölçeklenebilir web uygulamaları geliştirdim. API entegrasyonları ve performans optimizasyonuna odaklandım.",
        tags: "Next.js,TypeScript,PostgreSQL",
        stat1Label: "Süre",
        stat1Value: "2yr+",
        stat2Label: "Günlük Kullanıcı",
        stat2Value: "5k+",
        stat3Label: "Ekip",
        stat3Value: "3 Kişi",
      },
    });
  }

  if ((await prisma.project.count()) === 0) {
    await prisma.project.create({
      data: {
        order: 0,
        title: "Örnek Proje",
        eyebrow1: "Web Uygulaması",
        eyebrow2: "2024",
        description: "Kısa proje açıklaması buraya gelecek.",
        tags: "Next.js,Prisma,Tailwind",
        mission: "Kullanıcı deneyimini iyileştirmek",
        keyFeature: "Gerçek zamanlı güncellemeler",
        clientName: "Örnek Müşteri",
        coverImage: "",
        liveUrl: "",
      },
    });
  }

  if ((await prisma.skillGroup.count()) === 0) {
    await prisma.skillGroup.createMany({
      data: [
        {
          order: 0,
          category: "Programlama Dilleri & Framework",
          subcategory: "Temel Diller",
          items: "TypeScript,JavaScript,Python",
        },
        {
          order: 1,
          category: "Programlama Dilleri & Framework",
          subcategory: "Framework",
          items: "Next.js,React,Express.js",
        },
        {
          order: 2,
          category: "Arka Plan & Veritabanları",
          subcategory: "Veritabanları",
          items: "PostgreSQL,SQLite,Redis",
        },
        {
          order: 3,
          category: "Arka Plan & Veritabanları",
          subcategory: "Kimlik Doğrulama",
          items: "JWT,OAuth 2.0",
        },
      ],
    });
  }

  if ((await prisma.education.count()) === 0) {
    await prisma.education.createMany({
      data: [
        {
          order: 0,
          icon: "graduation",
          title: "Bilgisayar Mühendisliği",
          institution: "Örnek Üniversite",
          period: "2018 – 2022",
          type: "Lisans",
          bullets: "",
        },
        {
          order: 1,
          icon: "code",
          title: "Full-Stack Web Geliştirme",
          institution: "Bireysel Öğrenme & Çevrimiçi Kurslar",
          period: "2020 – Devam Ediyor",
          type: "Sertifika",
          bullets: "Next.js İleri Seviye\nTypeScript Sertifikası",
        },
      ],
    });
  }

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
