/**
 * Checks for the approved booking rules: airport-desk payment
 * eligibility, round-trip payment coverage, reminder payment wording,
 * demo-data honesty, step validation and discovery coverage.
 * Plain Node assertions; the project has no test framework.
 */
const Module = require("module"); const path = require("path");
// Compiled by `npm run test:rules` (tsc -p scripts/booking-rules).
const OUT = path.join(__dirname, "..", "..", ".rules-build");
const orig = Module._resolveFilename;
Module._resolveFilename = function (req, ...rest) { if (req.startsWith("@/")) req = path.join(OUT, req.slice(2)); return orig.call(this, req, ...rest); };
const assert = require("assert");
const { legsFromSearch } = require(OUT + "/lib/b2c/booking/itinerary");
const { deskPaymentEligibility } = require(OUT + "/lib/b2c/booking/payment-eligibility");
const { reminderFor } = require(OUT + "/lib/b2c/booking/reminder");
const { demoBookings } = require(OUT + "/lib/b2c/booking/demo/bookings");
const D = require(OUT + "/lib/b2c/booking/draft");
const { discoveryFor } = require(OUT + "/lib/b2c/discovery");
const { shuttleFareUnits } = require(OUT + "/lib/b2c/booking/itinerary");
let n = 0; const t = (name, fn) => { fn(); n++; console.log("ok -", name); };
const s = (o) => ({ trip: "oneway", from: "", to: "", date: "2030-06-01", time: "", returnDate: "", returnTime: "", adults: 2, children: 0, ages: [], ...o });
const elig = (o, term) => deskPaymentEligibility(legsFromSearch(s(o)), term);

t("AYT → hotel one way is eligible, covers one leg", () => { const e = elig({ from: "ayt", to: "belek" }); assert.equal(e.eligible, true); assert.deepEqual(e.coversLegs, ["out"]); assert.equal(e.paymentPoint, null); });
t("AYT → hotel round trip: one payment covers both legs", () => { const e = elig({ from: "ayt", to: "side", trip: "return", returnDate: "2030-06-08" }); assert.equal(e.eligible, true); assert.deepEqual(e.coversLegs, ["out", "ret"]); assert.equal(e.collectAtLeg, "out"); });
t("terminal → desk 44 / 74 / domestic→44", () => {
  assert.equal(elig({ from: "ayt", to: "kemer" }, "int_t1").paymentPoint.desk, "Desk 44");
  assert.equal(elig({ from: "ayt", to: "kemer" }, "int_t2").paymentPoint.desk, "Desk 74");
  const d = elig({ from: "ayt", to: "kemer" }, "domestic").paymentPoint; assert.equal(d.desk, "Desk 44"); assert.ok(d.note);
});
t("standalone hotel → AYT not eligible", () => { const e = elig({ from: "belek", to: "ayt" }); assert.equal(e.eligible, false); assert.equal(e.reason, "no_arrival_leg"); });
t("hotel → AYT → hotel round trip not eligible (arrival not first)", () => { const e = elig({ from: "belek", to: "ayt", trip: "return", returnDate: "2030-06-08" }); assert.equal(e.eligible, false); assert.equal(e.reason, "first_leg_not_arrival"); });
t("Gazipaşa arrival not eligible", () => { const e = elig({ from: "gzp", to: "alanya" }); assert.equal(e.eligible, false); assert.equal(e.reason, "arrival_not_ayt"); });
t("Dalaman arrival not eligible", () => assert.equal(elig({ from: "dlm", to: "fethiye" }).eligible, false));
t("AYT → airport not eligible", () => { const e = elig({ from: "ayt", to: "gzp" }); assert.equal(e.eligible, false); assert.equal(e.reason, "arrival_not_to_accommodation"); });
t("no legs not eligible", () => assert.equal(deskPaymentEligibility([]).eligible, false));

const today = new Date(2030, 5, 10);
const demos = Object.fromEntries(demoBookings(today).map((d) => [d.id, d.booking]));
t("reminder: unpaid desk booking asks for payment on the arrival leg only", () => {
  assert.equal(reminderFor(demos.reminder, "out").payment, "pay_at_desk");
  assert.equal(reminderFor(demos.reminder, "ret").payment, "none");
});
t("reminder: return already paid at desk is never asked to pay", () => {
  const r = reminderFor(demos["paid-return"], "ret");
  assert.equal(r.payment, "already_paid"); assert.ok(!r.lines.some((l) => /due|pay at/i.test(l)));
});
t("reminder: pending pickup is described, not invented", () => { const r = reminderFor(demos["paid-return"], "ret"); assert.ok(r.lines.some((l) => /not been set/.test(l))); });
t("demo: statuses are independent (reserved + unpaid + reconfirmed)", () => {
  const b = demos["reconfirmed-unpaid"]; assert.equal(b.status, "reserved"); assert.equal(b.payment.status, "unpaid"); assert.equal(b.legs[0].reconfirmation.status, "confirmed");
});
t("demo: no fabricated pickup times, durations or vehicles", () => {
  for (const b of Object.values(demos)) for (const l of b.legs) { assert.notEqual(l.pickup.status, "confirmed"); assert.equal(l.journey.status, "unavailable"); assert.equal(l.vehicleCategory, null); }
});
t("demo: paid only with a payment record", () => { for (const b of Object.values(demos)) if (b.payment.status === "paid") assert.ok(b.payment.paymentRecordRef && b.payment.paidAt); });

t("shuttle fares: <3 free, 3–11 half", () => assert.deepEqual(shuttleFareUnits({ adults: 2, children: 3, childAges: [0, 2, 3] }), { adult: 2, child_half: 1, infant_free: 2 }));
t("step 1 requires a service", () => { assert.ok(D.validateTransfer(D.EMPTY_DRAFT).service); assert.deepEqual(D.validateTransfer({ ...D.EMPTY_DRAFT, service: "shared" }), {}); });
t("child seats limited to children", () => assert.ok(D.validateExtras({ ...D.EMPTY_DRAFT, childSeats: 2 }, s({ children: 1, ages: [4] })).childSeats));
const legsRT = legsFromSearch(s({ from: "ayt", to: "belek", trip: "return", returnDate: "2030-06-08" }));
t("details: required fields, phone needs country code, both flights", () => {
  const e = D.validateDetails({ ...D.EMPTY_DRAFT, fields: { phone: "07700 900123" } }, legsRT);
  for (const k of ["lead-first", "lead-last", "email", "phone", "out-arr-number", "out-arr-time", "ret-dep-number", "ret-dep-time", "hotel"]) assert.ok(e[k], k);
});
t("details: valid set passes; departure date day-after ok, 2 days not", () => {
  const fields = { "lead-first": "A", "lead-last": "B", email: "a@b.co", phone: "+44 7700 900123", "out-arr-number": "TK 2412", "out-arr-time": "14:30", "ret-dep-number": "TK2413", "ret-dep-time": "06:05", "ret-dep-date": "2030-06-09", hotel: "H" };
  assert.deepEqual(D.validateDetails({ ...D.EMPTY_DRAFT, fields }, legsRT), {});
  assert.ok(D.validateDetails({ ...D.EMPTY_DRAFT, fields: { ...fields, "ret-dep-date": "2030-06-10" } }, legsRT)["ret-dep-date"]);
});
t("payment: desk rejected when ineligible", () => { assert.ok(D.validatePayment({ ...D.EMPTY_DRAFT, paymentMethod: "airport_desk" }, false).payment); assert.deepEqual(D.validatePayment({ ...D.EMPTY_DRAFT, paymentMethod: "online_card" }, false), {}); });
t("request mapping: terminal + notes, manifest", () => {
  const sr = s({ from: "ayt", to: "belek", adults: 2, children: 1, ages: [5] });
  const legs = legsFromSearch(sr);
  const r = D.toBookingRequest(sr, legs, { ...D.EMPTY_DRAFT, service: "private", notes: " golf ", fields: { "out-arr-terminal": "int_t2", "out-arr-number": "tk 1", "a2-first": "X" } });
  assert.equal(r.flights[0].terminal, "int_t2"); assert.equal(r.flights[0].flightNumber, "TK 1"); assert.equal(r.extras.operationalNotes, "golf");
  assert.equal(r.manifest.others.length, 2); assert.equal(r.manifest.others[1].age, 5); assert.equal(D.arrivalTerminal({ ...D.EMPTY_DRAFT, fields: { "out-arr-terminal": "int_t2" } }, legs), "int_t2");
});
t("discovery: Antalya areas only", () => { assert.equal(discoveryFor("belek").place, "Belek"); assert.ok(discoveryFor("kemer").modules[0].items.length); assert.equal(discoveryFor("fethiye"), null); assert.equal(discoveryFor("goreme"), null); assert.equal(discoveryFor("ayt"), null); });
console.log(`\n${n} checks passed`);
