"use strict";

/**
 * Populate a fresh Strapi database with enough content for the frontend to
 * render something meaningful.
 *
 * Idempotent: every record is looked up before it is created, so re-running
 * this changes nothing and never duplicates a row.
 *
 * Deliberately a standalone script rather than a `bootstrap` in src/index.js —
 * bootstrap runs on every server start and would re-seed constantly.
 *
 *   npm run seed        (from backend/, or `npm run seed` at the repo root)
 *
 * Images are not seeded: `Cover` is a media field and needs an actual upload.
 * The UI degrades gracefully when an article has no cover.
 */

const { compileStrapi, createStrapi } = require("@strapi/strapi");

const SITE_SETTINGS = {
  Site_Name: "Football",
  Copyright: "Football. All rights reserved.",
};

const CATEGORIES = [
  {
    Name: "Premier League",
    Slug: "premier-league",
    Description: "News, analysis, and results from England's top flight.",
  },
  {
    Name: "La Liga",
    Slug: "la-liga",
    Description: "Spanish football, from the title race to the relegation battle.",
  },
  {
    Name: "Champions League",
    Slug: "champions-league",
    Description: "Europe's premier club competition, knockout nights included.",
  },
];

const paragraph = (text) => ({
  type: "paragraph",
  children: [{ type: "text", text }],
});

const heading = (text) => ({
  type: "heading",
  level: 2,
  children: [{ type: "text", text }],
});

const ARTICLES = [
  {
    Title: "Title race tightens after weekend of upsets",
    Slug: "title-race-tightens",
    Description:
      "Two of the top three dropped points, and the table is now separated by a single point.",
    Author: "Sara Idris",
    categorySlug: "premier-league",
    Content: [
      paragraph(
        "A weekend that looked routine on paper turned the title race on its head, with two of the top three dropping points."
      ),
      heading("What changed"),
      paragraph(
        "The leaders were held to a draw after conceding late, while the chasing pack closed the gap with a comfortable win."
      ),
      paragraph(
        "With a single point now separating the top three, every remaining fixture carries weight."
      ),
    ],
  },
  {
    Title: "The pressing trap that decided the derby",
    Slug: "pressing-trap-derby",
    Description:
      "A tactical look at how a mid-block press turned a tight derby into a rout.",
    Author: "Marco Ferrer",
    categorySlug: "premier-league",
    Content: [
      paragraph(
        "Derbies are usually decided by fine margins. This one was decided by a structure."
      ),
      heading("The trap"),
      paragraph(
        "By leaving the far-side full-back free, the home side invited a switch of play they were waiting to pounce on."
      ),
      paragraph(
        "Three of the four goals came from turnovers won within ten seconds of that invitation."
      ),
    ],
  },
  {
    Title: "Academy graduates are reshaping the midfield",
    Slug: "academy-graduates-midfield",
    Description:
      "Three teenagers have started more league games this season than the entire senior midfield did last term.",
    Author: "Priya Nair",
    categorySlug: "la-liga",
    Content: [
      paragraph(
        "The average age of the starting midfield has fallen by nearly four years in a single season."
      ),
      heading("Why now"),
      paragraph(
        "A wage bill squeeze and a coaching change that prioritises ball retention have made the academy the path of least resistance."
      ),
    ],
  },
  {
    Title: "Set pieces are worth more than ever",
    Slug: "set-pieces-value",
    Description:
      "Dead-ball situations now account for a third of all goals in the division.",
    Author: "Marco Ferrer",
    categorySlug: "la-liga",
    Content: [
      paragraph(
        "The specialist set-piece coach has moved from novelty to standard appointment."
      ),
      heading("The numbers"),
      paragraph(
        "A third of all goals this season have come from dead balls, up from a fifth five years ago."
      ),
    ],
  },
  {
    Title: "How the new format changed the group stage",
    Slug: "new-format-group-stage",
    Description:
      "More fixtures, more jeopardy, and a table that rewards goal difference in ways teams are still adjusting to.",
    Author: "Sara Idris",
    categorySlug: "champions-league",
    Content: [
      paragraph(
        "The expanded league phase has done what it promised: every matchday matters."
      ),
      heading("Unintended consequences"),
      paragraph(
        "Squad rotation has gone up sharply, and several clubs are now carrying three fit centre-backs rather than four."
      ),
    ],
  },
  {
    Title: "The away goal that should not have counted",
    Slug: "away-goal-controversy",
    Description:
      "A lengthy VAR review and a rule most fans had never heard of decided a knockout tie.",
    Author: "Priya Nair",
    categorySlug: "champions-league",
    Content: [
      paragraph(
        "It took four minutes, two angles, and a rule book to settle a goal that decided the tie."
      ),
      heading("The rule"),
      paragraph(
        "The scorer was judged to have been in an offside position, but only because the goalkeeper had left his line before the ball was played."
      ),
    ],
  },
];

const NAVIGATION_ITEMS = [
  { Name: "Home", URL: "/", Order: 1 },
  { Name: "Articles", URL: "/articles", Order: 2 },
  { Name: "Categories", URL: "/categories", Order: 3 },
];

/**
 * Look a document up by any filter, checking both the published and the draft
 * version. A draft-only record would otherwise look absent and be created a
 * second time.
 */
async function findExisting(documents, filters) {
  const published = await documents.findMany({
    filters,
    limit: 1,
    status: "published",
  });
  if (published.length > 0) {
    return published[0];
  }

  const drafts = await documents.findMany({
    filters,
    limit: 1,
    status: "draft",
  });
  return drafts[0] ?? null;
}

async function ensureEntry(documents, filters, data) {
  const existing = await findExisting(documents, filters);
  if (existing) {
    console.log(`  · already present: ${filters.Slug ?? filters.URL}`);
    return existing;
  }

  const created = await documents.create({ data, status: "published" });
  console.log(`  · created: ${filters.Slug ?? filters.URL}`);
  return created;
}

async function seedSiteSettings(app) {
  const documents = app.documents("api::site-setting.site-setting");

  const existing =
    (await documents.findFirst({ status: "published" })) ??
    (await documents.findFirst({ status: "draft" }));

  if (existing) {
    // Update and publish: a draftAndPublish single type returns nothing at all
    // through the API until it has been published, not even a default.
    await documents.update({
      documentId: existing.documentId,
      data: SITE_SETTINGS,
      status: "published",
    });
    console.log("  · site settings updated and published");
    return;
  }

  await documents.create({ data: SITE_SETTINGS, status: "published" });
  console.log("  · site settings created and published");
}

async function main() {
  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();

  try {
    console.log("Site settings");
    await seedSiteSettings(app);

    console.log("Categories");
    const categoryDocuments = app.documents("api::category.category");
    const categoriesBySlug = new Map();

    for (const category of CATEGORIES) {
      const record = await ensureEntry(
        categoryDocuments,
        { Slug: category.Slug },
        category
      );
      categoriesBySlug.set(category.Slug, record);
    }

    console.log("Articles");
    const articleDocuments = app.documents("api::article.article");

    for (const { categorySlug, ...article } of ARTICLES) {
      const existing = await findExisting(articleDocuments, {
        Slug: article.Slug,
      });

      if (existing) {
        console.log(`  · already present: ${article.Slug}`);
        continue;
      }

      const category = categoriesBySlug.get(categorySlug);

      await articleDocuments.create({
        data: {
          ...article,
          ...(category ? { category: { connect: [category.documentId] } } : {}),
        },
        status: "published",
      });
      console.log(`  · created: ${article.Slug}`);
    }

    console.log("Navigation items");
    const navigationDocuments = app.documents(
      "api::navigation-item.navigation-item"
    );

    for (const item of NAVIGATION_ITEMS) {
      await ensureEntry(navigationDocuments, { URL: item.URL }, item);
    }

    console.log("\nSeed complete.");
  } finally {
    await app.destroy();
  }
}

main().catch((error) => {
  console.error("\nSeed failed:");
  console.error(error);
  process.exit(1);
});
