interface preference {
  candidate: string,
  preference: number
};

class Election {
  votes: Vote[] = [];
  allCandidates: Set<string> = new Set();

  constructor(public maxPreference: number = Infinity) {
  }

  /**
   * Adds a preferences to the election
   * @param preferences the preferences for the vote to be added
   */
  addPreferences(preferences: preference[]): void {
    this.votes.push(new Vote(preferences));
    preferences.forEach(preference => { this.allCandidates.add(preference.candidate) });
  }

  /**
   * Adds a vote to the election
   * @param vote the vote to add to the election
   */
  addVote(vote: Vote): void {
    this.votes.push(vote);
    vote.preferences.forEach(preference => { this.allCandidates.add(preference.candidate) });
  }

  /**
   * Return an Object with the preferences counted for each candidate
   * @param preferenceNumber the preference number to count
   */
  countPreference(preferenceNumber: number): Object {
    var counts: Object = {};
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
    })

    return counts;
  }

  /**
   * Returns an array containing the candidates with the least votes
   * @param counts Object containing the counts for all candidates
   */
  leastVotes(counts: Object): string[] {
    var leastVotes = Math.min(...Object.keys(counts).map(key => counts[key]));
    return Object.keys(counts).filter(candidate => {
      return counts[candidate] === leastVotes;
    });
  }

  /**
   * Returns an array containing the candidates with the most votes
   * @param counts Object containing the counts for all candidates
   */
  mostVotes(counts: Object): string[] {
    var mostVotes = Math.max(...Object.keys(counts).map(key => counts[key]));
    return Object.keys(counts).filter(candidate => {
      return counts[candidate] === mostVotes;
    });
  }

  nextRound(): string[] {
    var counts = this.countPreference(1);
    var leastVotes = this.leastVotes(counts);

    var pref: number = 2;
    while (leastVotes.length > 1 && pref <= this.maxPreference) {
      var new_counts = this.countPreference(pref);
      leastVotes = this.leastVotes(new_counts);
    }

    return leastVotes;
  }

  /**
   * Removes a specified candidate from all votes in the Election
   * @param candidate the candidate to eliminate from the votes
   * @param numVotes the number of first preference votes the candidate to remove had at the time of their removal
   */
  eliminateCandidate(candidate: string): void {
    this.allCandidates.delete(candidate);

    this.votes.slice().reverse().forEach((vote, index) => {
      vote.shiftPreferences(candidate);
      if (vote.preferences.length == 0) {
        this.votes.splice(-index - 1, 1);
      }
    });
  }

  getNthCandidate(n: number): string[] {
    if (n === 1) {
      return this.getWinner();
    } else {
      var election = new Election(this.maxPreference - 1);
      this.votes.forEach(vote => {
        election.addVote(Vote.copy(vote));
      });
      this.getWinner().forEach(winner => {
        election.eliminateCandidate(winner);
      });
      return election.getNthCandidate(n - 1);
    }
  }

  getWinner(): string[] {
    return this.simulate();
  }

  /**
   * Checks if a winner has been found
   */
  haveWinner(): boolean {
    var counts = this.countPreference(1);
    var mostVotes: string[] = this.mostVotes(counts);

    if (((counts[mostVotes[0]] / this.votes.length) > 0.5) || this.allCandidates.size == 2) {
      return true;
    }
    return false;
  }

  /**
   * Simulates the election
   */
  simulate(): string[] {
    if (!this.haveWinner()) {
      var election = new Election(this.maxPreference - 1);

      this.votes.forEach(vote => {
        election.addVote(Vote.copy(vote));
      })

      var leastVotes = this.nextRound();
      leastVotes.forEach(candidate => {
        election.eliminateCandidate(candidate);
      })

      return election.getWinner();
    } else {
      var counts = this.countPreference(1);
      var mostVotes: string[] = this.mostVotes(counts);
      return mostVotes;
    }
  }
}

class Vote {

  constructor(public preferences: preference[] = []) {
  }

  /**
   * Add a preference to a vote, the existing preferences are checked to see if there is a clash
   * @param new_preference preference to add to the vote
   */
  addPreference(new_preference: preference): void {
    this.preferences.forEach(preference => {
      if (new_preference.preference == preference.preference) {
        throw "Preference already exists"
      }
    });

    this.preferences.push(new_preference);
  }

  /**
   * Removes a candidate from a vote and shift all candidates with preferences less than the one removed up by one
   * @param candidate candidate to remove from a vote
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

  static copy(vote: Vote): Vote {
    var voteCopy = new Vote();
    vote.preferences.forEach(preference => {
      voteCopy.addPreference({ candidate: preference.candidate, preference: preference.preference });
    });
    return voteCopy;
  }
}
