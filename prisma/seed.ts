// prisma/seed.ts
import "dotenv/config"; // Load the .env file
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// 1. Set up the Prisma 7 Adapter (just like we did in the app)
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

// 2. Initialize Prisma with the adapter
const prisma = new PrismaClient({ adapter });

async function main() {

  console.log("Saving SVS NBG Details to the database...");
  // 1. Save Verein Info (Using upsert so it updates if you run seed again)
  await prisma.vereinInfo.upsert({
    where: { id: "1" },
    update: {},
    create: {
      id: "1",
      aboutText: "Die 'Siedlervereinigung Siemens Nürnberg e.V.' ist Mitglied im Verband Wohneigentum Bezirksverband Mittelfranken e.V. und besteht seit der Mitte der 1930er Jahren. Dieser Tradition sind wir uns bewusst und dementsprechend handeln wir auch in unserer Gemeinschaft. Mit verschiedenen Veranstaltungen für unsere Mitglieder und deren Freunde und Bekannte halten wir ein aktives Vereinsleben aufrecht. Ebenso vertreten wir unsere Interessen in der Gesellschaft in nachhaltiger Art und Weise.",
      contactEmail: "svs_nbg@web.de",
      bankName: "Sparkasse Nürnberg",
      iban: "DE69760501010001321290",
      bic: "SSKNDE77XXX",
      registerCourt: "Amtsgericht Nürnberg",
      registerNumber: "VR 201735",
    }
  });

  // 2. Clear old board members and insert current ones
  await prisma.boardMember.deleteMany({});
  
  await prisma.boardMember.createMany({
    data: [
      {
        role: "1. Vorsitzender",
        name: "Thomas Konradt",
        address: "Herpersdorfer Str. 1b, 90469 Nürnberg",
        phone: "01523 4337378",
        email: "tkonradt81@gmail.com",
        order: 1
      },
      {
        role: "2. Vorsitzende",
        name: "Carolin Heelein",
        address: "Königshammerstraße 23, 90469 Nürnberg",
        phone: "0160 3044982",
        email: "carolin.heelein@gmx.de",
        order: 2
      },
      {
        role: "Kassier",
        name: "Klaus Brendel",
        address: "Königshammerstraße 39, 90469 Nürnberg",
        phone: "0911 481778",
        email: "brendel.klaus@t-online.de",
        order: 3
      },
	  {
        role: "Schriftführer",
        name: "Klaus Händler",
        address: "Wendelsteiner Straße 54, 90469 Nürnberg",
        phone: "0911 487106",
        email: "klaus.haendler@svs-nbg.de ",
        order: 4
      },
	  {
        role: "Schriftführerin",
        name: "Madeleine Schulze-Erdei",
        address: "Worzeldorfer Straße 92, 90469 Nürnberg",
        phone: "0911 48084467",
        email: "madeleine_schulze@web.de",
        order: 5
      }
    ]
  });

  console.log("Database successfully seeded with dynamic Verein info!");
  console.log("Adding events to the database...");
  await prisma.event.deleteMany({});
  // Example Event 1
  await prisma.event.create({
    data: {
      title: "Sommerfest der Siedlervereinigung",
      description: "Unser jährliches Sommerfest mit Grillen, Getränken und Musik für die ganze Familie.",
      date: new Date("2026-07-15T14:00:00Z"), 
      location: "Siedlerfestplatz Vereinsgelände Siemens Nürnberg",
    },
  });

  // Example Event 2
  await prisma.event.create({
    data: {
      title: "Jahreshauptversammlung 2026",
      description: "Wahl des neuen Vorstands und Bericht des Kassiers. Um zahlreiches Erscheinen wird gebeten.",
      date: new Date("2026-11-20T19:00:00Z"),
      location: "Gemeindesaal Nürnberg",
    },
  });
  // Example Event 3
  await prisma.event.create({
    data: {
      title: "Weihnachtsfeier der Siedlervereinigung",
      description: "Unser jährliches Weihnachtsfeier mit Gluehwein-und-Kinderpunsch für die ganze Familie.",
      date: new Date("2026-12-20T17:00:00Z"),
      location: "Siedlerfestplatz Vereinsgelände Siemens Nürnberg",
    },
  });
  // Example Event 4
  await prisma.event.create({
    data: {
      title: "SVS Kinderfest",
      description: "Unser jährliches Kinderfest für die ganze Familie, bei dem Kinder spielen und Spaß haben können, während Eltern die gemeinsame Zeit genießen und sich austauschen.",
      date: new Date("2026-07-04T10:00:00Z"),
      location: "Siedlerfestplatz Vereinsgelände Siemens Nürnberg",
    },
  });


  console.log("Events added successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Close the database connection properly
    await prisma.$disconnect();
    await pool.end();
  });