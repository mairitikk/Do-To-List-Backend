const bcrypt = require("bcryptjs");
const { generateId } = require("./utils");

const seedDatabase = async () => {
  try {
    // Check if admin exists
    const [admins] = await db.query(
      "SELECT id FROM users WHERE email = 'admin@lens.com'",
    );
    if (!admins.length) {
      const hash = await bcrypt.hash("admin2026", 10);
      await db.query(
        "INSERT INTO users (id, email, password, role, email_confirmed, created_at) VALUES (?, ?, ?, ?, 1, ?)",
        ["admin-1", "admin@lens.com", hash, "admin", Date.now()],
      );
      console.log("Seeded admin user");
    }

    // Check if photographer exists
    const [photographers] = await db.query(
      "SELECT id FROM users WHERE email = 'ms78_visuals@web.de'",
    );
    if (!photographers.length) {
      const hash = await bcrypt.hash("ms782026", 10);
      await db.query(
        "INSERT INTO users (id, email, password, role, email_confirmed, created_at) VALUES (?, ?, ?, ?, 1, ?)",
        [
          "photographer-1",
          "ms78_visuals@web.de",
          hash,
          "photographer",
          Date.now(),
        ],
      );
      console.log("Seeded photographer user");
    }

    // Check if superadmin exists
    const [superadmins] = await db.query(
      "SELECT id FROM users WHERE email = 'superadmin@lens.com'",
    );
    if (!superadmins.length) {
      const hash = await bcrypt.hash("superadmin", 10);
      await db.query(
        "INSERT INTO users (id, email, password, role, email_confirmed, created_at) VALUES (?, ?, ?, ?, 1, ?)",
        [generateId(), "superadmin@lens.com", hash, "admin", Date.now()],
      );
      console.log("Seeded superadmin user");
    }

    // Seed settings
    const [settings] = await db.query("SELECT id FROM settings LIMIT 1");
    if (!settings.length) {
      await db.query(
        `INSERT INTO settings (owner_id, default_price, enable_paypal, paypal_client_id, fussball_de_token, branch_name, instagram_url, background_image_url, logo_url)
         VALUES (?, ?, 1, ?, ?, ?, ?, ?, ?)`,
        [
          "photographer-1",
          10.0,
          "sb",
          "e1s7n7b24868H8K3Q4I3J5D8N2amouvJVN9JwJwnWc",
          "ms78_visuals",
          "https://instagram.com/ms78_visuals",
          "ms78_visuals/background.jpg",
          "ms78_visuals/logo_ms78_visuals.png",
        ],
      );
      console.log("Seeded settings");
    }

    // Seed terms
    const [terms] = await db.query("SELECT id FROM terms LIMIT 1");
    if (!terms.length) {
      await db.query(
        "INSERT INTO terms (owner_id, terms_of_service, privacy_policy, data_processing_agreement, child_content_consent, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
        [
          "photographer-1",
          "Terms of Service",
          "Privacy Policy",
          "Data Processing Agreement",
          "<p>Welcome to the official gallery provided by <strong>ms78_visuals</strong>.</p>",
          Date.now(),
        ],
      );
      console.log("Seeded terms");
    }

    // Seed sample gallery
    const [galleries] = await db.query(
      "SELECT id FROM galleries WHERE id = 'gallery-1'",
    );
    if (!galleries.length) {
      await db.query(
        "INSERT INTO galleries (id, name, description, owner_id) VALUES (?, ?, ?, ?)",
        [
          "gallery-1",
          "Sample Gallery",
          "This is a sample gallery for testing.",
          "photographer-1",
        ],
      );
      console.log("Seeded sample gallery");
    }

    // Seed sample event
    const [events] = await db.query(
      "SELECT id FROM events WHERE token = 'sample-token'",
    );
    if (!events.length) {
      await db.query(
        "INSERT INTO events (id, gallery_id, name, date, description, token, expiration_date) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          "event-1",
          "gallery-1",
          "Sample Event",
          new Date().toISOString(),
          "This is a sample event.",
          "sample-token",
          new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        ],
      );
      console.log("Seeded sample event");
    }

    // Seed sample photos
    const [photos] = await db.query(
      "SELECT id FROM photos WHERE event_id = 'event-1' LIMIT 1",
    );
    if (!photos.length) {
      const values = [];
      for (let i = 1; i <= 10; i++) {
        values.push([
          `photo-${i}`,
          "event-1",
          `https://picsum.photos/800/600?random=${i}`,
          `https://picsum.photos/300/200?random=${i}`,
          `sample-photo-${i}.jpg`,
          15.0,
          0,
        ]);
      }
      await db.query(
        "INSERT INTO photos (id, event_id, url, thumbnail_url, filename, price, is_watermarked) VALUES ?",
        [values],
      );
      console.log("Seeded 10 sample photos");
    }

    console.log("Database seeding complete");
  } catch (err) {
    console.error("Seed error:", err.message);
  }
};

module.exports = { seedDatabase };

// Run directly if called as a script
if (require.main === module) {
  require("dotenv").config({
    path: require("path").join(__dirname, "..", "..", ".env"),
  });
  require("../config/db");
  seedDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
