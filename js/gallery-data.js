/*
  QBD POWER — GALLERY SETTINGS
  1. Put images inside: assets/img/gallery/<category>/
  2. Rename them: p1.jpg, p2.jpg, p3.jpg ...
  3. Update count per category below.
*/

const QBD_GALLERY_CONFIG = {

  plumbing: {
    count: 10,
    folder: "../assets/img/gallery/plumbing/",
    prefix: "p",
    extension: "jpg",
    caption: "Plumbing Works"
  },

  mechanical: {
    count: 10,
    folder: "../assets/img/gallery/mechanical/",
    prefix: "p",
    extension: "jpg",
    caption: "Mechanical / HVAC Works"
  },

  electrical: {
    count: 10,
    folder: "../assets/img/gallery/electrical/",
    prefix: "p",
    extension: "jpg",
    caption: "Electrical Works"
  },

  manpower: {
    count: 10,
    folder: "../assets/img/gallery/manpower/",
    prefix: "p",
    extension: "jpg",
    caption: "MEP Workforce"
  }

};

const QBD_GALLERY = [];
const QBD_CATEGORY_ORDER = Object.keys(QBD_GALLERY_CONFIG);
const QBD_MAX_COUNT = Math.max(...QBD_CATEGORY_ORDER.map(cat => QBD_GALLERY_CONFIG[cat].count));

for (let i = 1; i <= QBD_MAX_COUNT; i++) {
  QBD_CATEGORY_ORDER.forEach(category => {
    const settings = QBD_GALLERY_CONFIG[category];
    if (i <= settings.count) {
      QBD_GALLERY.push({
        category: category,
        src: settings.folder + settings.prefix + i + "." + settings.extension,
        caption: settings.caption,
        project: "Project Site"
      });
    }
  });
}

