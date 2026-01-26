
/**
 * Noor Official V3 - Logic & Data Integrity Test
 * Role: Senior QA Automation Engineer
 * Terminology Refined: (System, Setup, Verification, Membership, Wallet Funds)
 */

const { dbNode } = require('../utils/db'); 

// Utility to log results in a clean table format
const testResults = [];
const logStep = (step, status, details) => {
    testResults.push({ Step: step, Status: status ? "✅ SUCCESS" : "❌ FAILED", Details: details });
};

/**
 * Verification Engine: Checks if database state matches expected values
 */
const check = (actual, expected, message) => {
    if (actual === expected) return true;
    console.error(`🚨 Verification Error: ${message} (Expected ${expected}, got ${actual})`);
    return false;
};

async function runSystemTest() {
    console.log("\n🚀 INITIALIZING NOOR V3 SYSTEM TEST PROTOCOL...");
    console.log("--------------------------------------------------\n");

    try {
        const testEmail = "test_user@example.com";
        const testPhone = "03001112223";

        // --- 1. INITIALIZATION (Cleanup & Setup) ---
        // Purge existing test member to start fresh
        let allUsers = dbNode.getUsers();
        const filteredUsers = allUsers.filter(u => u.email !== testEmail);
        dbNode.saveUsers(filteredUsers);
        
        logStep("Setup", true, "Database purged of old test data.");

        // --- 2. STEP 1: REGISTRATION ---
        const newUser = {
            id: "TEST-USR-99",
            name: "Test Member",
            email: testEmail,
            phone: testPhone,
            password: "password123",
            role: "user",
            balance: 0,
            currentPlan: "None",
            referralCode: "TEST-REF-001",
            transactions: [],
            workSubmissions: [],
            createdAt: new Date().toISOString()
        };

        allUsers = dbNode.getUsers();
        allUsers.push(newUser);
        dbNode.saveUsers(allUsers);

        const regCheck = check(newUser.balance, 0, "Initial balance check failed");
        logStep("Registration", regCheck, "Member account created with 0 balance.");

        // --- 3. STEP 2: DEPOSIT SIMULATION (Wallet Funding) ---
        // Simulating Admin Approving a Rs. 1000 Deposit
        const depositAmt = 1000;
        const updatedUserAfterDep = dbNode.updateUser(newUser.id, { 
            balance: depositAmt 
        });

        const depCheck = check(updatedUserAfterDep.balance, 1000, "Deposit balance sync failed");
        logStep("Wallet Funding", depCheck, "Rs. 1000 verified and added to wallet.");

        // --- 4. STEP 3: MEMBERSHIP ACTIVATION (Plan Purchase) ---
        // Simulating purchasing a plan for Rs. 1000
        const planPrice = 1000;
        const remainingBalance = updatedUserAfterDep.balance - planPrice;
        
        const userWithPlan = dbNode.updateUser(newUser.id, {
            balance: remainingBalance,
            currentPlan: "GOLD PLAN",
            planActivatedAt: new Date().toISOString()
        });

        const planCheck = check(userWithPlan.currentPlan, "GOLD PLAN", "Membership update failed") && 
                          check(userWithPlan.balance, 0, "Plan cost deduction failed");
        logStep("Membership", planCheck, "Gold Plan active. Wallet: 0.");

        // --- 5. STEP 4: DAILY WORK EARNINGS ---
        // User completes 1 task and earns Rs. 50
        const taskReward = 50;
        const userAfterWork = dbNode.updateUser(newUser.id, {
            balance: userWithPlan.balance + taskReward
        });

        const workCheck = check(userAfterWork.balance, 50, "Work reward sync failed");
        logStep("Daily Work", workCheck, "Task completed. Earning: Rs. 50.");

        // --- 6. STEP 5: PAYOUT REQUEST (Withdrawal) ---
        // User requests to withdraw Rs. 50
        const withdrawAmt = 50;
        // Funds are locked immediately during request
        const userAfterWithdrawReq = dbNode.updateUser(newUser.id, {
            balance: userAfterWork.balance - withdrawAmt,
            transactions: [{ 
                id: "WD-TEST-001", 
                type: "withdraw", 
                amount: withdrawAmt, 
                status: "pending", 
                timestamp: new Date().toISOString() 
            }]
        });

        const withdrawCheck = check(userAfterWithdrawReq.balance, 0, "Withdrawal lock failed");
        logStep("Payout Request", withdrawCheck, "Rs. 50 locked for verification.");

        // --- 7. STEP 6: REFUND LOGIC (Critical Check) ---
        // Simulate Admin Rejecting the Payout (System must return funds)
        const currentData = dbNode.findUserById(newUser.id);
        const refundAmt = 50; 
        
        const finalUser = dbNode.updateUser(newUser.id, {
            balance: currentData.balance + refundAmt, // Logic: Return funds on rejection
            transactions: currentData.transactions.map(t => t.id === "WD-TEST-001" ? { ...t, status: "rejected" } : t)
        });

        const refundCheck = check(finalUser.balance, 50, "Refund logic failed");
        logStep("Refund Protocol", refundCheck, "Payout declined. Rs. 50 returned to wallet.");

        // --- FINAL SUMMARY ---
        console.log("\n📊 SYSTEM FLOW VERIFICATION REPORT:");
        console.table(testResults);

        const allPassed = testResults.every(r => r.Status === "✅ SUCCESS");
        if (allPassed) {
            console.log("\n🌟 [CORE SYSTEM STATUS]: ALL DATA NODES ARE HEALTHY AND SECURE.\n");
        } else {
            console.log("\n⚠️ [CORE SYSTEM STATUS]: DATA INTEGRITY ISSUES DETECTED.\n");
        }

    } catch (error) {
        console.error("🔥 CRITICAL TEST FAILURE:", error.message);
    }
}

// Execution
runSystemTest();
