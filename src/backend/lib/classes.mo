import Map "mo:core/Map";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Types "../types/classes";
import Common "../types/common";

module {
  public func listClasses(
    classes : Map.Map<Common.Id, Types.Class>,
    filter : Types.ClassFilter,
  ) : [Types.Class] {
    let all = classes.values().toArray();
    all.filter(
      func(c) {
        let matchesSearch = switch (filter.search) {
          case null { true };
          case (?term) {
            let q = term.toLower();
            c.name.toLower().contains(#text q) or c.gradeLevel.toLower().contains(#text q);
          };
        };
        let matchesTeacher = switch (filter.homeroomTeacherId) {
          case null { true };
          case (?tid) { c.homeroomTeacherId == ?tid };
        };
        matchesSearch and matchesTeacher;
      }
    );
  };

  public func getClass(
    classes : Map.Map<Common.Id, Types.Class>,
    id : Types.Id,
  ) : ?Types.Class {
    classes.get(id);
  };

  public func createClass(
    classes : Map.Map<Common.Id, Types.Class>,
    counters : { var nextClassId : Common.Id },
    input : Types.ClassInput,
  ) : Types.Class {
    let now = Time.now();
    let id = counters.nextClassId;
    counters.nextClassId := id + 1;
    let cls : Types.Class = {
      id;
      name = input.name;
      gradeLevel = input.gradeLevel;
      homeroomTeacherId = input.homeroomTeacherId;
      capacity = input.capacity;
      enrolledCount = 0;
      createdAt = now;
      updatedAt = now;
    };
    classes.add(id, cls);
    cls;
  };

  public func updateClass(
    classes : Map.Map<Common.Id, Types.Class>,
    id : Types.Id,
    update : Types.ClassUpdate,
  ) : ?Types.Class {
    switch (classes.get(id)) {
      case null { null };
      case (?existing) {
        let updated : Types.Class = {
          id = existing.id;
          name = update.name ?? existing.name;
          gradeLevel = update.gradeLevel ?? existing.gradeLevel;
          homeroomTeacherId = switch (update.homeroomTeacherId) {
            case null { existing.homeroomTeacherId };
            case (?tid) { ?tid };
          };
          capacity = update.capacity ?? existing.capacity;
          enrolledCount = existing.enrolledCount;
          createdAt = existing.createdAt;
          updatedAt = Time.now();
        };
        classes.add(id, updated);
        ?updated;
      };
    };
  };

  public func deleteClass(
    classes : Map.Map<Common.Id, Types.Class>,
    id : Types.Id,
  ) : Bool {
    switch (classes.get(id)) {
      case null { false };
      case (?_) {
        classes.remove(id);
        true;
      };
    };
  };

  /// Increment the enrolled count of a class, if it exists.
  public func incrementEnrolled(
    classes : Map.Map<Common.Id, Types.Class>,
    id : Types.Id,
  ) : () {
    switch (classes.get(id)) {
      case null {};
      case (?existing) {
        classes.add(id, { existing with enrolledCount = existing.enrolledCount + 1 });
      };
    };
  };

  /// Decrement the enrolled count of a class, if it exists and is positive.
  public func decrementEnrolled(
    classes : Map.Map<Common.Id, Types.Class>,
    id : Types.Id,
  ) : () {
    switch (classes.get(id)) {
      case null {};
      case (?existing) {
        if (existing.enrolledCount > 0) {
          let nextCount = (existing.enrolledCount.toInt() - 1).toNat();
          classes.add(id, { existing with enrolledCount = nextCount });
        };
      };
    };
  };
};
