type SettingsSerialized = {
  useColumnNumbers: boolean;
};

export class Settings {
  useColumnNumbers: boolean;

  constructor(useColumnNumbers: boolean) {
    this.useColumnNumbers = useColumnNumbers;
  }

  saveToLocalStorage() {
    const serialized = this.toSerialized();
    try {
      localStorage.setItem("appSettings", JSON.stringify(serialized));
    }
    catch (err) {
      console.warn(err);
    }
  }

  toSerialized(): SettingsSerialized {
    const { useColumnNumbers } = this;
    return {
      useColumnNumbers: useColumnNumbers ?? false
    };
  }

  static fromSerialized(json: SettingsSerialized): Settings {
    const { useColumnNumbers } = json;
    return new Settings(useColumnNumbers);
  }

  static getDefaultSettings(): Settings {
    return new Settings(false);
  }

  static getFromLocalStorage(): Settings {
    try {
      const data = localStorage.getItem("appSettings");
      if (data) { return this.fromSerialized(JSON.parse(data)); }
      else { return this.getDefaultSettings(); }
    }
    catch (err) {
      console.warn(err);
      return this.getDefaultSettings();
    }
  }
}

export const settings = Settings.getFromLocalStorage();
