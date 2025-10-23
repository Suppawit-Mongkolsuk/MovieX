import express from "express";
import cors from "cors";
import fs from "fs";
import bcrypt from "bcryptjs";

const app = express();
app.use(cors());
app.use(express.json());

const USERS_FILE = "./users.json";

// อ่านข้อมูลผู้ใช้จากไฟล์
const readUsers = () => {
  try {
    const data = fs.readFileSync(USERS_FILE, "utf8");
    return JSON.parse(data);
  } catch {
    return [];
  }
};

// เขียนข้อมูลผู้ใช้กลับไปในไฟล์
const writeUsers = (users) => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

// Register
app.post("/api/register", async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบ" });

  const users = readUsers();
  const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing)
    return res.status(400).json({ message: "อีเมลนี้ถูกใช้แล้ว" });

  const hashed = await bcrypt.hash(password, 10);
  users.push({ email, password: hashed, role: role || "user" }); // 👈 default = user
  writeUsers(users);

  res.json({ message: "สมัครสมาชิกสำเร็จ!" });
});

// Login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const users = readUsers();

  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user)
    return res.status(400).json({ message: "ไม่พบบัญชีนี้" });

  const match = await bcrypt.compare(password, user.password);
  if (!match)
    return res.status(400).json({ message: "รหัสผ่านไม่ถูกต้อง" });

  res.json({ 
    message: "เข้าสู่ระบบสำเร็จ ✅", 
    user: { email: user.email, role: user.role }
  });
});

// Forgot Password (ย้ายออกมาไว้นอก login)
app.post("/api/forgot-password", (req, res) => {
  const { email } = req.body;

  const users = readUsers();
  const user = users.find((u) => u.email === email);

  if (!user) {
    return res.status(404).json({ message: "ไม่พบบัญชีอีเมลนี้ในระบบ" });
  }

  // จำลองการส่งอีเมล (จริง ๆ แค่ตอบกลับ)
  res.json({ message: `ลิงก์รีเซ็ตรหัสผ่านถูกส่งไปที่ ${email} แล้ว` });
});

app.listen(5000, () =>
  console.log("🚀 Server running on http://localhost:5000")
);