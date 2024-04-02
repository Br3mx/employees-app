const Employee = require("../employees.model.js");
const expect = require("chai").expect;

describe("Employee", () => {
  it("should throw an error if no arg", async () => {
    const dep = new Employee({}); // create new Employee, but don't set `name` attr value

    dep.validateSync((err) => {
      expect(err.errors.firstName).to.exist;
    });
  });
  it('should throw an error if "firstName, lastName, department" is not a string', () => {
    const cases = [{}, []];

    for (let data of cases) {
      const emp = new Employee(data);

      emp.validateSync((err) => {
        expect(err.errors.firstName).to.exist;
        expect(err.errors.lastName).to.exist;
        expect(err.errors.department).to.exist;
      });
    }
  });
  it("should not throw error if data is ok", () => {
    const cases = [
      { firstName: "Wiktioria", lastName: "Bulanda", department: "IT" },
    ];
    for (let data of cases) {
      const emp = new Employee(data);

      emp.validateSync((err) => {
        expect(err.errors.firstName).to.not.exist;
        expect(err.errors.lastName).to.not.Argumentsexist;
        expect(err.errors.department).to.not.exist;
      });
    }
  });
});
