import { 
  localCalculateLeaveCapacity, 
  localCalculateRequiredClasses, 
  localCalculateAttendanceProject 
} from './src/services/api.js';

console.log("=== RUNNING MATHEMATICAL ATTENDANCE TESTS ===");

// 1. Setup a mock student with specific class records:
// Let's test the case: attended = 41, conducted = 50.
// Current attendance: 41 / 50 = 82%.
// Target: 75%
// Formula: 41 / (50 + x) >= 0.75
// 41 / 0.75 >= 50 + x => 54.67 >= 50 + x => x <= 4.67 => floor is 4.
const testStudent = {
  id: 'STU_TEST',
  name: 'Test Student',
  attendance: {
    overall: 82.0,
    subjects: [
      { subject_id: 'SUB001', attended: 41, conducted: 50 } // 82%
    ]
  }
};

console.log("\nTesting: attended = 41, conducted = 50 (82% overall)");

const capacities = localCalculateLeaveCapacity(testStudent);
const testSubjectCapacity = capacities.find(c => c.subject_id === 'SUB001');

console.log("Result Leave Capacity:", testSubjectCapacity.classes_can_miss);
if (testSubjectCapacity.classes_can_miss === 4) {
  console.log("✅ Success: Can miss max 4 classes (formula: 41 / 54 = 75.9% >= 75%, 41 / 55 = 74.5% < 75%)");
} else {
  console.log("❌ Failure: Expected capacity 4, got", testSubjectCapacity.classes_can_miss);
  process.exit(1);
}

// 2. Test target consecutive classes to reach 80% (targetPct = 80).
// Formula: (41 + y) / (50 + y) >= 0.80
// 41 + y >= 0.80 * 50 + 0.80 * y => 41 + y >= 40 + 0.8y => 0.2y >= -1 => y >= -5 (already above 80%)
// Let's test reaching 85% instead:
// (41 + y) / (50 + y) >= 0.85
// 41 + y >= 42.5 + 0.85y => 0.15y >= 1.5 => y >= 10 (consecutive classes needed)
console.log("\nTesting consecutive classes to reach 85% starting from 82% (41/50):");
const targetPct = 85;
const reqClasses = localCalculateRequiredClasses(testStudent, targetPct);
const testSubjectReq = reqClasses.find(r => r.subject_id === 'SUB001');

console.log("Result Consecutive Classes needed:", testSubjectReq.required_classes);
if (testSubjectReq.required_classes === 10) {
  console.log("✅ Success: Needs 10 consecutive classes (formula: 51 / 60 = 85% >= 85%)");
} else {
  console.log("❌ Failure: Expected consecutive classes 10, got", testSubjectReq.required_classes);
  process.exit(1);
}

// 3. Test Date-based/Timetable leave projection.
// Let's test student Rohan Das (Student ID: STU003) taking leave from Monday Aug 17 to Wednesday Aug 19 (3 days).
// Monday classes: SUB001, SUB002, SUB003 (3 classes)
// Tuesday classes: SUB004, SUB005, SUB001 (3 classes)
// Wednesday classes: SUB002, SUB003, SUB004 (3 classes)
// Total missed: 9 classes (2 in SUB001, 2 in SUB002, 2 in SUB003, 2 in SUB004, 1 in SUB005)
// Rohan's original:
// SUB001: 12/20 (60%) -> Projected: 12 / 22 = 54.5%
// SUB002: 14/20 (70%) -> Projected: 14 / 22 = 63.6%
// SUB003: 13/20 (65%) -> Projected: 13 / 22 = 59.1%
// SUB004: 15/20 (75%) -> Projected: 15 / 22 = 68.2%
// SUB005: 14/20 (70%) -> Projected: 14 / 21 = 66.7%
// Overall current = 68%, Projected overall = (12+14+13+15+14)/(22+22+22+22+21) = 68 / 109 = 62.38%
console.log("\nTesting timetable-based leave projection for 3 days next week:");
const rohan = {
  id: 'STU003',
  name: 'Rohan Das',
  attendance: {
    overall: 68.0,
    subjects: [
      { subject_id: 'SUB001', attended: 12, conducted: 20 },
      { subject_id: 'SUB002', attended: 14, conducted: 20 },
      { subject_id: 'SUB003', attended: 13, conducted: 20 },
      { subject_id: 'SUB004', attended: 15, conducted: 20 },
      { subject_id: 'SUB005', attended: 14, conducted: 20 }
    ]
  }
};

const projection = localCalculateAttendanceProject(rohan, '2026-08-17', '2026-08-19');
console.log("Projected overall attendance:", projection.projected_overall_percentage + "%");
console.log("Total classes missed in projection:", projection.classes_missed_count);

if (projection.classes_missed_count === 9 && projection.projected_overall_percentage === 62.4) {
  console.log("✅ Success: Timetable projection resolved correctly.");
} else {
  console.log("❌ Failure: Timetable projection output incorrect.", projection);
  process.exit(1);
}

console.log("\n=== ALL MATHEMATICAL ATTENDANCE TESTS PASSED SUCCESSFULLY ===");
