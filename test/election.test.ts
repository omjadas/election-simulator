import { Election, Vote } from "../src/election";

const uniformPreferences = [
  [{ candidate: "apple", preference: 1 }, { candidate: "banana", preference: 2 }, { candidate: "carrot", preference: 3 }, { candidate: "date", preference: 4 }],
  [{ candidate: "apple", preference: 1 }, { candidate: "banana", preference: 2 }, { candidate: "carrot", preference: 3 }, { candidate: "date", preference: 4 }],
  [{ candidate: "apple", preference: 1 }, { candidate: "banana", preference: 2 }, { candidate: "carrot", preference: 3 }, { candidate: "date", preference: 4 }],
  [{ candidate: "apple", preference: 2 }, { candidate: "banana", preference: 1 }, { candidate: "carrot", preference: 3 }, { candidate: "date", preference: 4 }],
  [{ candidate: "apple", preference: 2 }, { candidate: "banana", preference: 1 }, { candidate: "carrot", preference: 3 }, { candidate: "date", preference: 4 }],
  [{ candidate: "apple", preference: 2 }, { candidate: "banana", preference: 1 }, { candidate: "carrot", preference: 3 }, { candidate: "date", preference: 4 }],
  [{ candidate: "apple", preference: 2 }, { candidate: "banana", preference: 1 }, { candidate: "carrot", preference: 3 }, { candidate: "date", preference: 4 }],
  [{ candidate: "apple", preference: 2 }, { candidate: "banana", preference: 1 }, { candidate: "carrot", preference: 3 }, { candidate: "date", preference: 4 }],
  [{ candidate: "apple", preference: 1 }, { candidate: "banana", preference: 2 }, { candidate: "carrot", preference: 3 }, { candidate: "date", preference: 4 }],
  [{ candidate: "apple", preference: 1 }, { candidate: "banana", preference: 2 }, { candidate: "carrot", preference: 3 }, { candidate: "date", preference: 4 }],
  [{ candidate: "apple", preference: 3 }, { candidate: "banana", preference: 2 }, { candidate: "carrot", preference: 1 }, { candidate: "date", preference: 4 }],
  [{ candidate: "apple", preference: 1 }, { candidate: "banana", preference: 2 }, { candidate: "carrot", preference: 3 }, { candidate: "date", preference: 4 }]
];

const nonUniformPreferences = [
  [{ candidate: "apple", preference: 1 }, { candidate: "banana", preference: 2 }, { candidate: "carrot", preference: 3 }, { candidate: "date", preference: 4 }],
  [{ candidate: "apple", preference: 1 }, { candidate: "banana", preference: 2 },                                         { candidate: "date", preference: 3 }, {candidate: "elderberry", preference: 4}, {candidate: "fig", preference: 5}],
  [{ candidate: "apple", preference: 5 }, { candidate: "banana", preference: 2 }, { candidate: "carrot", preference: 3 }, { candidate: "date", preference: 4 }, {candidate: "elderberry", preference: 1}],
  [{ candidate: "apple", preference: 2 }, { candidate: "banana", preference: 1 }, { candidate: "carrot", preference: 3 }, { candidate: "date", preference: 4 }],
  [{ candidate: "apple", preference: 3 },                                         { candidate: "carrot", preference: 1 }, { candidate: "date", preference: 2 }],
  [{ candidate: "apple", preference: 2 }, { candidate: "banana", preference: 1 }, { candidate: "carrot", preference: 3 }, { candidate: "date", preference: 4 }],
  [{ candidate: "apple", preference: 2 }, { candidate: "banana", preference: 1 }],
  [{ candidate: "apple", preference: 2 }, { candidate: "banana", preference: 1 }, { candidate: "carrot", preference: 3 }, { candidate: "date", preference: 4 }],
  [                                       { candidate: "banana", preference: 1 }, { candidate: "carrot", preference: 2 }, { candidate: "date", preference: 3 }],
  [{ candidate: "apple", preference: 1 }],
  [{ candidate: "apple", preference: 3 }, { candidate: "banana", preference: 2 }, { candidate: "carrot", preference: 1 }, { candidate: "date", preference: 4 }, {candidate: "elderberry", preference: 5}],
  [{ candidate: "apple", preference: 1 }, { candidate: "banana", preference: 2 }, { candidate: "carrot", preference: 3 }, { candidate: "date", preference: 4 }]
];

describe("elections", () => {
  describe("uniform preferences", () => {
    describe("results", () => {
      test("no votes", () => {
        const myElection = new Election();
        expect(myElection.getWinner()).toEqual([]);
      });

      test("one vote", () => {
        const myElection = new Election();
        myElection.addPreferences(uniformPreferences[0]);
        expect(myElection.getWinner()).toEqual(["apple"]);
      });

      test("all votes", () => {
        const myElection = new Election();
        uniformPreferences.forEach(preference => myElection.addPreferences(preference));
        expect(myElection.getWinner()).toEqual(["apple", "banana"]);
      });

      test("all candidates returned", () => {
        const myElection = new Election();
        uniformPreferences.forEach(preference => myElection.addPreferences(preference));
        var allCandidates = new Set();
        uniformPreferences.forEach(preference => {
          preference.forEach(candidate => {
            allCandidates.add(candidate.candidate);
          });
        });
        var returned = 0;
        var i = 1;
        while (myElection.getNthCandidate(i).length) {
          returned += myElection.getNthCandidate(i).length;
          i++;
        }
        expect(returned).toBe(allCandidates.size);
      });
    });

    test("counts", () => {
      const myElection = new Election();
      uniformPreferences.forEach(preference => myElection.addPreferences(preference));
      expect(myElection.countPreference(1)).toEqual({ "apple": 6, "banana": 5, "carrot": 1, "date": 0 });
    });
  });

  describe("non-uniform preferences", () => {
    describe("results", () => {
      test("all candidates returned", () => {
        const myElection = new Election();
        nonUniformPreferences.forEach(preference => myElection.addPreferences(preference));
        var allCandidates = new Set();
        nonUniformPreferences.forEach(preference => {
          preference.forEach(candidate => {
            allCandidates.add(candidate.candidate);
          });
        });
        var returned = 0;
        var i = 1;
        while (myElection.getNthCandidate(i).length) {
          returned += myElection.getNthCandidate(i).length;
          i++;
        }
        expect(returned).toBe(allCandidates.size);
      });
    });
  });
});

describe("votes", () => {
  test("shift preferences", () => {
    const myVote = new Vote(uniformPreferences[0]);
    myVote.shiftPreferences("banana");
    expect(myVote.preferences).toEqual([{ candidate: "apple", preference: 1 }, { candidate: "carrot", preference: 2 }, { candidate: "date", preference: 3 }]);
  });
});
