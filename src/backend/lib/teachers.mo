import Map "mo:core/Map";
import Time "mo:core/Time";
import Types "../types/teachers";
import Common "../types/common";

module {
  public func listTeachers(
    teachers : Map.Map<Common.Id, Types.Teacher>,
    filter : Types.TeacherFilter,
  ) : [Types.Teacher] {
    let all = teachers.values().toArray();
    all.filter(
      func(t) {
        switch (filter.search) {
          case null { true };
          case (?term) {
            let q = term.toLower();
            t.name.toLower().contains(#text q)
            or t.subject.toLower().contains(#text q)
            or t.email.toLower().contains(#text q);
          };
        };
      }
    );
  };

  public func getTeacher(
    teachers : Map.Map<Common.Id, Types.Teacher>,
    id : Types.Id,
  ) : ?Types.Teacher {
    teachers.get(id);
  };

  public func createTeacher(
    teachers : Map.Map<Common.Id, Types.Teacher>,
    counters : { var nextTeacherId : Common.Id },
    input : Types.TeacherInput,
  ) : Types.Teacher {
    let now = Time.now();
    let id = counters.nextTeacherId;
    counters.nextTeacherId := id + 1;
    let teacher : Types.Teacher = {
      id;
      name = input.name;
      email = input.email;
      phone = input.phone;
      subject = input.subject;
      createdAt = now;
      updatedAt = now;
    };
    teachers.add(id, teacher);
    teacher;
  };

  public func updateTeacher(
    teachers : Map.Map<Common.Id, Types.Teacher>,
    id : Types.Id,
    update : Types.TeacherUpdate,
  ) : ?Types.Teacher {
    switch (teachers.get(id)) {
      case null { null };
      case (?existing) {
        let updated : Types.Teacher = {
          id = existing.id;
          name = update.name ?? existing.name;
          email = update.email ?? existing.email;
          phone = update.phone ?? existing.phone;
          subject = update.subject ?? existing.subject;
          createdAt = existing.createdAt;
          updatedAt = Time.now();
        };
        teachers.add(id, updated);
        ?updated;
      };
    };
  };

  public func deleteTeacher(
    teachers : Map.Map<Common.Id, Types.Teacher>,
    id : Types.Id,
  ) : Bool {
    switch (teachers.get(id)) {
      case null { false };
      case (?_) {
        teachers.remove(id);
        true;
      };
    };
  };
};
