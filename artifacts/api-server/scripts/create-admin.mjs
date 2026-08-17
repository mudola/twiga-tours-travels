import bcrypt from "bcryptjs";
import pg from "../../../node_modules/.pnpm/pg@8.22.0/node_modules/pg/lib/index.js";

const { Pool } = pg;
const email = process.env.ADMIN_BOOTSTRAP_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_BOOTSTRAP_PASSWORD;

if (!email || !password) {
  throw new Error("ADMIN_BOOTSTRAP_EMAIL and ADMIN_BOOTSTRAP_PASSWORD are required.");
}
if (password.length < 8) {
  throw new Error("ADMIN_BOOTSTRAP_PASSWORD must be at least 8 characters.");
}

try {
  const passwordHash = await bcrypt.hash(password, 12);
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const result = await pool.query(
    `insert into admin_users (name, email, password_hash, role, is_active)
     values ($1, $2, $3, 'super_admin', true)
     on conflict (email) do update
       set password_hash = excluded.password_hash,
           role = 'super_admin',
           is_active = true,
           updated_at = now()
     returning email, role`,
    ["Twiga Administrator", email, passwordHash],
  );

  // Only report non-sensitive account metadata.
  console.log(`Super admin account ready for ${result.rows[0].email} (${result.rows[0].role}).`);
  await pool.end();
} finally {
}