import dotenv from 'dotenv';
import pool from '../config/db';
import { hashPassword } from '../utils/auth.utils';

dotenv.config();

const indianFirstNames = [
  'Aarav','Vivaan','Aditya','Vihaan','Arjun','Sai','Krishna','Ishaan','Rohan','Ayaan',
  'Ananya','Aadhya','Diya','Ira','Myra','Anika','Sara','Navya','Aarohi','Saanvi'
];
const indianLastNames = [
  'Sharma','Verma','Iyer','Patel','Reddy','Gupta','Singh','Yadav','Khan','Das',
  'Nair','Chowdhury','Mehta','Bose','Mukherjee','Rao','Kulkarni','Chatterjee','Joshi','Malhotra'
];
const indianCities = [
  'Mumbai','Delhi','Bengaluru','Hyderabad','Ahmedabad','Chennai','Kolkata','Pune','Jaipur','Surat',
  'Lucknow','Kanpur','Nagpur','Indore','Thane','Bhopal','Visakhapatnam','Vadodara','Noida','Gurugram'
];

// Approx city coordinates (centroids)
const cityCoords: Record<string, { lat: number; lon: number }> = {
  Mumbai: { lat: 19.0760, lon: 72.8777 },
  Delhi: { lat: 28.6139, lon: 77.2090 },
  Bengaluru: { lat: 12.9716, lon: 77.5946 },
  Hyderabad: { lat: 17.3850, lon: 78.4867 },
  Ahmedabad: { lat: 23.0225, lon: 72.5714 },
  Chennai: { lat: 13.0827, lon: 80.2707 },
  Kolkata: { lat: 22.5726, lon: 88.3639 },
  Pune: { lat: 18.5204, lon: 73.8567 },
  Jaipur: { lat: 26.9124, lon: 75.7873 },
  Surat: { lat: 21.1702, lon: 72.8311 },
  Lucknow: { lat: 26.8467, lon: 80.9462 },
  Kanpur: { lat: 26.4499, lon: 80.3319 },
  Nagpur: { lat: 21.1458, lon: 79.0882 },
  Indore: { lat: 22.7196, lon: 75.8577 },
  Thane: { lat: 19.2183, lon: 72.9781 },
  Bhopal: { lat: 23.2599, lon: 77.4126 },
  Visakhapatnam: { lat: 17.6868, lon: 83.2185 },
  Vadodara: { lat: 22.3072, lon: 73.1812 },
  Noida: { lat: 28.5355, lon: 77.3910 },
  Gurugram: { lat: 28.4595, lon: 77.0266 },
};

function jitter(n: number, spread = 0.02) { // ~2km-3km jitter
  return n + (Math.random() - 0.5) * spread;
}
// Must match constraint in server.ts: ('plastic','e-waste','paper','metal')
const wasteTypes = ['plastic','e-waste','paper','metal'];
const paymentMethods = ['UPI','Card','NetBanking','Wallet'];

function randInt(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function makeEmail(first: string, last: string, i: number) { return `${first.toLowerCase()}.${last.toLowerCase()}${Date.now()}${i}@example.in`; }
function makeAddress(city: string) { return `${randInt(1, 999)}, ${['MG Road','MG Rd','Station Rd','Ring Rd','Nehru Marg','GT Road'][randInt(0,5)]}, ${city}, India`; }

async function seedUsers(count = 50) {
  console.log('Seeding users...');
  const passwordHash = await hashPassword('Password@123');
  const roles: Array<'citizen'|'collector'|'ngo'> = ['citizen','collector','ngo'];
  const insertedUserIds: number[] = [];

  for (let i = 0; i < count; i++) {
    const first = pick(indianFirstNames);
    const last = pick(indianLastNames);
    const name = `${first} ${last}`;
    const email = makeEmail(first, last, i);
    const role = roles[i % roles.length];

    const res = await pool.query(
      `INSERT INTO users (name, email, password, role, green_coins, eco_score)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING id`,
      [name, email, passwordHash, role, randInt(0, 5000), randInt(0, 100)]
    );
    insertedUserIds.push(res.rows[0].id);
  }

  console.log(`Inserted ${insertedUserIds.length} users.`);
  return insertedUserIds;
}

async function seedRewards(count = 50) {
  console.log('Seeding rewards...');
  let inserted = 0;
  for (let i = 0; i < count; i++) {
    const gc = randInt(50, 1000);
    const rupee = randInt(50, 1000);
    const res = await pool.query(
      `INSERT INTO rewards (name, description, green_coins_required, image_url, is_active)
       VALUES ($1,$2,$3,$4,$5)
       ON CONFLICT DO NOTHING`,
      [
        `Gift Card ₹${rupee}`,
        `Redeem ${gc} GreenCoins for ₹${rupee} gift card`,
        gc,
        'https://via.placeholder.com/100',
        true
      ]
    );
    inserted += (res.rowCount || 0);
  }
  console.log(`Inserted ~${inserted} rewards.`);
}

async function seedPickups(userIds: number[], count = 50) {
  console.log('Seeding pickups...');
  let inserted = 0;
  const citizenIds = userIds.filter((_, idx) => idx % 3 === 0); // approximate citizens created
  for (let i = 0; i < count; i++) {
    const uid = pick(citizenIds.length ? citizenIds : userIds);
    const city = pick(indianCities);
    const waste = pick(wasteTypes);
    const qty = randInt(1, 25);
    const addr = makeAddress(city);
    const notes = Math.random() < 0.4 ? `Landmark: near ${['temple','school','market','metro station'][randInt(0,3)]}` : null;
    const date = new Date(Date.now() + randInt(1, 10) * 86400000);
    const time = `${randInt(9, 18)}:${randInt(0, 59).toString().padStart(2,'0')}`;
    const base = cityCoords[city] || { lat: 22.0, lon: 79.0 };
    const lat = jitter(base.lat);
    const lon = jitter(base.lon);

    const res = await pool.query(
      `INSERT INTO pickups (user_id, waste_type, quantity, address, notes, preferred_date, preferred_time, latitude, longitude)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       ON CONFLICT DO NOTHING`,
      [uid, waste, qty, addr, notes, date, time, lat, lon]
    );
    inserted += (res.rowCount || 0);
  }
  console.log(`Inserted ~${inserted} pickups.`);
}

async function seedPayments(userIds: number[], count = 50) {
  console.log('Seeding payments...');
  let inserted = 0;
  for (let i = 0; i < count; i++) {
    const uid = pick(userIds);
    const amount = randInt(100, 5000);
    const method = pick(paymentMethods);
    const res = await pool.query(
      `INSERT INTO payments (user_id, amount, currency, payment_method)
       VALUES ($1,$2,$3,$4)
       ON CONFLICT DO NOTHING`,
      [uid, amount, 'INR', method]
    );
    inserted += (res.rowCount || 0);
  }
  console.log(`Inserted ~${inserted} payments.`);
}

async function main() {
  try {
    await pool.query('BEGIN');
    const users = await seedUsers(50);
    await pool.query('COMMIT');

    // Rewards, pickups, payments can be outside single txn to avoid long locks
    await seedRewards(50);
    await seedPickups(users, 50);
    await seedPayments(users, 50);

    console.log('Seeding completed.');
  } catch (err) {
    console.error('Seeding error:', err);
    try { await pool.query('ROLLBACK'); } catch {}
  } finally {
    await pool.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
