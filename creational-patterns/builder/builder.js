
// class to be created
class Car {
  constructor(
    name,
    doorType,
    doorCount,
    wheelType,
    wheelSize,
    wheelCount
  ) {
    this.name       = name;
    this.doorType   = doorType;
    this.doorCount  = doorCount;
    this.wheelType  = wheelType;
    this.wheelSize  = wheelSize;
    this.wheelCount = wheelCount;

    this.state = 'stopped';
  }

  drive() {
    this.state = 'driving';
    return this.state;
  }

  stop() {
    this.state = 'stopped';
    return this.state;
  }
}

// builder
class CarBuilder {
  withName( name ) {
    this.name = name;
    return this;
  }

  withDoors( type, count ) {
    this.doorType  = type;
    this.doorCount = count;
    return this;
  }

  withWheels( type, size, count ) {
    this.wheelType  = type;
    this.wheelSize  = size;
    this.wheelCount = count;
    return this;
  }

  build() {
    return new Car(
      this.name,
      this.doorType,
      this.doorCount,
      this.wheelType,
      this.wheelSize,
      this.wheelCount
    );
  }
}

const myCar = new CarBuilder()
.withName('Subaru')
.withDoors( 'Cool', 4 )
.build();

console.log( myCar );
