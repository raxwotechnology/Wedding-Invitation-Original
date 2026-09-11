const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, '../guests.json');

let currentId = 1;
let guests = [];

try {
  if (fs.existsSync(dataFile)) {
    guests = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    const maxId = guests.reduce((max, g) => Math.max(max, parseInt(g._id) || 0), 0);
    currentId = maxId + 1;
  } else {
    // Add some sample guests if empty
    guests = [
      { _id: "1", name: "Kavindu Perera", title: "Mr", phone: "0771234567", group: "Family", side: "A", status: "Confirmed", table: "T1", rsvpUpdatedAt: new Date().toISOString() },
      { _id: "2", name: "Dewmi Fernando", title: "Miss", phone: "0712345678", group: "Friends", side: "B", status: "Pending", table: "T2", rsvpUpdatedAt: null },
      { _id: "3", name: "Saman Kumara", title: "Mr", phone: "0701112222", group: "Colleagues", side: "A", status: "Declined", table: "", rsvpUpdatedAt: new Date().toISOString() }
    ];
    fs.writeFileSync(dataFile, JSON.stringify(guests, null, 2));
    currentId = 4;
  }
} catch (e) {
  console.error("Error reading guests.json:", e);
}

function saveData() {
  fs.writeFileSync(dataFile, JSON.stringify(guests, null, 2));
}

class QueryBuilder {
  constructor(data) {
    this.data = data;
  }
  sort() { return Promise.resolve(this.data); }
  limit() { return this; }
  lean() { return Promise.resolve(this.data); }
  then(resolve, reject) {
    resolve(this.data);
  }
}

const GuestMock = {
  find: (query = {}, projection) => {
    let result = guests;
    if (query.name && query.name instanceof RegExp) {
      result = guests.filter(g => query.name.test(g.name));
    }
    return new QueryBuilder(result);
  },
  create: async (data) => {
    const g = { _id: String(currentId++), ...data };
    guests.push(g);
    saveData();
    return g;
  },
  findByIdAndUpdate: async (id, data) => {
    const idx = guests.findIndex(g => String(g._id) === String(id));
    if (idx !== -1) {
      guests[idx] = { ...guests[idx], ...data };
      saveData();
      return guests[idx];
    }
    return null;
  },
  findByIdAndDelete: async (id) => {
    const idx = guests.findIndex(g => String(g._id) === String(id));
    if (idx !== -1) {
      guests.splice(idx, 1);
      saveData();
    }
  }
};

module.exports = GuestMock;
