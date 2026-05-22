import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbFilePath = path.join(__dirname, 'data.json');
class JsonDb {
  constructor() {
    this.initDb();
  }
  // Ensure database directory and file exist with correct schema
  initDb() {
    const dir = path.dirname(dbFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(dbFilePath)) {
      this.writeRaw({ users: [], tasks: [] });
    } else {
      try {
        const data = this.readRaw();
        if (!data.users || !data.tasks) {
          this.writeRaw({ users: data.users || [], tasks: data.tasks || [] });
        }
      } catch (error) {
        // In case of corruption, reset
        console.error("Database file corrupted, recreating: ", error);
        this.writeRaw({ users: [], tasks: [] });
      }
    }
  }
  readRaw() {
    const raw = fs.readFileSync(dbFilePath, 'utf-8');
    return JSON.parse(raw);
  }
  writeRaw(data) {
    // Atomic write by writing to a temporary file first, then renaming it.
    // This prevents corruption if the process terminates mid-write.
    const tempPath = `${dbFilePath}.tmp`;
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempPath, dbFilePath);
  }
  // Find multiple records matching query criteria
  find(collection, query = {}) {
    const data = this.readRaw();
    const items = data[collection] || [];
    
    return items.filter(item => {
      for (const key in query) {
        if (item[key] !== query[key]) {
          return false;
        }
      }
      return true;
    });
  }
  // Find a single record matching query criteria
  findOne(collection, query = {}) {
    const data = this.readRaw();
    const items = data[collection] || [];
    
    return items.find(item => {
      for (const key in query) {
        if (item[key] !== query[key]) {
          return false;
        }
      }
      return true;
    }) || null;
  }
  // Insert a record into a collection
  insert(collection, record) {
    const data = this.readRaw();
    if (!data[collection]) {
      data[collection] = [];
    }
    
    const newRecord = {
      id: Math.random().toString(36).substring(2, 11),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...record
    };
    data[collection].push(newRecord);
    this.writeRaw(data);
    return newRecord;
  }
  // Update records matching query criteria
  update(collection, query, updates) {
    const data = this.readRaw();
    const items = data[collection] || [];
    let updatedCount = 0;
    const updatedRecords = [];
    const newItems = items.map(item => {
      let matches = true;
      for (const key in query) {
        if (item[key] !== query[key]) {
          matches = false;
          break;
        }
      }
      if (matches) {
        const updated = {
          ...item,
          ...updates,
          updatedAt: new Date().toISOString()
        };
        updatedRecords.push(updated);
        updatedCount++;
        return updated;
      }
      return item;
    });
    if (updatedCount > 0) {
      data[collection] = newItems;
      this.writeRaw(data);
    }
    return updatedRecords;
  }
  // Delete records matching query criteria
  delete(collection, query) {
    const data = this.readRaw();
    const items = data[collection] || [];
    let deletedCount = 0;
    const newItems = items.filter(item => {
      let matches = true;
      for (const key in query) {
        if (item[key] !== query[key]) {
          matches = false;
          break;
        }
      }
      if (matches) {
        deletedCount++;
        return false;
      }
      return true;
    });
    if (deletedCount > 0) {
      data[collection] = newItems;
      this.writeRaw(data);
    }
    return deletedCount;
  }
}
export const db = new JsonDb();
export default db;