const Employee = require("../employees.model.js");
const expect = require("chai").expect;
const mongoose = require("mongoose");

describe("Employee", () => {
  before(async () => {
    try {
      await mongoose.connect("mongodb://0.0.0.0:27017/companyDBtest", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    } catch (err) {
      console.error(err);
    }
  });

  describe("Reading data", () => {
    before(async () => {
      const testEmplOne = new Employee({
        firstName: "John",
        lastName: "Doe",
        department: "IT",
      });
      await testEmplOne.save();

      const testEmplTwo = new Employee({
        firstName: "Wiktoria",
        lastName: "Bulanda",
        department: "Marketing",
      });
      await testEmplTwo.save();
    });

    it('should return all the data with "find" method', async () => {
      const employees = await Employee.find();
      expect(employees.length).to.be.equal(2);
    });

    it("should return proper document by various params with findOne method", async () => {
      const employee1 = await Employee.findOne({ firstName: "John" });
      expect(employee1.firstName).to.be.equal("John");

      const employee2 = await Employee.findOne({ lastName: "Bulanda" });
      expect(employee2.lastName).to.be.equal("Bulanda");

      const employee3 = await Employee.findOne({ department: "IT" });
      expect(employee3.department).to.be.equal("IT");
    });

    after(async () => {
      await Employee.deleteMany();
    });
  });

  describe("Creating data", () => {
    it('should insert new document with "insertOne" method', async () => {
      const employee = new Employee({
        firstName: "Peter",
        lastName: "Parker",
        department: "Marketing",
      });
      await employee.save();
      expect(employee.isNew).to.be.false;
    });

    after(async () => {
      await Employee.deleteMany();
    });
  });

  describe("Updating data", () => {
    beforeEach(async () => {
      const testEmplOne = new Employee({
        firstName: "Steven",
        lastName: "Hopkins",
        department: "IT",
      });
      await testEmplOne.save();

      const testEmplTwo = new Employee({
        firstName: "John",
        lastName: "Kowalski",
        department: "Marketing",
      });
      await testEmplTwo.save();
    });

    it("should properly update one document with updateOne method", async () => {
      await Employee.updateOne(
        { lastName: "Kowalski" },
        { $set: { lastName: "Kowalewski" } }
      );
      const updatedEmployee = await Employee.findOne({
        lastName: "Kowalewski",
      });
      expect(updatedEmployee).to.not.be.null;
    });

    it("should properly update one document with save method", async () => {
      const employee = await Employee.findOne({ lastName: "Kowalski" });
      employee.lastName = "Kowalewski";
      await employee.save();

      const updatedEmployee = await Employee.findOne({
        lastName: "Kowalewski",
      });
      expect(updatedEmployee).to.not.be.null;
    });

    it("should properly update multiple documents with updateMany method", async () => {
      await Employee.updateMany({}, { $set: { department: "NewDepartment" } });
      const employees = await Employee.find({ department: "NewDepartment" });
      expect(employees.length).to.be.equal(2);
    });

    afterEach(async () => {
      await Employee.deleteMany();
    });
  });

  describe("Removing data", () => {
    beforeEach(async () => {
      const testEmplOne = new Employee({
        firstName: "Peter",
        lastName: "Parker",
        department: "IT",
      });
      await testEmplOne.save();

      const testEmplTwo = new Employee({
        firstName: "John",
        lastName: "Kowalski",
        department: "Marketing",
      });
      await testEmplTwo.save();
    });

    it("should properly remove one document with deleteOne method", async () => {
      await Employee.deleteOne({ firstName: "Peter" });
      const deletedEmployee = await Employee.findOne({ firstName: "Peter" });
      expect(deletedEmployee).to.be.null;
    });

    it("should properly remove multiple documents with deleteMany method", async () => {
      await Employee.deleteMany();
      const deletedEmployees = await Employee.find();
      expect(deletedEmployees.length).to.be.equal(0);
    });
    afterEach(async () => {
      await Employee.deleteMany();
    });
  });
});
