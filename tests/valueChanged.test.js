//How to run the tests: npx jest test --watchAll
//from the top level directory

//TODO: does this still work after removing const sumarray =     ???? if yes, repeat on other tests
require('../gradeupjs/valueChanged.js')

test("default test true", () => {
    expect(true).toBeTruthy();
})

//test valuechanged
