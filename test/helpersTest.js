// helptertest code
const { assert } = require("chai");
const { getUserByEmail } = require("../helpers");

const testUsers = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

describe("getUserByEmail", function () {
  it("should return a user with a valid email", function () {
    const user = getUserByEmail("user@example.com", testUsers);
    const expectedUserID = "userRandomID";
    assert.strictEqual(user.id, expectedUserID);
  });

  it("should return undefined for an email that is not in the database", function () {
    const user = getUserByEmail("notfound@example.com", testUsers);
    assert.isUndefined(user);
  });

  it("should return undefined if no email is provided", function () {
    const user = getUserByEmail("", testUsers);
    assert.isUndefined(user);
  });
});
