/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const db = new PrismaClient();

const services = [
  { title: "Master Stylist Cut", category: "Haircut & Styling", description: "A precision cut shaped by our master stylist, finished with a clean wash and styling.", duration: "~45 min" },
  { title: "Executive Haircut", category: "Haircut & Styling", description: "A signature haircut and styling with a relaxing head wash, built for a sharp, polished look.", duration: "~40 min" },
  { title: "Child Haircut", category: "Haircut & Styling", description: "A gentle, patient cut and tidy styling for younger gentlemen.", duration: "~30 min" },
  { title: "Wash & Styling", category: "Haircut & Styling", description: "A refreshing head wash and a styled finish with premium products.", duration: "~25 min" },
  { title: "Master Expert Beard", category: "Beard & Shave", description: "Expert beard shaping and detailing with razor-clean lines and a finishing serum.", duration: "~30 min" },
  { title: "Beard Grooming", category: "Beard & Shave", description: "Precision trim and shaping that frames your face and keeps the lines sharp.", duration: "~25 min" },
  { title: "Executive Wet Shave", category: "Beard & Shave", description: "A traditional hot-towel wet shave, gel and razor, finished with aftershave and moisturiser.", duration: "~30 min" },
  { title: "Nose Strip", category: "Facials & Skin", description: "A quick cleansing strip to refresh and clear.", duration: "~10 min" },
  { title: "Deep Cleansing Facial", category: "Facials & Skin", description: "A deep cleanse, scrub and tone to leave skin fresh, clear and matte.", duration: "~40 min" },
  { title: "Deep Clean Hydra Therapy", category: "Facials & Skin", description: "A multi-step hydra facial focused on deep hydration and a healthy, even glow.", duration: "~60 min" },
  { title: "Skin Brightening Cleansing", category: "Facials & Skin", description: "A brightening cleanse and mask to revive a dull, tired complexion.", duration: "~45 min" },
  { title: "Luxury Hair Dye", category: "Hair Colour", description: "Premium colour, sectioned and applied with care, finished with a wash and styling.", duration: "~60 min" },
  { title: "Hair Dye", category: "Hair Colour", description: "Clean, even colour application with a refreshing wash and basic styling.", duration: "~45 min" },
  { title: "Beard Dye", category: "Hair Colour", description: "A natural-looking beard colour, applied and finished with a wash.", duration: "~30 min" },
  { title: "Luxury Hand Detox", category: "Hands & Feet", description: "A soak, scrub, massage, mask and detailed nail care with luxury products.", duration: "~45 min" },
  { title: "Luxury Feet Detox", category: "Hands & Feet", description: "A relaxing soak, scrub, massage and full nail care to restore tired feet.", duration: "~45 min" },
  { title: "Manicure", category: "Hands & Feet", description: "Clean, shaped and cared-for hands with a smooth, groomed finish.", duration: "~35 min" },
  { title: "Pedicure", category: "Hands & Feet", description: "A thorough soak and care routine that leaves feet fresh and comfortable.", duration: "~40 min" },
  { title: "Head & Shoulder Massage", category: "Massage & Relaxation", description: "A deep, calming head and shoulder massage with premium oils to release tension.", duration: "~20 min" },
  { title: "Scalp Oiling", category: "Massage & Relaxation", description: "A relaxing scalp massage that nourishes the scalp and soothes the mind.", duration: "~20 min" },
];

const packages = [
  { title: "The Essentials", tagline: "A sharp, clean refresh.", price: 3600, items: ["Beard", "Deep Cleansing"], featured: false },
  { title: "The Signature", tagline: "The complete grooming session.", price: 7050, items: ["Hair Cut", "Beard", "Head & Shoulder Massage", "Wash", "Nose Strip", "Deep Cleansing"], featured: true },
  { title: "The Gentleman", tagline: "Groom, colour and care.", price: 12500, items: ["Hair Cut", "Hair Dye", "Manicure", "Pedicure", "Skin Brightening Cleansing"], featured: false },
  { title: "The Luxury", tagline: "The full master experience.", price: 17600, items: ["Master Stylist Cut", "Master Expert Beard", "Luxury Dye", "Luxury Hand Detox", "Luxury Feet Detox", "Deep Clean Hydra Therapy"], featured: false },
];

const team = [
  { name: "Fayaz Ahmad", role: "Master Hair Stylist", image: "/team/fayaz-ahmad.jpg" },
  { name: "Ahad Ali", role: "Senior Hair Stylist", image: "/team/ahad-ali.jpg" },
  { name: "Sohail Ejaz", role: "Senior Hair Stylist", image: "/team/sohail-ejaz.jpg" },
  { name: "Muhammad Amir", role: "Senior Hair Stylist", image: "/team/muhammad-amir.jpg" },
  { name: "Muhammad Danish", role: "Senior Hair Stylist", image: "/team/muhammad-danish.jpg" },
  { name: "Hamza Rasheed", role: "Skin Expert", image: "/team/hamza-rasheed.jpg" },
  { name: "Shahbaz", role: "Aesthetician", image: "/team/shahbaz.jpg" },
  { name: "Munim", role: "Junior Staff", image: "/team/munim.jpg" },
];

const gallery = [
  { image: "/photos/DY897D0FC8d.jpg", caption: "Doors are open. Premium grooming, modern style, a fresh new space.", link: "https://www.instagram.com/p/DY897D0FC8d/", isVideo: true, videoUrl: "/videos/DY897D0FC8d.mp4" },
  { image: "/photos/DYwrdlUDskk.jpg", caption: "Now officially open — where style, luxury and perfection come together.", link: "https://www.instagram.com/p/DYwrdlUDskk/" },
  { image: "/photos/DZhzlNEjIP4.jpg", caption: "Clean cuts. Defined lines. Effortless style.", link: "https://www.instagram.com/p/DZhzlNEjIP4/" },
  { image: "/photos/DYUdx3HiDS0.jpg", caption: "Congratulations to Hadiqa Kiani on the Sitara-e-Imtiaz.", link: "https://www.instagram.com/p/DYUdx3HiDS0/" },
  { image: "/photos/DZcjgU_givI.jpg", caption: "Thank you, Haseeb Niazi, for experiencing HK Salon For Men.", link: "https://www.instagram.com/p/DZcjgU_givI/" },
  { image: "/photos/DZMzAB0Oc4s.jpg", caption: "A sharp cut. A clean beard. A confident look.", link: "https://www.instagram.com/p/DZMzAB0Oc4s/" },
  { image: "/photos/DZZVon8jkde.jpg", caption: "Refined. Modern. Timeless. A look that speaks before you do.", link: "https://www.instagram.com/p/DZZVon8jkde/" },
  { image: "/photos/DZXnNOZCmgL.jpg", caption: "A little self-care goes a long way. Pedicure & facial services.", link: "https://www.instagram.com/p/DZXnNOZCmgL/" },
  { image: "/photos/DZUVweUOoO3.jpg", caption: "Grooming isn't a luxury, it's a standard. Facials, skincare, men's grooming.", link: "https://www.instagram.com/p/DZUVweUOoO3/" },
  { image: "/photos/DYmshaTFtka.jpg", caption: "A premium grooming experience, made exclusively for men.", link: "https://www.instagram.com/p/DYmshaTFtka/" },
  { image: "/photos/DYwnu0yOcqo.jpg", caption: "The gentleman's experience starts here.", link: "https://www.instagram.com/p/DYwnu0yOcqo/" },
  { image: "/photos/DZo7UF5OZAB.jpg", caption: "Sharp fades. Clean beards. A look that speaks for itself.", link: "https://www.instagram.com/p/DZo7UF5OZAB/" },
];

const testimonials = [
  { quote: "Obsessed with the interior.", author: "faseeha_feroz_awan" },
  { quote: "Been waiting for this day. Absolutely worth it.", author: "muffaddalsirajbadri" },
  { quote: "Ma sha Allah. A deserving, beautiful space for men in Multan.", author: "syed_faheem" },
  { quote: "Lovely space and a great experience.", author: "de.faw" },
];

const blogPosts = [
  {
    title: "Hadiqa Kiani Opens Her First Flagship Salon For Men In Multan",
    slug: "hadiqa-kiani-flagship-salon-multan",
    excerpt: "Pakistan's celebrated artist steps into men's grooming for the first time — and chooses Multan's Gulgasht Colony as the address for it.",
    image: "/founder/1.jpg",
    content: `Hadiqa Kiani has spent two decades as one of Pakistan's most recognised voices — an artist honoured with both the Tamgha-i-Imtiaz and, more recently, the Sitara-i-Imtiaz for her contribution to music. Now she's turned that same attention to detail toward a very different stage: grooming.

HK Salon For Men is her first venture into men's grooming, and she's chosen Gulgasht Colony, Multan as the flagship home for it — not a trial run, not a side project, but the first location of a brand she intends to grow with the same standards that defined her career.

The salon brings together precision haircuts, traditional wet shaves, beard sculpting, Hydrafacial treatments and a calm, considered space built specifically for men. Every detail, from the chair to the finish, carries her name.

For Multan, it means a first: a genuinely premium, flagship-grade men's salon, built to a standard the city hasn't seen before in this category. For Hadiqa Kiani, it's the start of a new chapter — one built one appointment at a time.`,
  },
  {
    title: "Inside HK Salon For Men: A Tour Of Multan's Premium Grooming Destination",
    slug: "inside-hk-salon-for-men-multan",
    excerpt: "From the fade chairs to the Hydrafacial suite — a walk through what makes this flagship different from any other salon in the city.",
    image: "/photos/DYwp5ofjqXW_4.jpg",
    content: `Step past the entrance at HK Salon For Men and the first thing you notice is the quiet. No blaring music, no chaos — just a calm, considered space built around the idea that grooming should feel deliberate, not rushed.

The chairs are where most of the work happens: precision haircuts, skin fades, and beard sculpting from a team trained to work with the same discipline as the brand's founder. Every cut starts with a proper consultation, not a guess.

Past the styling floor sits the Hydrafacial suite — a dedicated space for the salon's signature skin treatment. Multi-step extraction, infusion and hydration, done with clinical-grade tools rather than a quick add-on service bolted onto a haircut.

What ties it together is consistency. This is a flagship in the true sense — the first location of a brand, built to the standard every future HK Salon location will be measured against. In Gulgasht Colony, Multan, that standard is already live.`,
  },
  {
    title: "The Complete Guide To Men's Grooming Services At HK Salon, Multan",
    slug: "mens-grooming-services-guide-multan",
    excerpt: "Haircuts, beard sculpting, Hydrafacials and more — everything on the menu at Multan's flagship men's salon, explained.",
    image: "/hydrafacial/photo-2.jpg",
    content: `HK Salon For Men in Multan is built around five categories of service, each designed to cover a different part of a man's grooming routine — not a long, confusing menu, but a focused one.

Haircut & Styling covers everything from the Master Stylist Cut to a simple wash and style, each finished with a proper consultation rather than a rushed guess at what you want.

Beard & Shave is built for men who take their beard seriously — expert shaping, razor-clean lines, and a traditional hot-towel wet shave for anyone who wants the full experience.

Facials & Skin is where the salon's signature Deep Clean Hydra Therapy lives, alongside deep-cleansing and brightening facials built specifically for men's skin, not adapted from a women's menu.

Hair Colour, and Hands & Feet round things out — natural-looking dye work, and proper hand and foot care that's often missing from most men's salons entirely.

The full price list is available on the site and updated directly by the salon — a straightforward way to see exactly what's on offer before you book.`,
  },
  {
    title: "Why Multan? The Story Behind Hadiqa Kiani's Flagship Choice",
    slug: "why-multan-hadiqa-kiani-flagship",
    excerpt: "A closer look at why Gulgasht Colony, Multan was chosen as the flagship location for Hadiqa Kiani's first men's salon.",
    image: "/experience/1.jpg",
    content: `When Hadiqa Kiani decided to open her first men's salon, the choice of city wasn't obvious. Lahore, Karachi and Islamabad are the usual answers for a launch like this. She chose Multan instead — specifically, Gulgasht Colony.

Multan has always had the demand for premium grooming without quite having the supply. Men either settled for ordinary neighbourhood barbershops or travelled out of the city for anything closer to a proper salon experience.

Choosing Multan as the flagship location was a deliberate bet on the city itself — proof that a premium, standards-first grooming brand doesn't need to start in one of Pakistan's three biggest cities to do things properly.

It also means Multan gets something first. Every HK Salon location that follows will be measured against what's already running in Gulgasht Colony today — not the other way around.`,
  },
];

async function main() {
  const hash = await bcrypt.hash("hksalon123", 12);
  await db.admin.upsert({
    where: { email: "admin@hksalonformen.com" },
    update: {},
    create: { email: "admin@hksalonformen.com", passwordHash: hash, name: "Admin", role: "SUPER_ADMIN" },
  });

  for (const [i, s] of services.entries()) {
    const slug = s.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    await db.service.upsert({ where: { slug }, update: { ...s, order: i }, create: { ...s, slug, order: i } });
  }

  for (const [i, p] of packages.entries()) {
    const slug = p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    await db.package.upsert({ where: { slug }, update: { ...p, order: i }, create: { ...p, slug, order: i } });
  }

  for (const [i, b] of blogPosts.entries()) {
    await db.blogPost.upsert({ where: { slug: b.slug }, update: { ...b, order: i }, create: { ...b, order: i } });
  }

  await db.teamMember.deleteMany();
  for (const [i, t] of team.entries()) {
    await db.teamMember.create({ data: { ...t, order: i } });
  }

  await db.galleryPost.deleteMany();
  for (const [i, g] of gallery.entries()) {
    await db.galleryPost.create({ data: { ...g, order: i } });
  }

  await db.testimonial.deleteMany();
  for (const [i, t] of testimonials.entries()) {
    await db.testimonial.create({ data: { ...t, order: i } });
  }

  await db.setting.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      siteName: "HK Salon For Men",
      legalName: "Hadiqa Kiani Salon For Men",
      tagline: "Where men come to own their look.",
      standardsQuote: "Luxury isn't loud. It's in the details, the precision, and the confidence it creates.",
      aboutFounder: "Hadiqa Kiani is one of Pakistan's most celebrated artists and a recipient of the nation's highest civil honours — the Tamgha-i-Imtiaz, and twenty years later, the Sitara-i-Imtiaz. The same discipline and eye for detail that defined her on stage now shape a different kind of experience.\n\nHK Salon For Men is her first venture into men's grooming, and Multan is where it begins — chosen as the flagship home for a brand built entirely around her name and her standards. Every chair, every finish, every detail here reflects her personal vision for what a men's salon should feel like.",
      address: "7-B Tulip Street, Gulgasht Colony, Multan",
      hours: "Open daily · 12:00 pm – 11:00 pm",
      phone: "0320 0005337",
      phoneSecondary: "0320 0005336",
      whatsapp: "923200005337",
      instagram: "hksalonformenmultan",
      facebook: "hksalonformenmultan",
      tiktok: "hksalonformenmultan",
      mapsQuery: "HK Salon For Men Gulgasht Colony Multan",
      announcement: "Multan's only Hadiqa Kiani flagship — where precision meets luxury.",
      menuUrl: "/menu.pdf",
    },
  });

  console.log("Seeded: admin@hksalonformen.com / hksalon123");
}

main().catch(console.error).finally(() => db.$disconnect());
