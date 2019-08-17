interface Preference {
  candidate: string,
  preference: number,
};

interface Counts {
  [key: string]: number,
}

class MySet {
  private props: any[] = [];
  public size: number = 0;

  /**
   * Creates an instance of MySet.
   * @memberof MySet
   */
  constructor(vals: any[] = []) {
    vals.forEach(val => this.add(val));
  }

  /**
   * Adds a property to an instance of MySet
   * @param {any} item property to add
   * @returns {MySet}
   * @memberof MySet
   */
  add(item: any): MySet {
    if (!this.includes(item)) {
      this.props.push(item);
    }
    this.size = this.props.length;
    return this;
  }

  /**
   * Executes a callback on each prop of an instance of MySet
   * @param {(arg0: any) => void} callback
   * @param {*} [scope]
   * @memberof MySet
   */
  forEach(callback: (arg0: any) => void, scope?: any): void {
    this.props.forEach(callback, scope);
  }

  /**
   * Deletes a property from an instance of MySet
   * @param {any} item property to delete 
   * @returns {boolean}
   * @memberof MySet
   */
  delete(item: any): boolean {
    if (this.includes(item)) {
      this.props.splice(this.props.indexOf(item), 1);
    }
    this.size = this.props.length;
    return true;
  }

  /**
   * Determines whether an item is in an instance of MySet
   * @param {any} item property to check
   * @returns {boolean}
   * @memberof MySet
   */
  includes(item: any): boolean {
    var r = false;
    this.props.forEach(prop => {
      if (prop === item) {
        r = true;
      }
    });
    return r;
  }
}

export class Election {
  votes: Vote[] = [];
  allCandidates: MySet = new MySet();
  maxPreference: number = 0;

  /**
   * Creates an instance of Election.
   * @memberof Election
   */
  constructor() {
  }

  /**
   * Adds a preferences to the election
   * @param {Preference[]} preferences the preferences for the vote to be added
   * @memberof Election
   */
  addPreferences(preferences: Preference[]): void {
    this.votes.push(new Vote(preferences));
    preferences.forEach(preference => { this.allCandidates.add(preference.candidate); });
    this.setMaxPreference();
  }

  /**
   * Adds a vote to the election
   * @param {Vote} vote the vote to add to the election
   * @memberof Election
   */
  addVote(vote: Vote): void {
    this.votes.push(vote);
    vote.preferences.forEach(preference => { this.allCandidates.add(preference.candidate); });
    this.setMaxPreference();
  }

  /**
   * Set the maxPreference attribute
   * @memberof Election
   */
  setMaxPreference(): void {
    this.votes.forEach(vote => {
      this.maxPreference = vote.preferences.length > this.maxPreference ? vote.preferences.length : this.maxPreference;
    });
  }

  /**
   * Return an Object with the preferences counted for each candidate
   * @param {number} preferenceNumber the preference number to count
   * @returns {Counts} object containing candidates as keys, and vote counts as values
   * @memberof Election
   */
  countPreference(preferenceNumber: number): Counts {
    var counts: Counts = {};
    this.votes.forEach(vote => {
      vote.preferences.forEach(preference => {
        if (preference.preference === preferenceNumber) {
          if (preference.candidate in counts) {
            counts[preference.candidate]++;
          } else {
            counts[preference.candidate] = 1;
          }
        }
      });
    });

    this.allCandidates.forEach(candidate => {
      if (!(candidate in counts)) {
        counts[candidate] = 0;
      }
    });

    return counts;
  }

  /**
   * Returns an array containing the candidates with the least votes
   * @param {Counts} counts Object containing the counts for all candidates
   * @returns {string[]} array of all candidates with the least votes
   * @memberof Election
   */
  leastVotes(counts: Counts): string[] {
    var leastVotes = Math.min(...Object.keys(counts).map(key => counts[key]));
    return Object.keys(counts).filter(candidate => {
      return counts[candidate] === leastVotes;
    });
  }

  /**
   * Returns an array containing the candidates with the most votes
   * @param {Counts} counts Object containing the counts for all candidates
   * @returns {string[]} array of all candidates with the most votes
   * @memberof Election
   */
  mostVotes(counts: Counts): string[] {
    var mostVotes = Math.max(...Object.keys(counts).map(key => counts[key]));
    return Object.keys(counts).filter(candidate => {
      return counts[candidate] === mostVotes;
    });
  }

  /**
   * Determines what candidates should be eliminated
   * @returns {string[]} array of candidates to eliminate
   * @memberof Election
   */
  nextRound(): string[] {
    var counts = this.countPreference(1);
    var leastVotes = this.leastVotes(counts);

    var pref: number = 2;
    while (leastVotes.length > 1 && pref <= this.maxPreference) {
      var newCounts = this.countPreference(pref);
      leastVotes = leastVotes.filter(value => this.leastVotes(newCounts).indexOf(value) > -1).length ? leastVotes.filter(value => this.leastVotes(newCounts).indexOf(value) > -1) : leastVotes;
      pref++;
    }

    return leastVotes;
  }

  /**
   * Removes a specified candidate from all votes in the Election
   * @param {string} candidate the candidate to eliminate from the votes
   * @memberof Election
   */
  eliminateCandidate(candidate: string): void {
    this.allCandidates.delete(candidate);
    this.maxPreference--;

    for (var i = (this.votes.length - 1); i >= 0; i--) {
      this.votes[i].shiftPreferences(candidate);
      if (this.votes[i].preferences.length == 0) {
        this.votes.splice(i, 1);
      }
    }
  }

  /**
   * Returns the candidate/s that came in the nth position
   * @param {number} n the position of the candidate/s to return
   * @returns {string[]} array containing candidate/s that came in nth place
   * @memberof Election
   */
  getNthCandidate(n: number): string[] {
    if (n === 1) {
      return this.getWinner();
    } else {
      var election = new Election();
      this.votes.forEach(vote => {
        election.addVote(Vote.copy(vote));
      });
      this.getWinner().forEach(winner => {
        election.eliminateCandidate(winner);
      });
      return election.getNthCandidate(n - 1);
    }
  }

  /**
   * Checks if a winner has been found, or a tie has been reached
   * @returns {boolean} has a winner been found
   * @memberof Election
   */
  haveWinner(): boolean {
    var counts = this.countPreference(1);
    var mostVotes: string[] = this.mostVotes(counts);

    if (((counts[mostVotes[0]] / this.votes.length) > 0.5) || this.nextRound().length === this.allCandidates.size || this.allCandidates.size == 0) {
      return true;
    }
    return false;
  }

  /**
   * Returns the winner/s of the election
   * @returns {string[]} the winner/s of the election
   * @memberof Election
   */
  getWinner(): string[] {
    if (!this.haveWinner()) {
      var election = new Election();

      this.votes.forEach(vote => {
        election.addVote(Vote.copy(vote));
      });

      var leastVotes = this.nextRound();
      leastVotes.forEach(candidate => {
        election.eliminateCandidate(candidate);
      });

      return election.getWinner();
    } else {
      var counts = this.countPreference(1);
      var mostVotes: string[] = this.mostVotes(counts);
      return mostVotes;
    }
  }
}

export class Vote {

  /**
   * Creates an instance of Vote.
   * @param {Preference[]} [preferences=[]] the preferences to fill the vote with
   * @memberof Vote
   */
  constructor(public preferences: Preference[] = []) {
  }

  /**
   * Add a preference to a vote, the existing preferences are checked to see if there is a clash
   * @param {Preference} newPreference preference to add to the vote
   * @memberof Vote
   */
  addPreference(newPreference: Preference): void {
    this.preferences.forEach(preference => {
      if (newPreference.preference == preference.preference) {
        throw "Preference already exists";
      }
    });

    this.preferences.push(newPreference);
  }

  /**
   * Removes a candidate from a vote and shift all candidates with preferences less than the one removed up by one
   * @param {string} candidate candidate to remove from a vote
   * @memberof Vote
   */
  shiftPreferences(candidate: string): void {
    var preferenceNumber: Number;

    this.preferences = this.preferences.filter(preference => {
      if (preference.candidate === candidate) {
        preferenceNumber = preference.preference;
        return false;
      }
      return true;
    });

    this.preferences.forEach(preference => {
      if (preference.preference > preferenceNumber) {
        preference.preference--;
      }
    });
  }

  /**
   * Creates a copy of a Vote
   * @static
   * @param {Vote} vote the vote to create a copy of
   * @returns {Vote} a copy of vote
   * @memberof Vote
   */
  static copy(vote: Vote): Vote {
    var voteCopy = new Vote();
    vote.preferences.forEach(preference => {
      voteCopy.addPreference({ candidate: preference.candidate, preference: preference.preference });
    });
    return voteCopy;
  }
}

/**
 * Reads the votes from the input sheet
 * @param {GoogleAppsScript.Spreadsheet.Sheet} input the sheet to read the votes from
 * @returns {Vote[]} array of all votes
 */
function readVotes(input: GoogleAppsScript.Spreadsheet.Sheet): Vote[] {
  var vals = input.getRange("B2:F").getValues();
  var votes = [];
  vals.some(prefs => {
    if (!prefs[0]) {
      return;
    }
    var vote = new Vote();
    prefs.forEach((pref, index) => {
      vote.addPreference({ candidate: pref, preference: index + 1 });
    });
    votes.push(vote);
  });
  return votes;
}

/**
 * Main entrypoint for program
 */
function main(): void {
  var ss = SpreadsheetApp.getActive();
  var input = ss.getSheetByName("Form Responses 1");
  var output = ss.getSheetByName("Final Results");
  var preferences = readVotes(input);

  var myElection = new Election();
  preferences.forEach(vote => {
    myElection.addVote(vote);
  });

  output.clear();

  var i = 1;
  var cands = myElection.getNthCandidate(i);
  while (cands.length) {
    output.appendRow(cands);
    i++;
    cands = myElection.getNthCandidate(i);
  }
}
