/*

Context: At elective, we bring course creators in cohorts of X creators at a time. This allows us not to overload our ops teams
inflow funnel, which means we can provide the best customer experience; and our experience is everything.

Task: Build a FIFO system (first in, first out) that can handle the following:
=> Add a group (cohort) of creators into the system -- inserted at the start of the queue
=> Onboard X number of creators from the queue -- the ones waiting the longest, i.e. start of the queue
=> Get the total number of creators in the queue.

Notes:
=> The FIFO system should allow a specification for the cohort size X, defaulting to 10.
=> The queue is an array, wehere each element represents a group (cohort)
=> Each index in the queue represents x number of creators. [10] represents 10 creators in that cohort.
=> When you onboard creators, the longest waiting group (cohort) has priority, once its empty,
you can move to the next for the remaining creators (if there are any)
=> The last group (cohort) has been waiting the longest, the first group (cohort) has been waiting the shortest.

Testing:
=> [] (cohort size 10)
=> add 3 => [3]
=> add 13 => [6, 10]
=> Count => 16
=> add 22 => [8, 10, 10, 10]
=> Count => 38
=> Onboard 4 => [8, 10, 10, 6]
=> Count => 34
=> Onboard 7 => [8, 10, 9]
=> Count => 27
=> Onboard 20 => [7]
=> Count => 7

Time: 40 minutes

*/

class Queue {
  cohortSize: number;
  queue: number[];
  peopleTotal: number;

  constructor(size = 10) {
    this.cohortSize = 10;
    this.queue = [];
    this.peopleTotal = 0;
  }

  count() {
    return this.peopleTotal;
  }

  add(groupSize: number) {
    let currentGroup = groupSize;

    if (this.queue.length > 0) {
      const group = this.queue[0];
      const roomLeft = this.cohortSize - group;

      if (groupSize === roomLeft || roomLeft > groupSize) {
        this.queue[0] += groupSize;
        this.peopleTotal += groupSize;
        return;
      }

      this.queue[0] += roomLeft;
      this.peopleTotal += roomLeft;
      currentGroup -= roomLeft;
    }

    while (currentGroup > this.cohortSize) {
      currentGroup -= this.cohortSize;
      this.queue.unshift(this.cohortSize);
      this.peopleTotal += this.cohortSize;
    }

    this.queue.unshift(currentGroup);
    this.peopleTotal += currentGroup;
  }

  onboard(groupSize: number) {
    if (this.queue.length === 0) {
      return;
    }

    let currentGroup = groupSize;
    let lastIndex = this.queue.length - 1;

    if (this.queue[lastIndex] > currentGroup) {
      this.queue[lastIndex] -= currentGroup;
      this.peopleTotal -= currentGroup;
      return;
    }

    while (currentGroup > this.queue[lastIndex] && this.peopleTotal > 0) {
      this.peopleTotal -= this.queue[lastIndex];
      currentGroup = currentGroup - this.queue[lastIndex];
      this.queue.pop();

      lastIndex -= 1;
    }

    if (this.queue.length > 0) {
      this.queue[lastIndex] -= currentGroup;
      this.peopleTotal -= currentGroup;
    }
  }
}

const queue = new Queue();
queue.add(3);
queue.add(13);
console.log(queue.count());
queue.add(22);
console.log(queue.count());
queue.onboard(4);
console.log(queue.count());
queue.onboard(7);
console.log(queue.count());
queue.onboard(20);
console.log(queue.count());

// This is for when there's more people to onboard than people waiting in the queue
queue.onboard(10);
console.log(queue.count());
queue.onboard(10);
console.log(queue.count());
console.log(queue.queue);
