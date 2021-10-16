# Builder Pattern

The *builder pattern* simplifies the creation of objects by separating instantiation procedures into a set of methods that configure related properties.

### Without Builder Pattern

```jsx
class Boat {
  constructor(allParameters) {
  }
}

const myBoat = new Boat({
	hasMotor: true,
  motorCount: 2,
  motorBrand: 'Best Motor Co. ',
  motorModel: 'OM123',
  hasSails: true,
  sailsCount: 1,
  sailsMaterial: 'fabric',
  sailsColor: 'white',
  hullColor: 'blue',
  hasCabin: false
})
```

### With the Builder Pattern

```jsx
class BoatBuilder {
  withMotors (count, brand, model) {
    this.hasMotor = true
    this.motorCount = count
    this.motorBrand = brand
    this.motorModel = model
    return this
  }
  withSails (count, material, color) {
    this.hasSails = true
    this.sailsCount = count
    this.sailsMaterial = material
    this.sailsColor = color
    return this
  }
  hullColor (color) {
    this.hullColor = color
    return this
  }
  withCabin () {
    this.hasCabin = true
    return this
  }
  build() {
    return new Boat({
      hasMotor: this.hasMotor,
      motorCount: this.motorCount,
      motorBrand: this.motorBrand,
      motorModel: this.motorModel,
      hasSails: this.hasSails,
      sailsCount: this.sailsCount,
      sailsMaterial: this.sailsMaterial,
      sailsColor: this.sailsColor,
      hullColor: this.hullColor,
      hasCabin: this.hasCabin
    })
  }
}

const myBoat = new BoatBuilder()
  .withMotors(2, 'Best Motor Co. ', 'OM123')
  .withSails(1, 'fabric', 'white')
  .withCabin()
```

As you can see, this pattern makes it much simpler to create an object and the code is much easier to read. It also conveys information about different parameters that might be required.

### Guarantees & Uses

- Simplify constructor into logical sections
- Increase code readability
