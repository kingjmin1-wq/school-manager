import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Types "../types/students";
import Common "../types/common";

module {
  public func listStudents(
    students : Map.Map<Common.Id, Types.Student>,
    filter : Types.StudentFilter,
  ) : [Types.Student] {
    let all = students.values().toArray();
    all.filter(
      func(s) {
        let matchesSearch = switch (filter.search) {
          case null { true };
          case (?term) {
            let q = term.toLower();
            s.name.toLower().contains(#text q) or s.guardianName.toLower().contains(#text q);
          };
        };
        let matchesClass = switch (filter.classId) {
          case null { true };
          case (?cid) { s.classIds.contains(cid) };
        };
        let matchesStatus = switch (filter.status) {
          case null { true };
          case (?st) { s.status == st };
        };
        matchesSearch and matchesClass and matchesStatus;
      }
    );
  };

  public func getStudent(
    students : Map.Map<Common.Id, Types.Student>,
    id : Types.Id,
  ) : ?Types.Student {
    students.get(id);
  };

  public func createStudent(
    students : Map.Map<Common.Id, Types.Student>,
    counters : { var nextStudentId : Common.Id },
    input : Types.StudentInput,
  ) : Types.Student {
    let now = Time.now();
    let id = counters.nextStudentId;
    counters.nextStudentId := id + 1;
    let student : Types.Student = {
      id;
      name = input.name;
      gender = input.gender;
      dateOfBirth = input.dateOfBirth;
      guardianName = input.guardianName;
      guardianPhone = input.guardianPhone;
      status = input.status;
      classIds = [];
      createdAt = now;
      updatedAt = now;
    };
    students.add(id, student);
    student;
  };

  public func updateStudent(
    students : Map.Map<Common.Id, Types.Student>,
    id : Types.Id,
    update : Types.StudentUpdate,
  ) : ?Types.Student {
    switch (students.get(id)) {
      case null { null };
      case (?existing) {
        let updated : Types.Student = {
          id = existing.id;
          name = update.name ?? existing.name;
          gender = update.gender ?? existing.gender;
          dateOfBirth = update.dateOfBirth ?? existing.dateOfBirth;
          guardianName = update.guardianName ?? existing.guardianName;
          guardianPhone = update.guardianPhone ?? existing.guardianPhone;
          status = update.status ?? existing.status;
          classIds = existing.classIds;
          createdAt = existing.createdAt;
          updatedAt = Time.now();
        };
        students.add(id, updated);
        ?updated;
      };
    };
  };

  public func deleteStudent(
    students : Map.Map<Common.Id, Types.Student>,
    id : Types.Id,
  ) : Bool {
    switch (students.get(id)) {
      case null { false };
      case (?_) {
        students.remove(id);
        true;
      };
    };
  };
};
