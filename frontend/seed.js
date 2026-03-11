const axios = require('axios');

async function seed() {
    try {
        console.log("Registering admin...");
        await axios.post('http://localhost:8080/api/auth/signup', {
            email: 'admin@hospital.com',
            password: 'password123',
            role: 'admin',
            fullName: 'System Administrator',
            phone: '1234567890'
        });
        console.log("Admin registered successfully!");
    } catch (e) {
        if (e.response && e.response.data && JSON.stringify(e.response.data).includes("Email is already in use")) {
            console.log("Admin email already exists, proceeding to login.");
        } else {
            console.error("Signup error:", e.response ? e.response.data : e.message);
            return;
        }
    }

    try {
        const loginRes = await axios.post('http://localhost:8080/api/auth/signin', {
            email: 'admin@hospital.com',
            password: 'password123'
        });
        const token = loginRes.data.token;
        console.log("Admin logged in!");

        const depts = [
            { name: "Cardiology", description: "Heart and cardiovascular system" },
            { name: "Neurology", description: "Brain and nervous system" },
            { name: "Orthopedics", description: "Bones, joints, ligaments, tendons, and muscles" },
            { name: "Pediatrics", description: "Medical care of infants, children, and adolescents" },
            { name: "Dermatology", description: "Skin, hair and nails" }
        ];

        for (let dept of depts) {
            console.log(`Adding ${dept.name}...`);
            try {
                await axios.post('http://localhost:8080/api/departments', dept, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } catch (err) {
                // Ignore if department already exists (in case the script is run multiple times)
                if (err.response && err.response.status !== 500) {
                    console.log(`Skipped ${dept.name} (might already exist)`);
                } else {
                    console.error(`Failed to add ${dept.name}: ${err.message}`);
                }
            }
        }
        console.log("Departments seeded successfully!");

    } catch (e) {
        console.error("Login Error:", e.response ? e.response.data : e.message);
    }
}
seed();
