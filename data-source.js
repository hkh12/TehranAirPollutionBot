import { EventEmitter } from 'events';
import { fetchData } from './scraper';

export class DataSource extends EventEmitter {
  constructor() {
    super();
    this.now = 0;
    this.last24hours = 0;
    this.isReady = false;
    setInterval(this.update.bind(this), 1000 * 60 * 10);
  }

  async getData() {
    if (!this.isReady) await this.update(true);
    return {
      now: this.now,
      last24hours: this.last24hours
    };
  }

  async update(throwErrors = false) {
    try {
      const { now, last24hours } = await fetchData();
      if (!this.isReady) this.isReady = true;
      if (this.now !== now || this.last24hours !== last24hours) {
        this.last24hours = last24hours;
        this.now = now;
        this.emit('update', { now, last24hours });
      }
    } catch (e) {
      this.emit('error', e);
      if (throwErrors) throw e;
    }
  }

  clear() {
    this.isReady = false;
    this.now = 0;
    this.last24hours = 0;
  }
}
