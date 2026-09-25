const test = require("node:test");
const assert = require("node:assert/strict");
const {
  getDateValue,
  isDateValue,
  isDueDateAllowed,
} = require("../todo-utils.js");

test("日付をローカルの YYYY-MM-DD 形式に変換する", () => {
  assert.equal(getDateValue(new Date(2026, 8, 25)), "2026-09-25");
});

test("今日と未来の期限日を受け付ける", () => {
  const today = "2026-09-25";

  assert.equal(isDueDateAllowed(today, today), true);
  assert.equal(isDueDateAllowed("2026-09-26", today), true);
});

test("過去の期限日を拒否する", () => {
  assert.equal(isDueDateAllowed("2026-09-24", "2026-09-25"), false);
});

test("期限日が空欄の場合は許可する", () => {
  assert.equal(isDueDateAllowed("", "2026-09-25"), true);
});

test("過去や不正な形式の期限日を拒否する", () => {
  assert.equal(isDueDateAllowed("2026-09-24", "2026-09-25"), false);
  assert.equal(isDueDateAllowed(null, "2026-09-25"), false);
  assert.equal(isDateValue("2026-02-29"), false);
  assert.equal(isDateValue("2026-2-09"), false);
});
